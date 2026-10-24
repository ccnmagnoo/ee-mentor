import type { APIRoute } from 'astro';
import { errorResponse, jsonResponse } from '@/lib/http';
import { empresas, visitas } from '@/lib/repositories';
import { construirInforme } from '@/lib/services/report-service';

export const prerender = false;

export const POST: APIRoute = async ({ params }) => {
  const empresaId = params.id;
  const visitaId = params.visitaId;
  if (!empresaId || !visitaId) return errorResponse('Parámetros incompletos', 400);

  const [empresa, visita] = await Promise.all([
    empresas.get(empresaId),
    visitas.get(empresaId, visitaId),
  ]);
  if (!empresa || !visita) return errorResponse('Visita no encontrada', 404);

  try {
    const result = await construirInforme(empresaId, visitaId);
    if (!result) return errorResponse('No fue posible generar el informe', 500);
    return jsonResponse({
      ok: true,
      message: 'Informe regenerado correctamente.',
      redirect: `/empresas/${empresaId}/visitas/${visitaId}/informe`,
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
