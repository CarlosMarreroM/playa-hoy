/**
 * Hook que consigue las condiciones actuales de un punto de la costa.
 *
 * Pide a la vez los datos del mar y del tiempo, los transforma en
 * `BeachConditions` y devuelve en qué estado está la petición:
 * cargando, error o con datos.
 *
 * Cualquier componente que necesite la previsión de un punto usa este hook,
 * así no repite la lógica de las peticiones.
 */
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { BeachConditions } from '../types/beach'
import { getMarine, getWeather } from '../api/openMeteo'
import { toBeachConditions } from '../utils/transform'
import { getErrorMessage } from '../utils/errors'

/**
 * Estado de la petición. Es una unión discriminada: `status` indica en cuál
 * de las tres situaciones está, y cada una lleva solo los datos que tienen
 * sentido. Así es imposible tener, por ejemplo, datos y error a la vez.
 *
 * Se exporta para que los componentes puedan tipar lo que reciben del hook.
 */
export type ForecastState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: BeachConditions }

/**
 * Consigue las condiciones actuales del punto indicado.
 *
 * @param lat - Latitud del punto, en grados.
 * @param lon - Longitud del punto, en grados.
 * @returns El estado de la petición: cargando, error o con datos.
 */
export function useBeachForecast(lat: number, lon: number): ForecastState {
  // Empieza en 'loading' porque lo primero que pasa es la carga de los datos
  const [state, setState] = useState<ForecastState>({ status: 'loading' })

  useEffect(() => {
    // Permite cancelar las peticiones si el componente desaparece o cambian las coordenadas
    const controller = new AbortController()

    // El efecto no puede ser async, así que la función async va dentro
    async function load() {
      try {
        // Las dos peticiones salen a la vez; se espera a que terminen ambas
        const [marine, weather] = await Promise.all([
          getMarine(lat, lon, controller.signal),
          getWeather(lat, lon, controller.signal),
        ])

        setState({
          status: 'success',
          data: toBeachConditions(marine, weather),
        })
      } catch (error) {
        // Una cancelación la provocamos nosotros a propósito: no es un error para el usuario
        if (axios.isCancel(error)) return

        setState({ status: 'error', message: getErrorMessage(error) })
      }
    }

    load()

    // Limpieza: React la ejecuta cuando el componente desaparece o antes de repetir el efecto
    return () => controller.abort()
  }, [lat, lon]) // Se repite solo si cambian las coordenadas

  return state
}
