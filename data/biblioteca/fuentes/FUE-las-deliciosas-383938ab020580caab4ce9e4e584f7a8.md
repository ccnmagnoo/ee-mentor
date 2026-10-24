# Las Deliciosas

> Fuente importada desde `Las Deliciosas 383938ab020580caab4ce9e4e584f7a8.html` · hash `a4383527dbecf25b`

- **Rubro inferido:** Restaurante
- **Fecha del documento:** June 18, 2026

## Hallazgos

### Conservación de alimentos

**Categoría inferida:** refrigeracion

Cuenta con dos cámaras de frío de 5 °C utilizadas para la conservación de alimentos refrigerados presentan desafíos energéticos relevantes asociados principalmente a su operación continua (24/7) . Este tipo de sistemas requiere mantener condiciones térmicas estables, lo que implica un consumo constante de electricidad, incluso fuera del horario productivo.

### Sistema de congelado

**Categoría inferida:** refrigeracion

Cuenta con dos cámaras de congelado (una destinada a materias primas y otra a productos terminados de empanadas) con operación a bajas temperaturas (≈ -18 °C) , lo que implica un alto consumo energético continuo. Uno de los principales problemas es la apertura frecuente de puertas , especialmente en la cámara de productos terminados, donde existe mayor rotación, generando infiltración de aire húmedo que incrementa la formación de escarcha y la carga térmica del sistema. También la única fuente de información de congelado es la termocupla del equipo, del cuál el cliente desconoce su ubicación punto de toma de medición.

### Tarifa domiciliaria sección Restaurant

**Categoría inferida:** tarifas

El cliente cuenta con una unidad que cuenta con tarifa BT1A con un consumo mensual de 2.209 kWh, destinada a la atención restaurant del público . Se estima que podría no estar en la categoría tarifaria más adecuada para su perfil de consumo . La tarifa BT1A está diseñada típicamente para clientes con bajos niveles de consumo y sin gestión de demanda , por lo que no considera señales de precio diferenciadas por horario ni permite optimizar costos mediante la gestión de carga. A medida que el consumo aumenta, como en este caso, es probable que el cliente esté pagando un costo unitario de energía menos competitivo en comparación con otras tarifas disponibles para mayores consumos.

### Mal factor de potencia

**Categoría inferida:** tarifas

Registro de un bajo factor de potencia (penalización asociada del 6,4%) en la cuenta BT3PPP indica que la instalación eléctrica del cliente está presentando un uso ineficiente de la energía , debido a la presencia de potencia reactiva elevada en relación con la potencia activa consumida. Este fenómeno es común en instalaciones que operan con equipos como motores eléctricos, compresores de refrigeración, sistemas de climatización y transformadores , todos presentes en operaciones como cafeterías o fábricas de alimentos.
Un factor de potencia bajo implica que la red debe suministrar más corriente de la realmente necesaria para realizar el trabajo útil, lo que genera mayores pérdidas eléctricas, sobrecarga de conductores y transformadores , y una menor capacidad disponible de la instalación. En términos económicos, esto se traduce en cargos adicionales en la facturación eléctrica , como ocurre en este caso, afectando directamente los costos operacionales. Además, puede ser indicativo de falta de compensación reactiva (ausencia o mal estado de bancos de condensadores) o de una operación poco eficiente de los equipos eléctricos.

### No se detecta gestión energética dedicada

**Categoría inferida:** gestion_energetica

No se evidencia la existencia de un responsable designado ni de un sistema formal de gestión de la energía dentro de la empresa, lo que limita la capacidad para monitorear, analizar y optimizar el consumo energético. Esta ausencia dificulta la identificación oportuna de ineficiencias, la implementación de medidas correctivas y el seguimiento de indicadores clave, generando una gestión más bien reactiva que estratégica en materia energética.

### Energías Renovables

**Categoría inferida:** ernc

La empresa no cuenta con integración de energías renovables, lo que implica una dependencia total de fuentes convencionales. Si bien el consumo energético del proceso productivo podría limitar el impacto técnico de estas soluciones, existe una brecha estratégica relevante en términos de sostenibilidad, especialmente considerando las exigencias del cliente mayoritario. La falta de iniciativas en este ámbito puede afectar la competitividad, la imagen corporativa y el cumplimiento de compromisos ambientales.

