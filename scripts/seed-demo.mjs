import { promises as fs } from 'node:fs';
import path from 'node:path';
import { stringify } from 'smol-toml';

const DATA = path.resolve('data');
const EMPRESAS = path.join(DATA, 'empresas');
const NOW = '2026-01-01T00:00:00.000Z';

const empresas = [
  {
    id: 'EMP-001',
    nombre: 'Café Aurora',
    rut: '76.482.193-5',
    direccion: 'Av. Valparaíso 1250, local 4',
    comuna: 'Viña del Mar',
    region: 'Valparaíso',
    rubro: 'Cafetería',
    contacto: 'María José Herrera',
    telefono: '+56 9 6123 4587',
    correo: 'contacto@cafeaurora.cl',
    trabajadores: 5,
    superficie_m2: 72,
    observaciones:
      'Local arrendado en galería comercial. Operación de lunes a sábado de 08:00 a 20:00 horas, con peak de demanda entre 09:00 y 12:00.',
    created_at: '2026-06-10T10:00:00.000Z',
    updated_at: NOW,
  },
  {
    id: 'EMP-002',
    nombre: 'Pastelería Los Aromos',
    rut: '77.105.842-K',
    direccion: 'Calle Blanco 845',
    comuna: 'Quilpué',
    region: 'Valparaíso',
    rubro: 'Pequeña fábrica de alimentos',
    contacto: 'Rodrigo Salinas',
    telefono: '+56 9 7845 1120',
    correo: 'ventas@losaromos.cl',
    trabajadores: 9,
    superficie_m2: 135,
    observaciones:
      'Fábrica y punto de venta. Produce tortas y masas durante la madrugada; cuenta con dos cámaras de frío y tres hornos eléctricos.',
    created_at: '2026-07-20T10:00:00.000Z',
    updated_at: NOW,
  },
  {
    id: 'EMP-003',
    nombre: 'Hostal Brisa Marina',
    rut: '76.221.604-8',
    direccion: 'Los Pinos 48',
    comuna: 'Concón',
    region: 'Valparaíso',
    rubro: 'Hostal',
    contacto: 'Paula Reyes',
    telefono: '+56 9 5544 7781',
    correo: 'reservas@brisamarina.cl',
    trabajadores: 6,
    superficie_m2: 185,
    observaciones:
      'Hostal de 9 habitaciones con desayuno incluido. Mayor ocupación entre diciembre y marzo; calefacción con equipos individuales.',
    created_at: '2026-09-01T10:00:00.000Z',
    updated_at: NOW,
  },
];

function seccion(puntaje, observaciones = '') {
  return { puntaje, observaciones };
}

