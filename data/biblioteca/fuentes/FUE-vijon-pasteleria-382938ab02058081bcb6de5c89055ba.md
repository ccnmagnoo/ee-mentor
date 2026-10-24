# Vijon Pastelería

> Fuente importada desde `Vijon Pastelería 382938ab02058081bcb6de5c89055ba8.html` · hash `569900a3da4798a8`

- **Rubro inferido:** Pastelería
- **Fecha del documento:** June 17, 2026

## Hallazgos

### Tarifa domiciliaria

**Categoría inferida:** tarifas

El cliente cuenta con una unidad que cuenta con tarifa BT1, en el cual se integran viviendas de uso domiciliario . Se sugiere que podría no estar en la categoría tarifaria más adecuada para su perfil de consumo . La tarifa BT1A está diseñada típicamente para clientes con bajos niveles de consumo y sin gestión de demanda , por lo que no considera señales de precio diferenciadas por horario ni permite optimizar costos mediante la gestión de carga. A medida que el consumo aumenta, como en este caso, es probable que el cliente esté pagando un costo unitario de energía menos competitivo en comparación con otras tarifas disponibles para mayores consumos.

### Uso domiciliario

**Categoría inferida:** gestion_energetica

Existe un uso de una tarifa BT1 para una fábrica procesadora de alimentos , donde además se alimentan dos viviendas , constituye una falencia relevante en la gestión energética y contractual del suministro eléctrico . La tarifa BT1 está diseñada para consumos residenciales o de muy baja escala , sin considerar perfiles de carga productivos ni usos intensivos de energía.

### No cuenta con gestión energética profesionalizada ni indicadores de gestión energética

**Categoría inferida:** gestion_energetica

En gestión energética una situación típica de instalaciones productivas de menor escala: dispone de ciertas prácticas de sensibilización energética impulsadas directamente por los dueños, pero carece de un sistema formal y estructurado de gestión energética. Esta condición implica que, si bien existe conciencia respecto al uso eficiente de la energía, las acciones implementadas son esporádicas, no sistemáticas y sin seguimiento técnico que permita evaluar su impacto real. En consecuencia, es probable que existan ineficiencias operativas, especialmente en procesos intensivos en energía como la cocción (hornos), refrigeración, climatización y uso de equipos auxiliares.
Desde una perspectiva técnica, la ausencia de una gestión profesionalizada se traduce en la falta de indicadores clave de desempeño energético, inexistencia de líneas base, y una limitada capacidad de identificar consumos anómalos o oportunidades de mejora.

### Gestión de la cadena de refrigeración y congelados

**Categoría inferida:** gestion_operacional

La empresa presenta una gestión operativa de los sistemas de refrigeración basada en conocimientos en base a la experiencia del personal y los dueños. Pero este no cuenta con respaldo documental ni control formal de parámetros críticos. La ausencia de una sistematización de indicadores de setpoints (temperaturas, ciclos, tiempos de descongelamiento) impide verificar si los equipos están operando en condiciones óptimas o sobredimensionadas. Además, aunque existe un uso diferenciado según la etapa de manufactura, este no podría estar estandarizado durante la operación anual, lo que puede generar inconsistencias térmicas, sobreconsumo energético y potenciales riesgos. Hay dependencia de la experiencia operativa más que de una gestión técnica sistemática.

### Energías Renovables

**Categoría inferida:** ernc

La empresa no cuenta con integración de energías renovables, lo que implica una dependencia total de fuentes convencionales. Si bien la actual intensidad del consumo energético del proceso productivo podría limitar el impacto técnico de estas soluciones, existe una brecha estratégica relevante en términos de sostenibilidad, especialmente considerando las exigencias del cliente mayoritario el cuál tiene especial interés en la sostenibilidad de sus proveedores. La falta de iniciativas en este ámbito puede afectar la competitividad, la imagen corporativa y el cumplimiento de compromisos ambientales en el mediano y corto plazo.

## Recomendaciones

### Cambio de tarifa BT1

**Categoría inferida:** equipos_productivos

La tarifa BT1 corresponde a un suministro en baja tensión con cobro principalmente por energía consumida (kWh), sin diferenciación relevante por potencia demandada ni por bloques horarios.
Se recomienda cambio de tarifa a AT4.3 inicialmente, pero que requerirá análisis acabado por un especialista certificado SEC clase D o E.
Para un negocio tipo fábrica de alimentos como el analizado:
• Existe variabilidad horaria significativa en el consumo (picos en mañana y tarde), dependiendo de la demanda y producción.
• Se observan equipos de alta potencia (refrigeración, cocción, climatizado).
• Se mantiene también una carga base constante (refrigeración). Esto sugiere que BT1A no necesariamente refleja de forma eficiente la estructura real de consumo.