## Recomendaciones

### Mejoramiento operativo cámaras refrigerado

**Categoría inferida:** refrigeracion

Uno de los principales problemas es la pérdida de frío por aperturas frecuentes de puertas , especialmente en contextos operativos con alta rotación de productos, lo que obliga al sistema de refrigeración a trabajar de manera intensiva para recuperar la temperatura de consigna. A esto se suman posibles deficiencias en sellos, infiltraciones de aire y acumulación de hielo en evaporadores, factores que reducen la eficiencia del sistema.
Es clave implementar una gestión eficiente del uso de las cámaras , diferenciando su función (por ejemplo, una para productos de alta rotación y otra para almacenamiento más prolongado), lo que permite optimizar aperturas y reducir pérdidas térmicas. 
Asimismo, se recomienda establecer protocolos de operación , como limitar el tiempo de apertura de puertas, evitar el ingreso de productos calientes y mantener una adecuada organización interna que facilite la circulación de aire.
Adicionalmente, la mantención periódica es fundamental: limpieza de serpentines, revisión de sellos y control de escarcha. Desde el punto de vista energético, estas acciones permiten reducir el consumo eléctrico, mejorar la eficiencia del sistema y asegurar condiciones adecuadas de conservación de alimentos , contribuyendo a una operación más confiable y sostenible.

### Mejoramiento operativo cámaras congelado

**Categoría inferida:** gestion_operacional

Se recomienda mantener una diferenciación clara y estricta de uso entre ambas cámaras , optimizando su operación según el tipo de producto. La cámara de materias primas debe orientarse a almacenamiento de baja rotación, minimizando aperturas y asegurando una organización interna eficiente (sistema FIFO, orden por tipo de producto). En cambio, la cámara de productos terminados debe operar con una lógica de alta rotación , con un layout que facilite un acceso rápido y reduzca el tiempo de apertura de puertas.

### Mejoramiento del ciclo de refrigerado

**Categoría inferida:** mantencion

Se sugiere implementar mejoramiento de proceso de congelado a futuro, como el preenfriamiento de productos antes de su ingreso con túneles de congelado más pequeños , donde el control de carga máxima para permitir adecuada circulación de aire, y protocolos de minimización de aperturas. La mantención periódica (limpieza de escarcha, revisión de sellos y serpentines) es fundamental para mantener la eficiencia. Estas acciones permiten reducir el consumo energético, mejorar la estabilidad térmica y asegurar la calidad e inocuidad de los alimentos , contribuyendo a una operación más eficiente y sostenible del sistema de congelado.

### Corrección del mal factor de potencia

**Categoría inferida:** gestion_operacional

Se recomienda implementar un sistema de compensación de energía reactiva mediante bancos de condensadores , dimensionados de acuerdo con la carga instalada, con el objetivo de elevar el factor de potencia a valores cercanos a 0,95 o superiores , eliminando o reduciendo las penalizaciones económicas. Idealmente, estos sistemas deben ser automáticos , permitiendo adaptarse a las variaciones de carga durante la jornada, debido a la naturaleza variable de la demanda de los productos de la empresa.
Adicionalmente, es importante realizar una evaluación técnica de los equipos existentes , en particular motores y compresores, verificando su estado, eficiencia y adecuado dimensionamiento, ya que equipos sobredimensionados o en mal estado tienden a empeorar el factor de potencia. También se recomienda incorporar buenas prácticas operacionales , como evitar el funcionamiento en vacío de equipos inductivos y mantener una planificación adecuada del uso de cargas eléctricas.
Finalmente, el monitoreo periódico del factor de potencia y de la calidad de energía permitirá asegurar la correcta operación del sistema de compensación y mantener un consumo eléctrico eficiente, reduciendo costos y mejorando el desempeño energético general de la instalación.

### Profesionalización de la gestión de la energía

**Categoría inferida:** gestion_energetica

