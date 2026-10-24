import type { APIRoute } from 'astro';
import { parseRecursoForm } from '@/lib/catalog-form';
import { errorResponse, jsonResponse, zodErrorResponse } from '@/lib/http';
import { catalogos } from '@/lib/repositories';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  try {
    const input = parseRecursoForm(formData);
    const recurso = await catalogos.saveRecurso(input);
    return jsonResponse({
      ok: true,
      message: 'Recurso guardado correctamente.',
      redirect: `/catalogos?tab=recursos&guardado=${encodeURIComponent(recurso.nombre)}`,
      data: recurso,
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in error) {
      return zodErrorResponse(error as never);
    }
    return errorResponse((error as Error).message, 500);
  }
};
