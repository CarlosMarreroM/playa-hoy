/**
 * Lista con todas las playas, de mejor a peor nota del día, con buscador
 * y filtro por isla.
 *
 * Pide la previsión de todas las playas a la vez con `useBeachesForecast`.
 * Buscar y filtrar no hacen peticiones nuevas: solo deciden qué playas
 * de las que ya hay se muestran. Las tarjetas solo muestran datos.
 */
import { useState } from 'react'
import { beaches } from '../data/beaches'
import {
  useBeachesForecast,
  type BeachesForecastState,
} from '../hooks/useBeachesForecast'
import { calculateRating, compareRatings } from '../utils/rating'
import { matchesQuery } from '../utils/search'
import { BeachCard } from './BeachCard'
import { BeachCardSkeleton } from './BeachCardSkeleton'
import { GlassPanel } from './GlassPanel'
import { IslandFilter, type IslandOption } from './IslandFilter'
import { SearchBar } from './SearchBar'

/**
 * Columnas del grid de tarjetas. Se empieza por el móvil: 1 columna,
 * 2 desde tablet (sm) y 3 desde portátil (lg). Lo comparten la lista y
 * las tarjetas de carga para que tengan la misma forma.
 */
const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

/** Tarjetas provisionales que se muestran mientras cargan los datos. */
const SKELETON_COUNT = 6

export function BeachList() {
  // `beaches` es una constante del módulo, así que el efecto del hook no se repite
  const state = useBeachesForecast(beaches)

  // Lo que ha elegido el usuario. La lista filtrada no es estado: se calcula con esto
  const [query, setQuery] = useState('')
  const [island, setIsland] = useState<IslandOption>('all')

  return (
    <div className="flex flex-col gap-4">
      {/* Fuera de los estados de carga: se puede buscar mientras llegan los datos */}
      <SearchBar value={query} onChange={setQuery} />
      <IslandFilter value={island} onChange={setIsland} />
      <Results state={state} query={query} island={island} />
    </div>
  )
}

interface ResultsProps {
  /** Estado de la petición de la previsión. */
  state: BeachesForecastState
  /** Texto del buscador. */
  query: string
  /** Isla elegida en el filtro. */
  island: IslandOption
}

/**
 * La parte de la lista que cambia: cargando, error o las tarjetas.
 * No se exporta porque solo se usa dentro de `BeachList`.
 */
function Results({ state, query, island }: ResultsProps) {
  if (state.status === 'loading') {
    return (
      // Tarjetas grises con la misma forma que las reales: la página no salta al cargar
      <div role="status" className={GRID_CLASSES}>
        {/* El texto solo lo leen los lectores de pantalla */}
        <span className="sr-only">Cargando playas…</span>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          // Aquí sí vale el índice como key: son fijas y nunca se reordenan
          <BeachCardSkeleton key={index} />
        ))}
      </div>
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

  // Todo se calcula en cada renderizado a partir de los datos y los filtros: no es estado
  const visible = state.data
    .filter(({ beach }) => island === 'all' || beach.island === island)
    .filter(({ beach }) => matchesQuery(beach.name, query))
    .map((forecast) => ({
      ...forecast,
      rating: calculateRating(forecast.conditions),
    }))
    // toSorted devuelve un array nuevo: no modifica el que viene del hook.
    // Es estable, así que las playas con la misma nota mantienen el orden de la lista
    .toSorted((a, b) => compareRatings(a.rating, b.rating))

  return (
    <>
      {/* aria-live hace que los lectores de pantalla lean el número al cambiar los filtros */}
      <p className="text-sm text-gray-500" aria-live="polite">
        {visible.length === 1 ? '1 playa' : `${visible.length} playas`}
      </p>

      {visible.length === 0 ? (
        <GlassPanel>
          <p className="text-gray-500">No hay playas que coincidan.</p>
        </GlassPanel>
      ) : (
        <ul className={GRID_CLASSES}>
          {visible.map(({ beach, conditions, rating }) => (
            // La key es el id de la playa, no la posición: la posición cambia al reordenar
            <li key={beach.id}>
              <BeachCard
                beach={beach}
                conditions={conditions}
                rating={rating}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