Se recomienda avanzar hacia la profesionalización de la gestión energética de la empresa . Esto implica designar un responsable interno o apoyo externo que se encargue de monitorear consumos, revisar indicadores eléctricos (como factor de potencia, demanda máxima y consumos base), e implementar buenas prácticas operacionales. La incorporación de una gestión energética sistemática permitirá identificar oportunidades de mejora, reducir costos, optimizar el uso de la energía y asegurar la sostenibilidad operativa del negocio en el tiempo y acorde a su crecimiento empresarial.
A mediano plazo, se podría evaluar la adopción de estándares más formales como la norma ISO 50001 en una versión simplificada o adaptada, lo que permitiría consolidar una cultura energética organizacional, mejorar la eficiencia de manera sostenida y eventualmente reducir costos operacionales.
Otra herramienta que puede apoyar al reconocimiento del proceso de mejora de gestión es apuntar al Sello de Eficiencia Energética del Ministerio de Energía, con subscripción gratuita para MiPymes. Ver enlace en anexos de utilidad.
Puede revisar con más información en La Guía Metodológica para Auditorías Energéticas para el Sector de Alimentos

## Texto completo (datos personales redactados)

      Las Deliciosas            
 Las Deliciosas
 
       Fecha   June 18, 2026 11:01 AM  
     Negocio   Restaurant  
     Grado consumos   Intensivo  
     Usuario  Nicolás Lagomarsino 
     Teléfono   [teléfono redactado]  
     Correo electrónico   [correo redactado]  
     Contraparte   CND Sercotec Viña del Mar  
           
      

 ACTA de seguimiento Asesoría/Mentoría
 Información del contacto y cliente (negocio)
    Nombre del contacto  Nicolás Lagomarsino  RUT  [RUT redactado] 
  Nombre del negocio  Sociedad Gastronómica Reed y Lagomarsino Ltda - Las Deliciosas  ROL   
  Asesor asignado  Carlos Campos N  Servicio  Seremi Energía 
   Descripción
 La empresa “Empanadas Las Deliciosas” presenta un perfil energético característico de un proceso productivo alimentario con alta dependencia de sistemas de refrigeración. Actualmente se encuentra en el rubro de “servicios de alimentación”, pero por la naturaleza del crecimiento productivo, a tenido que implementar una infraestructura del grado una  fábrica de alimentos . En sus instalaciones se cuenta con dos cámaras de frío de aproximadamente 2x3 metros cada una, operando a 5 °C para la conservación de insumos y productos en estado refrigerado, así como dos cámaras de congelado destinadas, respectivamente, al almacenamiento de materias primas y de productos terminados (empanadas). Estos sistemas representan los principales consumos energéticos del establecimiento, debido a su operación continua y a la necesidad de mantener condiciones térmicas estables. La demanda energética se ve influenciada por factores como la frecuencia de apertura de puertas, la carga térmica de los productos ingresados, el nivel de aislamiento de las cámaras y la eficiencia de los equipos de refrigeración. En este contexto, la gestión energética de la empresa debe centrarse en optimizar la operación de estos sistemas, asegurar un mantenimiento adecuado y controlar las variables operacionales, con el fin de reducir consumos, garantizar la cadena de frío y preservar la calidad de los productos elaborados.
 Acometidas
    Cliente  354640-3  BT3PPP  264529-7  BT1A 
  Propietario  Empresa    Empresa   
  Distribuidora  Chilquinta    Chilquinta   
  Consumo kWh  7131  kWh  2330  kWh 
  Potencia Leída  28.7  kW     
  Demanda Máxima  35.7  kW  mfp  6.4% 
  Gasto nominal   2.587.994  $CLP  655.822  $CLP 
    Hallazgos
             Referencia     Servicio     Descripción 
     Conservación de alimentos.    refrigeración   Cuenta con dos cámaras de frío de 5 °C utilizadas para la  conservación de alimentos refrigerados  presentan desafíos energéticos relevantes asociados principalmente a su  operación continua (24/7) . Este tipo de sistemas requiere mantener condiciones térmicas estables, lo que implica un consumo constante de electricidad, incluso fuera del horario productivo.  
   Sistema de congelado    refrigeración    Cuenta con dos cámaras de congelado  (una destinada a materias primas y otra a productos terminados de empanadas) con   operación a bajas temperaturas (≈ -18 °C) , lo que implica un alto consumo energético continuo. Uno de los principales problemas es la  apertura frecuente de puertas , especialmente en la cámara de productos terminados, donde existe mayor rotación, generando infiltración de aire húmedo que incrementa la formación de escarcha y la carga térmica del sistema. También la única fuente de información de congelado es la termocupla del equipo, del cuál el cliente desconoce su ubicación punto de toma de medición. 
   Tarifa domiciliaria sección Restaurant    contractual   El cliente cuenta con una unidad que cuenta con  tarifa BT1A  con un consumo mensual de  2.209 kWh, destinada a la atención restaurant del público .  Se estima que  podría no estar en la categoría tarifaria más adecuada para su perfil de consumo . La tarifa BT1A está diseñada típicamente para clientes con  bajos niveles de consumo y sin gestión de demanda , por lo que no considera señales de precio diferenciadas por horario ni permite optimizar costos mediante la gestión de carga. A medida que el consumo aumenta, como en este caso, es probable que el cliente esté  pagando un costo unitario de energía menos competitivo  en comparación con otras tarifas disponibles para mayores consumos. 
   Mal factor de potencia    eléctrica   Registro de un  bajo factor de potencia (penalización asociada del 6,4%)  en la cuenta BT3PPP indica que la instalación eléctrica del cliente está presentando un  uso ineficiente de la energía , debido a la presencia de potencia reactiva elevada en relación con la potencia activa consumida. Este fenómeno es común en instalaciones que operan con equipos como  motores eléctricos, compresores de refrigeración, sistemas de climatización y transformadores , todos presentes en operaciones como cafeterías o fábricas de alimentos.
