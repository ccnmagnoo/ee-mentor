/**
 * Smoke test sin servidor: valida la integridad de los datos TOML, la estructura
 * de los informes Markdown y el flujo de importación de conocimiento.
 *
 * Uso: npm run smoke
 */
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'smol-toml';
import { importKnowledge } from '../src/lib/knowledge-import.mjs';

const DATA = process.env.EE_DATA_DIR ? path.resolve(process.env.EE_DATA_DIR) : path.resolve('data');
const CASOS = process.env.EE_KNOWLEDGE_DIR ? path.resolve(process.env.EE_KNOWLEDGE_DIR) : path.resolve('casos');

let checks = 0;
const errors = [];

function check(condition, message) {
  checks += 1;
  if (!condition) errors.push(message);
}

async function readToml(file) {
  try {
    return parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`TOML inválido ${path.relative(DATA, file)}: ${error.message}`);
    return null;
  }
}

async function listFiles(dir, extension) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(extension)).map((entry) => path.join(dir, entry.name));
}

async function listDirs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(dir, entry.name));
}

async function validateCatalogs() {
  const hallazgos = await listFiles(path.join(DATA, 'catalogos', 'hallazgos'), '.toml');
  const recomendaciones = await listFiles(path.join(DATA, 'catalogos', 'recomendaciones'), '.toml');
  const recursos = await listFiles(path.join(DATA, 'catalogos', 'recursos'), '.toml');

  for (const file of hallazgos) {
    const item = await readToml(file);
    if (!item) continue;
    check(Boolean(item.id && item.codigo && item.titulo && item.categoria), `Hallazgo incompleto: ${path.basename(file)}`);
    check(['critico', 'alto', 'medio', 'bajo'].includes(item.impacto), `Impacto inválido en ${path.basename(file)}`);
  }
  for (const file of recomendaciones) {
    const item = await readToml(file);
    if (!item) continue;
    check(Boolean(item.id && item.codigo && item.titulo && item.categoria), `Recomendación incompleta: ${path.basename(file)}`);
    check(['baja', 'media', 'alta'].includes(item.inversion), `Inversión inválida en ${path.basename(file)}`);
    check(['baja', 'media', 'alta'].includes(item.prioridad), `Prioridad inválida en ${path.basename(file)}`);
  }
  for (const file of recursos) {
    const item = await readToml(file);
    if (!item) continue;
    check(Boolean(item.id && item.nombre && item.url), `Recurso incompleto: ${path.basename(file)}`);
  }

  console.log(`  Catálogos: ${hallazgos.length} hallazgos, ${recomendaciones.length} recomendaciones, ${recursos.length} recursos`);
}

async function validateEmpresas() {
  const dirs = await listDirs(path.join(DATA, 'empresas'));
  let visitas = 0;
  let informes = 0;

  for (const dir of dirs) {
    const empresaFile = path.join(dir, 'metadata.toml');
    const empresa = await readToml(empresaFile);
    if (!empresa) continue;
    check(/^EMP-\d{3,}$/.test(empresa.id ?? ''), `ID de empresa inválido: ${path.basename(dir)}`);
    check(Boolean(empresa.nombre), `Empresa sin nombre: ${path.basename(dir)}`);

    const visitasFiles = await listFiles(dir, '.toml');
    for (const file of visitasFiles) {
      if (path.basename(file) === 'metadata.toml') continue;
      visitas += 1;
      const visita = await readToml(file);
      if (!visita) continue;
      check(/^VIS-\d{3,}$/.test(visita.id ?? ''), `ID de visita inválido: ${path.basename(file)}`);
      check(visita.empresa_id === empresa.id, `Visita ${visita.id} no coincide con ${empresa.id}`);
      check(/^\d{4}-\d{2}-\d{2}$/.test(visita.fecha ?? ''), `Fecha inválida en ${path.basename(file)}`);
      check(Boolean(visita.secciones), `Visita sin secciones: ${path.basename(file)}`);
    }

    const informesFiles = await listFiles(path.join(dir, 'informes'), '.md');
    for (const file of informesFiles) {
      informes += 1;
      const content = await fs.readFile(file, 'utf8');
      check(content.startsWith('---'), `Informe sin frontmatter: ${path.basename(file)}`);
      check(content.includes('# '), `Informe sin título: ${path.basename(file)}`);
    }
  }

  console.log(`  Empresas: ${dirs.length}, visitas: ${visitas}, informes: ${informes}`);
}

async function validateKnowledgeImport() {
  const casos = await listFiles(CASOS, '.html');
  if (!casos.length) {
    console.log('  Biblioteca: sin archivos HTML en casos/, se omite prueba de importación');
    return;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ee-mentor-smoke-'));
  try {
    const result = await importKnowledge({
      dataDir: tempDir,
      sourceDir: CASOS,
      logger: { info() {}, warn() {} },
    });
    check(result.ok, `Importación falló: ${result.errores.join('; ')}`);
    check(result.fuentes > 0, 'La importación no generó fuentes');

    const fuentes = await listFiles(path.join(tempDir, 'biblioteca', 'fuentes'), '.toml');
    const candidatos = await listFiles(path.join(tempDir, 'biblioteca', 'candidatos'), '.toml');
    check(fuentes.length === result.fuentes, 'El número de fuentes no coincide con el resumen');
    check(candidatos.length > 0, 'La importación no generó candidatos');

    console.log(`  Biblioteca: ${result.fuentes} fuentes, ${candidatos.length} candidatos (temporal)`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

console.log('Smoke test EE Mentor');
await validateCatalogs();
await validateEmpresas();
await validateKnowledgeImport();

if (errors.length) {
  console.error(`\n${errors.length} problema(s) detectado(s) tras ${checks} verificaciones:`);
  for (const error of errors) console.error(` - ${error}`);
  process.exitCode = 1;
} else {
  console.log(`\nOK: ${checks} verificaciones sin errores.`);
}