### División de medidores

**Categoría inferida:** tarifas

En paralelo a lo anterior, resulta fundamental abordar la actual configuración del sistema de medición mediante la separación de los consumos en medidores independientes. Se propone instalar al menos tres medidores diferenciados: uno exclusivo para la fábrica y uno para cada vivienda. Esta medida permitirá asignar correctamente los consumos, evitando subsidios cruzados entre el uso productivo y el residencial, y facilitando una mayor transparencia en la facturación eléctrica. Asimismo, la separación de medidores constituye una condición habilitante para que la fábrica pueda migrar a una tarifa industrial sin afectar el suministro de las viviendas, las cuales pueden mantenerse bajo una tarifa BT1 acorde a su perfil sin afectar las operaciones desagregadas de potencia de la tarifa de la fábrica.

### Uso diferenciado de refrigeración

**Categoría inferida:** refrigeracion

Se recomienda implementar una gestión diferenciada de los equipos de refrigeración tipo perfil de producto y proceso de la sala de ventas , considerando su diseño, función y condiciones óptimas de operación, con el fin de mejorar la eficiencia energética y preservar la calidad de los productos.
Las vitrinas refrigeradas están diseñadas principalmente para:
• Exhibición comercial de productos .
• Mantención de alimentos de consumo inmediato o venta en el corto plazo.
Estos equipos no deben utilizarse como equipos de almacenamiento de largo plazo , ya que presentan mayor intercambio térmico con el ambiente (aperturas frecuentes, menor hermeticidad). También estos presentan menor capacidad de control térmico homogéneo que cámaras o refrigeradores cerrados.
Su uso indebido incrementa el consumo energético y puede afectar la inocuidad de los alimentos.
Se debe disponer de equipos específicos para almacenamiento (cámaras frigoríficas o refrigeradores cerrados) para productos que requieran conservación prolongada.

### Mejora del proceso de congelado y refrigerado

**Categoría inferida:** equipos_productivos

Para el mediano plazo , y bajo una planificación estratégica de crecimiento de la empresa, se propone la mejora futura de un sistema integrado de congelación mediante cámaras de congelado estáticas optimizadas o túneles de congelación de tipo dinámico (blast freezer o túnel continuo). Para productos de pastelería, donde es clave preservar la textura, humedad y estructura, se recomienda priorizar soluciones de congelado rápido que minimicen la formación de cristales de hielo grandes, asegurando así la calidad final.
En una primera etapa, se sugiere la instalación de un equipo compacto tipo “blast freezer”, diseñado para congelación rápida por aire forzado, con capacidad ajustada a la producción diaria actual. Este sistema debe ser dimensionado en base a variables como kilogramos por hora, temperatura de entrada del producto, temperatura objetivo y tiempos de proceso requeridos. Un correcto dimensionamiento permitirá evitar tanto subutilización como sobrecarga del equipo, optimizando el consumo energético y la vida útil del sistema.

### Configuración operativa de refrigerados

**Categoría inferida:** refrigeracion

Se recomienda ajustar los parámetros de operación de las vitrinas en función de condiciones estacionales y ciclos de uso:
 Ajuste por temporada 
- Verano / altas temperaturas: Incrementar capacidad de refrigeración (setpoint más exigente dentro de rango seguro).
- Verificar sellos, cortinas de aire y correcto funcionamiento de condensadores.
- Invierno / bajas temperaturas: Reducir la potencia de refrigeración cuando sea posible y ajustar setpoints para evitar sobreenfriamiento y consumo innecesario.
 Ajuste por ciclo día–noche 
- Horario de atención (día): 
- Operación a capacidad nominal , asegurando temperatura de conservación y correcta exhibición.
- Horario no operativo (noche): 
Aplicar modo ahorro energético , mediante el incremento controlado del setpoint (sin comprometer la cadena de frío). Uso de cubiertas o cortinas térmicas y reducción de iluminación interna de vitrinas que no se estén utilizando.
 Se recomienda ajuste de setpoint por tipo de equipo: 
