import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse, stringify } from 'smol-toml';

const CATEGORIA_KEYWORDS = [
  ['iluminacion', ['ilumin', 'luminaria', 'led', 'fluorescente', 'halogen', 'ampolleta', 'lámpara', 'lampara']],
  ['congelacion', ['congel', 'freezer', 'escarcha', 'ultracongel']],
  ['refrigeracion', ['refrig', 'frío', 'frio', 'vitrina', 'cámara', 'camara', 'mesón', 'meson', 'cooler', 'condensador', 'serpentín', 'serpentin']],
  ['climatizacion', ['climatiz', 'calefacc', 'aire acondicionado', 'acondicionamiento', 'ventil', 'split', 'estufa', 'temperatura ambiente']],
  ['coccion', ['cocina', 'cocción', 'coccion', 'horno', 'plancha', 'quemador', 'percolador', 'freidora', 'cafetera', 'olla']],
  ['acs', ['agua caliente', 'calefón', 'calefon', 'termo eléctrico', 'termo electrico', ' acs', 'sanitaria']],
  ['calderas', ['caldera', 'radiador', 'calefacción central', 'calefaccion central']],
  ['motores', ['motor', 'bomba', 'variador', 'correa', 'compresor']],
  ['equipos_productivos', ['equipo productivo', 'producción', 'produccion', 'aire comprimido', 'máquina', 'maquina']],
  ['envolvente', ['envolvente', 'ventana', 'puerta', 'dvh', 'doble vidrio', 'aislación', 'aislacion', 'aislamiento', 'infiltra', 'burlete', 'sello']],
  ['gestion_energetica', ['gestión energ', 'gestion energ', 'gestión de la energ', 'sistema de gestión', 'indicador', 'kpi', 'monitoreo', 'línea base', 'linea base']],
  ['gestion_operacional', ['capacitación', 'capacitacion', 'operación', 'operacion', 'buenas prácticas', 'buenas practicas', 'horario', 'protocolo']],
  ['tarifas', ['tarifa', 'facturación', 'facturacion', 'bt1', 'bt4', 'at4', 'reactiva', 'factor de potencia', 'medidor', 'remarcador']],
  ['potencia_contratada', ['potencia contratada', 'demanda máxima', 'demanda maxima']],
  ['ernc', ['renovable', 'solar', 'fotovolt', 'ernc', 'autoconsumo']],
  ['mantencion', ['mantención', 'mantencion', 'mantenimiento', 'limpieza']],
  ['ventilacion', ['extracción', 'extraccion', 'campana', 'ventilación', 'ventilacion']],
];

const RUBRO_KEYWORDS = [
  ['Cafetería', ['café', 'cafe', 'cafetería', 'cafeteria', 'coffee']],
  ['Pastelería', ['pasteler', 'panader', 'boulanger', 'masitas']],
  ['Pizzería', ['pizzer', 'pizza']],
  ['Hotel pequeño', ['hotel', 'hostal', 'b&b', 'bed and breakfast']],
  ['Restaurante', ['restaurant', 'restoran', 'comida', 'empanada']],
  ['Comercio minorista', ['minimarket', 'almacén', 'almacen', 'comercio', 'supermercado', 'ecosuper']],
];

const DEFAULT_OPTIONS = {
  dataDir: path.join(process.cwd(), 'data'),
  sourceDir: path.join(process.cwd(), 'casos'),
  logger: console,
};

