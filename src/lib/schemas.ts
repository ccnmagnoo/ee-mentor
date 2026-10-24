import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Enumeraciones de dominio                                            */
/* ------------------------------------------------------------------ */

export const CATEGORIAS = {
  iluminacion: 'Iluminación',
  refrigeracion: 'Refrigeración',
  congelacion: 'Congelación',
  climatizacion: 'Climatización',
  ventilacion: 'Ventilación',
  coccion: 'Cocción',
  acs: 'Agua caliente sanitaria',
  calderas: 'Calderas y calefacción',
  envolvente: 'Envolvente térmica',
  infiltraciones: 'Infiltraciones',
  mantencion: 'Mantención de equipos',
  motores: 'Motores eléctricos',
  equipos_productivos: 'Equipos productivos',
  gestion_operacional: 'Gestión operacional',
  gestion_energetica: 'Gestión energética',
  tarifas: 'Tarifas eléctricas',
  potencia_contratada: 'Potencia contratada',
  ernc: 'Energías renovables',
  otros: 'Otros',
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export const CATEGORIA_ENUM = z.enum(
  Object.keys(CATEGORIAS) as [Categoria, ...Categoria[]],
);

export const ENERGOS = {
  electricidad: 'Electricidad',
  glp: 'GLP',
  gas_natural: 'Gas natural',
  lena: 'Leña',
  diesel: 'Diésel',
  biomasa: 'Biomasa',
  otro: 'Otro combustible',
} as const;

export type Energia = keyof typeof ENERGOS;
export const ENERGIA_ENUM = z.enum(Object.keys(ENERGOS) as [Energia, ...Energia[]]);

export const USOS_FINALES = {
  iluminacion: 'Iluminación',
  refrigeracion: 'Refrigeración y congelación',
  climatizacion: 'Climatización y ventilación',
  coccion: 'Cocción',
  acs: 'Agua caliente sanitaria',
  fuerza_motriz: 'Fuerza motriz',
  equipos_productivos: 'Equipos productivos',
  otros: 'Otros usos',
} as const;

export type UsoFinal = keyof typeof USOS_FINALES;
export const USO_FINAL_ENUM = z.enum(
  Object.keys(USOS_FINALES) as [UsoFinal, ...UsoFinal[]],
);

export const IMPACTOS = {
  critico: 'Crítico',
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
} as const;

export const IMPACTO_ENUM = z.enum(
  Object.keys(IMPACTOS) as [keyof typeof IMPACTOS, ...(keyof typeof IMPACTOS)[]],
);

export const PRIORIDADES = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
} as const;

export const PRIORIDAD_ENUM = z.enum(
  Object.keys(PRIORIDADES) as [keyof typeof PRIORIDADES, ...(keyof typeof PRIORIDADES)[]],
);

export const INVERSIONES = {
  baja: 'Bajo costo',
  media: 'Costo medio',
  alta: 'Alto costo',
} as const;

export const INVERSION_ENUM = z.enum(
  Object.keys(INVERSIONES) as [keyof typeof INVERSIONES, ...(keyof typeof INVERSIONES)[]],
);

export const DIFICULTADES = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
} as const;

export const DIFICULTAD_ENUM = z.enum(
  Object.keys(DIFICULTADES) as [keyof typeof DIFICULTADES, ...(keyof typeof DIFICULTADES)[]],
);

export const GRADOS_CONSUMO = {
  ligero: 'Ligero',
  moderado: 'Moderado',
  relevante: 'Relevante',
  intensivo: 'Intensivo',
} as const;

export const GRADO_CONSUMO_ENUM = z.enum(
  Object.keys(GRADOS_CONSUMO) as [
    keyof typeof GRADOS_CONSUMO,
    ...(keyof typeof GRADOS_CONSUMO)[],
  ],
);

export const RUBROS = [
  'Cafetería',
  'Restaurante',
  'Pastelería',
  'Peluquería',
  'Almacén / minimarket',
  'Librería',
  'Hostal',
  'Hotel pequeño',
  'Bed & Breakfast',
  'Taller',
  'Pequeña fábrica de alimentos',
  'Comercio minorista',
  'Otro',
] as const;

export const ESTADOS_EQUIPO = {
  bueno: 'Bueno',
  regular: 'Regular',
  deficiente: 'Deficiente',
  no_evaluado: 'No evaluado',
} as const;
export const ESTADO_EQUIPO_ENUM = z.enum(
  Object.keys(ESTADOS_EQUIPO) as [
    keyof typeof ESTADOS_EQUIPO,
    ...(keyof typeof ESTADOS_EQUIPO)[],
  ],
);