- Refrigeradores: mantener entre 2°C y 5°C .
- Congeladores: entre -18°C y -20°C .
- Evitar configuraciones más bajas, ya que aumentan innecesariamente el consumo energético sin beneficios sanitarios relevantes.

### Implementación de un sistema de gestión energética básica e indicadores de gestión

**Categoría inferida:** gestion_energetica

Se propone avanzar progresivamente hacia la implementación de un sistema básico de gestión energética adaptado a la escala de la empresa. En primer lugar, es fundamental formalizar la gestión mediante la designación de un responsable energético (aunque sea a tiempo parcial) que centralice la información, coordine acciones y establezca objetivos claros de reducción de consumo. Este rol puede ser asumido por un miembro del equipo con capacitación específica, evitando la necesidad de incorporar inicialmente un especialista externo permanente.
En segundo lugar, se recomienda establecer una línea base de consumo energético y definir indicadores simples, como consumo mensual de energía por unidad de producción (kWh/kg de producto elaborado). Esto permitirá monitorear el desempeño en el tiempo y evaluar el impacto de las medidas implementadas. Complementariamente, se sugiere llevar un registro sistemático de consumos eléctricos y de combustibles, idealmente con cierta desagregación por áreas o equipos críticos.
A mediano plazo, se podría evaluar la adopción de estándares más formales como la norma ISO 50001 en una versión simplificada o adaptada, lo que permitiría consolidar una cultura energética organizacional, mejorar la eficiencia de manera sostenida y eventualmente reducir costos operacionales.

### Gestión de la cadena de refrigeración y congelados

**Categoría inferida:** gestion_operacional

Se recomienda documentar formalmente los procedimientos de operación por etapa productiva, definiendo setpoints óptimos para cada tipo de producto y proceso, como referencia entre -7° a 0° para refrigerados, y -20° a -18°C para congelados, o según corresponda las definiciones del encargado del proceso de producción. Incorporar un registro simple de temperaturas y funcionamiento (manual o digital) permitirá monitorear desviaciones. Asimismo, se sugiere establecer indicadores básicos como consumo energético por hora de operación o por volumen refrigerado. Complementariamente, implementar capacitación estructurada (no solo básica) y estandarizar prácticas operativas asegurará consistencia. A mediano plazo, la incorporación de controles automáticos o dataloggers facilitará el seguimiento continuo y la optimización del desempeño energético.

### Estrategia de sostenibilidad mediante Energías Renovables

**Categoría inferida:** ernc

Se propone evaluar la implementación de un sistema fotovoltaico térmico de pequeña/mediana escala para autoconsumo, orientado principalmente a cubrir consumos base (iluminación, refrigeración en régimen estable y equipos auxiliares). Esta solución permite generar un aporte parcial pero visible, alineado con objetivos de sostenibilidad y reducción de huella de carbono.
Complementariamente, se recomienda integrar esta iniciativa dentro de una estrategia comunicacional simple (etiquetado interno, información a clientes) que refuerce el compromiso ambiental de la empresa, mediante apoyo de CDN Sercotec. A nivel técnico, es clave realizar un dimensionamiento acorde a la demanda real y evaluar opciones modulares que permitan futuras ampliaciones. De este modo, aunque el porcentaje de cobertura sea limitado, el impacto en imagen, cumplimiento de requisitos y proyección sostenible puede resultar significativo.

