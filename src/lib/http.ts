import type { ZodError } from 'zod';

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Array<{ path: string; message: string }>,
): Response {
  return jsonResponse({ ok: false, message, errors }, status);
}

export function zodErrorResponse(error: ZodError): Response {
  return errorResponse(
    'La validación falló. Revisa los campos del formulario.',
    422,
    error.issues.map((issue) => ({
      path: issue.path.map(String).join('.'),
      message: issue.message,
    })),
  );
}

export function validationErrorResponse(parse: {
  message?: string;
  errors?: Array<{ path: string; message: string }>;
}): Response {
  return errorResponse(parse.message ?? 'Datos inválidos', 422, parse.errors);
}

export async function readRequestBody(
  request: Request,
): Promise<FormData | Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await request.json()) as Record<string, unknown>;
  }
  return request.formData();
}

export async function readJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export function isFormData(payload: FormData | Record<string, unknown>): payload is FormData {
  return payload instanceof FormData;
}

export function getString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return value === undefined || value === null ? '' : String(value);
}

export function requireMethod(request: Request, method = 'POST'): void {
  if (request.method.toUpperCase() !== method) {
    throw Object.assign(new Error(`Método ${request.method} no permitido`), { status: 405 });
  }
}
