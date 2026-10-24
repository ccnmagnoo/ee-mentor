import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { Empresa, Visita } from '../schemas';
import { empresaDir } from './empresas';
import { listFiles, readMarkdownFile, writeMarkdownFile } from './fs-utils';

export interface InformeRepository {
  save(empresaId: string, visitaId: string, markdown: string): Promise<string>;
  readLatest(empresaId: string): Promise<string | null>;
  read(empresaId: string, visitaId: string): Promise<string | null>;
  list(empresaId: string): Promise<Array<{ visitaId: string; archivo: string; actualizado: string }>>;
}

export function informesDir(empresaId: string): string {
  return path.join(empresaDir(empresaId), 'informes');
}

export function informeVisitaPath(empresaId: string, visitaId: string): string {
  return path.join(informesDir(empresaId), `visita-${visitaId.replace(/^VIS-/, '')}.md`);
}

export class FileInformeRepository implements InformeRepository {
  async save(empresaId: string, visitaId: string, markdown: string): Promise<string> {
    const file = informeVisitaPath(empresaId, visitaId);
    await writeMarkdownFile(file, markdown);
    // Copia de conveniencia: informe.md siempre apunta a la última visita generada.
    await writeMarkdownFile(path.join(empresaDir(empresaId), 'informe.md'), markdown);
    return file;
  }

  async readLatest(empresaId: string): Promise<string | null> {
    return readMarkdownFile(path.join(empresaDir(empresaId), 'informe.md'));
  }

  async read(empresaId: string, visitaId: string): Promise<string | null> {
    return readMarkdownFile(informeVisitaPath(empresaId, visitaId));
  }

  async list(
    empresaId: string,
  ): Promise<Array<{ visitaId: string; archivo: string; actualizado: string }>> {
    const files = await listFiles(informesDir(empresaId), '.md');
    const items: Array<{ visitaId: string; archivo: string; actualizado: string }> = [];
    for (const file of files) {
      const match = /visita-(\d+)\.md$/.exec(path.basename(file));
      if (!match) continue;
      const stat = await fs.stat(file);
      items.push({
        visitaId: `VIS-${match[1]}`,
        archivo: file,
        actualizado: stat.mtime.toISOString(),
      });
    }
    return items.sort((a, b) => b.visitaId.localeCompare(a.visitaId));
  }
}

export function reportFileName(empresa: Empresa, visita: Visita): string {
  return `${empresa.id}-${visita.id}.md`;
}
