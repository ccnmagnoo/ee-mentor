import { SECCIONES, type SeccionKey, type Secciones } from './schemas';

export interface Clasificacion {
  etiqueta: 'Crítico' | 'Deficiente' | 'Aceptable' | 'Bueno' | 'Destacado' | 'No evaluado';
  tono: 'critical' | 'warning' | 'neutral' | 'good' | 'excellent' | 'muted';
  descripcion: string;
}

export const ESCALA_PUNTAJE = [
  { valor: 0, etiqueta: 'No aplica', descripcion: 'Sección no evaluada o sin incidencia.' },
  { valor: 1, etiqueta: 'Deficiente', descripcion: 'Existen brechas graves o riesgos operacionales.' },
  { valor: 2, etiqueta: 'Regular', descripcion: 'Cumple parcialmente; hay oportunidades claras de mejora.' },
  { valor: 3, etiqueta: 'Bueno', descripcion: 'Operación adecuada con mejoras puntuales posibles.' },
  { valor: 4, etiqueta: 'Muy bueno', descripcion: 'Prácticas consolidadas, con bajo potencial de mejora.' },
  { valor: 5, etiqueta: 'Excelente', descripcion: 'Referente de eficiencia; mantener y monitorear.' },
] as const;

export function clasificarPuntaje(puntaje: number | null): Clasificacion {
  if (puntaje === null || Number.isNaN(puntaje)) {
    return {
      etiqueta: 'No evaluado',
      tono: 'muted',
      descripcion: 'No se registraron puntajes aplicables para esta sección.',
    };
  }
  if (puntaje <= 1.5) {
    return {
      etiqueta: 'Crítico',
      tono: 'critical',
      descripcion: 'Requiere intervención prioritaria: existen brechas relevantes de eficiencia.',
    };
  }
  if (puntaje <= 2.5) {
    return {
      etiqueta: 'Deficiente',
      tono: 'warning',
      descripcion: 'El desempeño está por debajo de lo esperado; se recomienda un plan de mejora.',
    };
  }
  if (puntaje <= 3.5) {
    return {
      etiqueta: 'Aceptable',
      tono: 'neutral',
      descripcion: 'Cumple lo básico, pero persisten oportunidades de optimización.',
    };
  }
  if (puntaje <= 4.5) {
    return {
      etiqueta: 'Bueno',
      tono: 'good',
      descripcion: 'Buen desempeño energético, con espacio para ajustes finos.',
    };
  }
  return {
    etiqueta: 'Destacado',
    tono: 'excellent',
    descripcion: 'Desempeño sobresaliente; enfocar esfuerzos en sostenibilidad y monitoreo.',
  };
}

export interface EvaluacionSeccion {
  key: SeccionKey;
  nombre: string;
  puntaje: number;
  aplica: boolean;
  clasificacion: Clasificacion;
}

export interface EvaluacionGlobal {
  secciones: EvaluacionSeccion[];
  puntajeGlobal: number | null;
  clasificacionGlobal: Clasificacion;
  evaluadas: number;
  total: number;
}

export function evaluarSecciones(secciones: Secciones): EvaluacionGlobal {
  const evaluadas: EvaluacionSeccion[] = (Object.keys(SECCIONES) as SeccionKey[]).map((key) => {
    const seccion = secciones[key];
    const puntaje = seccion?.puntaje ?? 0;
    return {
      key,
      nombre: SECCIONES[key],
      puntaje,
      aplica: puntaje > 0,
      clasificacion: clasificarPuntaje(puntaje > 0 ? puntaje : null),
    };
  });

  const aplicables = evaluadas.filter((s) => s.aplica);
  const puntajeGlobal =
    aplicables.length > 0
      ? aplicables.reduce((acc, s) => acc + s.puntaje, 0) / aplicables.length
      : null;

  return {
    secciones: evaluadas,
    puntajeGlobal,
    clasificacionGlobal: clasificarPuntaje(puntajeGlobal),
    evaluadas: aplicables.length,
    total: evaluadas.length,
  };
}

export function redondear(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
