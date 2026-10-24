/**
 * Importa los casos históricos de `casos/` a la biblioteca de conocimiento.
 * Uso: npm run import:knowledge
 */
import path from 'node:path';
import { importKnowledge } from '../src/lib/knowledge-import.mjs';

const dataDir = process.env.EE_DATA_DIR
  ? path.resolve(process.env.EE_DATA_DIR)
  : path.join(process.cwd(), 'data');
const sourceDir = process.env.EE_KNOWLEDGE_DIR
  ? path.resolve(process.env.EE_KNOWLEDGE_DIR)
  : path.join(process.cwd(), 'casos');

const result = await importKnowledge({ dataDir, sourceDir, logger: console });

console.log('');
console.log(`Documentos procesados: ${result.fuentes}`);
console.log(`Candidatos nuevos: ${result.nuevos_candidatos}`);
console.log(`Candidatos actualizados: ${result.candidatos_actualizados}`);
if (result.errores.length) {
  console.error('Errores:');
  for (const error of result.errores) console.error(` - ${error}`);
  process.exitCode = 1;
}
