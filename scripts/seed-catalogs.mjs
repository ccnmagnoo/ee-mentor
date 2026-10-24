import { promises as fs } from 'node:fs';
import path from 'node:path';
import { stringify } from 'smol-toml';

const DATA = path.resolve('data');
const HALLAZGOS = path.join(DATA, 'catalogos', 'hallazgos');
const RECOMENDACIONES = path.join(DATA, 'catalogos', 'recomendaciones');
const RECURSOS = path.join(DATA, 'catalogos', 'recursos');
const NOW = '2026-01-01T00:00:00.000Z';

const hallazgos = [
  // Iluminación
  {
    codigo: 'ILUM-01',
    titulo: 'Uso de iluminación fluorescente',
    categoria: 'iluminacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ILUM-01',
    tags: ['iluminacion', 'fluorescente', 'led'],
    descripcion:
      'Se observan luminarias fluorescentes, incluidos tubos T8/T5 y ampolletas compactas, con tecnología de menor eficacia luminosa que la disponible actualmente en el mercado. Su reemplazo progresivo por LED permite reducir el consumo manteniendo o mejorando los niveles de iluminación.',
    justificacion:
      'Las luminarias fluorescentes tienen una eficacia menor, contienen mercurio y suelen presentar depreciación lumínica con el uso. La migración a LED es una de las medidas con mejor relación costo-beneficio en locales comerciales.',
  },
  {
    codigo: 'ILUM-02',
    titulo: 'Presencia de iluminación halógena o incandescente',
    categoria: 'iluminacion',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ILUM-01',
    tags: ['iluminacion', 'halogena', 'led'],
    descripcion:
      'Se identifican ampolletas halógenas o incandescentes en sectores de exhibición, baños, bodegas o iluminación decorativa. Estos equipos transforman una fracción importante de la electricidad en calor y tienen una vida útil reducida.',
    justificacion:
      'Una ampolleta halógena puede consumir entre tres y cinco veces más que una LED equivalente. Además, la carga térmica adicional aumenta la necesidad de climatización en verano.',
  },
  {
    codigo: 'ILUM-03',
    titulo: 'Iluminación sin zonificación ni control de presencia',
    categoria: 'iluminacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ILUM-02',
    tags: ['iluminacion', 'control', 'automatizacion'],
    descripcion:
      'La iluminación permanece encendida de forma homogénea durante toda la jornada, incluso en sectores sin ocupación como bodegas, baños, vitrinas o áreas de preparación cerradas. No se observan sensores, temporizadores ni circuitos independientes.',
    justificacion:
      'La iluminación es una carga base relevante en comercios pequeños. Zonificar y automatizar el encendido reduce horas de operación innecesarias sin afectar la atención al público.',
  },
  {
    codigo: 'ILUM-04',
    titulo: 'Falta de mantención y limpieza de luminarias',
    categoria: 'iluminacion',
    impacto: 'bajo',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ILUM-03',
    tags: ['iluminacion', 'mantencion'],
    descripcion:
      'Se observan luminarias, difusores y pantallas con acumulación de polvo, grasa o insectos, especialmente en cocinas y sectores de atención. Algunas luminarias presentan además parpadeo o baja intensidad.',
    justificacion:
      'La suciedad reduce el flujo luminoso y puede llevar a sobredimensionar la iluminación o a encender equipos adicionales. La limpieza periódica es una medida de bajo costo con impacto inmediato.',
  },
  // Refrigeración
  {
    codigo: 'REFR-01',
    titulo: 'Uso de vitrinas de exhibición como almacenamiento prolongado',
    categoria: 'refrigeracion',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-REFR-01',
    tags: ['refrigeracion', 'vitrina', 'operacion'],
    descripcion:
      'Se utilizan vitrinas refrigeradas, mesones refrigerados o equipos de exhibición para almacenar alimentos durante períodos prolongados, cuando están diseñados para apoyo operativo de corto plazo. Esto implica aperturas frecuentes, mayor intercambio térmico y menor hermeticidad.',
    justificacion:
      'Los equipos de exhibición tienen peor aislación y mayor exposición al ambiente que cámaras o refrigeradores cerrados. Usarlos como almacén eleva el consumo base de refrigeración, que opera 24/7.',
  },
  {
    codigo: 'REFR-02',
    titulo: 'Condensadores y serpentines con suciedad acumulada',
    categoria: 'refrigeracion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-REFR-02',
    tags: ['refrigeracion', 'mantencion', 'condensador'],
    descripcion:
      'Se observan condensadores, serpentines y rejillas de ventilación con polvo, grasa o pelusa, especialmente en equipos ubicados en cocinas o zonas de preparación. No se evidencia una pauta periódica de limpieza.',
    justificacion:
      'La suciedad reduce la transferencia de calor y obliga al compresor a trabajar más tiempo para alcanzar la temperatura de consigna, aumentando el consumo eléctrico y el desgaste del equipo.',
  },
  {
    codigo: 'REFR-03',
    titulo: 'Sellos y empaquetaduras de puertas deterioradas',
    categoria: 'refrigeracion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-REFR-03',
    tags: ['refrigeracion', 'sellos', 'mantencion'],
    descripcion:
      'Las puertas de refrigeradores, vitrinas o cámaras presentan empaquetaduras deformadas, rotas o con holguras. En algunos casos la puerta no cierra completamente o requiere ser empujada para sellar.',
    justificacion:
      'Las infiltraciones de aire caliente y húmedo aumentan la carga térmica del equipo, favorecen la formación de escarcha y elevan el consumo del compresor de forma permanente.',
  },
  {
    codigo: 'REFR-04',
    titulo: 'Temperaturas de consigna más bajas de lo necesario',
    categoria: 'refrigeracion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-REFR-04',
    tags: ['refrigeracion', 'setpoint', 'temperatura'],
    descripcion:
      'Se observan equipos configurados con temperaturas inferiores a las requeridas para la conservación de los productos, o sin termómetro visible para verificar el punto de operación. La regulación se realiza por percepción del personal.',
    justificacion:
      'Cada grado adicional de frío innecesario incrementa el consumo eléctrico. Ajustar los setpoints a los requisitos sanitarios y de conservación reales reduce el consumo sin comprometer la inocuidad.',
  },
  {
    codigo: 'REFR-05',
    titulo: 'Equipos de refrigeración antiguos o ineficientes',
    categoria: 'refrigeracion',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-REFR-05',
    tags: ['refrigeracion', 'renovacion', 'eficiencia'],
    descripcion:
      'Se identifican equipos con más de 8 a 10 años de operación, sin etiqueta de eficiencia visible y con signos de desgaste. Algunos utilizan refrigerantes con alto potencial de calentamiento global.',
    justificacion:
      'La eficiencia de los compresores y del aislamiento se degrada con los años. La renovación planificada por equipos de clase energética superior reduce el consumo y las pérdidas de refrigerante.',
  },
  {
    codigo: 'REFR-06',
    titulo: 'Equipos de frío próximos a fuentes de calor o sin ventilación',
    categoria: 'refrigeracion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-REFR-06',
    tags: ['refrigeracion', 'ventilacion', 'ubicacion'],
    descripcion:
      'Refrigeradores, congeladores o vitrinas se encuentran junto a hornos, planchas, exposición solar directa o en espacios sin ventilación suficiente, con las rejillas posteriores obstruidas.',
    justificacion:
      'El calor externo reduce la capacidad de rechazo del condensador y aumenta el trabajo del compresor. Reubicar o ventilar adecuadamente el equipo es una medida de bajo costo.',
  },
  // Congelación
  {
    codigo: 'CONG-01',
    titulo: 'Acumulación de escarcha en evaporadores',
    categoria: 'congelacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CONG-01',
    tags: ['congelacion', 'escarcha', 'mantencion'],
    descripcion:
      'Se observa escarcha o hielo acumulado en evaporadores, paredes o puertas de congeladores. El ciclo de descongelación no se realiza de forma programada o no se registra.',
    justificacion:
      'La escarcha actúa como aislante térmico y reduce la transferencia de frío, obligando al equipo a operar más tiempo. Puede además obstruir la circulación de aire.',
  },
  {
    codigo: 'CONG-02',
    titulo: 'Aperturas frecuentes y falta de cortinas en congelación',
    categoria: 'congelacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CONG-02',
    tags: ['congelacion', 'operacion', 'cortina'],
    descripcion:
      'Las puertas de congeladores y cámaras se abren con frecuencia durante la jornada, o permanecen abiertas mientras se retiran productos. No se utilizan cortinas de tiras ni se ha definido un protocolo de acceso.',
    justificacion:
      'Cada apertura introduce aire caliente y húmedo que incrementa la carga térmica y la formación de escarcha. La gestión operacional es una medida de bajo costo y rápida implementación.',
  },
  {
    codigo: 'CONG-03',
    titulo: 'Cadena de frío sin control documentado',
    categoria: 'congelacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CONG-03',
    tags: ['congelacion', 'registro', 'inocuidad'],
    descripcion:
      'La operación de equipos de congelación se basa en la experiencia del personal, sin registros formales de temperatura, setpoints, ciclos de descongelación ni mantenciones. No se identifican termómetros calibrados en todos los equipos.',
    justificacion:
      'La falta de registros impide detectar desviaciones de consumo y temperatura, y dificulta demostrar la inocuidad de los alimentos. Un registro simple permite ambas cosas.',
  },
  // Climatización
  {
    codigo: 'CLIM-01',
    titulo: 'Calefacción con equipos individuales ineficientes',
    categoria: 'climatizacion',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CLIM-01',
    tags: ['climatizacion', 'calefaccion', 'bomba de calor'],
    descripcion:
      'Se utilizan calefactores eléctricos portátiles, halógenos o de resistencia como estrategia principal de climatización, en ocasiones con varias unidades operando en paralelo para cubrir un mismo espacio.',
    justificacion:
      'La calefacción por resistencia eléctrica tiene un rendimiento cercano a 1, mientras que una bomba de calor puede entregar varias unidades de calor por unidad de electricidad. Además, la distribución del calor suele ser heterogénea.',
  },
  {
    codigo: 'CLIM-02',
    titulo: 'Equipos de climatización sin mantención periódica',
    categoria: 'climatizacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CLIM-02',
    tags: ['climatizacion', 'mantencion', 'split'],
    descripcion:
      'Se observan equipos split o de aire acondicionado con filtros sucios, unidades exteriores obstruidas o sin registro de mantención. En algunos casos se desconoce la fecha de la última limpieza.',
    justificacion:
      'Los filtros y serpentines sucios reducen el caudal de aire y la eficiencia del intercambio térmico, aumentando el consumo y deteriorando la calidad del aire interior.',
  },
  {
    codigo: 'CLIM-03',
    titulo: 'Setpoints y horarios de climatización inadecuados',
    categoria: 'climatizacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CLIM-03',
    tags: ['climatizacion', 'setpoint', 'horario'],
    descripcion:
      'Los equipos de climatización operan con temperaturas de consigna extremas, sin programación horaria y en algunos casos durante toda la noche o con el local cerrado.',
    justificacion:
      'Ajustar la temperatura de consigna y alinear la operación con la ocupación real reduce el consumo sin afectar el confort. Cada grado de ajuste en calefacción puede representar una reducción significativa.',
  },
  {
    codigo: 'CLIM-04',
    titulo: 'Uso simultáneo de calefacción y refrigeración',
    categoria: 'climatizacion',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-CLIM-03',
    tags: ['climatizacion', 'operacion', 'control'],
    descripcion:
      'Se detectan sectores con calefacción y aire acondicionado operando al mismo tiempo, o equipos de frío y hornos compitiendo térmicamente en el mismo ambiente sin extracción adecuada.',
    justificacion:
      'La simultaneidad de cargas opuestas genera consumo innecesario y afecta el confort. En locales con cocina, la extracción y reposición de aire son claves para controlar la carga térmica.',
  },
  // Cocción
  {
    codigo: 'COCC-01',
    titulo: 'Hornos operados con baja carga o aperturas frecuentes',
    categoria: 'coccion',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-COCC-01',
    tags: ['coccion', 'horno', 'operacion'],
    descripcion:
      'Los hornos se encienden antes de la producción, operan en vacío o con carga baja y su puerta se abre con frecuencia para verificar la cocción. No se observa una planificación de tandas.',
    justificacion:
      'El funcionamiento en vacío y las aperturas de puerta provocan pérdidas térmicas significativas. Agrupar la producción y respetar los precalentamientos del fabricante reduce el consumo sin afectar la calidad.',
  },
  {
    codigo: 'COCC-02',
    titulo: 'Quemadores sucios o mal regulados',
    categoria: 'coccion',
    impacto: 'medio',
    energetico: 'glp',
    recomendacion_id: 'REC-COCC-02',
    tags: ['coccion', 'gas', 'quemador', 'mantencion'],
    descripcion:
      'Se observan quemadores de cocina o plancha con suciedad, hollín o llamas desajustadas. No se evidencia una mantención periódica ni una verificación de combustión.',
    justificacion:
      'Una combustión deficiente reduce el aprovechamiento del gas y puede generar condiciones inseguras. La mantención y regulación de quemadores es una medida de bajo costo con impacto directo.',
  },
  {
    codigo: 'COCC-03',
    titulo: 'Equipos de cocción encendidos sin carga de trabajo',
    categoria: 'coccion',
    impacto: 'medio',
    energetico: 'glp',
    recomendacion_id: 'REC-COCC-03',
    tags: ['coccion', 'operacion', 'desperdicio'],
    descripcion:
      'Planchas, freidoras, cocinas y percoladores permanecen encendidos durante pausas prolongadas o fuera del horario de atención, manteniendo temperatura sin demanda real.',
    justificacion:
      'Mantener equipos térmicos energizados sin carga genera consumo evitable y carga térmica adicional en el local. Un protocolo de apagado por bloques horarios es de bajo costo.',
  },
  // ACS
  {
    codigo: 'ACS-01',
    titulo: 'Calefón o termo eléctrico ineficiente y sobredimensionado',
    categoria: 'acs',
    impacto: 'alto',
    energetico: 'glp',
    recomendacion_id: 'REC-ACS-01',
    tags: ['acs', 'calefon', 'termo'],
    descripcion:
      'El sistema de agua caliente sanitaria está compuesto por calefones o termos eléctricos de tecnología antigua, con capacidad superior a la demanda real y sin aislación adicional.',
    justificacion:
      'Un equipo sobredimensionado opera con ciclos ineficientes y mayores pérdidas de acumulación. La renovación por equipos de alta eficiencia reduce el consumo de combustible o electricidad.',
  },
  {
    codigo: 'ACS-02',
    titulo: 'Tuberías de agua caliente sin aislación',
    categoria: 'acs',
    impacto: 'bajo',
    energetico: 'glp',
    recomendacion_id: 'REC-ACS-02',
    tags: ['acs', 'aislacion', 'tuberias'],
    descripcion:
      'Se observan tramos de tubería de agua caliente sin aislación térmica, especialmente en recorridos largos entre el equipo y los puntos de consumo. También se detectan filtraciones menores.',
    justificacion:
      'Las pérdidas en tuberías no aisladas obligan a elevar la temperatura de consigna y aumentan el consumo. Aislar los tramos accesibles es una medida de bajo costo.',
  },
  {
    codigo: 'ACS-03',
    titulo: 'Temperatura de acumulación excesiva',
    categoria: 'acs',
    impacto: 'medio',
    energetico: 'glp',
    recomendacion_id: 'REC-ACS-03',
    tags: ['acs', 'temperatura', 'seguridad'],
    descripcion:
      'El agua caliente se acumula a temperaturas superiores a las necesarias para el uso sanitario, sin válvulas mezcladoras ni control preciso. No se registra la temperatura de operación.',
    justificacion:
      'Temperaturas excesivas aumentan las pérdidas térmicas y el riesgo de quemaduras. Ajustar la consigna y verificar la seguridad del sistema reduce el consumo sin afectar el servicio.',
  },
  {
    codigo: 'ACS-04',
    titulo: 'Percoladores y agua caliente operando fuera de horario',
    categoria: 'acs',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ACS-04',
    tags: ['acs', 'percolador', 'horario'],
    descripcion:
      'Percoladores, hervidores y urnas de agua caliente permanecen encendidos durante toda la jornada, incluso en períodos sin ventas, y en algunos casos no se apagan al cierre.',
    justificacion:
      'Mantener agua caliente sin demanda consume energía de forma constante. Temporizadores y protocolos de apagado reducen el consumo evitable sin afectar la operación.',
  },
  // Envolvente
  {
    codigo: 'ENV-01',
    titulo: 'Ventanas con vidrio simple y sin control solar',
    categoria: 'envolvente',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ENV-01',
    tags: ['envolvente', 'ventanas', 'control solar'],
    descripcion:
      'Se observan ventanales de vidrio simple o sin doble vidriado hermético, con exposición solar directa en horarios de mayor radiación. No hay láminas de control solar, aleros ni cortinas térmicas.',
    justificacion:
      'El vidrio simple tiene alta transmitancia térmica y puede generar ganancias solares excesivas, aumentando la demanda de climatización en verano y las pérdidas en invierno.',
  },
  {
    codigo: 'ENV-02',
    titulo: 'Infiltraciones de aire en puertas y ventanas',
    categoria: 'envolvente',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ENV-02',
    tags: ['envolvente', 'infiltraciones', 'sellos'],
    descripcion:
      'Se detectan corrientes de aire, holguras y falta de burletes en puertas y ventanas. Las puertas de acceso permanecen abiertas durante la operación y no existen cortinas de aire.',
    justificacion:
      'Las infiltraciones aumentan la carga de climatización y afectan el confort. El sellamiento perimetral es una de las medidas de menor costo y mayor impacto relativo.',
  },
  {
    codigo: 'ENV-03',
    titulo: 'Falta de aislación en cubierta o muros',
    categoria: 'envolvente',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ENV-03',
    tags: ['envolvente', 'aislacion', 'cubierta'],
    descripcion:
      'La construcción presenta cubierta o muros sin aislación térmica declarada, con superficies frías o calientes y condensación en algunos sectores. No se dispone de planos o antecedentes de la envolvente.',
    justificacion:
      'La envolvente es la barrera entre el clima exterior y el interior. Mejorar su aislación reduce la demanda de climatización de forma sostenida, aunque requiere inversión.',
  },
  // Motores y equipos productivos
  {
    codigo: 'MOT-01',
    titulo: 'Motores antiguos o sobredimensionados',
    categoria: 'motores',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-MOT-01',
    tags: ['motores', 'renovacion', 'variador'],
    descripcion:
      'Se identifican motores eléctricos de tecnología antigua, con potencias superiores a la demanda real y sin variadores de frecuencia en cargas variables como bombas o ventiladores.',
    justificacion:
      'Los motores sobredimensionados operan en rangos de baja eficiencia. La renovación o el control de velocidad en cargas variables puede reducir significativamente el consumo eléctrico.',
  },
  {
    codigo: 'MOT-02',
    titulo: 'Falta de mantención de motores y transmisiones',
    categoria: 'motores',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-MOT-02',
    tags: ['motores', 'mantencion', 'correas'],
    descripcion:
      'Se observan correas flojas, poleas desalineadas, rodamientos con ruido o motores con acumulación de suciedad. No existe un plan de mantención mecánica documentado.',
    justificacion:
      'La fricción y desalineación aumentan las pérdidas mecánicas y el consumo. La mantención preventiva es de bajo costo y prolonga la vida útil de los equipos.',
  },
  {
    codigo: 'PROD-01',
    titulo: 'Equipos productivos en standby fuera de horario',
    categoria: 'equipos_productivos',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-PROD-01',
    tags: ['equipos', 'standby', 'horario'],
    descripcion:
      'Máquinas, vitrinas, computadores, impresoras y equipos auxiliares permanecen en modo standby o encendidos fuera del horario de operación, sin un protocolo de cierre.',
    justificacion:
      'La suma de consumos en standby puede representar un porcentaje relevante del consumo base. Un protocolo de apagado y temporizadores reduce ese consumo sin inversión significativa.',
  },
  {
    codigo: 'PROD-02',
    titulo: 'Fugas en sistemas de aire comprimido',
    categoria: 'equipos_productivos',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-PROD-02',
    tags: ['aire comprimido', 'fugas', 'mantencion'],
    descripcion:
      'En talleres o pequeñas fábricas se detectan ruidos de fuga en acoples, mangueras o válvulas del sistema de aire comprimido. El compresor opera incluso sin demanda de aire.',
    justificacion:
      'El aire comprimido es una de las formas de energía más costosas. Las fugas obligan al compresor a operar más tiempo y pueden representar pérdidas relevantes.',
  },
  // Gestión
  {
    codigo: 'GEST-01',
    titulo: 'Ausencia de un sistema formal de gestión energética',
    categoria: 'gestion_energetica',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-GEST-01',
    tags: ['gestion', 'kpi', 'mejora continua'],
    descripcion:
      'No existe un responsable designado, una línea base de consumo, indicadores clave ni un procedimiento de revisión periódica. Las acciones energéticas son reactivas y no se documentan.',
    justificacion:
      'Sin gestión sistemática las mejoras no se sostienen y las desviaciones se detectan tarde. Es la brecha transversal más frecuente en las MiPyMEs diagnosticadas.',
  },
  {
    codigo: 'GEST-02',
    titulo: 'Falta de medición y monitoreo de consumos',
    categoria: 'gestion_energetica',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-GEST-02',
    tags: ['gestion', 'medicion', 'monitoreo'],
    descripcion:
      'Se dispone solo de la facturación mensual o de remarcadores sin registro sistemático. No se separan consumos por área, proceso o equipo, ni se comparan mes a mes.',
    justificacion:
      'Lo que no se mide no se gestiona. El monitoreo permite verificar el efecto de las medidas y detectar sobreconsumos o fallas de equipos.',
  },
  {
    codigo: 'GEST-03',
    titulo: 'Personal sin capacitación en buenas prácticas energéticas',
    categoria: 'gestion_operacional',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-GEST-03',
    tags: ['gestion', 'capacitacion', 'cultura'],
    descripcion:
      'El personal no ha recibido orientación sobre el uso eficiente de equipos, apagado de luces, manejo de puertas de frío o control de temperaturas. Las prácticas dependen de cada turno.',
    justificacion:
      'Muchas medidas de bajo costo dependen del comportamiento. La capacitación y los procedimientos escritos aseguran consistencia y sostenibilidad de los ahorros.',
  },
  {
    codigo: 'GEST-04',
    titulo: 'Operación de equipos fuera del horario de atención',
    categoria: 'gestion_operacional',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-GEST-04',
    tags: ['gestion', 'horario', 'cierre'],
    descripcion:
      'Luces, climatización, equipos de cocción y letreros permanecen encendidos después del cierre o antes de la apertura. No existe una lista de verificación de cierre.',
    justificacion:
      'La operación fuera de horario es un desperdicio evitable. Una pauta de cierre simple y asignada a un responsable puede reducir el consumo base diario.',
  },
  // Tarifas
  {
    codigo: 'TAR-01',
    titulo: 'Tarifa eléctrica inadecuada para el perfil de consumo',
    categoria: 'tarifas',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-TAR-01',
    tags: ['tarifa', 'facturacion', 'demanda'],
    descripcion:
      'El negocio mantiene una tarifa de tipo residencial o sin discriminación horaria pese a tener un consumo productivo relevante. No se ha analizado el historial de facturación ni la curva de carga.',
    justificacion:
      'Una tarifa mal seleccionada puede encarecer la factura incluso sin cambios en el consumo. El análisis tarifario es una medida de bajo costo con impacto económico directo.',
  },
  {
    codigo: 'TAR-02',
    titulo: 'Bajo factor de potencia con penalización económica',
    categoria: 'tarifas',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-TAR-02',
    tags: ['tarifa', 'reactiva', 'factor de potencia'],
    descripcion:
      'La facturación registra energía reactiva o cargos por bajo factor de potencia, asociados a motores, compresores y equipos inductivos. No se monitorea este indicador.',
    justificacion:
      'Un factor de potencia bajo genera cobros adicionales evitables. La compensación con condensadores, dimensionada correctamente, elimina o reduce la penalización.',
  },
  {
    codigo: 'TAR-03',
    titulo: 'Potencia contratada mal dimensionada',
    categoria: 'potencia_contratada',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-TAR-03',
    tags: ['tarifa', 'potencia', 'demanda'],
    descripcion:
      'La potencia contratada no coincide con la demanda máxima registrada: puede estar sobredimensionada, encareciendo el cargo fijo, o subdimensionada, generando recargos por exceso.',
    justificacion:
      'La potencia contratada es un cargo fijo relevante. Ajustarla al perfil real de demanda reduce la factura sin afectar la operación.',
  },
  {
    codigo: 'TAR-04',
    titulo: 'Medidor compartido con usos residenciales o administrativos',
    categoria: 'tarifas',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-TAR-04',
    tags: ['tarifa', 'medidor', 'segregacion'],
    descripcion:
      'La facturación del negocio incluye consumos de viviendas, oficinas u otras actividades sin segregación de medidores, generando subsidios cruzados y distorsión de la tarifa aplicable.',
    justificacion:
      'Separar los medidores permite acceder a la tarifa adecuada para la actividad productiva, transparentar costos y evitar pagar cargos que no corresponden al negocio.',
  },
  // ERNC y otros
  {
    codigo: 'ERNC-01',
    titulo: 'Sin evaluación de autoconsumo con energías renovables',
    categoria: 'ernc',
    impacto: 'medio',
    energetico: 'electricidad',
    recomendacion_id: 'REC-ERNC-01',
    tags: ['ernc', 'solar', 'fotovoltaica'],
    descripcion:
      'No se ha evaluado la incorporación de generación solar fotovoltaica u otra fuente renovable para autoconsumo, pese a disponer de cubierta o superficie útil y de un consumo eléctrico diurno relevante.',
    justificacion:
      'La generación distribuida puede reducir la dependencia de la red y estabilizar costos. Un estudio de prefactibilidad permite dimensionar la solución antes de invertir.',
  },
  {
    codigo: 'GEN-01',
    titulo: 'Grupo electrógeno no operativo',
    categoria: 'otros',
    impacto: 'critico',
    energetico: 'diesel',
    recomendacion_id: 'REC-GEN-01',
    tags: ['respaldo', 'continuidad', 'seguridad'],
    descripcion:
      'Se identifica un grupo electrógeno instalado pero sin conexión, sin transferencia automática o sin puesta en marcha. No se han realizado pruebas de funcionamiento ni mantenciones.',
    justificacion:
      'Un equipo de respaldo no operativo expone la continuidad del negocio ante cortes de suministro, especialmente en procesos de frío y producción. Es un riesgo crítico de operación.',
  },
  {
    codigo: 'GEN-02',
    titulo: 'Posibles fugas de refrigerante',
    categoria: 'refrigeracion',
    impacto: 'alto',
    energetico: 'electricidad',
    recomendacion_id: 'REC-GEN-02',
    tags: ['refrigeracion', 'refrigerante', 'ambiente'],
    descripcion:
      'Se observan equipos de frío con bajo rendimiento, formación excesiva de hielo o registros de carga de refrigerante sin trazabilidad. No se cuenta con un programa de detección de fugas.',
    justificacion:
      'Las fugas de refrigerante reducen la capacidad del equipo, aumentan el consumo y generan emisiones de gases de efecto invernadero. Su detección y reparación es prioritaria.',
  },
];