## Texto completo (datos personales redactados)

      Vijon Pastelería            
 Vijon Pastelería
 
       Fecha   June 17, 2026 2:16 PM  
     Negocio   Alimentos  
     Grado consumos   Intensivo  
     Usuario  Victor Anibal Farias Jil 
     Teléfono   [teléfono redactado]  
     Correo electrónico   [correo redactado]  
     Contraparte   CND Sercotec Viña del Mar  
           
      

 ACTA de seguimiento Asesoría/Mentoría
 Información del contacto y cliente (negocio)
    Nombre del contacto  Victor Farias Jil  RUT  [RUT redactado] 
  Nombre del negocio  Vijon Pastelería  ROL   
  Asesor asignado  Carlos Campos N  Servicio  Seremi Energía 
   Descripción
 Vijon Pastelería es un establecimiento del rubro alimenticio ubicado en Viña del Mar, dedicado a la  elaboración artesanal de productos de pastelería, repostería y banquetería , incluyendo tortas, postres, galletas y preparaciones personalizadas.  Desde el punto de vista energético, su operación combina características de  cocina productiva y pequeña planta elaboradora , con consumos asociados a procesos térmicos, eléctricos y de refrigeración. El consumo energético se compone principalmente de energía eléctrica y, eventualmente, combustibles térmicos (gas licuado GLP), distribuidos en las siguientes etapas productivas como procesos de producción, refrigeración y conservación y servicios auxiliares como iluminación, climatización, lavado, administrativos y otros.
  Hallazgos
             Referencia     Servicio     Descripción 
     Tarifa domiciliaria    refrigeración   El cliente cuenta con una unidad que cuenta con  tarifa BT1, en el cual se integran viviendas de uso domiciliario .  Se sugiere que  podría no estar en la categoría tarifaria más adecuada para su perfil de consumo . La tarifa BT1A está diseñada típicamente para clientes con  bajos niveles de consumo y sin gestión de demanda , por lo que no considera señales de precio diferenciadas por horario ni permite optimizar costos mediante la gestión de carga. A medida que el consumo aumenta, como en este caso, es probable que el cliente esté  pagando un costo unitario de energía menos competitivo  en comparación con otras tarifas disponibles para mayores consumos. 
   Uso domiciliario    contractual   Existe un uso de una  tarifa BT1  para una  fábrica procesadora de alimentos , donde además se alimentan  dos viviendas , constituye una  falencia relevante en la gestión energética y contractual del suministro eléctrico . La tarifa BT1 está diseñada para  consumos residenciales o de muy baja escala , sin considerar perfiles de carga productivos ni usos intensivos de energía. 
   No cuenta con gestión energética profesionalizada ni indicadores de gestión energética    gestión energética   En gestión energética  una situación típica de instalaciones productivas de menor escala: dispone de ciertas prácticas de sensibilización energética impulsadas directamente por los dueños, pero carece de un sistema formal y estructurado de gestión energética. Esta condición implica que, si bien existe conciencia respecto al uso eficiente de la energía, las acciones implementadas son esporádicas, no sistemáticas y sin seguimiento técnico que permita evaluar su impacto real. En consecuencia, es probable que existan ineficiencias operativas, especialmente en procesos intensivos en energía como la cocción (hornos), refrigeración, climatización y uso de equipos auxiliares.
Desde una perspectiva técnica, la ausencia de una gestión profesionalizada se traduce en la falta de indicadores clave de desempeño energético, inexistencia de líneas base, y una limitada capacidad de identificar consumos anómalos o oportunidades de mejora.  
   Gestión de la cadena de refrigeración y congelados    refrigeración   La empresa presenta una gestión operativa de los sistemas de refrigeración basada en conocimientos en base a la experiencia del personal y los dueños. Pero este no cuenta con respaldo documental ni control formal de parámetros críticos. La ausencia de una sistematización de indicadores de setpoints (temperaturas, ciclos, tiempos de descongelamiento) impide verificar si los equipos están operando en condiciones óptimas o sobredimensionadas. Además, aunque existe un uso diferenciado según la etapa de manufactura, este no podría estar estandarizado durante la operación anual, lo que puede generar inconsistencias térmicas, sobreconsumo energético y potenciales riesgos. Hay dependencia de la experiencia operativa más que de una gestión técnica sistemática. 
   Energías Renovables    energías renovables   La empresa no cuenta con integración de energías renovables, lo que implica una dependencia total de fuentes convencionales. Si bien la actual intensidad del consumo energético del proceso productivo podría limitar el impacto técnico de estas soluciones, existe una brecha estratégica relevante en términos de sostenibilidad, especialmente considerando las exigencias del cliente mayoritario el cuál tiene especial interés en la sostenibilidad de sus proveedores. La falta de iniciativas en este ámbito puede afectar la competitividad, la imagen corporativa y el cumplimiento de compromisos ambientales en el mediano y corto plazo. 
  



  Recomendaciones
            Medida     Recomendación 
     Cambio de tarifa BT1   La tarifa  BT1  corresponde a un suministro en baja tensión con cobro principalmente por energía consumida (kWh), sin diferenciación relevante por potencia demandada ni por bloques horarios.
