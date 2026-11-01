/**
 * Lista con todas las playas y su nota del día.
 *
 * Pide la previsión de todas las playas a la vez con `useBeachesForecast`
 * y calcula la nota de cada una. Las tarjetas solo muestran datos.
 */
import { beaches } from '../data/beaches'
import { useBeachesForecast } from '../hooks/useBeachesForecast'
import { calculateRating } from '../utils/rating'
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
  const withRatings = state.data.map((forecast) => ({
    ...forecast,
    rating: calculateRating(forecast.conditions),
  }))

  return (
    <ul className="flex flex-col gap-4">
      {withRatings.map(({ beach, conditions, rating }) => (
        <li key={beach.id}>
          <BeachCard beach={beach} conditions={conditions} rating={rating} />
        </li>
      ))}
    </ul>
  )
}
