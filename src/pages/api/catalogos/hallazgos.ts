import type { APIRoute } from 'astro';
import { parseHallazgoForm } from '@/lib/catalog-form';
import { errorResponse, jsonResponse, zodErrorResponse } from '@/lib/http';
import { catalogos } from '@/lib/repositories';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  try {
    const input = parseHallazgoForm(formData);
    const hallazgo = await catalogos.saveHallazgo(input);
    return jsonResponse({
      ok: true,
      message: 'Hallazgo guardado correctamente.',
      redirect: `/catalogos?tab=hallazgos&guardado=${encodeURIComponent(hallazgo.codigo)}`,
      data: hallazgo,
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in error) {
      return zodErrorResponse(error as never);
    }
    return errorResponse((error as Error).message, 500);
  }
};
