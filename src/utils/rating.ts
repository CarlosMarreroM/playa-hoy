/**
 * Nota del día de una playa: si merece la pena ir a bañarse.
 *
 * Cada dato (olas, viento y temperatura del agua) se puntúa por separado
 * como bueno, regular o malo, y la nota final es la del peor de ellos:
 * si un dato es malo, la playa es mala aunque el resto sea perfecto.
 *
 * Es una función pura, sin React, para poder testearla en la fase 6.
 */
import type { BeachConditions } from '../types/beach'

/** Nota de una playa. Los textos que ve el usuario se definen aparte. */
export type Rating = 'good' | 'fair' | 'bad'

/** Los dos límites que separan bueno, regular y malo en un dato. */
interface Limits {
  good: number
  fair: number
}

/**
 * Límites de cada dato. Todos en un solo sitio para poder ajustarlos
 * con el uso sin tocar la lógica.
 */
export const THRESHOLDS = {
  /** Altura de ola en m. Menos que `good` es bueno; menos que `fair`, regular. */
  waveHeight: { good: 0.8, fair: 1.5 },
  /** Viento en km/h. Menos que `good` es bueno; menos que `fair`, regular. */
  windSpeed: { good: 20, fair: 30 },
  /** Agua en °C. Desde `good` es bueno; desde `fair`, regular. */
  waterTemp: { good: 21, fair: 19 },
} as const

/** Gravedad de cada nota, para poder compararlas y quedarse con la peor. */
const SEVERITY: Record<Rating, number> = { good: 0, fair: 1, bad: 2 }

/**
 * Puntúa un dato en el que cuanto más bajo, mejor (olas, viento).
 *
 * @returns La nota del dato, o `null` si no hay dato.
 */
function rateLowerIsBetter(
  value: number | null,
  limits: Limits,
): Rating | null {
  if (value === null) return null
  if (value < limits.good) return 'good'
  if (value < limits.fair) return 'fair'
  return 'bad'
}

/**
 * Puntúa un dato en el que cuanto más alto, mejor (temperatura del agua).
 *
 * @returns La nota del dato, o `null` si no hay dato.
 */
function rateHigherIsBetter(
  value: number | null,
  limits: Limits,
): Rating | null {
  if (value === null) return null
  if (value >= limits.good) return 'good'
  if (value >= limits.fair) return 'fair'
  return 'bad'
}

/** Los datos que necesita la nota: solo estos tres de `BeachConditions`. */
export type RatingInput = Pick<
  BeachConditions,
  'waveHeight' | 'windSpeed' | 'waterTemp'
>

/**
 * Calcula la nota del día de una playa.
 *
 * Los datos que faltan (`null`) no cuentan: la nota se calcula con los que haya.
 *
 * @param conditions Altura de ola, viento y temperatura del agua.
 * @returns La peor de las notas de los tres datos, o `null` si no hay ninguno.
 */
export function calculateRating(conditions: RatingInput): Rating | null {
  const ratings = [
    rateLowerIsBetter(conditions.waveHeight, THRESHOLDS.waveHeight),
    rateLowerIsBetter(conditions.windSpeed, THRESHOLDS.windSpeed),
    rateHigherIsBetter(conditions.waterTemp, THRESHOLDS.waterTemp),
  ].filter((rating): rating is Rating => rating !== null)

  if (ratings.length === 0) return null

  // Se recorre la lista quedándose siempre con la nota más grave vista hasta ahora
  return ratings.reduce((worst, rating) =>
    SEVERITY[rating] > SEVERITY[worst] ? rating : worst,
  )
}

/**
 * Compara dos notas para ordenar de mejor a peor. Se usa con `sort` o `toSorted`.
 * Las playas sin nota (`null`) van al final.
 *
 * @returns Negativo si `a` va antes, positivo si va después, 0 si son iguales.
 */
export function compareRatings(a: Rating | null, b: Rating | null): number {
  // Sin nota cuenta como la peor posible, para que quede detrás de 'bad'
  const severityA = a === null ? Infinity : SEVERITY[a]
  const severityB = b === null ? Infinity : SEVERITY[b]

  // Infinity - Infinity da NaN, así que los empates se resuelven antes de restar
  if (severityA === severityB) return 0
  return severityA - severityB
}
