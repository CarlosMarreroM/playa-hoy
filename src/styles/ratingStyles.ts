/**
 * Cómo se muestra cada nota: el texto y los colores.
 *
 * Las clases de Tailwind se escriben completas a propósito. Tailwind lee el
 * código como texto para saber qué CSS generar, así que una clase montada
 * con variables (`shadow-${color}-500`) no la encontraría y no funcionaría.
 */
import type { Rating } from '../utils/rating'

interface RatingStyle {
  /** Texto que ve el usuario. */
  label: string
  /** Clases de la píldora con la nota: fondo y color del texto. */
  badge: string
  /** Clase del color de la sombra de la tarjeta. */
  shadow: string
}

export const RATING_STYLES: Record<Rating, RatingStyle> = {
  good: {
    label: 'Hoy sí',
    badge: 'bg-emerald-100 text-emerald-800',
    shadow: 'shadow-emerald-500/70',
  },
  fair: {
    label: 'Regular',
    badge: 'bg-amber-100 text-amber-800',
    shadow: 'shadow-amber-500/70',
  },
  bad: {
    label: 'Hoy no',
    badge: 'bg-red-100 text-red-800',
    shadow: 'shadow-red-500/70',
  },
}
