import type { APIRoute } from 'astro';
import { parseRecomendacionForm } from '@/lib/catalog-form';
import { errorResponse, jsonResponse, zodErrorResponse } from '@/lib/http';
import { catalogos } from '@/lib/repositories';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  try {
    const input = parseRecomendacionForm(formData);
    const recomendacion = await catalogos.saveRecomendacion(input);
    return jsonResponse({
      ok: true,
      message: 'Recomendación guardada correctamente.',
      redirect: `/catalogos?tab=recomendaciones&guardado=${encodeURIComponent(recomendacion.codigo)}`,
      data: recomendacion,
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in error) {
      return zodErrorResponse(error as never);
    }
    return errorResponse((error as Error).message, 500);
  }
};
