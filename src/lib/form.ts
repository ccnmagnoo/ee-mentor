import type { EmpresaInput, VisitaInput } from './schemas';
import { EmpresaBaseSchema, VisitaBodySchema } from './schemas';

export type NestedRecord = Record<string, unknown>;

/**
 * Convierte FormData con nombres tipo `secciones.iluminacion.puntaje` o
 * `energeticos.0.tipo` en un objeto anidado validable con Zod.
 */
export function formDataToNested(formData: FormData): NestedRecord {
  const root: NestedRecord = {};
  for (const [rawKey, rawValue] of formData.entries()) {
    if (typeof rawValue !== 'string') continue;
    const forceArray = rawKey.endsWith('[]');
    const key = rawKey.replace(/\[\]$/, '');
    if (!key) continue;
    setPath(root, key.split('.'), rawValue, forceArray);
  }
  return root;
}

function setPath(
  root: NestedRecord,
  parts: string[],
  value: string,
  forceArray: boolean,
): void {
  let current: Record<string, unknown> | unknown[] = root;

  for (let index = 0; index < parts.length; index += 1) {
    const token = parts[index]!;
    const isLast = index === parts.length - 1;
    const nextToken = parts[index + 1];
    const nextIsIndex = nextToken !== undefined && /^\d+$/.test(nextToken);

    if (isLast) {
      const container = current as Record<string, unknown>;
      if (forceArray) {
        const existing = container[token];
        if (!Array.isArray(existing)) container[token] = [];
        (container[token] as string[]).push(value);
      } else if (container[token] === undefined) {
        container[token] = value;
      } else if (Array.isArray(container[token])) {
        (container[token] as string[]).push(value);
      } else {
        container[token] = [container[token], value];
      }
      return;
    }

    if (/^\d+$/.test(token)) {
      if (!Array.isArray(current)) {
        throw new Error(`Estructura de formulario inválida en "${parts.join('.')}"`);
      }
      const arrayIndex = Number(token);
      if (current[arrayIndex] === undefined) {
        current[arrayIndex] = nextIsIndex ? [] : {};
      }
      current = current[arrayIndex] as Record<string, unknown> | unknown[];
      continue;
    }

    const container = current as Record<string, unknown>;
    if (container[token] === undefined || typeof container[token] !== 'object') {
      container[token] = nextIsIndex ? [] : {};
    }
    current = container[token] as Record<string, unknown> | unknown[];
  }
}

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
  message?: string;
}

function fail(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}): ParseResult<never> {
  return {
    success: false,
    message: 'Revisa los campos marcados. Hay datos incompletos o inválidos.',
    errors: error.issues.map((issue) => ({
      path: issue.path.map(String).join('.'),
      message: issue.message,
    })),
  };
}

export function parseEmpresaForm(formData: FormData): ParseResult<EmpresaInput> {
  const result = EmpresaBaseSchema.safeParse(formDataToNested(formData));
  if (!result.success) return fail(result.error);
  return { success: true, data: result.data };
}

export function parseVisitaForm(formData: FormData): ParseResult<VisitaInput> {
  const body = formDataToNested(formData);

  const hallazgoIds = formData.getAll('hallazgos[]').map(String).filter(Boolean);
  body.hallazgos = [...new Set(hallazgoIds)].map((id) => ({
    hallazgo_id: id,
    justificacion: String(formData.get(`justificacion_${id}`) ?? ''),
  }));

  const recomendacionIds = formData.getAll('recomendaciones[]').map(String).filter(Boolean);
  body.recomendaciones = [...new Set(recomendacionIds)].map((id) => {
    const prioridad = String(formData.get(`prioridad_${id}`) ?? '').trim();
    return {
      recomendacion_id: id,
      ...(prioridad ? { prioridad } : {}),
      observacion: String(formData.get(`reco_obs_${id}`) ?? ''),
    };
  });

  const acuerdosTexto = String(formData.get('acuerdos_texto') ?? '');
  body.acuerdos = acuerdosTexto
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);

  delete body.acuerdos_texto;

  const result = VisitaBodySchema.safeParse(body);
  if (!result.success) return fail(result.error);
  return { success: true, data: result.data };
}
