/**
 * Islas de la app.
 *
 * La lista y el tipo van juntos porque el tipo se saca de la lista:
 * si se añade una isla aquí, el tipo `Island` la incluye solo.
 */

/**
 * Islas de la app, en el orden en que salen en el filtro.
 * `as const` hace que TypeScript guarde cada nombre exacto y no solo `string`.
 */
export const ISLANDS = [
  'Tenerife',
  'Gran Canaria',
  'Lanzarote',
  'Fuerteventura',
  'La Palma',
  'La Gomera',
  'El Hierro',
  'La Graciosa',
] as const

/** Nombre de una isla: 'Tenerife' | 'Gran Canaria' | … Sale de `ISLANDS`. */
export type Island = (typeof ISLANDS)[number]
