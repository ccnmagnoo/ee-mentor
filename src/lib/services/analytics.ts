import type { Empresa, Visita } from '../schemas';
import { CATEGORIAS, IMPACTOS, PRIORIDADES } from '../schemas';
import { empresas, visitas, catalogos } from '../repositories';
import { clasificarPuntaje, evaluarSecciones, redondear } from '../scoring';

export interface EmpresaResumen {
  empresa: Empresa;
  visitas: number;
  ultimaVisita: string | null;
  puntaje: number | null;
  clasificacion: string;
  hallazgos: number;
  recomendaciones: number;
}

export interface RankingItem {
  id: string;
  titulo: string;
  codigo: string;
  count: number;
  detalle: string;
}

export interface DashboardData {
  totalEmpresas: number;
  totalVisitas: number;
  visitasMes: number;
  rubros: Array<{ rubro: string; count: number }>;
  promedioGlobal: number | null;
  clasificacionGlobal: string;
  topHallazgos: RankingItem[];
  topRecomendaciones: RankingItem[];
  recientes: Array<{ empresa: Empresa; visita: Visita }>;
  empresasSinVisita: number;
  porMes: Array<{ mes: string; count: number }>;
  totalHallazgos: number;
  totalRecomendaciones: number;
}

export async function listarEmpresasConResumen(): Promise<EmpresaResumen[]> {
  const [empresasList, visitasList] = await Promise.all([empresas.list(), visitas.listAll()]);
  return empresasList.map((empresa) => {
    const propias = visitasList.filter((v) => v.empresa_id === empresa.id);
    const ultima = propias[0];
    const evaluacion = ultima ? evaluarSecciones(ultima.secciones) : null;
    return {
      empresa,
      visitas: propias.length,
      ultimaVisita: ultima?.fecha ?? null,
      puntaje: evaluacion?.puntajeGlobal ?? null,
      clasificacion: evaluacion?.clasificacionGlobal.etiqueta ?? 'Sin evaluación',
      hallazgos: ultima?.hallazgos.length ?? 0,
      recomendaciones: ultima?.recomendaciones.length ?? 0,
    };
  });
}

export async function getDashboardData(): Promise<DashboardData> {
  const [empresasList, visitasList, hallazgos, recomendaciones] = await Promise.all([
    empresas.list(),
    visitas.listAll(),
    catalogos.listHallazgos(true),
    catalogos.listRecomendaciones(true),
  ]);

  const now = new Date();
  const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const rubrosMap = new Map<string, number>();
  for (const empresa of empresasList) {
    const rubro = empresa.rubro || 'Sin rubro';
    rubrosMap.set(rubro, (rubrosMap.get(rubro) ?? 0) + 1);
  }

  const hallazgoMap = new Map(hallazgos.map((h) => [h.id, h]));
  const recoMap = new Map(recomendaciones.map((r) => [r.id, r]));

  const hallazgoCount = new Map<string, number>();
  const recoCount = new Map<string, number>();
  const puntajes: number[] = [];

  for (const visita of visitasList) {
    for (const item of visita.hallazgos) {
      hallazgoCount.set(item.hallazgo_id, (hallazgoCount.get(item.hallazgo_id) ?? 0) + 1);
    }
    for (const item of visita.recomendaciones) {
      recoCount.set(item.recomendacion_id, (recoCount.get(item.recomendacion_id) ?? 0) + 1);
    }
    const evaluacion = evaluarSecciones(visita.secciones);
    if (evaluacion.puntajeGlobal !== null) puntajes.push(evaluacion.puntajeGlobal);
  }

  const topHallazgos: RankingItem[] = [...hallazgoCount.entries()]
    .map(([id, count]) => {
      const item = hallazgoMap.get(id);
      return {
        id,
        titulo: item?.titulo ?? id,
        codigo: item?.codigo ?? id,
        count,
        detalle: item ? `${IMPACTOS[item.impacto]} · ${CATEGORIAS[item.categoria]}` : 'Fuera del catálogo',
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topRecomendaciones: RankingItem[] = [...recoCount.entries()]
    .map(([id, count]) => {
      const item = recoMap.get(id);
      return {
        id,
        titulo: item?.titulo ?? id,
        codigo: item?.codigo ?? id,
        count,
        detalle: item ? `${PRIORIDADES[item.prioridad]} · ${item.ahorro_estimado || 'Ahorro por cuantificar'}` : 'Fuera del catálogo',
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const empresaMap = new Map(empresasList.map((e) => [e.id, e]));
  const recientes = visitasList
    .map((visita) => ({ visita, empresa: empresaMap.get(visita.empresa_id) }))
    .filter((item): item is { visita: Visita; empresa: Empresa } => Boolean(item.empresa))
    .slice(0, 5);

  const empresasConVisita = new Set(visitasList.map((v) => v.empresa_id));

  const porMesMap = new Map<string, number>();
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    porMesMap.set(key, 0);
  }
  for (const visita of visitasList) {
    const key = visita.fecha.slice(0, 7);
    if (porMesMap.has(key)) porMesMap.set(key, (porMesMap.get(key) ?? 0) + 1);
  }

  const promedioGlobal = puntajes.length
    ? puntajes.reduce((acc, value) => acc + value, 0) / puntajes.length
    : null;

  return {
    totalEmpresas: empresasList.length,
    totalVisitas: visitasList.length,
    visitasMes: visitasList.filter((v) => v.fecha.startsWith(mesActual)).length,
    rubros: [...rubrosMap.entries()]
      .map(([rubro, count]) => ({ rubro, count }))
      .sort((a, b) => b.count - a.count),
    promedioGlobal,
    clasificacionGlobal: clasificarPuntaje(promedioGlobal).etiqueta,
    topHallazgos,
    topRecomendaciones,
    recientes,
    empresasSinVisita: empresasList.filter((e) => !empresasConVisita.has(e.id)).length,
    porMes: [...porMesMap.entries()].map(([mes, count]) => ({ mes, count })),
    totalHallazgos: hallazgoCount.size,
    totalRecomendaciones: recoCount.size,
  };
}

export async function getEmpresaDetalle(empresaId: string): Promise<{
  empresa: Empresa;
  visitas: Visita[];
  ultimaVisita: Visita | null;
  evaluacion: ReturnType<typeof evaluarSecciones> | null;
} | null> {
  const empresa = await empresas.get(empresaId);
  if (!empresa) return null;
  const visitasList = await visitas.listByEmpresa(empresaId);
  const ultimaVisita = visitasList[0] ?? null;
  return {
    empresa,
    visitas: visitasList,
    ultimaVisita,
    evaluacion: ultimaVisita ? evaluarSecciones(ultimaVisita.secciones) : null,
  };
}

export function puntajeRedondeado(value: number | null): string {
  return value === null ? '—' : redondear(value, 1).toFixed(1);
}
