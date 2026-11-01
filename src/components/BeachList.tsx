/**
 * Lista con todas las playas, de mejor a peor nota del día.
 *
 * Pide la previsión de todas las playas a la vez con `useBeachesForecast`,
 * calcula la nota de cada una y las ordena. Las tarjetas solo muestran datos.
 */
import { beaches } from '../data/beaches'
import { useBeachesForecast } from '../hooks/useBeachesForecast'
import { calculateRating, compareRatings } from '../utils/rating'
import { BeachCard } from './BeachCard'
import { GlassPanel } from './GlassPanel'

export function BeachList() {
  // `beaches` es una constante del módulo, así que el efecto del hook no se repite
  const state = useBeachesForecast(beaches)

  if (state.status === 'loading') {
    return (
      <GlassPanel>
        <p className="text-gray-500">Cargando playas…</p>
      </GlassPanel>
    )
  }

  if (state.status === 'error') {
    return (
      <GlassPanel>
        <p className="font-semibold">No se pudieron cargar las playas</p>
        <p className="mt-2 text-red-600">{state.message}</p>
      </GlassPanel>
    )
  }

  // La nota se calcula a partir de los datos en cada renderizado: no es estado
  const sorted = state.data
    .map((forecast) => ({
      ...forecast,
      rating: calculateRating(forecast.conditions),
    }))
    // toSorted devuelve un array nuevo: no modifica el que viene del hook.
    // Es estable, así que las playas con la misma nota mantienen el orden de la lista
    .toSorted((a, b) => compareRatings(a.rating, b.rating))

  return (
    <ul className="flex flex-col gap-4">
      {sorted.map(({ beach, conditions, rating }) => (
        // La key es el id de la playa, no la posición: la posición cambia al reordenar
        <li key={beach.id}>
          <BeachCard beach={beach} conditions={conditions} rating={rating} />
        </li>
      ))}
    </ul>
  )
}
