import { defineMiddleware } from 'astro:middleware';

/**
 * Astro reconstruye `Astro.url` sin el puerto cuando el adapter Node valida el
 * host, por lo que su comprobación de origen integrada rechaza formularios
 * legítimos en instalaciones con puerto o detrás de un proxy. Aquí comparamos
 * el `Origin` contra el host real de la solicitud (incluyendo el puerto).
 */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const FORM_CONTENT_TYPES = [
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
];

function firstHeaderValue(value: string | null): string | undefined {
  return value?.split(',')[0]?.trim() || undefined;
}

function forbidden(): Response {
  return new Response('Origen de formulario no permitido.', { status: 403 });
}

export const onRequest = defineMiddleware((context, next) => {
  const { request } = context;
  if (SAFE_METHODS.has(request.method)) return next();

  const contentType = request.headers.get('content-type') ?? '';
  if (!FORM_CONTENT_TYPES.some((type) => contentType.toLowerCase().startsWith(type))) {
    return next();
  }

  const origin = request.headers.get('origin');
  const host =
    firstHeaderValue(request.headers.get('x-forwarded-host')) ??
    firstHeaderValue(request.headers.get('host'));

  // Sin host no podemos validar; el servidor HTTP siempre lo entrega.
  if (!host) return forbidden();

  if (!origin) {
    // Clientes no navegador (curl, scripts) pueden omitir Origin. En producción
    // exigimos el encabezado para no aceptar formularios de origen desconocido.
    return import.meta.env.DEV ? next() : forbidden();
  }

  try {
    if (new URL(origin).host !== host) return forbidden();
  } catch {
    return forbidden();
  }

  return next();
});
