import type { APIRoute } from 'astro';
import { DATA_DIR, KNOWLEDGE_SOURCE_DIR } from '@/lib/config';
import { errorResponse, jsonResponse } from '@/lib/http';
import { importKnowledge } from '@/lib/knowledge-import.mjs';

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const result = await importKnowledge({
      dataDir: DATA_DIR,
      sourceDir: KNOWLEDGE_SOURCE_DIR,
      logger: console,
    });
    return jsonResponse({
      ok: result.ok,
      message: result.ok
        ? `Importación completada: ${result.fuentes} fuentes, ${result.nuevos_candidatos} candidatos nuevos.`
        : `No se pudo importar: ${result.errores.join('; ')}`,
      cancelRedirect: true,
      redirect: '/biblioteca',
      data: result,
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
