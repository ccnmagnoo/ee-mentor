export interface KnowledgeImportResult {
  ok: boolean;
  fuente_dir: string;
  fuentes: number;
  nuevos_candidatos: number;
  candidatos_actualizados: number;
  total_candidatos: number;
  errores: string[];
  detalle: Array<{
    archivo: string;
    titulo: string;
    rubro: string;
    hallazgos: number;
    recomendaciones: number;
  }>;
}

export function importKnowledge(options?: {
  dataDir?: string;
  sourceDir?: string;
  logger?: Pick<Console, 'info' | 'warn'>;
}): Promise<KnowledgeImportResult>;

export function extractCase(
  html: string,
  fileName?: string,
): {
  titulo: string;
  rubro: string;
  fecha: string;
  hallazgos: Array<{
    titulo: string;
    servicio: string;
    descripcion: string;
    categoria: string;
  }>;
  recomendaciones: Array<{
    titulo: string;
    servicio: string;
    descripcion: string;
    categoria: string;
  }>;
  texto: string;
};
