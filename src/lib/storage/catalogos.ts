import path from 'node:path';
import {
  HallazgoSchema,
  RecomendacionSchema,
  RecursoSchema,
  type Hallazgo,
  type HallazgoInput,
  type Recomendacion,
  type RecomendacionInput,
  type Recurso,
  type RecursoInput,
} from '../schemas';
import { HALLAZGOS_DIR, RECOMENDACIONES_DIR, RECURSOS_DIR } from '../config';
import {
  listFiles,
  normalizeId,
  readTomlFileSafe,
  slugify,
  writeTomlFile,
} from './fs-utils';

export interface CatalogoRepository {
  listHallazgos(includeInactive?: boolean): Promise<Hallazgo[]>;
  getHallazgo(id: string): Promise<Hallazgo | null>;
  saveHallazgo(input: HallazgoInput): Promise<Hallazgo>;
  listRecomendaciones(includeInactive?: boolean): Promise<Recomendacion[]>;
  getRecomendacion(id: string): Promise<Recomendacion | null>;
  saveRecomendacion(input: RecomendacionInput): Promise<Recomendacion>;
  listRecursos(includeInactive?: boolean): Promise<Recurso[]>;
  getRecurso(id: string): Promise<Recurso | null>;
  saveRecurso(input: RecursoInput): Promise<Recurso>;
}

function hallazgoFile(id: string): string {
  return path.join(HALLAZGOS_DIR, `${id}.toml`);
}

function recomendacionFile(id: string): string {
  return path.join(RECOMENDACIONES_DIR, `${id}.toml`);
}

function recursoFile(id: string): string {
  return path.join(RECURSOS_DIR, `${id}.toml`);
}

export class FileCatalogoRepository implements CatalogoRepository {
  async listHallazgos(includeInactive = false): Promise<Hallazgo[]> {
    const files = await listFiles(HALLAZGOS_DIR, '.toml');
    const items: Hallazgo[] = [];
    for (const file of files) {
      const item = await readTomlFileSafe(file, HallazgoSchema);
      if (item && (includeInactive || item.activo)) items.push(item);
    }
    return items.sort(
      (a, b) => a.categoria.localeCompare(b.categoria, 'es') || a.codigo.localeCompare(b.codigo),
    );
  }

  async getHallazgo(id: string): Promise<Hallazgo | null> {
    return readTomlFileSafe(hallazgoFile(id), HallazgoSchema);
  }

  async saveHallazgo(input: HallazgoInput): Promise<Hallazgo> {
    const now = new Date().toISOString();
    const existing = input.id ? await this.getHallazgo(input.id) : null;
    let id = input.id || `HAL-${normalizeId(input.codigo).replace(/^HAL-/, '')}`;
    if (!existing) {
      let suffix = 1;
      while (await this.getHallazgo(id)) {
        suffix += 1;
        id = `HAL-${normalizeId(input.codigo).replace(/^HAL-/, '')}-${suffix}`;
      }
    }
    const hallazgo: Hallazgo = {
      ...input,
      schema_version: 1,
      id,
      origen: input.origen ?? 'catalogo_base',
      created_at: existing?.created_at || now,
      updated_at: now,
    };
    await writeTomlFile(hallazgoFile(id), hallazgo);
    return hallazgo;
  }

  async listRecomendaciones(includeInactive = false): Promise<Recomendacion[]> {
    const files = await listFiles(RECOMENDACIONES_DIR, '.toml');
    const items: Recomendacion[] = [];
    for (const file of files) {
      const item = await readTomlFileSafe(file, RecomendacionSchema);
      if (item && (includeInactive || item.activo)) items.push(item);
    }
    return items.sort(
      (a, b) => a.categoria.localeCompare(b.categoria, 'es') || a.codigo.localeCompare(b.codigo),
    );
  }

  async getRecomendacion(id: string): Promise<Recomendacion | null> {
    return readTomlFileSafe(recomendacionFile(id), RecomendacionSchema);
  }

  async saveRecomendacion(input: RecomendacionInput): Promise<Recomendacion> {
    const now = new Date().toISOString();
    const existing = input.id ? await this.getRecomendacion(input.id) : null;
    let id = input.id || `REC-${normalizeId(input.codigo).replace(/^REC-/, '')}`;
    if (!existing) {
      let suffix = 1;
      while (await this.getRecomendacion(id)) {
        suffix += 1;
        id = `REC-${normalizeId(input.codigo).replace(/^REC-/, '')}-${suffix}`;
      }
    }
    const recomendacion: Recomendacion = {
      ...input,
      schema_version: 1,
      id,
      origen: input.origen ?? 'catalogo_base',
      created_at: existing?.created_at || now,
      updated_at: now,
    };
    await writeTomlFile(recomendacionFile(id), recomendacion);
    return recomendacion;
  }

  async listRecursos(includeInactive = false): Promise<Recurso[]> {
    const files = await listFiles(RECURSOS_DIR, '.toml');
    const items: Recurso[] = [];
    for (const file of files) {
      const item = await readTomlFileSafe(file, RecursoSchema);
      if (item && (includeInactive || item.activo)) items.push(item);
    }
    return items.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
  }

  async getRecurso(id: string): Promise<Recurso | null> {
    return readTomlFileSafe(recursoFile(id), RecursoSchema);
  }

  async saveRecurso(input: RecursoInput): Promise<Recurso> {
    const existing = input.id ? await this.getRecurso(input.id) : null;
    let id = input.id || `REC-${normalizeId(input.nombre).replace(/^REC-/, '')}`;
    if (!existing) {
      let suffix = 1;
      while (await this.getRecurso(id)) {
        suffix += 1;
        id = `REC-${normalizeId(input.nombre).replace(/^REC-/, '')}-${suffix}`;
      }
    }
    const recurso: Recurso = {
      ...input,
      schema_version: 1,
      id,
    };
    await writeTomlFile(recursoFile(id), recurso);
    return recurso;
  }
}

export function catalogoSlug(value: string): string {
  return slugify(value);
}
