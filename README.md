# EE Mentor

Aplicación de diagnóstico y generación de informes de eficiencia energética para MiPyMEs. Permite mantener la ficha de cada empresa, registrar visitas técnicas con una pauta estructurada, evaluar 10 dimensiones de desempeño energético y generar automáticamente un informe Markdown editable y exportable a HTML/PDF.

Todo el contenido vive en archivos locales (TOML + Markdown), sin base de datos ni servicios externos.

## Funcionalidades

- **Empresas**: ficha con RUT, rubro, ubicación, contacto, superficie, trabajadores y observaciones.
- **Visitas**: perfil energético, energéticos y costos, equipos, 10 secciones evaluadas de 0 a 5, hallazgos con evidencia, recomendaciones, acuerdos y próxima visita.
- **Puntajes**: promedio por sección y global con clasificación automática:
  - `0 – 1,5` Crítico · `1,6 – 2,5` Deficiente · `2,6 – 3,5` Aceptable · `3,6 – 4,5` Bueno · `4,6 – 5` Destacado
- **Informe automático** en Markdown con frontmatter YAML: perfil, evaluación, hallazgos agrupados, recomendaciones por costo, plan de acción, recursos y anexos.
- **Catálogos editables** de hallazgos, recomendaciones y recursos, con impacto, inversión, dificultad, prioridad, ahorro estimado y plazo.
- **Biblioteca de conocimiento**: importa los casos históricos en HTML, extrae hallazgos/recomendaciones, redacta datos personales y genera candidatos revisables que se aprueban hacia el catálogo.
- **Dashboard** con cartera, actividad mensual, rubros y hallazgos/recomendaciones más frecuentes.
- **Búsqueda** de empresas por nombre, RUT, rubro o comuna y filtros en catálogos.
- **Reutilización**: una nueva visita precarga la configuración de la última visita de la empresa.
- **Exportación**: Markdown descargable, HTML imprimible independiente y PDF vía impresión del navegador.

## Stack

