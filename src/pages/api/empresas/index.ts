import type { APIRoute } from 'astro';
import { parseEmpresaForm } from '@/lib/form';
import { errorResponse, jsonResponse, validationErrorResponse } from '@/lib/http';
import { empresas } from '@/lib/repositories';

export const prerender = false;

export const GET: APIRoute = async () => {
  const items = await empresas.list();
  return jsonResponse({ ok: true, data: items });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const parsed = parseEmpresaForm(formData);
  if (!parsed.success || !parsed.data) return validationErrorResponse(parsed);

  try {
    const empresa = await empresas.create(parsed.data);
    return jsonResponse({
      ok: true,
      message: 'Empresa creada correctamente.',
      redirect: `/empresas/${empresa.id}`,
      data: empresa,
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
