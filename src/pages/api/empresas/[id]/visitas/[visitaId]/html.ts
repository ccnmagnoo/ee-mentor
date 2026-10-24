import type { APIRoute } from 'astro';
import { empresas, informes, visitas } from '@/lib/repositories';
import { construirInforme } from '@/lib/services/report-service';
import { reportStandaloneHtml } from '@/lib/markdown';

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

  const title = `Informe ${empresa.nombre} · ${visita.id}`;
  const html = reportStandaloneHtml(markdown, title);

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-disposition': `inline; filename="informe-${empresa.id}-${visita.id}.html"`,
    },
  });
};
