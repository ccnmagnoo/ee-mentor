import { stringify as yamlStringify } from 'yaml';
import {
  CATEGORIAS,
  DIFICULTADES,
  ENERGOS,
  GRADOS_CONSUMO,
  IMPACTOS,
  INVERSIONES,
  PRIORIDADES,
  RECURSO_CATEGORIAS,
  SECCIONES,
  USOS_FINALES,
  type Categoria,
  type Empresa,
  type Hallazgo,
  type Recurso,
  type Recomendacion,
  type SeccionKey,
  type UsoFinal,
  type Visita,
} from './schemas';
import { clasificarPuntaje, evaluarSecciones, redondear } from './scoring';
import { formatCLP, formatFecha, formatNumero } from './config';

export interface ReportInput {
  empresa: Empresa;
  visita: Visita;
  hallazgos: Map<string, Hallazgo>;
  recomendaciones: Map<string, Recomendacion>;
  recursos: Recurso[];
}

interface RecoSeleccionada {
  reco: Recomendacion;
  prioridad: keyof typeof PRIORIDADES;
  observacion: string;
}

const ORDEN_PRIORIDAD: Record<keyof typeof PRIORIDADES, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

const GRUPOS_FALENCIAS: Array<{ titulo: string; categorias: Categoria[] }> = [
  { titulo: 'Iluminación', categorias: ['iluminacion'] },
  {
    titulo: 'Refrigeración y congelación',
    categorias: ['refrigeracion', 'congelacion', 'mantencion'],
  },
  { titulo: 'Climatización y ventilación', categorias: ['climatizacion', 'ventilacion', 'calderas'] },
  { titulo: 'Cocción', categorias: ['coccion'] },
  { titulo: 'Agua caliente sanitaria', categorias: ['acs'] },
  {
    titulo: 'Fuerza motriz y equipos productivos',
    categorias: ['motores', 'equipos_productivos'],
  },
  { titulo: 'Envolvente e infiltraciones', categorias: ['envolvente', 'infiltraciones'] },
  {
    titulo: 'Gestión, tarifas y potencia contratada',
    categorias: ['gestion_energetica', 'gestion_operacional', 'tarifas', 'potencia_contratada'],
  },
  { titulo: 'Energías renovables', categorias: ['ernc'] },
  { titulo: 'Otros aspectos', categorias: ['otros'] },
];