export const MANTENCIONES = {
  programada: 'Programada y documentada',
  ocasional: 'Ocasional / no documentada',
  correctiva: 'Solo correctiva',
  sin_mantencion: 'Sin mantención',
  no_evaluado: 'No evaluado',
} as const;
export const MANTENCION_ENUM = z.enum(
  Object.keys(MANTENCIONES) as [
    keyof typeof MANTENCIONES,
    ...(keyof typeof MANTENCIONES)[],
  ],
);

export const TECNOLOGIAS_ILUMINACION = {
  led: 'LED',
  fluorescente: 'Fluorescente',
  halogenuro: 'Halogenuro metálico',
  incandescente: 'Incandescente / halógena',
  mixta: 'Mixta',
  no_evaluado: 'No evaluado',
} as const;
export const TECNOLOGIA_ILUMINACION_ENUM = z.enum(
  Object.keys(TECNOLOGIAS_ILUMINACION) as [
    keyof typeof TECNOLOGIAS_ILUMINACION,
    ...(keyof typeof TECNOLOGIAS_ILUMINACION)[],
  ],
);

export const CONTROL_TEMPERATURA = {
  termostato: 'Termostato / control automático',
  manual: 'Control manual',
  sin_control: 'Sin control',
  no_evaluado: 'No evaluado',
} as const;
export const CONTROL_TEMPERATURA_ENUM = z.enum(
  Object.keys(CONTROL_TEMPERATURA) as [
    keyof typeof CONTROL_TEMPERATURA,
    ...(keyof typeof CONTROL_TEMPERATURA)[],
  ],
);

export const SECCIONES = {
  iluminacion: 'Iluminación',
  refrigeracion: 'Refrigeración',
  congelacion: 'Congelación',
  climatizacion: 'Climatización y A/C',
  acs: 'Agua caliente sanitaria',
  coccion: 'Cocción',
  motores: 'Motores y equipos productivos',
  envolvente: 'Envolvente e infiltraciones',
  gestion: 'Gestión energética',
  tarifas: 'Tarifas y potencia',
} as const;

export type SeccionKey = keyof typeof SECCIONES;

export const RECURSO_CATEGORIAS = {
  eficiencia_energetica: 'Eficiencia energética',
  agencia_se: 'Agencia de Sostenibilidad Energética',
  ministerio_energia: 'Ministerio de Energía',
  climatizacion: 'Climatización',
  refrigeracion: 'Refrigeración',
  etiquetado: 'Etiquetado energético',
  tarifas: 'Tarifas eléctricas',
  herramientas: 'Herramientas de cálculo',
  ernc: 'Energías renovables',
  normativa: 'Normativa',
  financiamiento: 'Financiamiento',
} as const;

export const RECURSO_CATEGORIA_ENUM = z.enum(
  Object.keys(RECURSO_CATEGORIAS) as [
    keyof typeof RECURSO_CATEGORIAS,
    ...(keyof typeof RECURSO_CATEGORIAS)[],
  ],
);

/* ------------------------------------------------------------------ */
/* Primitivos tolerantes a formularios HTML                            */
/* ------------------------------------------------------------------ */

const str = z.string().default('');
const text = z.string().default('');
const num = z.coerce.number().nonnegative().default(0);
const int = z.coerce.number().int().nonnegative().default(0);
const bool = z.preprocess(
  (v) => v === true || v === 'true' || v === 'on' || v === '1',
  z.boolean(),
);
const optionalNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.coerce.number().nonnegative().optional(),
);

const fecha = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD');

const corréo = z
  .union([z.literal(''), z.email('Correo electrónico inválido')])
  .default('');

function seccion<T extends z.ZodRawShape>(shape: T) {
  const schema = z.object({
    puntaje: z.coerce.number().int().min(0).max(5).default(0),
    observaciones: text,
    ...shape,
  });
  return z.preprocess((v) => v ?? {}, schema);
}

/* ------------------------------------------------------------------ */
/* Empresa                                                             */
/* ------------------------------------------------------------------ */

export const EmpresaBaseSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre es obligatorio'),
  rut: str,
  direccion: str,
  comuna: str,
  region: str,
  rubro: z.string().default('Otro'),
  contacto: str,
  telefono: str,
  correo: corréo,
  trabajadores: int,
  superficie_m2: num,
  observaciones: text,
});