const recomendaciones = [
  {
    codigo: 'REC-ILUM-01',
    titulo: 'Migración progresiva a tecnología LED',
    categoria: 'iluminacion',
    inversion: 'media',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '40-60% del consumo de iluminación',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ILUM-01', 'HAL-ILUM-02'],
    tags: ['iluminacion', 'led', 'recambio'],
    descripcion:
      'Reemplazar progresivamente luminarias fluorescentes, halógenas e incandescentes por soluciones LED de alta eficacia, priorizando los sectores con mayor número de horas de uso: atención, vitrinas, cocina y fachada.',
    beneficio:
      'Menor consumo eléctrico, mayor vida útil, menor carga térmica y mejor calidad de iluminación. La inversión se recupera habitualmente en menos de dos años.',
  },
  {
    codigo: 'REC-ILUM-02',
    titulo: 'Zonificación y control automático de iluminación',
    categoria: 'iluminacion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '10-25% del consumo de iluminación',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ILUM-03'],
    tags: ['iluminacion', 'sensores', 'control'],
    descripcion:
      'Separar circuitos por zona funcional e incorporar sensores de presencia en baños, bodegas y áreas de paso, junto con temporizadores para letreros y fachadas.',
    beneficio:
      'Reduce las horas de operación innecesarias y evita que la iluminación permanezca encendida en sectores desocupados.',
  },
  {
    codigo: 'REC-ILUM-03',
    titulo: 'Plan de mantención y limpieza de luminarias',
    categoria: 'iluminacion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '5-15% del consumo de iluminación',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ILUM-04'],
    tags: ['iluminacion', 'mantencion', 'limpieza'],
    descripcion:
      'Establecer una pauta semestral de limpieza de luminarias y difusores, revisión de conexiones y reemplazo de equipos con parpadeo o baja intensidad.',
    beneficio:
      'Recupera los niveles de iluminación diseñados, evita sobredimensionar la potencia instalada y prolonga la vida útil de los equipos.',
  },
  {
    codigo: 'REC-REFR-01',
    titulo: 'Gestión diferenciada de equipos de refrigeración',
    categoria: 'refrigeracion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '10-25% del consumo de refrigeración',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-REFR-01'],
    tags: ['refrigeracion', 'operacion', 'fifo'],
    descripcion:
      'Definir que vitrinas y mesones refrigerados se usen para exhibición y apoyo de corto plazo, y que el almacenamiento prolongado se realice en refrigeradores o cámaras cerradas. Implementar rotación FIFO y señalización de equipos.',
    beneficio:
      'Reduce el consumo base de refrigeración, mejora la conservación de alimentos y prolonga la vida útil de los equipos de exhibición.',
  },
  {
    codigo: 'REC-REFR-02',
    titulo: 'Limpieza programada de condensadores y serpentines',
    categoria: 'refrigeracion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de refrigeración',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-REFR-02'],
    tags: ['refrigeracion', 'mantencion', 'condensador'],
    descripcion:
      'Incorporar la limpieza de condensadores, serpentines y rejillas en un plan trimestral, con registro de la actividad y verificación de la ventilación alrededor de los equipos.',
    beneficio:
      'Mejora la transferencia de calor, reduce el tiempo de operación del compresor y disminuye el riesgo de fallas.',
  },
  {
    codigo: 'REC-REFR-03',
    titulo: 'Recambio de sellos y cortinas de frío',
    categoria: 'refrigeracion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '3-10% del consumo de refrigeración',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-REFR-03'],
    tags: ['refrigeracion', 'sellos', 'cortinas'],
    descripcion:
      'Reemplazar empaquetaduras deterioradas, ajustar bisagras y verificar el cierre hermético de puertas. En vitrinas abiertas, evaluar cortinas de tiras o puertas de vidrio.',
    beneficio:
      'Reduce la infiltración de aire caliente y humedad, disminuye la formación de escarcha y el consumo del compresor.',
  },
  {
    codigo: 'REC-REFR-04',
    titulo: 'Ajuste de setpoints y control de temperaturas',
    categoria: 'refrigeracion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de refrigeración',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-REFR-04'],
    tags: ['refrigeracion', 'setpoint', 'termometro'],
    descripcion:
      'Ajustar las temperaturas de consigna a los requisitos sanitarios y de conservación de cada producto, instalar termómetros visibles y registrar los valores al menos dos veces al día.',
    beneficio:
      'Evita el frío excesivo innecesario, mejora el control de inocuidad y facilita la detección temprana de fallas.',
  },
  {
    codigo: 'REC-REFR-05',
    titulo: 'Renovación planificada de equipos de frío ineficientes',
    categoria: 'refrigeracion',
    inversion: 'alta',
    dificultad: 'alta',
    prioridad: 'media',
    ahorro_estimado: '20-40% del consumo de refrigeración',
    plazo: 'Largo plazo (6-12 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-REFR-05'],
    tags: ['refrigeracion', 'renovacion', 'etiqueta energetica'],
    descripcion:
      'Elaborar un plan de recambio por etapas, priorizando los equipos con mayor antigüedad y horas de operación. Especificar clase energética, refrigerante de bajo GWP y servicio técnico disponible.',
    beneficio:
      'Reduce el consumo, mejora la confiabilidad y disminuye las emisiones directas e indirectas. Requiere evaluación económica caso a caso.',
  },
  {
    codigo: 'REC-REFR-06',
    titulo: 'Reubicación y ventilación de equipos de frío',
    categoria: 'refrigeracion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '5-10% del consumo de refrigeración',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-REFR-06'],
    tags: ['refrigeracion', 'ventilacion', 'ubicacion'],
    descripcion:
      'Separar los equipos de frío de hornos, planchas y exposición solar directa, despejar las rejillas y asegurar espacio suficiente para la circulación de aire.',
    beneficio:
      'Mejora el rechazo de calor, reduce el esfuerzo del compresor y evita sobreconsumos por operación en condiciones desfavorables.',
  },
  {
    codigo: 'REC-CONG-01',
    titulo: 'Descongelación y control de escarcha',
    categoria: 'congelacion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de congelación',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-CONG-01'],
    tags: ['congelacion', 'escarcha', 'mantencion'],
    descripcion:
      'Establecer un calendario de descongelación según las instrucciones del fabricante, verificar el funcionamiento de resistencias y desagües, y registrar la actividad.',
    beneficio:
      'Restablece la transferencia de frío, reduce el tiempo de operación del compresor y mejora la conservación de los productos.',
  },
  {
    codigo: 'REC-CONG-02',
    titulo: 'Protocolo de apertura y cortinas para congelación',
    categoria: 'congelacion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '3-8% del consumo de congelación',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-CONG-02'],
    tags: ['congelacion', 'operacion', 'cortinas'],
    descripcion:
      'Definir horarios y responsables para el retiro de productos, incorporar cortinas de tiras en cámaras de alta rotación y señalizar la importancia de cerrar puertas.',
    beneficio:
      'Reduce la entrada de aire caliente y la formación de escarcha, con una inversión mínima y participación directa del personal.',
  },
  {
    codigo: 'REC-CONG-03',
    titulo: 'Registro y control documentado de la cadena de frío',
    categoria: 'congelacion',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'media',
    ahorro_estimado: '5-10% del consumo de congelación',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-CONG-03'],
    tags: ['congelacion', 'registro', 'inocuidad'],
    descripcion:
      'Implementar una planilla simple o aplicación para registrar temperaturas, setpoints, descongelaciones y mantenciones. Definir límites de control y acciones correctivas.',
    beneficio:
      'Mejora la inocuidad, detecta desviaciones de consumo y proporciona evidencia para auditorías y programas de calidad.',
  },
  {
    codigo: 'REC-CLIM-01',
    titulo: 'Reemplazo de calefactores por bomba de calor',
    categoria: 'climatizacion',
    inversion: 'alta',
    dificultad: 'alta',
    prioridad: 'alta',
    ahorro_estimado: '30-60% del consumo de calefacción',
    plazo: 'Largo plazo (6-12 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-CLIM-01'],
    tags: ['climatizacion', 'bomba de calor', 'inverter'],
    descripcion:
      'Evaluar la instalación de equipos inverter tipo split o bomba de calor de alta eficiencia para reemplazar calefactores individuales, dimensionados según la carga térmica del local.',
    beneficio:
      'Mayor eficiencia por unidad de electricidad, mejor distribución del calor y control de temperatura. Requiere evaluación técnica y cotización.',
  },
  {
    codigo: 'REC-CLIM-02',
    titulo: 'Mantención periódica de equipos de climatización',
    categoria: 'climatizacion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de climatización',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-CLIM-02'],
    tags: ['climatizacion', 'mantencion', 'filtros'],
    descripcion:
      'Programar limpieza de filtros y serpentines al menos una vez al año, verificar carga de refrigerante y estado de unidades exteriores, con registro de cada intervención.',
    beneficio:
      'Mantiene la eficiencia del equipo, mejora la calidad del aire interior y reduce el riesgo de fallas costosas.',
  },
  {
    codigo: 'REC-CLIM-03',
    titulo: 'Gestión de setpoints y horarios de climatización',
    categoria: 'climatizacion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '10-20% del consumo de climatización',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-CLIM-03', 'HAL-CLIM-04'],
    tags: ['climatizacion', 'setpoint', 'horario'],
    descripcion:
      'Fijar consignas de 20-22 °C en invierno y 24-26 °C en verano, programar el apagado fuera del horario de atención y evitar la operación simultánea de calefacción y refrigeración.',
    beneficio:
      'Reduce el consumo sin afectar el confort y evita conflictos térmicos entre equipos y procesos.',
  },
  {
    codigo: 'REC-COCC-01',
    titulo: 'Programación eficiente de hornos y tandas de cocción',
    categoria: 'coccion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de cocción',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-COCC-01'],
    tags: ['coccion', 'horno', 'produccion'],
    descripcion:
      'Planificar la producción en tandas que aprovechen la capacidad del horno, respetar los tiempos de precalentamiento del fabricante y reducir las aperturas de puerta.',
    beneficio:
      'Reduce el consumo por unidad producida, mejora la consistencia del producto y disminuye la carga térmica en el local.',
  },
  {
    codigo: 'REC-COCC-02',
    titulo: 'Mantención y regulación de quemadores',
    categoria: 'coccion',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'alta',
    ahorro_estimado: '5-12% del consumo de gas',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'glp',
    hallazgos_relacionados: ['HAL-COCC-02'],
    tags: ['coccion', 'gas', 'combustion'],
    descripcion:
      'Realizar mantención anual de quemadores, verificar la combustión y detectar fugas con personal certificado. Mantener limpios los inyectores y reguladores.',
    beneficio:
      'Mejora la eficiencia de combustión, reduce el consumo de gas y disminuye el riesgo de incidentes.',
  },
  {
    codigo: 'REC-COCC-03',
    titulo: 'Apagado de equipos de cocción sin carga',
    categoria: 'coccion',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '5-10% del consumo de cocción',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'glp',
    hallazgos_relacionados: ['HAL-COCC-03'],
    tags: ['coccion', 'operacion', 'apagado'],
    descripcion:
      'Definir bloques de operación y apagar planchas, freidoras y cocinas durante pausas prolongadas. Incorporar la acción en la lista de cierre del local.',
    beneficio:
      'Evita consumo innecesario de combustible, reduce la carga térmica y disminuye el desgaste de los equipos.',
  },
  {
    codigo: 'REC-ACS-01',
    titulo: 'Renovación de equipos de agua caliente sanitaria',
    categoria: 'acs',
    inversion: 'media',
    dificultad: 'media',
    prioridad: 'media',
    ahorro_estimado: '20-40% del consumo de ACS',
    plazo: 'Mediano plazo (3-6 meses)',
    energetico: 'glp',
    hallazgos_relacionados: ['HAL-ACS-01'],
    tags: ['acs', 'calefon', 'eficiencia'],
    descripcion:
      'Evaluar el recambio de calefones o termos por equipos de mayor eficiencia, correctamente dimensionados según la demanda real, o la incorporación de bombas de calor para ACS.',
    beneficio:
      'Reduce el consumo de combustible o electricidad, mejora la disponibilidad de agua caliente y disminuye las pérdidas de acumulación.',
  },
  {
    codigo: 'REC-ACS-02',
    titulo: 'Aislación térmica de tuberías de agua caliente',
    categoria: 'acs',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '3-8% del consumo de ACS',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'glp',
    hallazgos_relacionados: ['HAL-ACS-02'],
    tags: ['acs', 'aislacion', 'tuberias'],
    descripcion:
      'Aislar los tramos accesibles de tubería de agua caliente, reparar filtraciones y reducir recorridos innecesarios entre la fuente y los puntos de consumo.',
    beneficio:
      'Disminuye las pérdidas térmicas, permite reducir la temperatura de consigna y mejora el confort de uso.',
  },
  {
    codigo: 'REC-ACS-03',
    titulo: 'Ajuste de temperatura y control de acumulación',
    categoria: 'acs',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-10% del consumo de ACS',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'glp',
    hallazgos_relacionados: ['HAL-ACS-03'],
    tags: ['acs', 'temperatura', 'seguridad'],
    descripcion:
      'Ajustar la temperatura de acumulación a un rango seguro y eficiente, instalar válvulas mezcladoras si corresponde y verificar dispositivos de seguridad.',
    beneficio:
      'Reduce pérdidas térmicas y el riesgo de quemaduras, manteniendo el servicio en los puntos de consumo.',
  },
  {
    codigo: 'REC-ACS-04',
    titulo: 'Control horario de percoladores y agua caliente',
    categoria: 'acs',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '5-15% del consumo de equipos de agua caliente',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ACS-04'],
    tags: ['acs', 'percolador', 'temporizador'],
    descripcion:
      'Encender los equipos según la demanda esperada, incorporar temporizadores y apagarlos durante pausas prolongadas y al cierre.',
    beneficio:
      'Reduce el consumo evitable de los equipos que mantienen agua caliente sin demanda real.',
  },
  {
    codigo: 'REC-ENV-01',
    titulo: 'Mejoramiento de vidrios y control solar',
    categoria: 'envolvente',
    inversion: 'alta',
    dificultad: 'alta',
    prioridad: 'media',
    ahorro_estimado: '10-25% del consumo de climatización',
    plazo: 'Largo plazo (6-12 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ENV-01'],
    tags: ['envolvente', 'dvh', 'control solar'],
    descripcion:
      'Evaluar doble vidriado hermético, láminas de control solar, aleros o persianas en las fachadas con mayor exposición. Priorizar las superficies con mayor ganancia o pérdida térmica.',
    beneficio:
      'Mejora el confort, reduce la demanda de climatización y protege los productos y mobiliario de la radiación solar.',
  },
  {
    codigo: 'REC-ENV-02',
    titulo: 'Sellamiento de infiltraciones en la envolvente',
    categoria: 'envolvente',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de climatización',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ENV-02'],
    tags: ['envolvente', 'infiltraciones', 'burletes'],
    descripcion:
      'Instalar burletes en puertas y ventanas, ajustar cierrapuertas y sellar pasos de instalaciones. Evaluar cortinas de aire en accesos de alta circulación.',
    beneficio:
      'Reduce las pérdidas por infiltración, mejora el confort y disminuye la carga de climatización con inversión mínima.',
  },
  {
    codigo: 'REC-ENV-03',
    titulo: 'Aislación térmica de cubierta y muros',
    categoria: 'envolvente',
    inversion: 'alta',
    dificultad: 'alta',
    prioridad: 'media',
    ahorro_estimado: '10-20% del consumo de climatización',
    plazo: 'Largo plazo (6-12 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ENV-03'],
    tags: ['envolvente', 'aislacion', 'cubierta'],
    descripcion:
      'Incorporar aislación térmica en cubierta y muros priorizando las áreas con mayor pérdida, y corregir puentes térmicos y condensaciones.',
    beneficio:
      'Reduce la demanda de climatización de forma sostenida, mejora el confort y puede disminuir el riesgo de humedad y deterioro estructural.',
  },
  {
    codigo: 'REC-MOT-01',
    titulo: 'Renovación o redimensionamiento de motores',
    categoria: 'motores',
    inversion: 'alta',
    dificultad: 'alta',
    prioridad: 'media',
    ahorro_estimado: '10-30% del consumo de fuerza motriz',
    plazo: 'Largo plazo (6-12 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-MOT-01'],
    tags: ['motores', 'variador', 'eficiencia'],
    descripcion:
      'Evaluar el reemplazo de motores antiguos por equipos de alta eficiencia y la incorporación de variadores de frecuencia en bombas y ventiladores con caudal variable.',
    beneficio:
      'Reduce el consumo en cargas variables, mejora el control de procesos y prolonga la vida útil de los equipos.',
  },
  {
    codigo: 'REC-MOT-02',
    titulo: 'Mantención de motores y transmisiones',
    categoria: 'motores',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '3-10% del consumo de fuerza motriz',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-MOT-02'],
    tags: ['motores', 'mantencion', 'correas'],
    descripcion:
      'Alinear poleas, tensar correas, lubricar rodamientos y limpiar motores según un plan preventivo. Verificar el estado de acoples y protecciones.',
    beneficio:
      'Reduce pérdidas mecánicas y el riesgo de fallas, con una inversión menor y retorno rápido.',
  },
  {
    codigo: 'REC-PROD-01',
    titulo: 'Gestión de standby y apagado programado',
    categoria: 'equipos_productivos',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '3-8% del consumo eléctrico',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-PROD-01'],
    tags: ['equipos', 'standby', 'horario'],
    descripcion:
      'Identificar equipos con consumo permanente, incorporar temporizadores o regletas con interruptor y establecer una lista de cierre por área.',
    beneficio:
      'Elimina consumos evitables fuera del horario de operación sin afectar la disponibilidad de los equipos.',
  },
  {
    codigo: 'REC-PROD-02',
    titulo: 'Detección y reparación de fugas de aire comprimido',
    categoria: 'equipos_productivos',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'alta',
    ahorro_estimado: '10-30% del consumo del compresor',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-PROD-02'],
    tags: ['aire comprimido', 'fugas', 'mantencion'],
    descripcion:
      'Realizar una campaña de detección de fugas con ultrasonido o agua jabonosa, reparar acoples y mangueras, y programar el compresor según la demanda real.',
    beneficio:
      'Reduce el tiempo de operación del compresor, disminuye el consumo eléctrico y mejora la presión disponible en los puntos de uso.',
  },
  {
    codigo: 'REC-GEST-01',
    titulo: 'Implementar un sistema simple de gestión energética',
    categoria: 'gestion_energetica',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo total',
    plazo: 'Mediano plazo (3-6 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-GEST-01'],
    tags: ['gestion', 'kpi', 'sello ee'],
    descripcion:
      'Designar un responsable, establecer una línea base de consumo, definir indicadores simples (kWh/mes, costo por venta o por m²) y realizar revisiones mensuales con metas de mejora.',
    beneficio:
      'Sostiene los ahorros en el tiempo, permite detectar desviaciones y prepara a la empresa para programas como el Sello de Eficiencia Energética.',
  },
  {
    codigo: 'REC-GEST-02',
    titulo: 'Medición y monitoreo de consumos',
    categoria: 'gestion_energetica',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'alta',
    ahorro_estimado: '5-10% del consumo total',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-GEST-02'],
    tags: ['gestion', 'medicion', 'remarcador'],
    descripcion:
      'Registrar mensualmente la facturación y, si es posible, instalar remarcadores o medidores por área. Mantener una planilla con consumos, costos, producción y observaciones.',
    beneficio:
      'Permite verificar el impacto de las medidas, comparar períodos y priorizar nuevas acciones con información confiable.',
  },
  {
    codigo: 'REC-GEST-03',
    titulo: 'Capacitación y cultura energética',
    categoria: 'gestion_operacional',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'media',
    ahorro_estimado: '3-8% del consumo total',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-GEST-03'],
    tags: ['gestion', 'capacitacion', 'cultura'],
    descripcion:
      'Realizar charlas breves al personal, entregar procedimientos escritos y asignar responsables por turno para el apagado de equipos, manejo de frío y control de temperaturas.',
    beneficio:
      'Asegura la consistencia de las buenas prácticas y aumenta la adherencia a las medidas de bajo costo.',
  },
  {
    codigo: 'REC-GEST-04',
    titulo: 'Protocolo de cierre y control de horarios',
    categoria: 'gestion_operacional',
    inversion: 'baja',
    dificultad: 'baja',
    prioridad: 'alta',
    ahorro_estimado: '3-10% del consumo total',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-GEST-04'],
    tags: ['gestion', 'horario', 'cierre'],
    descripcion:
      'Crear una lista de verificación de cierre que incluya luces, climatización, equipos de cocción, letreros y equipos en standby. Asignar un responsable y registrar el cumplimiento.',
    beneficio:
      'Reduce el consumo fuera de horario, evita riesgos operacionales y genera hábitos sostenibles.',
  },
  {
    codigo: 'REC-TAR-01',
    titulo: 'Análisis y cambio de tarifa eléctrica',
    categoria: 'tarifas',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'alta',
    ahorro_estimado: '5-20% de la factura eléctrica',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-TAR-01'],
    tags: ['tarifa', 'facturacion', 'demanda'],
    descripcion:
      'Analizar al menos 12 meses de facturación y la curva de carga, y evaluar con un instalador o asesor certificado el cambio a la tarifa más conveniente para el perfil de consumo.',
    beneficio:
      'Reduce el costo eléctrico sin modificar la operación, mediante una tarifa y una estructura de cargos adecuadas.',
  },
  {
    codigo: 'REC-TAR-02',
    titulo: 'Compensación de energía reactiva',
    categoria: 'tarifas',
    inversion: 'media',
    dificultad: 'media',
    prioridad: 'media',
    ahorro_estimado: '3-8% de la factura eléctrica',
    plazo: 'Mediano plazo (3-6 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-TAR-02'],
    tags: ['tarifa', 'reactiva', 'condensadores'],
    descripcion:
      'Dimensionar e instalar un banco de condensadores o filtro activo para elevar el factor de potencia sobre 0,95, con evaluación de un especialista y monitoreo periódico.',
    beneficio:
      'Elimina o reduce las penalizaciones por reactiva y libera capacidad en la instalación.',
  },
  {
    codigo: 'REC-TAR-03',
    titulo: 'Redimensionamiento de la potencia contratada',
    categoria: 'potencia_contratada',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'media',
    ahorro_estimado: '3-10% de la factura eléctrica',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-TAR-03'],
    tags: ['tarifa', 'potencia', 'demanda'],
    descripcion:
      'Comparar la potencia contratada con la demanda máxima registrada y ajustar el contrato para evitar cargos por exceso o sobrecostos por capacidad no utilizada.',
    beneficio:
      'Optimiza el cargo fijo y reduce el riesgo de recargos, manteniendo la capacidad necesaria para la operación.',
  },
  {
    codigo: 'REC-TAR-04',
    titulo: 'Segregación de medidores y regularización',
    categoria: 'tarifas',
    inversion: 'media',
    dificultad: 'alta',
    prioridad: 'media',
    ahorro_estimado: '5-15% de la factura eléctrica',
    plazo: 'Mediano plazo (3-6 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-TAR-04'],
    tags: ['tarifa', 'medidor', 'regularizacion'],
    descripcion:
      'Separar los consumos productivos, administrativos y residenciales en medidores independientes, con proyecto y ejecución por instaladores certificados SEC.',
    beneficio:
      'Permite aplicar la tarifa correcta, transparentar costos por área y evitar subsidios cruzados.',
  },
  {
    codigo: 'REC-ERNC-01',
    titulo: 'Estudio e instalación de autoconsumo solar fotovoltaico',
    categoria: 'ernc',
    inversion: 'alta',
    dificultad: 'alta',
    prioridad: 'media',
    ahorro_estimado: '20-50% del consumo eléctrico diurno',
    plazo: 'Largo plazo (6-12 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-ERNC-01'],
    tags: ['ernc', 'solar', 'autoconsumo'],
    descripcion:
      'Realizar una prefactibilidad técnica y económica considerando cubierta disponible, curva de consumo y normativa de generación distribuida. Dimensionar el sistema para maximizar el autoconsumo.',
    beneficio:
      'Reduce la dependencia de la red, estabiliza costos y mejora el posicionamiento de sostenibilidad del negocio.',
  },
  {
    codigo: 'REC-GEN-01',
    titulo: 'Puesta en marcha y mantención del grupo electrógeno',
    categoria: 'otros',
    inversion: 'baja',
    dificultad: 'media',
    prioridad: 'alta',
    ahorro_estimado: 'Continuidad operativa',
    plazo: 'Inmediato (0-30 días)',
    energetico: 'diesel',
    hallazgos_relacionados: ['HAL-GEN-01'],
    tags: ['respaldo', 'continuidad', 'seguridad'],
    descripcion:
      'Conectar el grupo electrógeno mediante transferencia manual o automática, verificar cumplimiento normativo y programar pruebas y mantenciones periódicas.',
    beneficio:
      'Asegura la continuidad de procesos críticos ante cortes de suministro y evita pérdidas de productos y ventas.',
  },
  {
    codigo: 'REC-GEN-02',
    titulo: 'Programa de detección y reparación de fugas de refrigerante',
    categoria: 'refrigeracion',
    inversion: 'media',
    dificultad: 'alta',
    prioridad: 'alta',
    ahorro_estimado: '5-15% del consumo de refrigeración',
    plazo: 'Corto plazo (1-3 meses)',
    energetico: 'electricidad',
    hallazgos_relacionados: ['HAL-GEN-02'],
    tags: ['refrigeracion', 'refrigerante', 'ambiente'],
    descripcion:
      'Implementar inspecciones periódicas, registro de cargas y reparaciones por personal certificado. Reemplazar equipos con refrigerantes de alto GWP al final de su vida útil.',
    beneficio:
      'Recupera la capacidad de frío, reduce el consumo y disminuye las emisiones directas de gases de efecto invernadero.',
  },
];

