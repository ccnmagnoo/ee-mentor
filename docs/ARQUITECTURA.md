# Arquitectura

## Principios

1. **Datos desacoplados de las vistas.** Las páginas Astro y los endpoints solo consumen repositorios; no leen archivos directamente (excepto la lectura del Markdown de fuentes, encapsulada en `src/lib/storage/conocimiento.ts`).
2. **Un único contrato de dominio.** `src/lib/schemas.ts` define enums, esquemas Zod y tipos inferidos. Cualquier cambio de estructura parte ahí.
3. **Archivos portables.** TOML para datos estructurados (editable a mano, diffeable) y Markdown con frontmatter para informes y fuentes.
4. **Server-first.** Astro SSR con endpoints JSON y un script cliente pequeño para formularios, filas dinámicas y filtros.

## Capas

```
Páginas / API  →  Servicios  →  Repositorios  →  Storage (archivos)
       ↓              ↓
   Componentes     Esquemas Zod / dominio
```

- **Páginas (`src/pages`)**: renderizan datos y montan formularios.
- **API (`src/pages/api`)**: reciben `FormData`, validan con los parsers de `form.ts` / `catalog-form.ts`, llaman al repositorio y responden `{ ok, message, redirect, data }`.
- **Servicios (`src/lib/services`)**: analítica del dashboard y orquestación del informe (`construirInforme`).
- **Repositorios (`src/lib/repositories.ts`)**: singletons que implementan las interfaces de `storage/*`.
- **Storage**: lectura/escritura atómica de TOML y Markdown (`writeTomlFile` usa archivo temporal + rename).

## Flujo de una visita

1. `POST /api/empresas/[id]/visitas` parsea el formulario (`parseVisitaForm`).
2. `visitas.create` valida con `VisitaBodySchema`, asigna `VIS-NNN` y escribe `visita-NNN.toml`.
3. `construirInforme` recalcula puntajes (`scoring.ts`), resuelve catálogos y genera Markdown (`report.ts`).
4. El informe se guarda por visita y también como `informe.md` (último).
5. La vista del informe puede regenerarlo con `POST …/regenerar`.

## Puntajes

`evaluarSecciones` recorre las 10 secciones, excluye las que tienen puntaje `0` y promedia el resto. `clasificarPuntaje` aplica los cortes:

| Rango | Etiqueta | Tono |
| --- | --- | --- |
| 0,0 – 1,5 | Crítico | rose |
| 1,6 – 2,5 | Deficiente | orange |
| 2,6 – 3,5 | Aceptable | amber |
| 3,6 – 4,5 | Bueno | emerald |
| 4,6 – 5,0 | Destacado | brand |

## Importación de conocimiento

`src/lib/knowledge-import.mjs` es independiente del framework para poder ejecutarse también por CLI:

1. lee los `.html` de `casos/` (omite `resumen*`),
2. extrae tablas con `collection-title` que contengan “Hallazgo” o “Recomendaci”,
3. infiere categoría por palabras clave, rubro, impacto e inversión,
4. redacta PII con regex,
5. escribe `data/biblioteca/fuentes/<id>.md` + `.toml`,
6. hace *upsert* de candidatos preservando `estado`, `created_at` y acumulando `origen`,
7. guarda un resumen JSON de la importación.

La aprobación (`POST /api/biblioteca/candidatos/[id]`) crea el ítem con prefijo `KB-` o `REC-KB-` y marca el candidato como `aprobado`.

## Migración a SQLite

1. Crear `src/lib/storage/sqlite/*.ts` implementando `EmpresaRepository`, `VisitaRepository`, `CatalogoRepository`, `InformeRepository` y `ConocimientoRepository`.
2. Mantener exactamente las firmas actuales.
3. Cambiar las instancias exportadas en `src/lib/repositories.ts`.
4. Opcional: mover los informes a columnas `TEXT` o mantenerlos en disco para conservar la portabilidad del Markdown.

No es necesario tocar páginas, endpoints ni componentes.

## Decisiones técnicas

- **TOML sobre JSON**: comentarios, orden legible y edición manual segura.
- **Markdown con frontmatter**: el informe es portable, versionable y editable sin la aplicación.
- **Sin framework cliente**: el JavaScript compartido (~230 líneas) cubre formularios dinámicos, filtros y confirmaciones, reduciendo el peso y la complejidad.
- **Zod con `preprocess`**: tolera formularios HTML (strings vacíos, checkboxes ausentes) y valida tanto entradas como archivos en disco.
