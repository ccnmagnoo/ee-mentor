import type { Empresa, Hallazgo, Recomendacion, Visita } from '../schemas';
import { generarMarkdown } from '../report';
import { catalogos, empresas, informes, visitas } from '../repositories';

export interface BuildReportResult {
  empresa: Empresa;
  visita: Visita;
  markdown: string;
  hallazgos: Hallazgo[];
  recomendaciones: Recomendacion[];
  archivo: string;
}

export async function construirInforme(
  empresaId: string,
  visitaId: string,
): Promise<BuildReportResult | null> {
  const empresa = await empresas.get(empresaId);
  if (!empresa) return null;
  const visita = await visitas.get(empresaId, visitaId);
  if (!visita) return null;

  const [hallazgos, recomendaciones, recursos] = await Promise.all([
    catalogos.listHallazgos(true),
    catalogos.listRecomendaciones(true),
    catalogos.listRecursos(),
  ]);

  const hallazgoMap = new Map(hallazgos.map((item) => [item.id, item]));
  const recomendacionMap = new Map(recomendaciones.map((item) => [item.id, item]));

  const markdown = generarMarkdown({
    empresa,
    visita,
    hallazgos: hallazgoMap,
    recomendaciones: recomendacionMap,
    recursos,
  });

  const archivo = await informes.save(empresaId, visitaId, markdown);

  return {
    empresa,
    visita,
    markdown,
    hallazgos: visita.hallazgos
      .map((item) => hallazgoMap.get(item.hallazgo_id))
      .filter((item): item is Hallazgo => Boolean(item)),
    recomendaciones: visita.recomendaciones
      .map((item) => recomendacionMap.get(item.recomendacion_id))
      .filter((item): item is Recomendacion => Boolean(item)),
    archivo,
  };
}

export async function regenerarInforme(
  empresaId: string,
  visitaId: string,
): Promise<BuildReportResult | null> {
  return construirInforme(empresaId, visitaId);
}
