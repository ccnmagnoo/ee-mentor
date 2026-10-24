import type { APIRoute } from 'astro';
import { parseVisitaForm } from '@/lib/form';
import { errorResponse, jsonResponse, validationErrorResponse } from '@/lib/http';
import { empresas, visitas } from '@/lib/repositories';
import { construirInforme } from '@/lib/services/report-service';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const empresaId = params.id;
  const visitaId = params.visitaId;
  if (!empresaId || !visitaId) return errorResponse('Parámetros incompletos', 400);

  const [empresa, visita] = await Promise.all([
    empresas.get(empresaId),
    visitas.get(empresaId, visitaId),
  ]);
  if (!empresa) return errorResponse('Empresa no encontrada', 404);
  if (!visita) return errorResponse('Visita no encontrada', 404);

  const formData = await request.formData();
  const parsed = parseVisitaForm(formData);
  if (!parsed.success || !parsed.data) return validationErrorResponse(parsed);

  try {
    const updated = await visitas.update(empresaId, visitaId, parsed.data);
    await construirInforme(empresaId, visitaId);
    return jsonResponse({
      ok: true,
      message: 'Visita actualizada e informe regenerado.',
      redirect: `/empresas/${empresaId}/visitas/${visitaId}`,
      data: updated,
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
