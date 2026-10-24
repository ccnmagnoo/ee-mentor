import type { APIRoute } from 'astro';
import { empresas, informes, visitas } from '@/lib/repositories';
import { construirInforme } from '@/lib/services/report-service';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const empresaId = params.id;
  const visitaId = params.visitaId;
  if (!empresaId || !visitaId) {
    return new Response('Parámetros incompletos', { status: 400 });
  }

  const [empresa, visita] = await Promise.all([
    empresas.get(empresaId),
    visitas.get(empresaId, visitaId),
  ]);
  if (!empresa || !visita) {
    return new Response('Visita no encontrada', { status: 404 });
  }

  const markdown =
    (await informes.read(empresaId, visitaId)) ??
    (await construirInforme(empresaId, visitaId))?.markdown ??
    '';

  const fileName = `${empresa.nombre.replace(/[^\w-]+/g, '-')}-${visita.id}.md`;
  return new Response(markdown, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'content-disposition': `attachment; filename="${fileName}"`,
    },
  });
};
