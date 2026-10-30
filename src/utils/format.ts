/**
 * Funciones para mostrar los datos en pantalla.
 */

/**
 * Formatea un número con su unidad, o devuelve "—" si no hay dato.
 *
 * Ejemplos:
 * - `formatValue(1.234, 'm')` → `"1.2 m"`
 * - `formatValue(18.6, 'km/h', 0)` → `"19 km/h"`
 * - `formatValue(5)` → `"5.0"`
 * - `formatValue(null, 'm')` → `"—"`
 *
 * @param value El valor que se quiere mostrar. Puede ser `null` si la API no tiene dato.
 * @param unit Unidad que se añade detrás del número (opcional).
 * @param decimals Número de decimales (por defecto, 1).
 * @returns El texto listo para mostrar.
 */
export function formatValue(
  value: number | null,
  unit = '',
  decimals = 1,
): string {
  if (value === null) return '—'

  // toFixed redondea y convierte el número en texto: 1.234 → "1.2"
  const number = value.toFixed(decimals)

  // Si hay unidad, se añade con un espacio; si no, solo el número
  return unit ? `${number} ${unit}` : number
}