Un factor de potencia bajo implica que la red debe suministrar más corriente de la realmente necesaria para realizar el trabajo útil, lo que genera  mayores pérdidas eléctricas, sobrecarga de conductores y transformadores , y una menor capacidad disponible de la instalación. En términos económicos, esto se traduce en  cargos adicionales en la facturación eléctrica , como ocurre en este caso, afectando directamente los costos operacionales. Además, puede ser indicativo de  falta de compensación reactiva (ausencia o mal estado de bancos de condensadores)  o de una operación poco eficiente de los equipos eléctricos. 
   No se detecta gestión energética dedicada    gestión energética   No se evidencia la existencia de un  responsable designado ni de un sistema formal de gestión de la energía  dentro de la empresa, lo que limita la capacidad para monitorear, analizar y optimizar el consumo energético. Esta ausencia dificulta la identificación oportuna de ineficiencias, la implementación de medidas correctivas y el seguimiento de indicadores clave, generando una gestión más bien reactiva que estratégica en materia energética. 
   Energías Renovables    energías renovables   La empresa no cuenta con integración de energías renovables, lo que implica una dependencia total de fuentes convencionales. Si bien el consumo energético del proceso productivo podría limitar el impacto técnico de estas soluciones, existe una brecha estratégica relevante en términos de sostenibilidad, especialmente considerando las exigencias del cliente mayoritario. La falta de iniciativas en este ámbito puede afectar la competitividad, la imagen corporativa y el cumplimiento de compromisos ambientales. 
  



  Recomendaciones
            nombre     Recomendación 
     Mejoramiento operativo cámaras refrigerado   Uno de los principales problemas es la  pérdida de frío por aperturas frecuentes de puertas , especialmente en contextos operativos con alta rotación de productos, lo que obliga al sistema de refrigeración a trabajar de manera intensiva para recuperar la temperatura de consigna. A esto se suman posibles deficiencias en sellos, infiltraciones de aire y acumulación de hielo en evaporadores, factores que reducen la eficiencia del sistema.