Se recomienda cambio de tarifa a AT4.3 inicialmente, pero que requerirá análisis acabado por un especialista certificado SEC clase D o E.
Para un negocio tipo fábrica de alimentos como el analizado:
• Existe  variabilidad horaria significativa en el consumo  (picos en mañana y tarde), dependiendo de la demanda y producción.
• Se observan  equipos de alta potencia  (refrigeración, cocción, climatizado).
• Se mantiene también una  carga base constante  (refrigeración). Esto sugiere que BT1A no necesariamente refleja de forma eficiente la estructura real de consumo. 
   División de medidores   En paralelo a lo anterior, resulta fundamental abordar la actual configuración del sistema de medición mediante la separación de los consumos en medidores independientes. Se propone instalar al menos tres medidores diferenciados: uno exclusivo para la fábrica y uno  para cada vivienda. Esta medida permitirá asignar correctamente los consumos, evitando subsidios cruzados entre el uso productivo y el residencial, y facilitando una mayor transparencia en la facturación eléctrica. Asimismo, la separación de medidores constituye una condición habilitante para que la fábrica pueda migrar a una tarifa industrial sin afectar el suministro de las viviendas, las cuales pueden mantenerse bajo una tarifa BT1 acorde a su perfil sin afectar las operaciones desagregadas de potencia de la tarifa de la fábrica. 
   Uso diferenciado de refrigeración   Se recomienda implementar una  gestión diferenciada de los equipos de refrigeración tipo perfil de producto y proceso de la sala de ventas , considerando su diseño, función y condiciones óptimas de operación, con el fin de mejorar la eficiencia energética y preservar la calidad de los productos.
Las vitrinas refrigeradas están diseñadas principalmente para:
•  Exhibición comercial de productos .
•  Mantención de alimentos de consumo inmediato o venta en el corto plazo.
Estos equipos no deben utilizarse como equipos de almacenamiento de largo plazo , ya que presentan mayor intercambio térmico con el ambiente (aperturas frecuentes, menor hermeticidad). También estos presentan menor capacidad de control térmico homogéneo que cámaras o refrigeradores cerrados.
Su uso indebido incrementa el consumo energético y puede afectar la inocuidad de los alimentos.
Se debe disponer de  equipos específicos para almacenamiento  (cámaras frigoríficas o refrigeradores cerrados) para productos que requieran conservación prolongada.  
   Mejora del proceso de congelado y refrigerado   Para el mediano plazo , y bajo una planificación estratégica de crecimiento de la empresa, se propone la  mejora futura de un sistema integrado de congelación mediante cámaras de congelado estáticas optimizadas o túneles de congelación de tipo dinámico (blast freezer o túnel continuo). Para productos de pastelería, donde es clave preservar la textura, humedad y estructura, se recomienda priorizar soluciones de congelado rápido que minimicen la formación de cristales de hielo grandes, asegurando así la calidad final.
En una primera etapa, se sugiere la instalación de un equipo compacto tipo “blast freezer”, diseñado para congelación rápida por aire forzado, con capacidad ajustada a la producción diaria actual. Este sistema debe ser dimensionado en base a variables como kilogramos por hora, temperatura de entrada del producto, temperatura objetivo y tiempos de proceso requeridos. Un correcto dimensionamiento permitirá evitar tanto subutilización como sobrecarga del equipo, optimizando el consumo energético y la vida útil del sistema. 
   Configuración operativa de refrigerados   Se recomienda ajustar los parámetros de operación de las vitrinas en función de condiciones estacionales y ciclos de uso:
 Ajuste por temporada 
-  Verano / altas temperaturas:   Incrementar capacidad de refrigeración (setpoint más exigente dentro de rango seguro).
- Verificar sellos, cortinas de aire y correcto funcionamiento de condensadores.
-  Invierno / bajas temperaturas:  Reducir la potencia de refrigeración cuando sea posible y ajustar setpoints para evitar sobreenfriamiento y consumo innecesario.

 Ajuste por ciclo día–noche 
-  Horario de atención (día): 
- Operación a  capacidad nominal , asegurando temperatura de conservación y correcta exhibición.
-  Horario no operativo (noche): 

Aplicar  modo ahorro energético , mediante el incremento controlado del setpoint (sin comprometer la cadena de frío). Uso de cubiertas o cortinas térmicas y reducción de iluminación interna de vitrinas que no se estén utilizando.

 Se recomienda ajuste de setpoint por tipo de equipo: 
