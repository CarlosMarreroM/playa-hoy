/**
 * Búsqueda de texto que no distingue mayúsculas ni tildes.
 *
 * Son funciones puras, sin React, para poder testearlas en la fase 6.
 */

/**
 * Prepara un texto para compararlo: quita tildes, pasa a minúsculas y
 * quita los espacios de los extremos.
 *
 * `normalize('NFD')` separa cada letra de su tilde ("é" → "e" + "´") y la
 * expresión regular borra las tildes sueltas.
 *
 * @example normalize(' El Médano ') // "el medano"
 */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/**
 * Indica si un texto contiene lo que ha escrito el usuario.
 * Una búsqueda vacía coincide con todo.
 *
 * @param text - Texto en el que se busca, por ejemplo el nombre de la playa.
 * @param query - Lo que ha escrito el usuario.
 * @returns `true` si `text` contiene `query`, sin tener en cuenta mayúsculas ni tildes.
 *
 * @example matchesQuery('El Médano', 'medano') // true
 */
export function matchesQuery(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query))
}
