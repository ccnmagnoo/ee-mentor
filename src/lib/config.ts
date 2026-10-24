import path from 'node:path';

/** Directorio raíz de datos. Puede moverse con EE_DATA_DIR para respaldos o tests. */
export const DATA_DIR = process.env.EE_DATA_DIR
  ? path.resolve(process.env.EE_DATA_DIR)
  : path.join(process.cwd(), 'data');

export const EMPRESAS_DIR = path.join(DATA_DIR, 'empresas');
export const CATALOGOS_DIR = path.join(DATA_DIR, 'catalogos');
export const HALLAZGOS_DIR = path.join(CATALOGOS_DIR, 'hallazgos');
export const RECOMENDACIONES_DIR = path.join(CATALOGOS_DIR, 'recomendaciones');
export const RECURSOS_DIR = path.join(CATALOGOS_DIR, 'recursos');
export const BIBLIOTECA_DIR = path.join(DATA_DIR, 'biblioteca');
export const FUENTES_DIR = path.join(BIBLIOTECA_DIR, 'fuentes');
export const CANDIDATOS_DIR = path.join(BIBLIOTECA_DIR, 'candidatos');
export const IMPORTACIONES_DIR = path.join(BIBLIOTECA_DIR, 'importaciones');

/** Carpeta de los informes históricos entregados por el consultor (fuente de conocimiento). */
export const KNOWLEDGE_SOURCE_DIR = process.env.EE_KNOWLEDGE_DIR
  ? path.resolve(process.env.EE_KNOWLEDGE_DIR)
  : path.join(process.cwd(), 'casos');

export const APP_NAME = 'EE Mentor';
export const APP_TAGLINE = 'Diagnóstico y reportes de eficiencia energética';

export const ASSESSOR_DEFAULT =
  process.env.EE_ASSESSOR_NAME ?? 'Consultor Energético';

export const REGION_DEFAULT = 'Valparaíso';

export function formatFecha(iso: string): string {
  if (!iso) return '—';
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatFechaCorta(iso: string): string {
  if (!iso) return '—';
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatCLP(value: number | undefined | null): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumero(value: number | null | undefined, unit = ''): string {
  if (value === null || value === undefined) return '—';
  const formatted = new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 1,
  }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowISO(): string {
  return new Date().toISOString();
}
