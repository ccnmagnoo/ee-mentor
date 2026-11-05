import type { Empresa } from './schemas';

type EmpresaUbicacion = Pick<Empresa, 'mapa_url' | 'latitud' | 'longitud'>;

export interface Coordenadas {
  lat: number;
  lng: number;
}

export function coordenadas(empresa: EmpresaUbicacion): Coordenadas | null {
  const { latitud, longitud } = empresa;
  if (latitud === undefined || longitud === undefined) return null;
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) return null;
  if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) return null;
  return { lat: latitud, lng: longitud };
}

export function urlMapaDesdeCoordenadas(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Devuelve el enlace configurado o, si solo hay coordenadas, genera uno
 * compatible con Google Maps para no obligar a completar ambos datos.
 */
export function urlMapa(empresa: EmpresaUbicacion): string | null {
  if (empresa.mapa_url) return empresa.mapa_url;
  const coords = coordenadas(empresa);
  return coords ? urlMapaDesdeCoordenadas(coords.lat, coords.lng) : null;
}

export function formatearCoordenadas(empresa: EmpresaUbicacion): string | null {
  const coords = coordenadas(empresa);
  if (!coords) return null;
  return `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
}
