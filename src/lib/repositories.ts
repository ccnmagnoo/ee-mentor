import { FileEmpresaRepository, FileVisitaRepository } from './storage/empresas';
import { FileCatalogoRepository } from './storage/catalogos';
import { FileInformeRepository } from './storage/informes';
import { FileConocimientoRepository } from './storage/conocimiento';

/**
 * Punto único de acceso a datos. Para migrar a SQLite basta con implementar
 * las interfaces de `storage/*` y reemplazar estas instancias.
 */
export const empresas = new FileEmpresaRepository();
export const visitas = new FileVisitaRepository();
export const catalogos = new FileCatalogoRepository();
export const informes = new FileInformeRepository();
export const conocimiento = new FileConocimientoRepository();