export async function importKnowledge(options = {}) {
  const { dataDir, sourceDir, logger } = { ...DEFAULT_OPTIONS, ...options };
  const fuentesDir = path.join(dataDir, 'biblioteca', 'fuentes');
  const candidatosDir = path.join(dataDir, 'biblioteca', 'candidatos');
  const importacionesDir = path.join(dataDir, 'biblioteca', 'importaciones');
  await fs.mkdir(fuentesDir, { recursive: true });
  await fs.mkdir(candidatosDir, { recursive: true });
  await fs.mkdir(importacionesDir, { recursive: true });

  const entries = await fs.readdir(sourceDir).catch(() => []);
  const htmlFiles = entries.filter((name) => name.toLowerCase().endsWith('.html'));

  const resumen = {
    ok: true,
    fuente_dir: sourceDir,
    fuentes: 0,
    nuevos_candidatos: 0,
    candidatos_actualizados: 0,
    total_candidatos: 0,
    errores: [],
    detalle: [],
  };

  if (!htmlFiles.length) {
    return {
      ...resumen,
      ok: false,
      errores: [`No se encontraron archivos HTML en ${sourceDir}`],
    };
  }

  const candidateIds = new Set();

  for (const fileName of htmlFiles) {
    // El resumen general no es un caso: se usa como referencia, no como fuente.
    if (/resumen/i.test(fileName)) continue;
    try {
      const html = await fs.readFile(path.join(sourceDir, fileName), 'utf8');
      const extracted = extractCase(html, fileName);
      const hash = crypto.createHash('sha256').update(html).digest('hex').slice(0, 16);
      const id = `FUE-${slugify(path.basename(fileName, '.html')).slice(0, 48)}`;
      const importedAt = new Date().toISOString();

      const markdown = buildSourceMarkdown(extracted, fileName, hash);
      await fs.writeFile(path.join(fuentesDir, `${id}.md`), markdown, 'utf8');

      const fuente = {
        id,
        titulo: extracted.titulo,
        archivo: `${id}.md`,
        rubro: extracted.rubro,
        fecha: extracted.fecha,
        hash,
        imported_at: importedAt,
        hallazgos_count: extracted.hallazgos.length,
        recomendaciones_count: extracted.recomendaciones.length,
        texto: '',
      };
      await fs.writeFile(path.join(fuentesDir, `${id}.toml`), `${stringify(fuente)}\n`, 'utf8');
      resumen.fuentes += 1;

      for (const hallazgo of extracted.hallazgos) {
        const candidate = buildCandidate('hallazgo', hallazgo, id, extracted.rubro);
        const result = await upsertCandidate(candidatosDir, candidate);
        if (result === 'nuevo') resumen.nuevos_candidatos += 1;
        if (result === 'actualizado') resumen.candidatos_actualizados += 1;
        candidateIds.add(candidate.id);
      }
      for (const recomendacion of extracted.recomendaciones) {
        const candidate = buildCandidate('recomendacion', recomendacion, id, extracted.rubro);
        const result = await upsertCandidate(candidatosDir, candidate);
        if (result === 'nuevo') resumen.nuevos_candidatos += 1;
        if (result === 'actualizado') resumen.candidatos_actualizados += 1;
        candidateIds.add(candidate.id);
      }

      resumen.detalle.push({
        archivo: fileName,
        titulo: extracted.titulo,
        rubro: extracted.rubro,
        hallazgos: extracted.hallazgos.length,
        recomendaciones: extracted.recomendaciones.length,
      });
      logger.info?.(`[knowledge] ${fileName}: ${extracted.hallazgos.length} hallazgos, ${extracted.recomendaciones.length} recomendaciones`);
    } catch (error) {
      resumen.errores.push(`${fileName}: ${error.message}`);
      logger.warn?.(`[knowledge] Error en ${fileName}: ${error.message}`);
    }
  }

  resumen.total_candidatos = candidateIds.size;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  await fs.writeFile(
    path.join(importacionesDir, `${stamp}.json`),
    JSON.stringify(resumen, null, 2),
    'utf8',
  );
  return resumen;
}

export function extractCase(html, fileName = 'documento.html') {
  const titleTag = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '';
  const titulo =
    decodeEntities(stripTags(titleTag)).trim() ||
    path.basename(fileName, '.html').replace(/\s+[0-9a-f]{20,}$/i, '').trim();

  const fullText = decodeEntities(stripTags(html.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ')));
  const rubro = inferRubro(`${titulo} ${fullText.slice(0, 2500)}`);
  const fechaMatch = /Fecha\s+([A-Z][a-z]+ \d{1,2}, \d{4})/.exec(fullText);
  const fecha = fechaMatch?.[1] ?? '';

  const tables = extractCollections(html);
  const hallazgos = tables
    .filter((table) => /hallazgo/i.test(table.titulo))
    .flatMap((table) => table.rows)
    .map((row) => {
      const [referencia = '', servicio = '', descripcion = ''] = row;
      return {
        titulo: cleanTitle(referencia) || cleanTitle(descripcion).slice(0, 80),
        servicio,
        descripcion: cleanText(descripcion),
        categoria: inferCategoria(`${referencia} ${servicio} ${descripcion}`),
      };
    })
    .filter((item) => item.titulo && item.descripcion.length > 40);

  const recomendaciones = tables
    .filter((table) => /recomendaci/i.test(table.titulo))
    .flatMap((table) => table.rows)
    .map((row) => {
      const [nombre = '', texto = ''] = row;
      const categoria = inferCategoria(`${nombre} ${texto}`);
      return {
        titulo: cleanTitle(nombre) || cleanTitle(texto).slice(0, 80),
        servicio: categoria,
        descripcion: cleanText(texto),
        categoria,
      };
    })
    .filter((item) => item.titulo && item.descripcion.length > 40);

  return {
    titulo,
    rubro,
    fecha,
    hallazgos: dedupe(hallazgos),
    recomendaciones: dedupe(recomendaciones),
    texto: redact(fullText),
  };
}

function extractCollections(html) {
  const collections = [];
  const regex =
    /<h4 class="collection-title">([\s\S]*?)<\/h4>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/gi;
  for (const match of html.matchAll(regex)) {
    const titulo = cleanText(decodeEntities(stripTags(match[1])));
    const rows = [];
    for (const rowMatch of match[2].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = [];
      for (const cellMatch of rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)) {
        cells.push(cleanText(decodeEntities(stripTags(cellMatch[1]))));
      }
      if (cells.length) rows.push(cells);
    }
    if (rows.length) collections.push({ titulo, rows });
  }
  return collections;
}

function stripTags(value) {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&Ntilde;/g, 'Ñ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

function cleanText(value) {
  return value.replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
}

function cleanTitle(value) {
  return cleanText(value).replace(/\s+/g, ' ').replace(/[.:;]$/, '').slice(0, 120);
}

function inferCategoria(text) {
  const normalized = normalizeText(text);
  let best = { categoria: 'otros', score: 0 };
  for (const [categoria, keywords] of CATEGORIA_KEYWORDS) {
    let score = 0;
    for (const keyword of keywords) {
      if (normalized.includes(normalizeText(keyword))) score += keyword.length;
    }
    if (score > best.score) best = { categoria, score };
  }
  return best.categoria;
}

function inferRubro(text) {
  const normalized = normalizeText(text);
  for (const [rubro, keywords] of RUBRO_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(normalizeText(keyword)))) return rubro;
  }
  return 'No especificado';
}