const ORDEN_PLAZO = [
  'Inmediato (0-30 días)',
  'Corto plazo (1-3 meses)',
  'Mediano plazo (3-6 meses)',
  'Largo plazo (6-12 meses)',
] as const;

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function cell(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  return String(value)
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function bullets(items: string[]): string {
  return items.filter(Boolean).map((item) => `- ${item}`).join('\n');
}

function etiquetaEnergia(value: string): string {
  return ENERGOS[value as keyof typeof ENERGOS] ?? value;
}

function etiquetaCategoria(value: string): string {
  return CATEGORIAS[value as Categoria] ?? value;
}

function etiquetaUsoFinal(value: string): string {
  return USOS_FINALES[value as UsoFinal] ?? value;
}

function usoFinalDeCategoria(categoria: Categoria): UsoFinal {
  switch (categoria) {
    case 'iluminacion':
      return 'iluminacion';
    case 'refrigeracion':
    case 'congelacion':
    case 'mantencion':
      return 'refrigeracion';
    case 'climatizacion':
    case 'ventilacion':
    case 'calderas':
      return 'climatizacion';
    case 'coccion':
      return 'coccion';
    case 'acs':
      return 'acs';
    case 'motores':
      return 'fuerza_motriz';
    case 'equipos_productivos':
      return 'equipos_productivos';
    default:
      return 'otros';
  }
}

function plazoNormalizado(reco: Recomendacion): string {
  const plazo = reco.plazo.toLowerCase();
  if (plazo.includes('inmediat')) return ORDEN_PLAZO[0];
  if (plazo.includes('corto')) return ORDEN_PLAZO[1];
  if (plazo.includes('mediano')) return ORDEN_PLAZO[2];
  if (plazo.includes('largo')) return ORDEN_PLAZO[3];
  if (reco.inversion === 'baja') return ORDEN_PLAZO[1];
  if (reco.inversion === 'media') return ORDEN_PLAZO[2];
  return ORDEN_PLAZO[3];
}

function recomendacionesSeleccionadas(input: ReportInput): RecoSeleccionada[] {
  const seleccionadas: RecoSeleccionada[] = [];
  const vistos = new Set<string>();

  for (const item of input.visita.recomendaciones) {
    const reco = input.recomendaciones.get(item.recomendacion_id);
    if (!reco || vistos.has(reco.id)) continue;
    vistos.add(reco.id);
    seleccionadas.push({
      reco,
      prioridad: item.prioridad ?? reco.prioridad,
      observacion: item.observacion,
    });
  }

  // Fallback: si el consultor no seleccionó recomendaciones, se derivan del
  // vínculo hallazgo → recomendación del catálogo.
  if (seleccionadas.length === 0) {
    for (const seleccion of input.visita.hallazgos) {
      const hallazgo = input.hallazgos.get(seleccion.hallazgo_id);
      if (!hallazgo?.recomendacion_id) continue;
      const reco = input.recomendaciones.get(hallazgo.recomendacion_id);
      if (!reco || vistos.has(reco.id)) continue;
      vistos.add(reco.id);
      seleccionadas.push({ reco, prioridad: reco.prioridad, observacion: '' });
    }
  }

  return seleccionadas.sort(
    (a, b) =>
      ORDEN_PRIORIDAD[a.prioridad] - ORDEN_PRIORIDAD[b.prioridad] ||
      a.reco.titulo.localeCompare(b.reco.titulo, 'es'),
  );
}

function hallazgosSeleccionados(input: ReportInput): Hallazgo[] {
  return input.visita.hallazgos
    .map((seleccion) => input.hallazgos.get(seleccion.hallazgo_id))
    .filter((item): item is Hallazgo => Boolean(item));
}

function textoPerfil(input: ReportInput): string {
  if (input.visita.descripcion_perfil.trim()) {
    return input.visita.descripcion_perfil.trim();
  }
  const { empresa, visita } = input;
  const partes: string[] = [];
  partes.push(
    `**${empresa.nombre}** corresponde a un negocio del rubro **${empresa.rubro || 'no especificado'}**` +
      `${empresa.comuna ? `, ubicado en la comuna de ${empresa.comuna}` : ''}` +
      `${empresa.region ? `, Región de ${empresa.region}` : ''}.`,
  );
  if (empresa.trabajadores > 0 || empresa.superficie_m2 > 0) {
    partes.push(
      `La operación considera ${empresa.trabajadores || 'no informados'} trabajadores y una superficie aproximada de ${empresa.superficie_m2 || 'no informada'} m².`,
    );
  }
  if (visita.energeticos.length) {
    partes.push(
      `Los principales energéticos declarados son ${visita.energeticos
        .map((e) => etiquetaEnergia(e.tipo))
        .join(', ')}.`,
    );
  }
  partes.push(`El grado de consumo observado se clasifica como **${GRADOS_CONSUMO[visita.grado_consumo]}**.`);
  return partes.join(' ');
}

function contextoEmpresa(empresa: Empresa): string {
  const partes = [
    empresa.rubro && `Rubro: ${empresa.rubro}`,
    empresa.comuna && `Comuna: ${empresa.comuna}`,
    empresa.region && `Región: ${empresa.region}`,
    empresa.superficie_m2 > 0 && `Superficie: ${formatNumero(empresa.superficie_m2, 'm²')}`,
    empresa.trabajadores > 0 && `Trabajadores: ${empresa.trabajadores}`,
  ].filter(Boolean) as string[];
  return partes.join(' · ');
}

function construirResumenEjecutivo(
  input: ReportInput,
  hallazgos: Hallazgo[],
  recomendaciones: RecoSeleccionada[],
): string {
  const evaluacion = evaluarSecciones(input.visita.secciones);
  const lineas: string[] = [];

  lineas.push(
    `El presente informe resume el diagnóstico energético realizado a **${input.empresa.nombre}** el ${formatFecha(input.visita.fecha)}. La evaluación abarca ${evaluacion.evaluadas} de ${evaluacion.total} dimensiones del desempeño energético y entrega una hoja de ruta priorizada para reducir consumos y costos operacionales.`,
  );

  if (evaluacion.puntajeGlobal !== null) {
    lineas.push(
      `El **puntaje global de desempeño es ${redondear(evaluacion.puntajeGlobal, 1).toFixed(1)}/5**, clasificado como **${evaluacion.clasificacionGlobal.etiqueta}**. ${evaluacion.clasificacionGlobal.descripcion}`,
    );
  }

  const conteoImpacto = hallazgos.reduce<Record<string, number>>((acc, h) => {
    acc[h.impacto] = (acc[h.impacto] ?? 0) + 1;
    return acc;
  }, {});

  if (hallazgos.length || recomendaciones.length) {
    lineas.push(
      `Se identificaron **${hallazgos.length} hallazgos** y **${recomendaciones.length} recomendaciones** de mejora.` +
        (conteoImpacto.critico || conteoImpacto.alto
          ? ` De ellos, ${hallazgos.filter((h) => h.impacto === 'critico' || h.impacto === 'alto').length} hallazgos presentan impacto alto o crítico y deberían abordarse en el corto plazo.`
          : ''),
    );
  }

  const bajoCosto = recomendaciones.filter((r) => r.reco.inversion === 'baja');
  if (bajoCosto.length) {
    lineas.push(
      `Un total de **${bajoCosto.length} medidas son de bajo costo** y pueden implementarse principalmente mediante ajustes operacionales, mantención y capacitación, sin comprometer inversiones relevantes.`,
    );
  }

  const top = recomendaciones.slice(0, 3);
  if (top.length) {
    lineas.push(
      `Las acciones prioritarias sugeridas son: ${top
        .map((item) => `**${item.reco.titulo}**`)
        .join('; ')}.`,
    );
  }

  lineas.push(
    'Las estimaciones de ahorro incluidas son referenciales, no son aditivas entre sí y deben validarse con mediciones y cotizaciones antes de su implementación.',
  );

  return lineas.join('\n\n');
}

function tablaEnergia(visita: Visita): string {
  if (!visita.energeticos.length) {
    return '_No se registraron consumos por energético en la visita._';
  }
  const filas = visita.energeticos.map(
    (e) =>
      `| ${cell(etiquetaEnergia(e.tipo))} | ${cell(e.consumo !== undefined ? formatNumero(e.consumo, e.unidad) : 'No informado')} | ${cell(e.costo !== undefined ? formatCLP(e.costo) : '—')} | ${cell(e.observacion)} |`,
  );
  return [
    '| Energético | Consumo declarado | Costo mensual | Observación |',
    '| --- | ---: | ---: | --- |',
    ...filas,
  ].join('\n');
}

function tablaEquipos(visita: Visita): string {
  if (!visita.equipos.length) {
    return '_No se registró un inventario detallado de equipos._';
  }
  const filas = visita.equipos.map(
    (e) =>
      `| ${cell(e.nombre)} | ${cell(e.cantidad)} | ${cell(e.potencia_w !== undefined ? `${formatNumero(e.potencia_w)} W` : '—')} | ${cell(e.horas_dia !== undefined ? `${formatNumero(e.horas_dia)} h/día` : '—')} | ${cell(e.estado)} | ${cell(e.observacion)} |`,
  );
  return [
    '| Equipo | Cantidad | Potencia | Uso diario | Estado | Observación |',
    '| --- | ---: | ---: | ---: | --- | --- |',
    ...filas,
  ].join('\n');
}

function tablaEvaluacion(input: ReportInput): string {
  const evaluacion = evaluarSecciones(input.visita.secciones);
  const filas = evaluacion.secciones.map(
    (s) =>
      `| ${cell(s.nombre)} | ${s.aplica ? `${s.puntaje}/5` : 'No evaluado'} | ${cell(s.clasificacion.etiqueta)} |`,
  );
  const global = evaluacion.puntajeGlobal;
  return [
    '| Dimensión | Puntaje | Clasificación |',
    '| --- | :---: | --- |',
    ...filas,
    `| **Puntaje global** | **${global !== null ? `${redondear(global, 1).toFixed(1)}/5` : 'No evaluado'}** | **${cell(evaluacion.clasificacionGlobal.etiqueta)}** |`,
  ].join('\n');
}

function fortalezasYBrechas(input: ReportInput): string {
  const evaluacion = evaluarSecciones(input.visita.secciones);
  const fortalezas = evaluacion.secciones.filter((s) => s.aplica && s.puntaje >= 4);
  const brechas = evaluacion.secciones.filter((s) => s.aplica && s.puntaje <= 2.5);
  const lineas: string[] = [];
  if (fortalezas.length) {
    lineas.push(
      `**Fortalezas observadas:** ${fortalezas
        .map((s) => `${s.nombre} (${s.puntaje}/5)`)
        .join('; ')}.`,
    );
  }
  if (brechas.length) {
    lineas.push(
      `**Brechas prioritarias:** ${brechas
        .map((s) => `${s.nombre} (${s.puntaje}/5, ${s.clasificacion.etiqueta.toLowerCase()})`)
        .join('; ')}.`,
    );
  }
  return lineas.join('\n\n');
}

function seccionHallazgos(input: ReportInput): string {
  const hallazgos = hallazgosSeleccionados(input);
  if (!hallazgos.length) {
    return '## 2. Principales falencias detectadas\n\nNo se registraron hallazgos en esta visita. Se recomienda mantener el monitoreo y revisar la pauta en la próxima inspección.';
  }

  const lineas: string[] = ['## 2. Principales falencias detectadas', ''];

  const porImpacto = hallazgos.reduce<Record<string, number>>((acc, h) => {
    acc[h.impacto] = (acc[h.impacto] ?? 0) + 1;
    return acc;
  }, {});
  lineas.push(
    `Se identificaron ${hallazgos.length} hallazgos. La distribución por impacto es: ` +
      Object.entries(IMPACTOS)
        .map(([key, label]) => `${label.toLowerCase()}: ${porImpacto[key] ?? 0}`)
        .join(', ') +
      '.',
    '',
  );

  const porEnergia = new Map<string, number>();
  for (const hallazgo of hallazgos) {
    porEnergia.set(hallazgo.energetico, (porEnergia.get(hallazgo.energetico) ?? 0) + 1);
  }
  lineas.push('### Distribución por energético', '');
  lineas.push('| Energético | Hallazgos |', '| --- | ---: |');
  for (const [energia, cantidad] of [...porEnergia.entries()].sort((a, b) => b[1] - a[1])) {
    lineas.push(`| ${cell(etiquetaEnergia(energia))} | ${cantidad} |`);
  }
  lineas.push('');

  for (const grupo of GRUPOS_FALENCIAS) {
    const items = hallazgos.filter((h) => grupo.categorias.includes(h.categoria));
    if (!items.length) continue;
    lineas.push(`### ${grupo.titulo}`, '');
    for (const hallazgo of items) {
      const seleccion = input.visita.hallazgos.find((h) => h.hallazgo_id === hallazgo.id);
      const justificacion = seleccion?.justificacion?.trim() || hallazgo.justificacion;
      lineas.push(
        `#### ${hallazgo.codigo} · ${oneLine(hallazgo.titulo)}`,
        '',
        `**Impacto:** ${IMPACTOS[hallazgo.impacto]} · **Energético:** ${etiquetaEnergia(hallazgo.energetico)} · **Categoría:** ${etiquetaCategoria(hallazgo.categoria)}`,
        '',
        oneLine(hallazgo.descripcion),
        '',
      );
      if (justificacion) {
        lineas.push(`**Justificación técnica:** ${oneLine(justificacion)}`, '');
      }
      if (hallazgo.recomendacion_id) {
        lineas.push(`**Recomendación asociada:** ${hallazgo.recomendacion_id}`, '');
      }
    }
  }

  return lineas.join('\n').trim();
}

function detalleRecomendacion(item: RecoSeleccionada, input: ReportInput): string[] {
  const { reco } = item;
  const hallazgosVinculados = input.visita.hallazgos
    .map((h) => input.hallazgos.get(h.hallazgo_id))
    .filter((h): h is Hallazgo => Boolean(h) && h!.recomendacion_id === reco.id)
    .map((h) => h.codigo);
  const lineas = [
    `#### ${reco.codigo} · ${oneLine(reco.titulo)}`,
    '',
    `**Prioridad:** ${PRIORIDADES[item.prioridad]} · **Inversión:** ${INVERSIONES[reco.inversion]} · **Complejidad:** ${DIFICULTADES[reco.dificultad]} · **Ahorro estimado:** ${reco.ahorro_estimado || 'Por cuantificar'} · **Plazo:** ${reco.plazo}`,
    '',
    oneLine(reco.descripcion),
    '',
  ];
  if (reco.beneficio) {
    lineas.push(`**Beneficio esperado:** ${oneLine(reco.beneficio)}`, '');
  }
  if (item.observacion) {
    lineas.push(`**Observación del consultor:** ${oneLine(item.observacion)}`, '');
  }
  if (hallazgosVinculados.length) {
    lineas.push(`**Atiende hallazgos:** ${hallazgosVinculados.join(', ')}`, '');
  }
  return lineas;
}

function seccionRecomendaciones(input: ReportInput, recomendaciones: RecoSeleccionada[]): string {
  if (!recomendaciones.length) {
    return '## 3. Recomendaciones de mejora energética\n\nNo se seleccionaron recomendaciones para esta visita.';
  }

  const lineas: string[] = ['## 3. Recomendaciones de mejora energética', ''];
  lineas.push(
    `Las ${recomendaciones.length} medidas propuestas se ordenan por nivel de inversión. La prioridad considera el impacto potencial, el costo y la facilidad de implementación.`,
    '',
  );

  for (const inversion of ['baja', 'media', 'alta'] as const) {
    const items = recomendaciones.filter((r) => r.reco.inversion === inversion);
    if (!items.length) continue;
    lineas.push(`### ${INVERSIONES[inversion]}`, '');
    for (const item of items) {
      lineas.push(...detalleRecomendacion(item, input), '');
    }
  }

  lineas.push('### Vista por uso final', '');
  lineas.push('| Uso final | Recomendaciones | Inversión predominante |', '| --- | --- | --- |');
  const usos = new Map<string, RecoSeleccionada[]>();
  for (const item of recomendaciones) {
    const uso = usoFinalDeCategoria(item.reco.categoria);
    usos.set(uso, [...(usos.get(uso) ?? []), item]);
  }
  for (const [uso, items] of usos) {
    const inversion = items.some((i) => i.reco.inversion === 'alta')
      ? 'Alta'
      : items.some((i) => i.reco.inversion === 'media')
        ? 'Media'
        : 'Baja';
    lineas.push(
      `| ${cell(etiquetaUsoFinal(uso))} | ${cell(items.map((i) => i.reco.titulo).join('; '))} | ${inversion} |`,
    );
  }
  return lineas.join('\n').trim();
}

function seccionPlan(input: ReportInput, recomendaciones: RecoSeleccionada[]): string {
  const lineas: string[] = ['## 4. Plan de acción sugerido', ''];
  if (!recomendaciones.length) {
    lineas.push('No hay acciones priorizadas para esta visita.', '');
  } else {
    lineas.push(
      'El siguiente plan ordena las medidas según horizonte de implementación. Se sugiere revisar los avances en cada visita de seguimiento y ajustar las metas según los resultados medidos.',
      '',
    );
    lineas.push(
      '| Prioridad | Acción | Inversión | Plazo | Ahorro referencial |',
      '| --- | --- | --- | --- | --- |',
    );
    const ordenadas = [...recomendaciones].sort(
      (a, b) =>
        ORDEN_PLAZO.indexOf(plazoNormalizado(a.reco) as (typeof ORDEN_PLAZO)[number]) -
          ORDEN_PLAZO.indexOf(plazoNormalizado(b.reco) as (typeof ORDEN_PLAZO)[number]) ||
        ORDEN_PRIORIDAD[a.prioridad] - ORDEN_PRIORIDAD[b.prioridad],
    );
    for (const item of ordenadas) {
      lineas.push(
        `| ${cell(PRIORIDADES[item.prioridad])} | ${cell(item.reco.titulo)} | ${cell(INVERSIONES[item.reco.inversion])} | ${cell(plazoNormalizado(item.reco))} | ${cell(item.reco.ahorro_estimado || 'Por cuantificar')} |`,
      );
    }
    lineas.push('');
  }

  lineas.push('### Metas y seguimiento recomendado', '');
  lineas.push(
    bullets([
      'Designar un responsable interno para la gestión energética y registrar mensualmente consumos, costos y principales indicadores.',
      'Establecer una meta inicial de reducción de 5% a 10% del consumo anual respecto de la línea base, sujeta a verificación.',
      'Revisar mensualmente la facturación eléctrica y de combustibles, verificando tarifa, potencia contratada y factor de potencia.',
      'Mantener un registro de mantenciones preventivas y de temperaturas de operación de equipos de frío.',
      'Documentar las acciones implementadas y sus resultados para consolidar la mejora continua.',
    ]),
    '',
  );

  if (input.visita.acuerdos.length) {
    lineas.push('### Acuerdos y próximos pasos', '');
    lineas.push(bullets(input.visita.acuerdos), '');
  }
  if (input.visita.proxima_visita) {
    lineas.push(`**Próxima visita sugerida:** ${formatFecha(input.visita.proxima_visita)}`, '');
  } else {
    lineas.push('**Próxima visita sugerida:** a definir con la empresa.', '');
  }

  return lineas.join('\n').trim();
}

function seccionRecursos(recursos: Recurso[]): string {
  const lineas: string[] = ['## 5. Información complementaria', ''];
  if (!recursos.length) {
    lineas.push('No hay recursos configurados en el catálogo.', '');
    return lineas.join('\n').trim();
  }
  lineas.push(
    'Los siguientes recursos públicos pueden apoyar la implementación de las medidas y la postulación a programas de fomento. Su inclusión es referencial y no constituye una recomendación comercial.',
    '',
  );
  for (const [key, label] of Object.entries(RECURSO_CATEGORIAS)) {
    const items = recursos.filter((r) => r.categoria === key);
    if (!items.length) continue;
    lineas.push(`### ${label}`, '');
    for (const recurso of items) {
      lineas.push(
        `- **${oneLine(recurso.nombre)}.** ${oneLine(recurso.descripcion)} [${recurso.url}](${recurso.url})`,
      );
    }
    lineas.push('');
  }
  return lineas.join('\n').trim();
}

function seccionAnexo(input: ReportInput): string {
  const evaluacion = evaluarSecciones(input.visita.secciones);
  return [
    '## Anexo A. Metodología y alcance',
    '',
    '### Escala de evaluación',
    '',
    '| Puntaje | Criterio |',
    '| :---: | --- |',
    '| 0 | No aplica / no evaluado |',
    '| 1 | Deficiente |',
    '| 2 | Regular |',
    '| 3 | Bueno |',
    '| 4 | Muy bueno |',
    '| 5 | Excelente |',
    '',
    '### Clasificación del puntaje promedio',
    '',
    '| Rango | Clasificación |',
    '| --- | --- |',
    '| 0,0 – 1,5 | Crítico |',
    '| 1,6 – 2,5 | Deficiente |',
    '| 2,6 – 3,5 | Aceptable |',
    '| 3,6 – 4,5 | Bueno |',
    '| 4,6 – 5,0 | Destacado |',
    '',
    `El puntaje global se calcula como el promedio simple de las ${evaluacion.evaluadas} dimensiones evaluadas. Las secciones con puntaje 0 se excluyen del promedio.`,
    '',
    '### Alcance del diagnóstico',
    '',
    '- Inspección visual y levantamiento de información en terreno, complementado con antecedentes declarados por la empresa.',
    '- Diagnóstico de nivel básico, orientado a identificar oportunidades de mejora y priorizar acciones; no reemplaza una auditoría energética detallada ni un proyecto de ingeniería.',
    '- Los ahorros y costos son estimaciones referenciales. Deben validarse mediante mediciones, análisis de facturación y cotizaciones formales.',
    '- La implementación de medidas eléctricas, de gas o de combustibles debe ser ejecutada por profesionales o instaladores certificados cuando corresponda.',
    '',
    '### Antecedentes de la visita',
    '',
    `- **Fecha:** ${formatFecha(input.visita.fecha)}`,
    `- **Asesor:** ${input.visita.asesor}`,
    `- **Grado de consumo:** ${GRADOS_CONSUMO[input.visita.grado_consumo]}`,
    `- **Clasificación global:** ${evaluacion.clasificacionGlobal.etiqueta}`,
    `- **Generado:** ${new Date().toLocaleString('es-CL')}`,
    '',
    '---',
    '',
    'Documento generado automáticamente por EE Mentor. Debe ser revisado y validado por el consultor energético antes de su entrega al cliente.',
  ].join('\n');
}

export function generarMarkdown(input: ReportInput): string {
  const { empresa, visita } = input;
  const hallazgos = hallazgosSeleccionados(input);
  const recomendaciones = recomendacionesSeleccionadas(input);
  const evaluacion = evaluarSecciones(visita.secciones);

  const frontmatter: Record<string, unknown> = {
    title: `Informe técnico de eficiencia energética — ${empresa.nombre}`,
    tipo: 'informe_diagnostico_energetico',
    empresa_id: empresa.id,
    empresa: empresa.nombre,
    rut: empresa.rut,
    visita_id: visita.id,
    fecha_visita: visita.fecha,
    asesor: visita.asesor,
    comuna: empresa.comuna,
    region: empresa.region,
    rubro: empresa.rubro,
    version: 1,
    generado: new Date().toISOString(),
    puntaje_global:
      evaluacion.puntajeGlobal !== null ? redondear(evaluacion.puntajeGlobal, 1) : null,
    clasificacion: evaluacion.clasificacionGlobal.etiqueta,
    hallazgos: hallazgos.length,
    recomendaciones: recomendaciones.length,
    tags: ['eficiencia-energetica', empresa.rubro.toLowerCase().replace(/\s+/g, '-')].filter(
      Boolean,
    ),
  };

  const lines: string[] = [];
  lines.push('# Informe Técnico de Eficiencia Energética', '');
  lines.push(`## ${empresa.nombre}`, '');
  lines.push(
    `**Visita:** ${visita.id} · **Fecha:** ${formatFecha(visita.fecha)} · **Asesor:** ${visita.asesor}`,
    '',
  );
  if (contextoEmpresa(empresa)) lines.push(`${contextoEmpresa(empresa)}`, '');
  if (empresa.rut) lines.push(`**RUT:** ${empresa.rut} · **Contacto:** ${empresa.contacto || '—'} · **Teléfono:** ${empresa.telefono || '—'}`, '');
  lines.push('---', '');

  lines.push('## Resumen ejecutivo', '');
  lines.push(construirResumenEjecutivo(input, hallazgos, recomendaciones), '');

  lines.push('## 1. Perfil energético', '');
  lines.push('### 1.1 Contexto del negocio', '');
  lines.push(textoPerfil(input), '');

  lines.push('### 1.2 Energéticos utilizados', '');
  lines.push(tablaEnergia(visita), '');
  if (visita.usos_finales.length) {
    lines.push(
      `**Principales usos finales:** ${visita.usos_finales.map((u) => etiquetaUsoFinal(u)).join(', ')}.`,
      '',
    );
  }
  if (empresa.observaciones) {
    lines.push(`**Observaciones de la empresa:** ${oneLine(empresa.observaciones)}`, '');
  }

  lines.push('### 1.3 Equipos y procesos observados', '');
  lines.push(tablaEquipos(visita), '');

  lines.push('### 1.4 Evaluación energética global', '');
  lines.push(tablaEvaluacion(input), '');
  const fortalezas = fortalezasYBrechas(input);
  if (fortalezas) lines.push(fortalezas, '');
  if (visita.observaciones) {
    lines.push(`**Observaciones generales de la visita:** ${oneLine(visita.observaciones)}`, '');
  }

  lines.push(seccionHallazgos(input), '');
  lines.push(seccionRecomendaciones(input, recomendaciones), '');
  lines.push(seccionPlan(input, recomendaciones), '');
  lines.push(seccionRecursos(input.recursos), '');
  lines.push(seccionAnexo(input), '');

  const yaml = yamlStringify(frontmatter, { lineWidth: 0 }).trim();
  return `---\n${yaml}\n---\n\n${lines.join('\n').replace(/\n{3,}/g, '\n\n')}`;
}

export function datosPortada(input: ReportInput): {
  empresa: Empresa;
  visita: Visita;
  evaluacion: ReturnType<typeof evaluarSecciones>;
} {
  return {
    empresa: input.empresa,
    visita: input.visita,
    evaluacion: evaluarSecciones(input.visita.secciones),
  };
}

export function resumenSeccion(input: ReportInput): Array<{
  key: SeccionKey;
  nombre: string;
  puntaje: number;
  clasificacion: string;
}> {
  return evaluarSecciones(input.visita.secciones).secciones.map((s) => ({
    key: s.key,
    nombre: SECCIONES[s.key],
    puntaje: s.puntaje,
    clasificacion: clasificarPuntaje(s.aplica ? s.puntaje : null).etiqueta,
  }));
}