const recursos = [
  {
    id: 'REC-AGENCIA-BIBLIOTECA',
    categoria: 'agencia_se',
    nombre: 'Biblioteca de la Agencia de Sostenibilidad Energética',
    descripcion:
      'Guías técnicas, manuales y estudios sobre eficiencia energética, gestión de la energía y tecnologías de bajo consumo.',
    url: 'https://www.agenciase.org/biblioteca/',
    orden: 10,
  },
  {
    id: 'REC-GESTIONA-MIPYMES',
    categoria: 'herramientas',
    nombre: 'Gestiona Energía MiPyMEs',
    descripcion:
      'Herramientas gratuitas del Ministerio de Energía para estimar consumos, evaluar medidas y calcular ahorros en pequeñas empresas.',
    url: 'https://mipymes.gestionaenergia.cl/herramientas',
    orden: 20,
  },
  {
    id: 'REC-SELLO-EE',
    categoria: 'eficiencia_energetica',
    nombre: 'Sello de Eficiencia Energética (Sello EE)',
    descripcion:
      'Programa gratuito para MiPyMEs que reconoce la gestión energética y entrega una hoja de ruta de mejora continua.',
    url: 'https://plataforma.selloee.cl/',
    orden: 30,
  },
  {
    id: 'REC-ASISTENCIA-TECNICA',
    categoria: 'ministerio_energia',
    nombre: 'Unidad de Asistencia Técnica Gratuita',
    descripcion:
      'Servicio de diagnóstico energético gratuito en línea para empresas, con recomendaciones de eficiencia energética y energías renovables.',
    url: 'https://mipymes.gestionaenergia.cl/unidad-de-asistencia-tecnica',
    orden: 40,
  },
  {
    id: 'REC-SEC-INSTALADORES',
    categoria: 'eficiencia_energetica',
    nombre: 'Buscador de instaladores certificados SEC',
    descripcion:
      'Listado oficial de instaladores eléctricos y de gas certificados para regularizaciones, proyectos y modificaciones.',
    url: 'https://www.sec.cl/area-ciudadana/nuevo-buscador-de-instaladores-e-instaladoras/',
    orden: 50,
  },
  {
    id: 'REC-REGISTRO-CONSULTORES',
    categoria: 'eficiencia_energetica',
    nombre: 'Registro de Consultores Energéticos',
    descripcion:
      'Plataforma para contactar profesionales y empresas que prestan servicios de eficiencia energética y energías renovables.',
    url: 'https://consultores.registroenergetico.cl/',
    orden: 60,
  },
  {
    id: 'REC-EXPLORADOR-SOLAR',
    categoria: 'ernc',
    nombre: 'Explorador Solar',
    descripcion:
      'Herramienta pública para estimar la radiación solar y el potencial de generación fotovoltaica en una ubicación.',
    url: 'https://solar.minenergia.cl/',
    orden: 70,
  },
  {
    id: 'REC-CALCULADORA-AHORRO',
    categoria: 'herramientas',
    nombre: 'Plataforma Gestiona Energía',
    descripcion:
      'Calculadora de ahorros y beneficios para una primera estimación del impacto de medidas de eficiencia energética.',
    url: 'https://mipyme.agenciase.org/plataforma/',
    orden: 80,
  },
  {
    id: 'REC-CERO-FUGAS',
    categoria: 'refrigeracion',
    nombre: 'Programa Cero Fugas (PNUD)',
    descripcion:
      'Apoyo técnico y cofinanciamiento para empresas con sistemas de refrigeración que utilizan HCFC.',
    url: 'https://www.undp.org/es/chile/programa-cero-fugas',
    orden: 90,
  },
  {
    id: 'REC-ETIQUETADO-SEC',
    categoria: 'etiquetado',
    nombre: 'Etiquetado energético de equipos',
    descripcion:
      'Información oficial sobre etiquetas de eficiencia energética para artefactos eléctricos y de gas.',
    url: 'https://www.sec.cl/etiquetado-energetico/',
    orden: 100,
  },
  {
    id: 'REC-CNE-TARIFAS',
    categoria: 'tarifas',
    nombre: 'Comisión Nacional de Energía — Tarifas',
    descripcion:
      'Información oficial sobre tarifas eléctricas, cargos regulados y normativa del sector.',
    url: 'https://www.cne.cl/tarificacion/electrica/',
    orden: 110,
  },
  {
    id: 'REC-MINENERGIA-EE',
    categoria: 'ministerio_energia',
    nombre: 'Ministerio de Energía — Eficiencia Energética',
    descripcion:
      'Políticas, programas y material de apoyo sobre eficiencia energética en Chile.',
    url: 'https://www.energia.gob.cl/eficiencia-energetica',
    orden: 120,
  },
  {
    id: 'REC-HUELLACHILE',
    categoria: 'herramientas',
    nombre: 'HuellaChile',
    descripcion:
      'Programa del Ministerio del Medio Ambiente para medir y gestionar la huella de carbono de las empresas.',
    url: 'https://huellachile.mma.gob.cl/',
    orden: 130,
  },
  {
    id: 'REC-LEY-EE',
    categoria: 'normativa',
    nombre: 'Ley de Eficiencia Energética',
    descripcion:
      'Marco legal chileno que promueve el uso eficiente de la energía y la gestión energética en organizaciones.',
    url: 'https://www.energia.gob.cl/ley-de-eficiencia-energetica',
    orden: 140,
  },
];