const visitas = [
  {
    empresa_id: 'EMP-001',
    id: 'VIS-001',
    fecha: '2026-06-17',
    asesor: 'Carlos Campos N.',
    grado_consumo: 'moderado',
    descripcion_perfil:
      'Café Aurora es una cafetería de pequeña escala ubicada en una galería comercial de Viña del Mar. La electricidad es el energético principal y se destina a máquinas de café, horno de convección, refrigeración e iluminación. El GLP se utiliza en la plancha y en la cocina. El mayor consumo se concentra en la preparación de alimentos y en los equipos de frío que operan de forma continua. La iluminación permanece encendida durante toda la jornada y la climatización se apoya en un calefactor portátil en invierno.',
    energeticos: [
      { tipo: 'electricidad', consumo: 712, unidad: 'kWh/mes', costo: 112000, observacion: 'Consumo promedio últimos 6 meses. Tarifa BT1.' },
      { tipo: 'glp', consumo: 45, unidad: 'kg/mes', costo: 68000, observacion: 'Suministro en cilindro de 45 kg.' },
    ],
    usos_finales: ['iluminacion', 'refrigeracion', 'coccion', 'climatizacion'],
    equipos: [
      { nombre: 'Máquina de espresso doble grupo', cantidad: 1, potencia_w: 3200, horas_dia: 10, estado: 'regular', observacion: 'Opera desde la apertura; incluye caldera.' },
      { nombre: 'Horno de convección', cantidad: 1, potencia_w: 2800, horas_dia: 6, estado: 'regular', observacion: 'Uso discontinuo con aperturas frecuentes.' },
      { nombre: 'Vitrina refrigerada de exhibición', cantidad: 2, potencia_w: 450, horas_dia: 24, estado: 'regular', observacion: 'Una se usa como almacén prolongado.' },
      { nombre: 'Congelador vertical', cantidad: 1, potencia_w: 380, horas_dia: 24, estado: 'deficiente', observacion: 'Escarcha visible en evaporador.' },
      { nombre: 'Calefactor portátil', cantidad: 2, potencia_w: 2000, horas_dia: 5, estado: 'deficiente', observacion: 'Uso en invierno.' },
    ],
    secciones: {
      iluminacion: { ...seccion(2, 'Tubos fluorescentes en sala y bodega. Sin zonificación.'), tecnologia: 'fluorescente', estado: 'regular', horas_uso_diarias: 12 },
      refrigeracion: { ...seccion(2, 'Vitrina usada como almacén y condensadores sucios.'), cantidad_equipos: 3, antiguedad_anios: 7, mantencion: 'ocasional' },
      congelacion: { ...seccion(2, 'Escarcha acumulada y control por percepción.'), cantidad_equipos: 1, antiguedad_anios: 8, estado: 'deficiente' },
      climatizacion: { ...seccion(1, 'Calefactores individuales como estrategia principal.'), tecnologia: 'Calefactor eléctrico portátil', mantenciones: 'sin_mantencion', control_temperatura: 'manual' },
      acs: { ...seccion(2, 'Agua caliente para café y aseo; sin aislación en tuberías.'), tecnologia: 'Caldera de espresso y termo eléctrico', fuente_energetica: 'electricidad', horarios: 'Toda la jornada' },
      coccion: { ...seccion(2, 'Horno con baja carga y aperturas frecuentes.'), equipos_principales: 'Horno de convección, plancha a gas, cocina', combustible: 'glp' },
      motores: { ...seccion(3, 'Sin motores relevantes; equipos de refrigeración en regular estado.'), tipo: 'Compresores de refrigeración', estado: 'regular', mantencion: 'ocasional' },
      envolvente: { ...seccion(1, 'Puertas y ventanas con infiltraciones; sin burletes.'), ventanas: 'regular', puertas: 'deficiente', infiltraciones: 'deficiente', aislacion: 'no_evaluado' },
      gestion: { ...seccion(1, 'No existe gestión energética ni registro de consumos.'), nivel: 'sin_gestion', monitoreo: false, responsable: '' },
      tarifas: { ...seccion(2, 'Tarifa BT1 sin análisis de perfil.'), tarifa_actual: 'BT1', potencia_contratada_kw: 0, factor_potencia: 0 },
    },
    hallazgos: [
      { hallazgo_id: 'HAL-ILUM-01', justificacion: 'Se contabilizaron 18 tubos fluorescentes en sala, bodega y baño, con 12 horas diarias de uso.' },
      { hallazgo_id: 'HAL-CLIM-01', justificacion: 'Dos calefactores de 2 kW se utilizan en paralelo durante el invierno.' },
      { hallazgo_id: 'HAL-REFR-01', justificacion: 'Una vitrina de exhibición se utiliza para almacenar productos durante la noche.' },
      { hallazgo_id: 'HAL-GEST-01', justificacion: 'No se registran consumos ni existe un responsable energético designado.' },
      { hallazgo_id: 'HAL-ENV-02', justificacion: 'Se perciben corrientes de aire en la puerta de acceso y en la ventana lateral.' },
    ],
    recomendaciones: [
      { recomendacion_id: 'REC-ILUM-01', prioridad: 'alta', observacion: 'Priorizar sala de atención y bodega.' },
      { recomendacion_id: 'REC-CLIM-01', prioridad: 'alta', observacion: 'Evaluar split inverter de 12.000 BTU.' },
      { recomendacion_id: 'REC-REFR-01', prioridad: 'alta', observacion: 'Rotular vitrinas y habilitar espacio de almacenamiento.' },
      { recomendacion_id: 'REC-ENV-02', prioridad: 'alta', observacion: 'Instalar burletes y cierrapuertas.' },
      { recomendacion_id: 'REC-COCC-01', prioridad: 'media', observacion: 'Agrupar la producción de masas en tandas.' },
      { recomendacion_id: 'REC-GEST-01', prioridad: 'alta', observacion: 'Comenzar con registro mensual de facturas.' },
    ],
    acuerdos: [
      'El consultor apoyará el registro mensual de consumos durante los próximos tres meses.',
      'La empresa solicitará cotización de luminarias LED y sellos para puertas y ventanas.',
    ],
    proxima_visita: '2026-11-15',
    observaciones: 'Se entrega listado de instaladores certificados y recursos públicos de apoyo.',
    created_at: '2026-06-17T15:00:00.000Z',
    updated_at: NOW,
  },
  {
    empresa_id: 'EMP-001',
    id: 'VIS-002',
    fecha: '2026-10-10',
    asesor: 'Carlos Campos N.',
    grado_consumo: 'moderado',
    descripcion_perfil:
      'Visita de seguimiento. La empresa implementó el recambio de luminarias en sala de atención y el sellamiento de la puerta principal. Se mantiene el uso de la vitrina como almacén y los calefactores individuales. Se observa una reducción del consumo eléctrico respecto de la visita anterior, aunque no se dispone de medición separada por área.',
    energeticos: [
      { tipo: 'electricidad', consumo: 648, unidad: 'kWh/mes', costo: 104000, observacion: 'Reducción preliminar de 9% respecto de la línea base.' },
      { tipo: 'glp', consumo: 42, unidad: 'kg/mes', costo: 66000, observacion: 'Sin cambios relevantes.' },
    ],
    usos_finales: ['iluminacion', 'refrigeracion', 'coccion', 'climatizacion'],
    equipos: [
      { nombre: 'Máquina de espresso doble grupo', cantidad: 1, potencia_w: 3200, horas_dia: 10, estado: 'regular', observacion: 'Sin cambios.' },
      { nombre: 'Horno de convección', cantidad: 1, potencia_w: 2800, horas_dia: 6, estado: 'regular', observacion: 'Se incorporó planificación de tandas.' },
      { nombre: 'Vitrina refrigerada de exhibición', cantidad: 2, potencia_w: 450, horas_dia: 24, estado: 'regular', observacion: 'Persiste uso como almacén en una unidad.' },
      { nombre: 'Congelador vertical', cantidad: 1, potencia_w: 380, horas_dia: 24, estado: 'regular', observacion: 'Se realizó descongelación y limpieza.' },
    ],
    secciones: {
      iluminacion: { ...seccion(4, 'Recambio a LED completado en sala; pendiente bodega.'), tecnologia: 'mixta', estado: 'bueno', horas_uso_diarias: 12 },
      refrigeracion: { ...seccion(3, 'Limpieza de condensadores realizada; persiste uso de vitrina.'), cantidad_equipos: 3, antiguedad_anios: 7, mantencion: 'programada' },
      congelacion: { ...seccion(3, 'Descongelación al día; falta registro formal.'), cantidad_equipos: 1, antiguedad_anios: 8, estado: 'regular' },
      climatizacion: { ...seccion(2, 'Persisten calefactores individuales.'), tecnologia: 'Calefactor eléctrico portátil', mantenciones: 'sin_mantencion', control_temperatura: 'manual' },
      acs: { ...seccion(2, 'Sin cambios en agua caliente.'), tecnologia: 'Caldera de espresso y termo eléctrico', fuente_energetica: 'electricidad', horarios: 'Toda la jornada' },
      coccion: { ...seccion(3, 'Mejor planificación de tandas; se mantienen aperturas.'), equipos_principales: 'Horno de convección, plancha a gas, cocina', combustible: 'glp' },
      motores: { ...seccion(3, 'Equipos sin novedades.'), tipo: 'Compresores de refrigeración', estado: 'regular', mantencion: 'ocasional' },
      envolvente: { ...seccion(3, 'Sellamiento de puerta principal ejecutado; ventana pendiente.'), ventanas: 'regular', puertas: 'regular', infiltraciones: 'regular', aislacion: 'no_evaluado' },
      gestion: { ...seccion(2, 'Se inició registro mensual, sin indicadores aún.'), nivel: 'basica', monitoreo: true, responsable: 'Administración' },
      tarifas: { ...seccion(2, 'Sin análisis tarifario.'), tarifa_actual: 'BT1', potencia_contratada_kw: 0, factor_potencia: 0 },
    },
    hallazgos: [
      { hallazgo_id: 'HAL-REFR-01', justificacion: 'Una de las dos vitrinas continúa usándose como almacén nocturno.' },
      { hallazgo_id: 'HAL-CLIM-01', justificacion: 'Los calefactores portátiles siguen siendo la única fuente de calefacción.' },
      { hallazgo_id: 'HAL-GEST-02', justificacion: 'El registro es manual y no se separan consumos por área.' },
    ],
    recomendaciones: [
      { recomendacion_id: 'REC-REFR-01', prioridad: 'alta', observacion: 'Completar la diferenciación de usos en ambas vitrinas.' },
      { recomendacion_id: 'REC-CLIM-01', prioridad: 'alta', observacion: 'Solicitar cotización de bomba de calor.' },
      { recomendacion_id: 'REC-GEST-02', prioridad: 'media', observacion: 'Evaluar remarcador para área de cocina.' },
      { recomendacion_id: 'REC-ENV-02', prioridad: 'media', observacion: 'Completar sellos en ventana lateral.' },
    ],
    acuerdos: [
      'Mantener el registro mensual y compartir los datos en la próxima visita.',
      'Cotizar dos alternativas de climatización eficiente antes de diciembre.',
    ],
    proxima_visita: '2027-01-20',
    observaciones: 'Se refuerza la importancia de separar el consumo de cocina y refrigeración.',
    created_at: '2026-10-10T16:00:00.000Z',
    updated_at: NOW,
  },
  {
    empresa_id: 'EMP-002',
    id: 'VIS-001',
    fecha: '2026-08-05',
    asesor: 'Carlos Campos N.',
    grado_consumo: 'intensivo',
    descripcion_perfil:
      'Pastelería Los Aromos es una pequeña fábrica de alimentos con punto de venta. La producción se concentra durante la madrugada y la mañana. Los principales consumos son los hornos eléctricos, las cámaras de frío y la iluminación. El GLP se utiliza en la cocina y en el calentador de agua. Se detecta una tarifa residencial pese al volumen de consumo y una penalización por bajo factor de potencia.',
    energeticos: [
      { tipo: 'electricidad', consumo: 2209, unidad: 'kWh/mes', costo: 385000, observacion: 'Tarifa BT1A con 2.209 kWh/mes.' },
      { tipo: 'glp', consumo: 120, unidad: 'kg/mes', costo: 176000, observacion: 'Cocina y calefón.' },
    ],
    usos_finales: ['coccion', 'refrigeracion', 'iluminacion', 'acs'],
    equipos: [
      { nombre: 'Horno eléctrico de resistencia', cantidad: 3, potencia_w: 4500, horas_dia: 8, estado: 'regular', observacion: 'Encendidos anticipadamente y con aperturas frecuentes.' },
      { nombre: 'Cámara de frío', cantidad: 2, potencia_w: 1800, horas_dia: 24, estado: 'regular', observacion: 'Evaporadores con escarcha.' },
      { nombre: 'Amasador', cantidad: 2, potencia_w: 1500, horas_dia: 3, estado: 'bueno', observacion: 'Uso programado.' },
      { nombre: 'Calefón a gas', cantidad: 1, potencia_w: 0, horas_dia: 10, estado: 'deficiente', observacion: 'Equipo antiguo, sin aislación de tuberías.' },
    ],
    secciones: {
      iluminacion: { ...seccion(2, 'Fluorescentes en producción y bodega.'), tecnologia: 'fluorescente', estado: 'regular', horas_uso_diarias: 14 },
      refrigeracion: { ...seccion(2, 'Condensadores sucios y setpoints sin registro.'), cantidad_equipos: 2, antiguedad_anios: 9, mantencion: 'correctiva' },
      congelacion: { ...seccion(2, 'Escarcha en evaporadores y aperturas frecuentes.'), cantidad_equipos: 2, antiguedad_anios: 9, estado: 'regular' },
      climatizacion: { ...seccion(0, 'No aplica: la fábrica no cuenta con climatización.'), tecnologia: 'Sin climatización', mantenciones: 'no_evaluado', control_temperatura: 'no_evaluado' },
      acs: { ...seccion(2, 'Calefón antiguo y tuberías sin aislación.'), tecnologia: 'Calefón a gas', fuente_energetica: 'glp', horarios: 'Toda la jornada' },
      coccion: { ...seccion(2, 'Hornos con baja carga y aperturas frecuentes.'), equipos_principales: 'Tres hornos eléctricos, cocina y plancha a gas', combustible: 'electricidad' },
      motores: { ...seccion(2, 'Motores de amasadores y compresores sin mantención documentada.'), tipo: 'Amasadores y compresores', estado: 'regular', mantencion: 'ocasional' },
      envolvente: { ...seccion(2, 'Puertas de cámara y acceso con infiltraciones.'), ventanas: 'regular', puertas: 'deficiente', infiltraciones: 'deficiente', aislacion: 'regular' },
      gestion: { ...seccion(1, 'Sin gestión energética ni indicadores.'), nivel: 'sin_gestion', monitoreo: false, responsable: '' },
      tarifas: { ...seccion(1, 'Tarifa residencial BT1A y penalización por reactiva.'), tarifa_actual: 'BT1A', potencia_contratada_kw: 0, factor_potencia: 0.86 },
    },
    hallazgos: [
      { hallazgo_id: 'HAL-TAR-01', justificacion: 'Consumo productivo de 2.209 kWh/mes mantenido en tarifa BT1A.' },
      { hallazgo_id: 'HAL-TAR-02', justificacion: 'La factura registra cargos por energía reactiva.' },
      { hallazgo_id: 'HAL-GEST-01', justificacion: 'No existe línea base ni revisión sistemática de consumos.' },
      { hallazgo_id: 'HAL-GEST-02', justificacion: 'Solo se dispone de la factura mensual.' },
      { hallazgo_id: 'HAL-COCC-01', justificacion: 'Los hornos se encienden antes de la producción y se abren con frecuencia.' },
      { hallazgo_id: 'HAL-CONG-01', justificacion: 'Se observa escarcha en evaporadores de ambas cámaras.' },
      { hallazgo_id: 'HAL-ILUM-01', justificacion: 'Tubos fluorescentes en producción y bodega, 14 horas diarias.' },
      { hallazgo_id: 'HAL-ACS-02', justificacion: 'Tuberías de agua caliente sin aislación en un recorrido de 8 metros.' },
    ],
    recomendaciones: [
      { recomendacion_id: 'REC-TAR-01', prioridad: 'alta', observacion: 'Analizar cambio a BT4.3 con curva de carga.' },
      { recomendacion_id: 'REC-TAR-02', prioridad: 'alta', observacion: 'Evaluar banco de condensadores.' },
      { recomendacion_id: 'REC-GEST-01', prioridad: 'alta', observacion: 'Implementar gestión con apoyo de Gestiona Energía MiPyME.' },
      { recomendacion_id: 'REC-GEST-02', prioridad: 'alta', observacion: 'Instalar remarcadores por área.' },
      { recomendacion_id: 'REC-COCC-01', prioridad: 'alta', observacion: 'Planificar producción en tandas completas.' },
      { recomendacion_id: 'REC-CONG-01', prioridad: 'alta', observacion: 'Programar descongelación semanal.' },
      { recomendacion_id: 'REC-ILUM-01', prioridad: 'media', observacion: 'Recambiar luminarias en dos etapas.' },
      { recomendacion_id: 'REC-ACS-02', prioridad: 'media', observacion: 'Aislar el tramo accesible.' },
    ],
    acuerdos: [
      'Solicitar análisis tarifario a instalador certificado SEC.',
      'Implementar registro de temperaturas y mantenciones de cámaras.',
    ],
    proxima_visita: '2026-11-30',
    observaciones: 'La empresa cuenta con 12 meses de facturación disponibles para el análisis.',
    created_at: '2026-08-05T14:00:00.000Z',
    updated_at: NOW,
  },
  {
    empresa_id: 'EMP-003',
    id: 'VIS-001',
    fecha: '2026-09-18',
    asesor: 'Carlos Campos N.',
    grado_consumo: 'relevante',
    descripcion_perfil:
      'Hostal Brisa Marina es un establecimiento de 9 habitaciones con desayuno incluido. La electricidad se utiliza en iluminación, agua caliente, refrigeración de desayuno y calefacción individual. El GLP abastece la cocina y un calefón. La envolvente presenta ventanales de vidrio simple y filtraciones en habitaciones de la fachada poniente. No existe gestión energética formal.',
    energeticos: [
      { tipo: 'electricidad', consumo: 1800, unidad: 'kWh/mes', costo: 310000, observacion: 'Mayor consumo en temporada estival.' },
      { tipo: 'glp', consumo: 80, unidad: 'kg/mes', costo: 118000, observacion: 'Cocina y calefón.' },
    ],
    usos_finales: ['acs', 'iluminacion', 'climatizacion', 'refrigeracion'],
    equipos: [
      { nombre: 'Calefón a gas', cantidad: 1, potencia_w: 0, horas_dia: 24, estado: 'deficiente', observacion: 'Equipo antiguo y sobredimensionado.' },
      { nombre: 'Calefactores eléctricos', cantidad: 9, potencia_w: 1500, horas_dia: 8, estado: 'deficiente', observacion: 'Uno por habitación.' },
      { nombre: 'Refrigerador de desayuno', cantidad: 2, potencia_w: 500, horas_dia: 24, estado: 'regular', observacion: 'Sellos en regular estado.' },
      { nombre: 'Luminarias de pasillo y habitaciones', cantidad: 42, potencia_w: 18, horas_dia: 10, estado: 'regular', observacion: 'Mezcla de LED y fluorescentes.' },
    ],
    secciones: {
      iluminacion: { ...seccion(2, 'Mezcla de tecnologías y luces de pasillo encendidas 24/7.'), tecnologia: 'mixta', estado: 'regular', horas_uso_diarias: 12 },
      refrigeracion: { ...seccion(3, 'Equipos de desayuno en buen estado general.'), cantidad_equipos: 2, antiguedad_anios: 5, mantencion: 'programada' },
      congelacion: { ...seccion(0, 'No aplica.'), cantidad_equipos: 0, antiguedad_anios: 0, estado: 'no_evaluado' },
      climatizacion: { ...seccion(1, 'Calefactores individuales en todas las habitaciones.'), tecnologia: 'Calefactores eléctricos', mantenciones: 'sin_mantencion', control_temperatura: 'manual' },
      acs: { ...seccion(2, 'Calefón antiguo y sin control de temperatura.'), tecnologia: 'Calefón a gas central', fuente_energetica: 'glp', horarios: '24 horas' },
      coccion: { ...seccion(3, 'Cocina de desayuno con equipos a gas en buen estado.'), equipos_principales: 'Cocina a gas, tostador, hervidor', combustible: 'glp' },
      motores: { ...seccion(3, 'Sin motores relevantes.'), tipo: 'Bombas de agua', estado: 'regular', mantencion: 'ocasional' },
      envolvente: { ...seccion(2, 'Ventanas de vidrio simple y filtraciones en fachada poniente.'), ventanas: 'deficiente', puertas: 'regular', infiltraciones: 'deficiente', aislacion: 'deficiente' },
      gestion: { ...seccion(1, 'Sin gestión energética.'), nivel: 'sin_gestion', monitoreo: false, responsable: '' },
      tarifas: { ...seccion(2, 'Tarifa sin análisis y potencia contratada no revisada.'), tarifa_actual: 'BT2', potencia_contratada_kw: 12, factor_potencia: 0.92 },
    },
    hallazgos: [
      { hallazgo_id: 'HAL-CLIM-01', justificacion: 'Nueve calefactores individuales de 1,5 kW se usan como única fuente de calefacción.' },
      { hallazgo_id: 'HAL-ACS-01', justificacion: 'Calefón central antiguo, sin aislación y sobredimensionado para la demanda.' },
      { hallazgo_id: 'HAL-ENV-01', justificacion: 'Ventanales de vidrio simple con exposición solar en fachada norte.' },
      { hallazgo_id: 'HAL-ENV-02', justificacion: 'Filtraciones percibidas en ventanas y puertas de habitaciones.' },
      { hallazgo_id: 'HAL-GEST-01', justificacion: 'No existe registro de consumos ni responsable designado.' },
      { hallazgo_id: 'HAL-ERNC-01', justificacion: 'Cubierta disponible sin evaluación de autoconsumo solar.' },
    ],
    recomendaciones: [
      { recomendacion_id: 'REC-CLIM-01', prioridad: 'alta', observacion: 'Evaluar bombas de calor por habitación o sistema central.' },
      { recomendacion_id: 'REC-ACS-01', prioridad: 'media', observacion: 'Cotizar calefón eficiente o bomba de calor para ACS.' },
      { recomendacion_id: 'REC-ENV-02', prioridad: 'alta', observacion: 'Priorizar sellos en habitaciones de fachada poniente.' },
      { recomendacion_id: 'REC-ENV-01', prioridad: 'media', observacion: 'Evaluar láminas de control solar en ventanales norte.' },
      { recomendacion_id: 'REC-GEST-01', prioridad: 'alta', observacion: 'Implementar registro mensual por medidor.' },
      { recomendacion_id: 'REC-ERNC-01', prioridad: 'media', observacion: 'Solicitar prefactibilidad solar para cubierta.' },
    ],
    acuerdos: [
      'La empresa entregará 12 meses de facturación para evaluar tarifa y potencia.',
      'Se coordinará visita de especialista para evaluar climatización y ACS.',
    ],
    proxima_visita: '2026-12-10',
    observaciones: 'Se recomienda priorizar medidas de bajo costo antes de la temporada alta.',
    created_at: '2026-09-18T11:00:00.000Z',
    updated_at: NOW,
  },
];

async function main() {
  await fs.mkdir(EMPRESAS, { recursive: true });
  for (const empresa of empresas) {
    const dir = path.join(EMPRESAS, empresa.id);
    await fs.mkdir(path.join(dir, 'informes'), { recursive: true });
    const record = { schema_version: 1, ...empresa };
    await fs.writeFile(path.join(dir, 'metadata.toml'), `${stringify(record)}\n`, 'utf8');
  }
  for (const visita of visitas) {
    const dir = path.join(EMPRESAS, visita.empresa_id);
    const fileName = `visita-${visita.id.replace('VIS-', '')}.toml`;
    const record = { schema_version: 1, ...visita };
    await fs.writeFile(path.join(dir, fileName), `${stringify(record)}\n`, 'utf8');
  }
  console.log(
    `Datos demo: ${empresas.length} empresas y ${visitas.length} visitas creadas en data/empresas.`,
  );
}

await main();
