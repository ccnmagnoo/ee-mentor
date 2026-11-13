import type { Categoria, SeccionKey, UsoFinal } from './schemas';

/** Iconos SVG por uso tecnológico. Se usan en la interfaz web. */
export const CATEGORIA_ICONS = {
  iluminacion: 'lightbulb',
  refrigeracion: 'refrigerator',
  congelacion: 'snow',
  climatizacion: 'wind',
  ventilacion: 'fan',
  coccion: 'flame',
  acs: 'drop',
  calderas: 'boiler',
  envolvente: 'home',
  infiltraciones: 'infiltration',
  mantencion: 'wrench',
  motores: 'motor',
  equipos_productivos: 'factory',
  gestion_operacional: 'clipboard',
  gestion_energetica: 'target',
  tarifas: 'receipt',
  potencia_contratada: 'bolt',
  ernc: 'leaf',
  otros: 'sparkles',
} as const satisfies Record<Categoria, string>;

/** Emojis equivalentes para los informes Markdown. */
export const CATEGORIA_EMOJIS = {
  iluminacion: '💡',
  refrigeracion: '🧊',
  congelacion: '❄️',
  climatizacion: '🌡️',
  ventilacion: '🌀',
  coccion: '🔥',
  acs: '💧',
  calderas: '♨️',
  envolvente: '🏠',
  infiltraciones: '💨',
  mantencion: '🔧',
  motores: '⚙️',
  equipos_productivos: '🏭',
  gestion_operacional: '📋',
  gestion_energetica: '🎯',
  tarifas: '🧾',
  potencia_contratada: '⚡',
  ernc: '🌿',
  otros: '✨',
} as const satisfies Record<Categoria, string>;

/** Iconos de las dimensiones evaluadas en una visita. */
export const SECCION_ICONS = {
  iluminacion: 'lightbulb',
  refrigeracion: 'refrigerator',
  congelacion: 'snow',
  climatizacion: 'wind',
  acs: 'drop',
  coccion: 'flame',
  motores: 'motor',
  envolvente: 'home',
  gestion: 'target',
  tarifas: 'receipt',
} as const satisfies Record<SeccionKey, string>;

export const SECCION_EMOJIS = {
  iluminacion: '💡',
  refrigeracion: '🧊',
  congelacion: '❄️',
  climatizacion: '🌡️',
  acs: '💧',
  coccion: '🔥',
  motores: '⚙️',
  envolvente: '🏠',
  gestion: '🎯',
  tarifas: '🧾',
} as const satisfies Record<SeccionKey, string>;

/** Emojis de los usos finales para los informes. */
export const USO_FINAL_EMOJIS = {
  iluminacion: '💡',
  refrigeracion: '🧊',
  climatizacion: '🌡️',
  coccion: '🔥',
  acs: '💧',
  fuerza_motriz: '⚙️',
  equipos_productivos: '🏭',
  otros: '✨',
} as const satisfies Record<UsoFinal, string>;

/** Iconos de los usos finales seleccionables en una visita. */
export const USO_FINAL_ICONS = {
  iluminacion: 'lightbulb',
  refrigeracion: 'refrigerator',
  climatizacion: 'wind',
  coccion: 'flame',
  acs: 'drop',
  fuerza_motriz: 'motor',
  equipos_productivos: 'factory',
  otros: 'sparkles',
} as const satisfies Record<UsoFinal, string>;
