import { z } from 'zod';
import {
  CATEGORIA_ENUM,
  DIFICULTAD_ENUM,
  ENERGIA_ENUM,
  IMPACTO_ENUM,
  INVERSION_ENUM,
  PRIORIDAD_ENUM,
  RECURSO_CATEGORIA_ENUM,
} from './schemas';

function csv(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function checkbox(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true' || value === '1';
}

const optionalText = z.string().trim().min(1).optional();

export const HallazgoFormSchema = z.object({
  id: optionalText,
  codigo: z.string().trim().min(2, 'El código es obligatorio'),
  titulo: z.string().trim().min(3, 'El título es obligatorio'),
  categoria: CATEGORIA_ENUM,
  descripcion: z.string().trim().min(10, 'La descripción debe ser más detallada'),
  justificacion: z.string().trim().default(''),
  impacto: IMPACTO_ENUM,
  energetico: ENERGIA_ENUM.default('electricidad'),
  recomendacion_id: z.string().trim().default(''),
  tags: z.array(z.string()).default([]),
  activo: z.boolean().default(true),
  origen: z.string().trim().default('catalogo_base'),
});

export const RecomendacionFormSchema = z.object({
  id: optionalText,
  codigo: z.string().trim().min(2, 'El código es obligatorio'),
  titulo: z.string().trim().min(3, 'El título es obligatorio'),
  categoria: CATEGORIA_ENUM,
  descripcion: z.string().trim().min(10, 'La descripción debe ser más detallada'),
  beneficio: z.string().trim().default(''),
  inversion: INVERSION_ENUM,
  dificultad: DIFICULTAD_ENUM,
  prioridad: PRIORIDAD_ENUM,
  ahorro_estimado: z.string().trim().default(''),
  plazo: z.string().trim().default('Corto plazo (1-3 meses)'),
  energetico: ENERGIA_ENUM.default('electricidad'),
  hallazgos_relacionados: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  activo: z.boolean().default(true),
  origen: z.string().trim().default('catalogo_base'),
});

export type HallazgoFormInput = z.infer<typeof HallazgoFormSchema>;
export type RecomendacionFormInput = z.infer<typeof RecomendacionFormSchema>;

export const RecursoFormSchema = z.object({
  id: optionalText,
  categoria: RECURSO_CATEGORIA_ENUM,
  nombre: z.string().trim().min(2, 'El nombre es obligatorio'),
  descripcion: z.string().trim().min(10, 'La descripción debe ser más detallada'),
  url: z.url('Debe ser una URL válida (https://…)'),
  orden: z.coerce.number().int().min(0).default(0),
  activo: z.boolean().default(true),
});

export type RecursoFormInput = z.infer<typeof RecursoFormSchema>;

export function parseHallazgoForm(formData: FormData): HallazgoFormInput {
  return HallazgoFormSchema.parse({
    id: String(formData.get('id') ?? '').trim() || undefined,
    codigo: formData.get('codigo'),
    titulo: formData.get('titulo'),
    categoria: formData.get('categoria'),
    descripcion: formData.get('descripcion'),
    justificacion: formData.get('justificacion') ?? '',
    impacto: formData.get('impacto'),
    energetico: formData.get('energetico') ?? 'electricidad',
    recomendacion_id: formData.get('recomendacion_id') ?? '',
    tags: csv(formData.get('tags')),
    activo: checkbox(formData.get('activo')),
    origen: formData.get('origen') ?? 'catalogo_base',
  });
}

export function parseRecomendacionForm(formData: FormData): RecomendacionFormInput {
  return RecomendacionFormSchema.parse({
    id: String(formData.get('id') ?? '').trim() || undefined,
    codigo: formData.get('codigo'),
    titulo: formData.get('titulo'),
    categoria: formData.get('categoria'),
    descripcion: formData.get('descripcion'),
    beneficio: formData.get('beneficio') ?? '',
    inversion: formData.get('inversion'),
    dificultad: formData.get('dificultad'),
    prioridad: formData.get('prioridad'),
    ahorro_estimado: formData.get('ahorro_estimado') ?? '',
    plazo: formData.get('plazo') || 'Corto plazo (1-3 meses)',
    energetico: formData.get('energetico') ?? 'electricidad',
    hallazgos_relacionados: [
      ...new Set(formData.getAll('hallazgos_relacionados').flatMap((value) => csv(value))),
    ],
    tags: csv(formData.get('tags')),
    activo: checkbox(formData.get('activo')),
    origen: formData.get('origen') ?? 'catalogo_base',
  });
}

export function parseRecursoForm(formData: FormData): RecursoFormInput {
  return RecursoFormSchema.parse({
    id: String(formData.get('id') ?? '').trim() || undefined,
    categoria: formData.get('categoria'),
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    url: formData.get('url'),
    orden: formData.get('orden') ?? 0,
    activo: checkbox(formData.get('activo')),
  });
}
