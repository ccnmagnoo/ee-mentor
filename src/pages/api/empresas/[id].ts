import type { APIRoute } from 'astro';
import { parseEmpresaForm } from '@/lib/form';
import { errorResponse, jsonResponse, validationErrorResponse } from '@/lib/http';
import { empresas } from '@/lib/repositories';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  if (!params.id) return errorResponse('Empresa no especificada', 400);
  const empresa = await empresas.get(params.id);
  if (!empresa) return errorResponse('Empresa no encontrada', 404);
  return jsonResponse({ ok: true, data: empresa });
};

export const POST: APIRoute = async ({ params, request }) => {
  if (!params.id) return errorResponse('Empresa no especificada', 400);
  const current = await empresas.get(params.id);
  if (!current) return errorResponse('Empresa no encontrada', 404);

  const formData = await request.formData();
  const parsed = parseEmpresaForm(formData);
  if (!parsed.success || !parsed.data) return validationErrorResponse(parsed);

  try {
    const empresa = await empresas.update(params.id, parsed.data);
    return jsonResponse({
      ok: true,
      message: 'Empresa actualizada correctamente.',
      redirect: `/empresas/${empresa.id}`,
      data: empresa,
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