Es clave implementar una  gestión eficiente del uso de las cámaras , diferenciando su función (por ejemplo, una para productos de alta rotación y otra para almacenamiento más prolongado), lo que permite optimizar aperturas y reducir pérdidas térmicas. 
Asimismo, se recomienda establecer  protocolos de operación , como limitar el tiempo de apertura de puertas, evitar el ingreso de productos calientes y mantener una adecuada organización interna que facilite la circulación de aire.
Adicionalmente, la mantención periódica es fundamental: limpieza de serpentines, revisión de sellos y control de escarcha. Desde el punto de vista energético, estas acciones permiten  reducir el consumo eléctrico, mejorar la eficiencia del sistema y asegurar condiciones adecuadas de conservación de alimentos , contribuyendo a una operación más confiable y sostenible. 
   Mejoramiento operativo cámaras congelado   Se recomienda mantener una  diferenciación clara y estricta de uso entre ambas cámaras , optimizando su operación según el tipo de producto. La cámara de  materias primas  debe orientarse a almacenamiento de baja rotación, minimizando aperturas y asegurando una organización interna eficiente (sistema FIFO, orden por tipo de producto). En cambio, la cámara de  productos terminados  debe operar con una lógica de  alta rotación , con un layout que facilite un acceso rápido y reduzca el tiempo de apertura de puertas.
 
   Mejoramiento del ciclo de refrigerado   Se sugiere implementar mejoramiento de proceso de congelado a futuro, como el  preenfriamiento de productos antes de su ingreso con túneles de congelado más pequeños , donde el control de carga máxima para permitir adecuada circulación de aire, y protocolos de minimización de aperturas. La mantención periódica (limpieza de escarcha, revisión de sellos y serpentines) es fundamental para mantener la eficiencia. Estas acciones permiten  reducir el consumo energético, mejorar la estabilidad térmica y asegurar la calidad e inocuidad de los alimentos , contribuyendo a una operación más eficiente y sostenible del sistema de congelado. 
   Corrección del mal factor de potencia   Se recomienda implementar un sistema de  compensación de energía reactiva mediante bancos de condensadores , dimensionados de acuerdo con la carga instalada, con el objetivo de  elevar el factor de potencia a valores cercanos a 0,95 o superiores , eliminando o reduciendo las penalizaciones económicas. Idealmente, estos sistemas deben ser  automáticos , permitiendo adaptarse a las variaciones de carga durante la jornada, debido a la naturaleza variable de la demanda de los productos de la empresa.
Adicionalmente, es importante realizar una  evaluación técnica de los equipos existentes , en particular motores y compresores, verificando su estado, eficiencia y adecuado dimensionamiento, ya que equipos sobredimensionados o en mal estado tienden a empeorar el factor de potencia. También se recomienda incorporar  buenas prácticas operacionales , como evitar el funcionamiento en vacío de equipos inductivos y mantener una planificación adecuada del uso de cargas eléctricas.
Finalmente, el monitoreo periódico del factor de potencia y de la calidad de energía permitirá asegurar la  correcta operación del sistema de compensación  y mantener un consumo eléctrico eficiente, reduciendo costos y mejorando el desempeño energético general de la instalación. 
   Profesionalización de la gestión de la energía   Se recomienda avanzar hacia la  profesionalización de la gestión energética de la empresa . Esto implica designar un responsable interno o apoyo externo que se encargue de monitorear consumos, revisar indicadores eléctricos (como factor de potencia, demanda máxima y consumos base), e implementar buenas prácticas operacionales. La incorporación de una gestión energética sistemática permitirá  identificar oportunidades de mejora, reducir costos, optimizar el uso de la energía y asegurar la sostenibilidad operativa del negocio  en el tiempo y acorde a su crecimiento empresarial.

A mediano plazo, se podría evaluar la adopción de estándares más formales como la norma ISO 50001 en una versión simplificada o adaptada, lo que permitiría consolidar una cultura energética organizacional, mejorar la eficiencia de manera sostenida y eventualmente reducir costos operacionales.

Otra herramienta que puede apoyar al reconocimiento del proceso de mejora de gestión es apuntar al Sello de Eficiencia Energética del Ministerio de Energía, con subscripción gratuita para MiPymes. Ver enlace en anexos de utilidad.