function inferImpacto(text) {
  const normalized = normalizeText(text);
  if (/(critic|seguridad|perdida|riesgo|penalizacion|incumplimiento)/.test(normalized)) return 'alto';
  if (/(ineficien|sobreconsumo|deficien|sin manten|antiguo)/.test(normalized)) return 'medio';
  return 'medio';
}

function inferInversion(text, tipo) {
  const normalized = normalizeText(text);
  if (tipo === 'hallazgo') return 'baja';
  if (/(sin inversion|bajo costo|gestion|capacitacion|protocolo|mantencion|limpieza|ajuste|sello|burlete)/.test(normalized)) {
    return 'baja';
  }
  if (/(fotovolt|solar term|dvh|doble vidrio|renovacion|reemplazo|inversor|equipo nuevo|caldera)/.test(normalized)) {
    return 'alta';
  }
  return 'media';
}

function buildCandidate(tipo, item, fuenteId, rubro) {
  const slug = slugify(item.titulo).slice(0, 42) || crypto.randomUUID().slice(0, 8);
  const id = `CAN-${tipo === 'hallazgo' ? 'HAL' : 'REC'}-${slug}`;
  const now = new Date().toISOString();
  return {
    id,
    tipo,
    titulo: item.titulo,
    descripcion: item.descripcion,
    categoria: item.categoria,
    impacto: inferImpacto(item.descripcion),
    inversion: inferInversion(item.descripcion, tipo),
    dificultad: tipo === 'hallazgo' ? 'baja' : inferInversion(item.descripcion, tipo) === 'alta' ? 'alta' : 'media',
    origen: `casos:${rubro}`,
    fuente_id: fuenteId,
    estado: 'pendiente',
    created_at: now,
  };
}

async function upsertCandidate(dir, candidate) {
  const file = path.join(dir, `${candidate.id}.toml`);
  const existingRaw = await fs.readFile(file, 'utf8').catch(() => null);
  if (!existingRaw) {
    await fs.writeFile(file, `${stringify(candidate)}\n`, 'utf8');
    return 'nuevo';
  }
  let existing;
  try {
    existing = parse(existingRaw);
  } catch {
    existing = null;
  }
  if (!existing) return 'sin_cambios';
  const merged = {
    ...candidate,
    estado: existing.estado ?? 'pendiente',
    created_at: existing.created_at ?? candidate.created_at,
    origen: mergeOrigins(String(existing.origen ?? ''), candidate.origen),
  };
  await fs.writeFile(file, `${stringify(merged)}\n`, 'utf8');
  return 'actualizado';
}

function mergeOrigins(previous, next) {
  const values = new Set(
    `${previous};${next}`
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean),
  );
  return [...values].slice(0, 6).join('; ');
}

function dedupe(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.categoria}:${slugify(item.titulo)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function buildSourceMarkdown(extracted, fileName, hash) {
  const lines = [
    `# ${extracted.titulo}`,
    '',
    `> Fuente importada desde \`${fileName}\` · hash \`${hash}\``,
    '',
    `- **Rubro inferido:** ${extracted.rubro}`,
    `- **Fecha del documento:** ${extracted.fecha || 'No identificada'}`,
    '',
    '## Hallazgos',
    '',
  ];
  if (!extracted.hallazgos.length) lines.push('_Sin hallazgos estructurados._', '');
  for (const hallazgo of extracted.hallazgos) {
    lines.push(`### ${hallazgo.titulo}`, '', `**Categoría inferida:** ${hallazgo.categoria}`, '', hallazgo.descripcion, '');
  }
  lines.push('## Recomendaciones', '');
  if (!extracted.recomendaciones.length) lines.push('_Sin recomendaciones estructuradas._', '');
  for (const reco of extracted.recomendaciones) {
    lines.push(`### ${reco.titulo}`, '', `**Categoría inferida:** ${reco.categoria}`, '', reco.descripcion, '');
  }
  lines.push('## Texto completo (datos personales redactados)', '', extracted.texto);
  return lines.join('\n');
}

function redact(text) {
  return text
    .replace(/[\w.+-]+@[\w.-]+\.\w+/g, '[correo redactado]')
    .replace(/\+?56\s?9\s?\d{4}\s?\d{4}/g, '[teléfono redactado]')
    .replace(/\b\d{1,2}\.\d{3}\.\d{3}-[\dkK]\b/g, '[RUT redactado]');
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