function findingId(codigo) {
  return `HAL-${codigo}`;
}

function recommendationId(codigo) {
  return codigo.startsWith('REC-') ? codigo : `REC-${codigo}`;
}

async function writeFinding(item) {
  const record = {
    schema_version: 1,
    id: findingId(item.codigo),
    codigo: item.codigo,
    titulo: item.titulo,
    categoria: item.categoria,
    descripcion: item.descripcion,
    justificacion: item.justificacion,
    impacto: item.impacto,
    energetico: item.energetico,
    recomendacion_id: recommendationId(item.recomendacion_id),
    tags: item.tags,
    activo: true,
    origen: 'catalogo_base',
    created_at: NOW,
    updated_at: NOW,
  };
  await fs.writeFile(
    path.join(HALLAZGOS, `${record.id}.toml`),
    `${stringify(record)}\n`,
    'utf8',
  );
}

async function writeRecommendation(item) {
  const record = {
    schema_version: 1,
    id: recommendationId(item.codigo),
    codigo: item.codigo,
    titulo: item.titulo,
    categoria: item.categoria,
    descripcion: item.descripcion,
    beneficio: item.beneficio,
    inversion: item.inversion,
    dificultad: item.dificultad,
    prioridad: item.prioridad,
    ahorro_estimado: item.ahorro_estimado,
    plazo: item.plazo,
    energetico: item.energetico,
    hallazgos_relacionados: item.hallazgos_relacionados,
    tags: item.tags,
    activo: true,
    origen: 'catalogo_base',
    created_at: NOW,
    updated_at: NOW,
  };
  await fs.writeFile(
    path.join(RECOMENDACIONES, `${record.id}.toml`),
    `${stringify(record)}\n`,
    'utf8',
  );
}

async function writeResource(item) {
  const record = {
    schema_version: 1,
    ...item,
    activo: true,
  };
  await fs.writeFile(path.join(RECURSOS, `${record.id}.toml`), `${stringify(record)}\n`, 'utf8');
}

async function main() {
  await fs.mkdir(HALLAZGOS, { recursive: true });
  await fs.mkdir(RECOMENDACIONES, { recursive: true });
  await fs.mkdir(RECURSOS, { recursive: true });
  for (const item of hallazgos) await writeFinding(item);
  for (const item of recomendaciones) await writeRecommendation(item);
  for (const item of recursos) await writeResource(item);
  console.log(
    `Catálogos generados: ${hallazgos.length} hallazgos, ${recomendaciones.length} recomendaciones, ${recursos.length} recursos.`,
  );
}

await main();
