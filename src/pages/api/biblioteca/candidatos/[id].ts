import type { APIRoute } from 'astro';
import { errorResponse, jsonResponse } from '@/lib/http';
import { catalogos, conocimiento } from '@/lib/repositories';
import type { Categoria } from '@/lib/schemas';

export const prerender = false;

const PREFIJOS: Partial<Record<Categoria, string>> = {
  iluminacion: 'ILUM',
  refrigeracion: 'REFR',
  congelacion: 'CONG',
  climatizacion: 'CLIM',
  ventilacion: 'VENT',
  coccion: 'COCC',
  acs: 'ACS',
  calderas: 'CALD',
  envolvente: 'ENV',
  infiltraciones: 'INF',
  mantencion: 'MANT',
  motores: 'MOT',
  equipos_productivos: 'PROD',
  gestion_operacional: 'GESTO',
  gestion_energetica: 'GEST',
  tarifas: 'TAR',
  potencia_contratada: 'POT',
  ernc: 'ERNC',
  otros: 'GEN',
};

function nextCodigo(base: string, existing: string[]): string {
  const used = existing
    .filter((codigo) => codigo.startsWith(base))
    .map((codigo) => Number.parseInt(codigo.slice(base.length + 1), 10))
    .filter((value) => Number.isFinite(value));
  const next = (used.length ? Math.max(...used) : 0) + 1;
  return `${base}-${String(next).padStart(2, '0')}`;
}

export const POST: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return errorResponse('Candidato no especificado', 400);

  const formData = await request.formData();
  const accion = String(formData.get('accion') ?? '');
  const candidatos = await conocimiento.listCandidatos();
  const candidato = candidatos.find((item) => item.id === id);
  if (!candidato) return errorResponse('Candidato no encontrado', 404);

  if (accion === 'descartar') {
    await conocimiento.updateCandidato(id, { estado: 'descartado' });
    return jsonResponse({
      ok: true,
      message: 'Candidato descartado.',
      redirect: '/biblioteca?estado=descartado',
    });
  }

  if (accion !== 'aprobar') {
    return errorResponse('Acción no válida. Use "aprobar" o "descartar".', 400);
  }

  try {
    const prefijo = PREFIJOS[candidato.categoria] ?? 'GEN';
    if (candidato.tipo === 'hallazgo') {
      const existentes = await catalogos.listHallazgos(true);
      const codigo = nextCodigo(`KB-${prefijo}`, existentes.map((item) => item.codigo));
      await catalogos.saveHallazgo({
        codigo,
        titulo: candidato.titulo,
        categoria: candidato.categoria,
        descripcion: candidato.descripcion,
        justificacion: `Hallazgo importado desde la biblioteca de conocimiento (fuente ${candidato.fuente_id}).`,
        impacto: candidato.impacto,
        energetico: 'electricidad',
        recomendacion_id: '',
        tags: ['biblioteca', candidato.categoria],
        activo: true,
        origen: `biblioteca:${candidato.fuente_id}`,
      });
    } else {
      const existentes = await catalogos.listRecomendaciones(true);
      const codigo = nextCodigo(`REC-KB-${prefijo}`, existentes.map((item) => item.codigo));
      await catalogos.saveRecomendacion({
        codigo,
        titulo: candidato.titulo,
        categoria: candidato.categoria,
        descripcion: candidato.descripcion,
        beneficio: '',
        inversion: candidato.inversion,
        dificultad: candidato.dificultad,
        prioridad: 'media',
        ahorro_estimado: '',
        plazo: 'Corto plazo (1-3 meses)',
        energetico: 'electricidad',
        hallazgos_relacionados: [],
        tags: ['biblioteca', candidato.categoria],
        activo: true,
        origen: `biblioteca:${candidato.fuente_id}`,
      });
    }

    await conocimiento.updateCandidato(id, { estado: 'aprobado' });
    return jsonResponse({
      ok: true,
      message: 'Candidato aprobado e incorporado al catálogo.',
      redirect: '/biblioteca?estado=aprobado',
    });
  } catch (error) {
    return errorResponse((error as Error).message, 500);
  }
};