- [Astro 5](https://astro.build/) con SSR (`@astrojs/node` standalone)
- TypeScript estricto
- Tailwind CSS v4
- Zod 4 para validación de formularios y archivos
- `smol-toml` para persistencia estructurada
- `marked` + `sanitize-html` para renderizar los informes

## Inicio rápido

```bash
npm install
npm run seed:catalogs   # catálogos base (hallazgos, recomendaciones, recursos)
npm run seed:demo       # empresas y visitas de ejemplo (opcional)
npm run dev             # http://localhost:4321
```

Para producción:

```bash
npm run build
npm start
```

### Variables de entorno

Copia `.env.example` a `.env` si necesitas rutas o nombres personalizados:

| Variable | Descripción | Default |
| --- | --- | --- |
| `EE_DATA_DIR` | Directorio raíz de datos | `./data` |
| `EE_KNOWLEDGE_DIR` | Carpeta con los HTML históricos | `./casos` |
| `EE_ASSESSOR_NAME` | Asesor propuesto en nuevas visitas | `Consultor Energético` |

## Estructura del proyecto

```
src/
  components/
    catalogos/      Formulario compartido de hallazgos y recomendaciones
    empresas/       Formulario de empresa
    ui/             Primitivas visuales (badges, cards, header, iconos…)
    visitas/        Pauta de visita y tarjetas de sección
  layouts/
    Layout.astro    Shell con navegación y estilos globales
  lib/
    config.ts       Rutas de datos, formato de fechas/montos y defaults
    schemas.ts      Esquemas Zod y enumeraciones del dominio (fuente única de tipos)
    form.ts         FormData → objeto anidado y selección de hallazgos/recomendaciones
    catalog-form.ts FormData de catálogos
    scoring.ts      Promedios y clasificación 0–5
    report.ts       Generador del informe Markdown
    markdown.ts     Render, frontmatter y HTML imprimible
    knowledge-import.mjs  Extracción de casos HTML y candidatos
    repositories.ts Punto único de acceso a datos (swap a SQLite)
    storage/        Implementaciones de archivos (empresas, catálogos, informes, conocimiento)
    services/       Analítica del dashboard y generación de informes
  pages/
    index.astro                      Dashboard
    empresas/…                       Listado, ficha, edición y visitas
    catalogos/…                      Catálogos y formularios
    biblioteca/…                     Fuentes y candidatos de conocimiento
    api/…                            Endpoints JSON para formularios
  scripts/app.ts    Comportamiento cliente: formularios, filas dinámicas, filtros, print
data/
  empresas/<EMP-ID>/metadata.toml
  empresas/<EMP-ID>/visita-NNN.toml
  empresas/<EMP-ID>/informes/visita-NNN.md
  catalogos/{hallazgos,recomendaciones,recursos}/*.toml
  biblioteca/{fuentes,candidatos,importaciones}/
casos/              HTML históricos usados por la importación
scripts/            Semillas, importación y smoke test
```

## Modelo de datos

### Empresa — `data/empresas/EMP-001/metadata.toml`

```toml
schema_version = 1
id = "EMP-001"
nombre = "Café Aurora"
rut = "76.482.193-5"
rubro = "Cafetería"
region = "Valparaíso"
comuna = "Viña del Mar"
trabajadores = 5
superficie_m2 = 72
created_at = "2026-06-10T10:00:00.000Z"
updated_at = "2026-06-10T10:00:00.000Z"
```

### Visita — `data/empresas/EMP-001/visita-001.toml`

Incluye `fecha`, `asesor`, `grado_consumo`, `descripcion_perfil`, `energeticos[]`, `usos_finales[]`, `equipos[]`, `secciones` (con `puntaje`, `observaciones` y atributos propios de cada dimensión), `hallazgos[]`, `recomendaciones[]`, `acuerdos[]` y `proxima_visita`.

### Informe — `data/empresas/EMP-001/informes/visita-001.md`

Markdown con frontmatter YAML (`empresa`, `visita`, `fecha`, `puntaje_global`, `clasificacion`, `hallazgos`, `recomendaciones`, `version`). Se regenera al crear/editar la visita o manualmente desde la vista del informe.

### Catálogos — `data/catalogos/*/*.toml`

Cada ítem tiene `codigo`, `titulo`, `categoria`, `descripcion`, `activo`, `origen` y los atributos propios del tipo. Los IDs se derivan del código (`HAL-…`, `REC-…`) y se evita sobrescribir con sufijos numéricos.

## Biblioteca de conocimiento

1. Coloca los HTML exportados de las mentorías en `casos/` (o `EE_KNOWLEDGE_DIR`).
2. Ejecuta `npm run import:knowledge` o usa **Importar documentos** en `/biblioteca`.
3. El importador:
   - detecta tablas de hallazgos y recomendaciones,
   - infiere categoría, rubro, impacto e inversión,
   - redacta correos, teléfonos y RUT del texto,
   - guarda la fuente en Markdown + TOML,
   - crea/actualiza candidatos sin perder el estado de revisión previo.
4. En `/biblioteca` revisa cada candidato y apruébalo o descártalo. Al aprobar se crea un ítem `KB-…` / `REC-KB-…` en el catálogo.

## Exportación y PDF

- **Markdown**: `/api/empresas/<id>/visitas/<visitaId>/markdown`
- **HTML independiente**: `/api/empresas/<id>/visitas/<visitaId>/html`
- **PDF**: desde la vista del informe, botón **Imprimir / PDF** → “Guardar como PDF” del navegador. El HTML imprimible incluye reglas `@media print`.

## Preparado para SQLite

Las vistas y servicios dependen de interfaces (`EmpresaRepository`, `VisitaRepository`, `CatalogoRepository`, `InformeRepository`, `ConocimientoRepository`) instanciadas en `src/lib/repositories.ts`. Para migrar, implementa esas interfaces sobre SQLite y reemplaza las instancias; el resto de la aplicación no cambia.

## Scripts

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y servidor standalone |
| `npm run check` | Type-check de Astro/TypeScript |
| `npm run seed:catalogs` | Carga/actualiza catálogos base |
| `npm run seed:demo` | Carga empresas y visitas de ejemplo |
| `npm run import:knowledge` | Importa casos HTML a la biblioteca |
| `npm run smoke` | Valida TOML, render de informes y flujo de importación |

> Los datos de ejemplo usan empresas ficticias para no exponer información real.
