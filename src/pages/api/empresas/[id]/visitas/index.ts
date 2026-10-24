import type { APIRoute } from 'astro';
import { parseVisitaForm } from '@/lib/form';
import { errorResponse, jsonResponse, validationErrorResponse } from '@/lib/http';
import { empresas, visitas } from '@/lib/repositories';
import { construirInforme } from '@/lib/services/report-service';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  if (!params.id) return errorResponse('Empresa no especificada', 400);
  const empresa = await empresas.get(params.id);
  if (!empresa) return errorResponse('Empresa no encontrada', 404);

  const formData = await request.formData();
  const parsed = parseVisitaForm(formData);
  if (!parsed.success || !parsed.data) return validationErrorResponse(parsed);

  try {
    const visita = await visitas.create(empresa.id, parsed.data);
    await construirInforme(empresa.id, visita.id);
    return jsonResponse({
      ok: true,
      message: 'Visita registrada e informe generado.',
      redirect: `/empresas/${empresa.id}/visitas/${visita.id}`,
      data: visita,
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
