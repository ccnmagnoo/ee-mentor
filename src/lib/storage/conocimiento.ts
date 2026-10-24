import path from 'node:path';
import { promises as fs } from 'node:fs';
import {
  CandidatoSchema,
  FuenteConocimientoSchema,
  type Candidato,
  type FuenteConocimiento,
} from '../schemas';
import { CANDIDATOS_DIR, FUENTES_DIR, IMPORTACIONES_DIR } from '../config';
import {
  ensureDir,
  listFiles,
  readMarkdownFile,
  readTomlFileSafe,
  writeMarkdownFile,
  writeTomlFile,
} from './fs-utils';

export interface ConocimientoRepository {
  listFuentes(): Promise<FuenteConocimiento[]>;
  getFuente(id: string): Promise<FuenteConocimiento | null>;
  saveFuente(fuente: FuenteConocimiento, markdown: string): Promise<void>;
  listCandidatos(): Promise<Candidato[]>;
  saveCandidato(candidato: Candidato): Promise<void>;
  updateCandidato(id: string, patch: Partial<Candidato>): Promise<Candidato | null>;
  saveImportacion(nombre: string, data: unknown): Promise<string>;
}

export class FileConocimientoRepository implements ConocimientoRepository {
  async listFuentes(): Promise<FuenteConocimiento[]> {
    const files = await listFiles(FUENTES_DIR, '.toml');
    const items: FuenteConocimiento[] = [];
    for (const file of files) {
      const item = await readTomlFileSafe(file, FuenteConocimientoSchema);
      if (item) items.push(item);
    }
    return items.sort((a, b) => b.imported_at.localeCompare(a.imported_at));
  }

  async getFuente(id: string): Promise<FuenteConocimiento | null> {
    return readTomlFileSafe(path.join(FUENTES_DIR, `${id}.toml`), FuenteConocimientoSchema);
  }

  async saveFuente(fuente: FuenteConocimiento, markdown: string): Promise<void> {
    await ensureDir(FUENTES_DIR);
    await writeMarkdownFile(path.join(FUENTES_DIR, `${fuente.id}.md`), markdown);
    await writeTomlFile(path.join(FUENTES_DIR, `${fuente.id}.toml`), fuente);
  }

  async listCandidatos(): Promise<Candidato[]> {
    const files = await listFiles(CANDIDATOS_DIR, '.toml');
    const items: Candidato[] = [];
    for (const file of files) {
      const item = await readTomlFileSafe(file, CandidatoSchema);
      if (item) items.push(item);
    }
    return items.sort(
      (a, b) => a.tipo.localeCompare(b.tipo) || a.titulo.localeCompare(b.titulo, 'es'),
    );
  }

  async saveCandidato(candidato: Candidato): Promise<void> {
    await ensureDir(CANDIDATOS_DIR);
    await writeTomlFile(path.join(CANDIDATOS_DIR, `${candidato.id}.toml`), candidato);
  }

  async updateCandidato(id: string, patch: Partial<Candidato>): Promise<Candidato | null> {
    const current = await readTomlFileSafe(
      path.join(CANDIDATOS_DIR, `${id}.toml`),
      CandidatoSchema,
    );
    if (!current) return null;
    const updated = { ...current, ...patch };
    await writeTomlFile(path.join(CANDIDATOS_DIR, `${id}.toml`), updated);
    return updated;
  }

  async saveImportacion(nombre: string, data: unknown): Promise<string> {
    await ensureDir(IMPORTACIONES_DIR);
    const file = path.join(IMPORTACIONES_DIR, `${nombre}.json`);
    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
    return file;
  }
}

export async function readFuenteMarkdown(fuente: FuenteConocimiento): Promise<string | null> {
  return readMarkdownFile(path.join(FUENTES_DIR, fuente.archivo));
}
