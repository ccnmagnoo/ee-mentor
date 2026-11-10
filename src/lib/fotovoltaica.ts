import type {
  Energetico,
  EvaluacionFotovoltaica,
  SistemaFotovoltaico,
} from './schemas';

export interface EntradaEvaluacionFotovoltaica {
  sistema: SistemaFotovoltaico;
  evaluacion: EvaluacionFotovoltaica;
  energeticos?: Energetico[];
  diasMes?: number;
}

export interface ResultadoFotovoltaico {
  potenciaKwp: number;
  potenciaMinKwp: number;
  potenciaMaxKwp: number;
  generacionEstimadaKwh: number;
  generacionMinKwh: number;
  generacionMaxKwh: number;
  generacionKwh: number;
  generacionAnualKwh: number;
  generacionMedida: boolean;
  consumoMensualKwh: number;
  consumoDiurnoKwh: number;
  autoconsumoKwh: number;
  autoconsumoMedido: boolean;
  excedentesKwh: number;
  autoconsumoPct: number;
  coberturaTotalPct: number;
  coberturaDiurnaPct: number;
  precioKwh: number;
  ahorroMensualClp: number;
  ahorroAnualClp: number;
  co2EvitadoKgMes: number;
  rendimientoEspecificoKwhKwpMes: number;
  performanceRatioMedido: number | null;
}

function positivo(value: number | undefined): number | undefined {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : undefined;
}

function porcentaje(numerador: number, denominador: number): number {
  if (denominador <= 0) return 0;
  return Math.min(100, Math.max(0, (numerador / denominador) * 100));
}

function potenciaConsiderada(sistema: SistemaFotovoltaico): {
  potencia: number;
  min: number;
  max: number;
} {
  const min = sistema.potencia_kwp_min;
  const max = sistema.potencia_kwp_max;
  const central = sistema.potencia_kwp;
  const potencia =
    central > 0
      ? central
      : min > 0 && max > 0
        ? (min + max) / 2
        : min > 0
          ? min
          : max;
  return {
    potencia,
    min: min > 0 ? min : potencia,
    max: max > 0 ? max : potencia,
  };
}

/**
 * Estima el aporte del sistema fotovoltaico. Si existen datos medidos, estos
 * reemplazan la estimación para la generación, el autoconsumo y los excedentes.
 */
export function evaluarFotovoltaica({
  sistema,
  evaluacion,
  energeticos = [],
  diasMes = 30,
}: EntradaEvaluacionFotovoltaica): ResultadoFotovoltaico | null {
  if (sistema.estado === 'no_aplica') return null;

  const { potencia, min, max } = potenciaConsiderada(sistema);
  if (potencia <= 0 || evaluacion.horas_sol_pico <= 0) return null;

  const electricidad = energeticos.find((item) => item.tipo === 'electricidad');
  const consumoMensualKwh =
    positivo(evaluacion.consumo_mensual_kwh) ?? positivo(electricidad?.consumo) ?? 0;
  const precioKwh =
    positivo(evaluacion.precio_kwh) ??
    (positivo(electricidad?.costo) && positivo(electricidad?.consumo)
      ? electricidad!.costo! / electricidad!.consumo!
      : 0);

  const generacionEstimadaKwh =
    potencia * evaluacion.horas_sol_pico * diasMes * evaluacion.performance_ratio;
  const generacionMinKwh =
    min * evaluacion.horas_sol_pico * diasMes * evaluacion.performance_ratio;
  const generacionMaxKwh =
    max * evaluacion.horas_sol_pico * diasMes * evaluacion.performance_ratio;

  const generacionMedida = evaluacion.generacion_medida_kwh > 0;
  const generacionKwh = generacionMedida
    ? evaluacion.generacion_medida_kwh
    : generacionEstimadaKwh;

  const consumoDiurnoKwh =
    consumoMensualKwh * (evaluacion.consumo_diurno_pct / 100);

  const autoconsumoMedido = evaluacion.autoconsumo_medido_kwh > 0;
  const autoconsumoKwh = autoconsumoMedido
    ? evaluacion.autoconsumo_medido_kwh
    : Math.min(generacionKwh, consumoDiurnoKwh);

  const excedentesKwh =
    evaluacion.excedentes_medidos_kwh > 0
      ? evaluacion.excedentes_medidos_kwh
      : Math.max(0, generacionKwh - autoconsumoKwh);

  const ahorroMensualClp =
    autoconsumoKwh * precioKwh +
    excedentesKwh * evaluacion.precio_inyeccion_kwh;
  const co2EvitadoKgMes = generacionKwh * evaluacion.factor_co2_kg_kwh;

  const performanceRatioMedido = generacionMedida
    ? generacionKwh / (potencia * evaluacion.horas_sol_pico * diasMes)
    : null;

  return {
    potenciaKwp: potencia,
    potenciaMinKwp: min,
    potenciaMaxKwp: max,
    generacionEstimadaKwh,
    generacionMinKwh,
    generacionMaxKwh,
    generacionKwh,
    generacionAnualKwh: generacionKwh * 12,
    generacionMedida,
    consumoMensualKwh,
    consumoDiurnoKwh,
    autoconsumoKwh,
    autoconsumoMedido,
    excedentesKwh,
    autoconsumoPct: porcentaje(autoconsumoKwh, generacionKwh),
    coberturaTotalPct: porcentaje(autoconsumoKwh, consumoMensualKwh),
    coberturaDiurnaPct: porcentaje(autoconsumoKwh, consumoDiurnoKwh),
    precioKwh,
    ahorroMensualClp,
    ahorroAnualClp: ahorroMensualClp * 12,
    co2EvitadoKgMes,
    rendimientoEspecificoKwhKwpMes: generacionKwh / potencia,
    performanceRatioMedido,
  };
}

export function oportunidadesFotovoltaicas(
  resultado: ResultadoFotovoltaico,
): string[] {
  const oportunidades: string[] = [];

  if (resultado.autoconsumoPct < 80) {
    oportunidades.push(
      'Desplazar cargas eléctricas hacia las horas de mayor generación solar para aumentar el autoconsumo y reducir la dependencia de la red.',
    );
  }
  if (resultado.coberturaTotalPct < 30) {
    oportunidades.push(
      'Evaluar una ampliación del sistema o una segunda etapa si la superficie disponible y la curva de consumo lo permiten.',
    );
  }
  if (resultado.excedentesKwh > 0) {
    oportunidades.push(
      'Analizar la valorización de excedentes mediante netbilling o la incorporación de almacenamiento para aprovecharlos en horarios sin sol.',
    );
  }
  if (
    resultado.performanceRatioMedido !== null &&
    resultado.performanceRatioMedido < 0.75
  ) {
    oportunidades.push(
      'Revisar sombreamiento, limpieza de paneles, orientación e inclinación, y el estado del inversor para recuperar el rendimiento esperado.',
    );
  }
  if (
    resultado.generacionMedida &&
    resultado.generacionKwh < resultado.generacionEstimadaKwh * 0.9
  ) {
    oportunidades.push(
      'Investigar la desviación entre generación medida y estimada, verificando disponibilidad, suciedad y posibles fallas del sistema.',
    );
  }
  if (oportunidades.length === 0) {
    oportunidades.push(
      'Mantener el monitoreo mensual de generación, autoconsumo y cobertura para detectar desviaciones y ajustar la operación.',
    );
  }

  return oportunidades.slice(0, 4);
}
