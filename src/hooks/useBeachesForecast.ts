/**
 * Hook que consigue las condiciones actuales de varias playas a la vez.
 *
 * Hace solo dos peticiones en total (mar y tiempo), da igual cuántas playas
 * haya: Open-Meteo acepta varias coordenadas en la misma petición.
 */
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Beach, BeachForecast } from '../types/beach'
import { getMarineBatch, getWeatherBatch } from '../api/openMeteo'
import { toBeachConditions } from '../utils/transform'
import { getErrorMessage } from '../utils/errors'

/** Estado de la petición: cargando, error o con los datos de todas las playas. */
export type BeachesForecastState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: BeachForecast[] }

/**
 * Consigue las condiciones actuales de las playas indicadas.
 *
 * @param beaches - Playas de las que se pide la previsión. Tiene que ser
 *   siempre el mismo array (una constante o un `useMemo`): si se crea uno
 *   nuevo en cada renderizado, el efecto se repetiría sin parar.
 * @returns El estado de la petición: cargando, error o con datos.
 */
export function useBeachesForecast(beaches: Beach[]): BeachesForecastState {
  const [state, setState] = useState<BeachesForecastState>({
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const [marine, weather] = await Promise.all([
          getMarineBatch(beaches, controller.signal),
          getWeatherBatch(beaches, controller.signal),
        ])

        // Las respuestas llegan en el mismo orden que las playas
        const data = beaches.map((beach, index) => ({
          beach,
          conditions: toBeachConditions(marine[index], weather[index]),
        }))

        setState({ status: 'success', data })
      } catch (error) {
        if (axios.isCancel(error)) return

        setState({ status: 'error', message: getErrorMessage(error) })
      }
    }

    load()

    return () => controller.abort()
  }, [beaches])

  return state
}