Puede revisar con más información en  La Guía Metodológica para Auditorías Energéticas para el Sector de Alimentos  
  



 Temas adicionales
 Se recomienda generar lazos de colaboración con instituciones educativas y centros de investigación especializados en tecnología de alimentos, con énfasis en productos del mar, con el fin de profundizar en estrategias avanzadas de conservación, aprovechando las redes de colaboración de CDN Sercotec Viña del Mar. Estas alianzas permitirían evaluar la existencia de brechas para eventuales incrementos marginales en las temperaturas de almacenamiento que no comprometan la inocuidad ni la calidad del producto, pero que contribuyan a mejorar la eficiencia energética de los procesos. No obstante, este tipo de ajustes requiere necesariamente de  estudios técnicos y validaciones científicas específicas , considerando la alta sensibilidad de los productos marinos, por lo que su implementación debe estar respaldada por conocimiento experto, ensayos controlados y cumplimiento de normativas sanitarias vigentes.
 Acuerdos
 Se recomienda además realizar una  visita técnica en terreno , con el fin de inspeccionar directamente las condiciones de operación de los equipos e instalaciones, lo que permitirá  identificar oportunidades adicionales de mejora, validar los hallazgos detectados y proponer medidas específicas ajustadas a la realidad del establecimiento . Esta instancia resulta clave para complementar el análisis teórico con observaciones prácticas y avanzar hacia una gestión energética más eficiente.
 Información para proveedores de servicios eléctricos y energías renovables, en la sección de “información de utilidad” adjunta.
 Información de utilidad
     👩‍🦰Instaladoras  Red de mujeres  Instaladoras  certificadas SEC, para regularización eléctrica y gas, análisis de tarifas, expansiones y proyectos   Instaladoras SEC Certificadas  
  👷‍♂️Portal SEC de instaladores  Listado de profesionales certificados SEC oficial.   Instaladoras e Instaladores Certificados por SEC  
  🏭Proveedores  Listado referencial proveedores de equipamiento renovable, no implica recomendación y es responsabilidad del mandante asegurar su cumplimiento y calidad.   Proveedores Energéticos (pub)  
  🧠Registro de  Consultores   Plataforma digital  para conectar a profesionales y empresas que prestan servicios en eficiencia energética y energías renovables   Registro de Consultores  
  📚Biblioteca  AgenciaSE   Material Bibliográfico sobre Eficiencia Energética y Sistemas de Gestión de la Energía   Biblioteca – Agencia de Sostenibilidad Energética  
  🛡️Sello EE  Sello de Eficiencia Energética,  gratuito  para MiPyMes   SelloEE - Sello de Excelencia Energética  
  🎯Gestiona Energía  MiPyME   El Ministerio de Energía ha desarrollado una serie de herramientas de fácil uso para que las MiPyMES puedan estimar el uso y generación de energía a lo largo del país.   Herramientas | Gestiona Energía MiPyMEs  
  ⚡Calculadora de  ahorro energéticos   Herramienta para calcular una primera aproximación de ahorros y beneficios   Plataforma Gestiona Energía  
  🌿Calculadora de Energías Renovables  Calculadora de Ahorro para calcular de forma rápida el ahorro que podría obtener al instalar un sistema solar fotovoltaico y conectarlo a la red, de acuerdo a la Ley de Generación Distribuida.   Explorador Solar  
  🧾Servicio de Diagnóstico ONLINE  Servicio de  diagnóstico energético gratuito  que, a partir de una revisión energética de la empresa, entrega recomendaciones sobre medidas de eficiencia energética y energía renovable   Asistencia Técnica Gratuita  
  ❄️Cero Fugas PNUD  Apoyo técnico y cofinanciamiento para empresas con sistemas de refrigeración HCFC.   Programa Cero Fugas | Programa De Las Naciones Unidas Para El Desarrollo  
  
   ━━━━━━  ━━━━━━━━━━ 
  Carlos Campos
  Analista Regional Eficiencia Energética
 Seremi de Energía Región de Valparaíso 
 [correo redactado] 

     