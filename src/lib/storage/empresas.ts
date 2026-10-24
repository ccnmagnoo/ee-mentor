import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { Empresa, EmpresaInput, Visita, VisitaInput } from '../schemas';
import { EmpresaSchema, VisitaSchema } from '../schemas';
import { EMPRESAS_DIR } from '../config';
import {
  ensureDir,
  listDirectories,
  listFiles,
  nextSequentialId,
  pathExists,
  readTomlFileSafe,
  writeTomlFile,
} from './fs-utils';

export interface EmpresaRepository {
  list(): Promise<Empresa[]>;
  get(id: string): Promise<Empresa | null>;
  create(input: EmpresaInput): Promise<Empresa>;
  update(id: string, input: EmpresaInput): Promise<Empresa>;
}

export interface VisitaRepository {
  listByEmpresa(empresaId: string): Promise<Visita[]>;
  listAll(): Promise<Visita[]>;
  get(empresaId: string, visitaId: string): Promise<Visita | null>;
  create(empresaId: string, input: VisitaInput): Promise<Visita>;
  update(empresaId: string, visitaId: string, input: VisitaInput): Promise<Visita>;
}

export function empresaDir(empresaId: string): string {
  return path.join(EMPRESAS_DIR, empresaId);
}

export function metadataPath(empresaId: string): string {
  return path.join(empresaDir(empresaId), 'metadata.toml');
}

/** Las visitas viven junto a metadata.toml, tal como exige el formato portable. */
export function visitasDir(empresaId: string): string {
  return empresaDir(empresaId);
}

export function visitFileName(visitaId: string): string {
  return `visita-${visitaId.replace(/^VIS-/, '')}.toml`;
}

export function visitPath(empresaId: string, visitaId: string): string {
  return path.join(visitasDir(empresaId), visitFileName(visitaId));
}

export class FileEmpresaRepository implements EmpresaRepository {
  async list(): Promise<Empresa[]> {
    const dirs = await listDirectories(EMPRESAS_DIR);
    const empresas: Empresa[] = [];
    for (const dir of dirs) {
      const empresa = await readTomlFileSafe(
        path.join(EMPRESAS_DIR, dir, 'metadata.toml'),
        EmpresaSchema,
      );
      if (empresa) empresas.push(empresa);
    }
    return empresas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  async get(id: string): Promise<Empresa | null> {
    if (!/^EMP-\d{3,}$/.test(id)) return null;
    return readTomlFileSafe(metadataPath(id), EmpresaSchema);
  }

  async create(input: EmpresaInput): Promise<Empresa> {
    const dirs = await listDirectories(EMPRESAS_DIR);
    const id = nextSequentialId('EMP', dirs);
    const now = new Date().toISOString();
    const empresa: Empresa = {
      schema_version: 1,
      id,
      ...input,
      created_at: now,
      updated_at: now,
    };
    await ensureDir(empresaDir(id));
    await ensureDir(visitasDir(id));
    await ensureDir(path.join(empresaDir(id), 'informes'));
    await writeTomlFile(metadataPath(id), empresa);
    return empresa;
  }

  async update(id: string, input: EmpresaInput): Promise<Empresa> {
    const current = await this.get(id);
    if (!current) throw new Error('Empresa no encontrada');
    const empresa: Empresa = {
      ...current,
      ...input,
      id,
      updated_at: new Date().toISOString(),
    };
    await writeTomlFile(metadataPath(id), empresa);
    return empresa;
  }
}

export class FileVisitaRepository implements VisitaRepository {
  async listByEmpresa(empresaId: string): Promise<Visita[]> {
    const files = (await listFiles(visitasDir(empresaId), '.toml')).filter((file) =>
      path.basename(file).startsWith('visita-'),
    );
    const visitas: Visita[] = [];
    for (const file of files) {
      const visita = await readTomlFileSafe(file, VisitaSchema);
      if (visita) visitas.push(visita);
    }
    return visitas.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async listAll(): Promise<Visita[]> {
    const dirs = await listDirectories(EMPRESAS_DIR);
    const all: Visita[] = [];
    for (const dir of dirs) {
      all.push(...(await this.listByEmpresa(dir)));
    }
    return all.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async get(empresaId: string, visitaId: string): Promise<Visita | null> {
    if (!/^VIS-\d{3,}$/.test(visitaId)) return null;
    return readTomlFileSafe(visitPath(empresaId, visitaId), VisitaSchema);
  }

  async create(empresaId: string, input: VisitaInput): Promise<Visita> {
    const existing = await this.listByEmpresa(empresaId);
    const id = nextSequentialId('VIS', existing.map((v) => v.id));
    const now = new Date().toISOString();
    const visita: Visita = {
      schema_version: 1,
      id,
      empresa_id: empresaId,
      ...input,
      created_at: now,
      updated_at: now,
    };
    await writeTomlFile(visitPath(empresaId, id), visita);
    return visita;
  }

  async update(empresaId: string, visitaId: string, input: VisitaInput): Promise<Visita> {
    const current = await this.get(empresaId, visitaId);
    if (!current) throw new Error('Visita no encontrada');
    const visita: Visita = {
      ...current,
      ...input,
      id: visitaId,
      empresa_id: empresaId,
      updated_at: new Date().toISOString(),
    };
    const file = visitPath(empresaId, visitaId);
    if (!(await pathExists(file))) throw new Error('Archivo de visita no encontrado');
    await writeTomlFile(file, visita);
    return visita;
  }
}

/** Utilidad para respaldos: tamaño total de una carpeta de empresa. */
export async function empresaSize(empresaId: string): Promise<number> {
  let total = 0;
  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else total += (await fs.stat(full)).size;
    }
  }
  await walk(empresaDir(empresaId));
  return total;
}