- Refrigeradores: mantener entre  2°C y 5°C .
- Congeladores: entre  -18°C y -20°C .
- Evitar configuraciones más bajas, ya que aumentan innecesariamente el consumo energético sin beneficios sanitarios relevantes. 
   Implementación de un sistema de gestión energética básica e indicadores de gestión.   Se propone avanzar progresivamente hacia la implementación de un sistema básico de gestión energética adaptado a la escala de la empresa. En primer lugar, es fundamental formalizar la gestión mediante la designación de un responsable energético (aunque sea a tiempo parcial) que centralice la información, coordine acciones y establezca objetivos claros de reducción de consumo. Este rol puede ser asumido por un miembro del equipo con capacitación específica, evitando la necesidad de incorporar inicialmente un especialista externo permanente.
En segundo lugar, se recomienda establecer una línea base de consumo energético y definir indicadores simples, como consumo mensual de energía por unidad de producción (kWh/kg de producto elaborado). Esto permitirá monitorear el desempeño en el tiempo y evaluar el impacto de las medidas implementadas. Complementariamente, se sugiere llevar un registro sistemático de consumos eléctricos y de combustibles, idealmente con cierta desagregación por áreas o equipos críticos.
A mediano plazo, se podría evaluar la adopción de estándares más formales como la norma ISO 50001 en una versión simplificada o adaptada, lo que permitiría consolidar una cultura energética organizacional, mejorar la eficiencia de manera sostenida y eventualmente reducir costos operacionales. 
   Gestión de la cadena de refrigeración y congelados   Se recomienda documentar formalmente los procedimientos de operación por etapa productiva, definiendo setpoints óptimos para cada tipo de producto y proceso, como referencia entre -7° a 0° para refrigerados, y -20° a -18°C para congelados, o según corresponda las definiciones del encargado del proceso de producción. Incorporar un registro simple de temperaturas y funcionamiento (manual o digital) permitirá monitorear desviaciones. Asimismo, se sugiere establecer indicadores básicos como consumo energético por hora de operación o por volumen refrigerado. Complementariamente, implementar capacitación estructurada (no solo básica) y estandarizar prácticas operativas asegurará consistencia. A mediano plazo, la incorporación de controles automáticos o dataloggers facilitará el seguimiento continuo y la optimización del desempeño energético. 
   Estrategia de sostenibilidad mediante Energías Renovables   Se propone evaluar la implementación de un sistema fotovoltaico térmico de pequeña/mediana escala para autoconsumo, orientado principalmente a cubrir consumos base (iluminación, refrigeración en régimen estable y equipos auxiliares). Esta solución permite generar un aporte parcial pero visible, alineado con objetivos de sostenibilidad y reducción de huella de carbono.
Complementariamente, se recomienda integrar esta iniciativa dentro de una estrategia comunicacional simple (etiquetado interno, información a clientes) que refuerce el compromiso ambiental de la empresa, mediante apoyo de CDN Sercotec. A nivel técnico, es clave realizar un dimensionamiento acorde a la demanda real y evaluar opciones modulares que permitan futuras ampliaciones. De este modo, aunque el porcentaje de cobertura sea limitado, el impacto en imagen, cumplimiento de requisitos y proyección sostenible puede resultar significativo. 
  



 Temas adicionales
 Se recomienda generar lazos de colaboración con instituciones educativas y centros de investigación especializados en tecnología de alimentos, con énfasis en productos del mar, con el fin de profundizar en estrategias avanzadas de conservación, aprovechando las redes de colaboración de CDN Sercotec Viña del Mar o la de sus colaboradores de la UNAB . Estas alianzas permitirían evaluar la existencia de brechas para eventuales incrementos marginales en las temperaturas de almacenamiento que no comprometan la inocuidad ni la calidad del producto, pero que contribuyan a mejorar la eficiencia energética de los procesos. No obstante, este tipo de ajustes requiere necesariamente de  estudios técnicos y validaciones científicas específicas , considerando la sensibilidad de los productos objetivos de la empresa , por lo que su implementación debe estar respaldada por conocimiento experto, ensayos controlados y  cumplimiento de normativas sanitarias vigente s.
 Acuerdos
 Se recomienda además realizar una  visita técnica en terreno , con el fin de inspeccionar directamente las condiciones de operación de los equipos e instalaciones, lo que permitirá  identificar oportunidades adicionales de mejora, validar los hallazgos detectados y proponer medidas específicas ajustadas a la realidad del establecimiento . Esta instancia resulta clave para complementar el análisis teórico con observaciones prácticas y avanzar hacia una gestión energética más eficiente.
 Información para proveedores de servicios eléctricos y energías renovables, en la sección de “información de utilidad” adjunta.
 Información adicional
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

     