import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse, stringify } from 'smol-toml';
import type { ZodType } from 'zod';

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/** Serializa a TOML eliminando valores que el formato no admite. */
export function toToml(data: unknown): string {
  return `${stringify(cleanData(data)).trim()}\n`;
}

function cleanData(value: unknown): unknown {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanData(item))
      .filter((item) => item !== undefined);
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => [key, cleanData(val)] as const)
      .filter(([, val]) => val !== undefined);
    return Object.fromEntries(entries);
  }
  return value;
}

export async function writeTomlFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, toToml(data), 'utf8');
  await fs.rename(tmp, filePath);
}

export async function readTomlFile<T>(filePath: string, schema: ZodType<T>): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  let parsed: unknown;
  try {
    parsed = parse(raw);
  } catch (error) {
    throw new Error(
      `TOML inválido en ${path.basename(filePath)}: ${(error as Error).message}`,
    );
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    const detalle = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Datos inválidos en ${path.basename(filePath)}: ${detalle}`);
  }
  return result.data;
}

export async function readTomlFileSafe<T>(
  filePath: string,
  schema: ZodType<T>,
): Promise<T | null> {
  try {
    return await readTomlFile(filePath, schema);
  } catch (error) {
    // Un archivo inexistente es parte del flujo normal (búsquedas por ID).
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(`[storage] ${(error as Error).message}`);
    }
    return null;
  }
}

export async function writeMarkdownFile(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, content, 'utf8');
  await fs.rename(tmp, filePath);
}

export async function readMarkdownFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

export async function listFiles(dir: string, extension: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
      .map((entry) => path.join(dir, entry.name))
      .sort((a, b) => a.localeCompare(b, 'es'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function listDirectories(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'es'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

export function normalizeId(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function nextSequentialId(prefix: string, existing: readonly string[]): string {
  const numbers = existing
    .map((id) => /(\d+)$/.exec(id)?.[1])
    .filter((value): value is string => Boolean(value))
    .map((value) => Number.parseInt(value, 10));
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `${prefix}-${String(next).padStart(3, '0')}`;
}