export const EmpresaSchema = EmpresaBaseSchema.extend({
  schema_version: z.literal(1).default(1),
  id: z.string().regex(/^EMP-\d{3,}$/),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Empresa = z.infer<typeof EmpresaSchema>;
export type EmpresaInput = z.infer<typeof EmpresaBaseSchema>;

/* ------------------------------------------------------------------ */
/* Visita energética                                                   */
/* ------------------------------------------------------------------ */

export const EnergeticoSchema = z.object({
  tipo: ENERGIA_ENUM,
  consumo: optionalNumber,
  unidad: z.string().default('kWh/mes'),
  costo: optionalNumber,
  observacion: text,
});

export const EquipoSchema = z.object({
  nombre: z.string().default(''),
  cantidad: z.coerce.number().int().nonnegative().default(1),
  potencia_w: optionalNumber,
  horas_dia: optionalNumber,
  estado: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
  observacion: text,
});

export const SeccionIluminacionSchema = seccion({
  tecnologia: TECNOLOGIA_ILUMINACION_ENUM.default('no_evaluado'),
  estado: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
  horas_uso_diarias: num,
});

export const SeccionRefrigeracionSchema = seccion({
  cantidad_equipos: int,
  antiguedad_anios: num,
  mantencion: MANTENCION_ENUM.default('no_evaluado'),
});

export const SeccionCongelacionSchema = seccion({
  cantidad_equipos: int,
  antiguedad_anios: num,
  estado: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
});

export const SeccionClimatizacionSchema = seccion({
  tecnologia: str,
  mantenciones: MANTENCION_ENUM.default('no_evaluado'),
  control_temperatura: CONTROL_TEMPERATURA_ENUM.default('no_evaluado'),
});

export const SeccionAcsSchema = seccion({
  tecnologia: str,
  fuente_energetica: ENERGIA_ENUM.default('electricidad'),
  horarios: str,
});

export const SeccionCoccionSchema = seccion({
  equipos_principales: str,
  combustible: ENERGIA_ENUM.default('electricidad'),
});

export const SeccionMotoresSchema = seccion({
  tipo: str,
  estado: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
  mantencion: MANTENCION_ENUM.default('no_evaluado'),
});

export const SeccionEnvolventeSchema = seccion({
  ventanas: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
  puertas: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
  infiltraciones: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
  aislacion: ESTADO_EQUIPO_ENUM.default('no_evaluado'),
});

export const SeccionGestionSchema = seccion({
  nivel: z
    .enum(['sin_gestion', 'basica', 'sistematica', 'certificada', 'no_evaluado'])
    .default('no_evaluado'),
  monitoreo: bool.default(false),
  responsable: str,
});

export const SeccionTarifasSchema = seccion({
  tarifa_actual: str,
  potencia_contratada_kw: optionalNumber,
  factor_potencia: optionalNumber,
});

export const SeccionesSchema = z.preprocess(
  (v) => v ?? {},
  z.object({
    iluminacion: SeccionIluminacionSchema,
    refrigeracion: SeccionRefrigeracionSchema,
    congelacion: SeccionCongelacionSchema,
    climatizacion: SeccionClimatizacionSchema,
    acs: SeccionAcsSchema,
    coccion: SeccionCoccionSchema,
    motores: SeccionMotoresSchema,
    envolvente: SeccionEnvolventeSchema,
    gestion: SeccionGestionSchema,
    tarifas: SeccionTarifasSchema,
  }),
);

export const HallazgoSeleccionadoSchema = z.object({
  hallazgo_id: z.string().min(1),
  justificacion: text,
});

export const RecomendacionSeleccionadaSchema = z.object({
  recomendacion_id: z.string().min(1),
  prioridad: PRIORIDAD_ENUM.optional(),
  observacion: text,
});

export const VisitaBodySchema = z.object({
  fecha,
  asesor: z.string().trim().min(2, 'El asesor es obligatorio'),
  grado_consumo: GRADO_CONSUMO_ENUM.default('moderado'),
  descripcion_perfil: text,
  energeticos: z.array(EnergeticoSchema).default([]),
  usos_finales: z.array(USO_FINAL_ENUM).default([]),
  equipos: z.array(EquipoSchema).default([]),
  secciones: SeccionesSchema,
  hallazgos: z.array(HallazgoSeleccionadoSchema).default([]),
  recomendaciones: z.array(RecomendacionSeleccionadaSchema).default([]),
  acuerdos: z.array(z.string()).default([]),
  proxima_visita: z.union([z.literal(''), fecha]).default(''),
  observaciones: text,
});

export const VisitaSchema = VisitaBodySchema.extend({
  schema_version: z.literal(1).default(1),
  id: z.string().regex(/^VIS-\d{3,}$/),
  empresa_id: z.string().regex(/^EMP-\d{3,}$/),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Visita = z.infer<typeof VisitaSchema>;
export type VisitaInput = z.infer<typeof VisitaBodySchema>;
export type Secciones = z.infer<typeof SeccionesSchema>;
export type SeccionIluminacion = z.infer<typeof SeccionIluminacionSchema>;
export type SeccionRefrigeracion = z.infer<typeof SeccionRefrigeracionSchema>;
export type Energetico = z.infer<typeof EnergeticoSchema>;
export type Equipo = z.infer<typeof EquipoSchema>;

/* ------------------------------------------------------------------ */
/* Catálogos                                                           */
/* ------------------------------------------------------------------ */

export const HallazgoSchema = z.object({
  schema_version: z.literal(1).default(1),
  id: z.string().min(3),
  codigo: z.string().min(3),
  titulo: z.string().min(3),
  categoria: CATEGORIA_ENUM,
  descripcion: z.string().min(3),
  justificacion: z.string().default(''),
  impacto: IMPACTO_ENUM,
  energetico: ENERGIA_ENUM.default('electricidad'),
  recomendacion_id: z.string().default(''),
  tags: z.array(z.string()).default([]),
  activo: z.boolean().default(true),
  origen: z.string().default('catalogo_base'),
  created_at: z.string().default(''),
  updated_at: z.string().default(''),
});

export type Hallazgo = z.infer<typeof HallazgoSchema>;
export type HallazgoInput = z.infer<typeof HallazgoInputSchema>;

export const RecomendacionSchema = z.object({
  schema_version: z.literal(1).default(1),
  id: z.string().min(3),
  codigo: z.string().min(3),
  titulo: z.string().min(3),
  categoria: CATEGORIA_ENUM,
  descripcion: z.string().min(3),
  beneficio: z.string().default(''),
  inversion: INVERSION_ENUM,
  dificultad: DIFICULTAD_ENUM,
  prioridad: PRIORIDAD_ENUM,
  ahorro_estimado: z.string().default(''),
  plazo: z.string().default('Corto plazo'),
  energetico: ENERGIA_ENUM.default('electricidad'),
  hallazgos_relacionados: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  activo: z.boolean().default(true),
  origen: z.string().default('catalogo_base'),
  created_at: z.string().default(''),
  updated_at: z.string().default(''),
});

export type Recomendacion = z.infer<typeof RecomendacionSchema>;
export type RecomendacionInput = z.infer<typeof RecomendacionInputSchema>;

export const RecursoSchema = z.object({
  schema_version: z.literal(1).default(1),
  id: z.string().min(3),
  categoria: RECURSO_CATEGORIA_ENUM,
  nombre: z.string().min(2),
  descripcion: z.string().min(2),
  url: z.url(),
  activo: z.boolean().default(true),
  orden: z.coerce.number().int().default(0),
});

export type Recurso = z.infer<typeof RecursoSchema>;

export const RecursoInputSchema = RecursoSchema.omit({
  schema_version: true,
}).partial({ id: true });

export type RecursoInput = z.infer<typeof RecursoInputSchema>;

export const HallazgoInputSchema = HallazgoSchema.omit({
  schema_version: true,
  created_at: true,
  updated_at: true,
}).partial({ id: true, origen: true });

export const RecomendacionInputSchema = RecomendacionSchema.omit({
  schema_version: true,
  created_at: true,
  updated_at: true,
}).partial({ id: true, origen: true });

/* ------------------------------------------------------------------ */
/* Biblioteca de conocimiento                                          */
/* ------------------------------------------------------------------ */

export const FuenteConocimientoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  archivo: z.string(),
  rubro: z.string().default('No especificado'),
  fecha: z.string().default(''),
  hash: z.string(),
  imported_at: z.string(),
  hallazgos_count: z.coerce.number().int().default(0),
  recomendaciones_count: z.coerce.number().int().default(0),
  texto: z.string().default(''),
});

export type FuenteConocimiento = z.infer<typeof FuenteConocimientoSchema>;

export const CandidatoSchema = z.object({
  id: z.string(),
  tipo: z.enum(['hallazgo', 'recomendacion']),
  titulo: z.string(),
  descripcion: z.string(),
  categoria: CATEGORIA_ENUM,
  impacto: IMPACTO_ENUM.default('medio'),
  inversion: INVERSION_ENUM.default('media'),
  dificultad: DIFICULTAD_ENUM.default('media'),
  origen: z.string(),
  fuente_id: z.string(),
  estado: z.enum(['pendiente', 'aprobado', 'descartado']).default('pendiente'),
  created_at: z.string(),
});

export type Candidato = z.infer<typeof CandidatoSchema>;
