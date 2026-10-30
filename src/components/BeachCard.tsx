/**
 * Tarjeta con las condiciones actuales de una playa.
 *
 * Al aparecer, pide a la vez los datos del mar y del tiempo, los transforma
 * en `BeachConditions` y los muestra. En cada momento enseña uno de tres
 * estados: cargando, error o los datos.
 */
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Beach } from '../data/beaches'
import type { BeachConditions } from '../types/beach'
import { getMarine, getWeather } from '../api/openMeteo'
import { toBeachConditions } from '../utils/transform'
import { getErrorMessage } from '../utils/errors'
import { formatValue } from '../utils/format'
import { GlassPanel } from './GlassPanel'

/**
 * Estado de la petición. Es una unión discriminada: `status` indica en cuál
 * de las tres situaciones está, y cada una lleva solo los datos que tienen
 * sentido. Así es imposible tener, por ejemplo, datos y error a la vez.
 */
type FetchState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: BeachConditions }

interface BeachCardProps {
  /** Playa de la que se muestran los datos. */
  beach: Beach
}

export function BeachCard({ beach }: BeachCardProps) {
  // Empieza en 'loading' porque, al aparecer la tarjeta, lo primero es cargar los datos
  const [state, setState] = useState<FetchState>({ status: 'loading' })

  useEffect(() => {
    // Permite cancelar las peticiones si la tarjeta desaparece o cambia la playa
    const controller = new AbortController()

    // El efecto no puede ser async, así que la función async va dentro
    async function load() {
      try {
        // Las dos peticiones salen a la vez; se espera a que terminen ambas.
        // Los resultados llegan en el mismo orden en que se pidieron.
        const [marine, weather] = await Promise.all([
          getMarine(beach.lat, beach.lon, controller.signal),
          getWeather(beach.lat, beach.lon, controller.signal),
        ])

        setState({ status: 'success', data: toBeachConditions(marine, weather) })
      } catch (error) {
        // Una cancelación la provocamos nosotros a propósito: no es un error para el usuario
        if (axios.isCancel(error)) return

        setState({ status: 'error', message: getErrorMessage(error) })
      }
    }

    load()

    // Limpieza: React la ejecuta cuando la tarjeta desaparece o antes de repetir el efecto
    return () => controller.abort()
  }, [beach.lat, beach.lon]) // Se repite solo si cambian las coordenadas

  // Los hooks van siempre antes de cualquier return: deben ejecutarse en cada renderizado

  if (state.status === 'loading') {
    return (
      <GlassPanel>
        <p className="text-gray-500">Cargando datos de {beach.name}…</p>
      </GlassPanel>
    )
  }

  if (state.status === 'error') {
    return (
      <GlassPanel>
        <p className="font-semibold">{beach.name}</p>
        {/* Aquí TypeScript ya sabe que el estado es el de error y tiene `message` */}
        <p className="mt-2 text-red-600">{state.message}</p>
      </GlassPanel>
    )
  }

  // Los dos if anteriores han descartado 'loading' y 'error': solo queda 'success'
  const { data } = state

  // data.time tiene el formato "2026-10-28T16:00": los caracteres 11 a 15 son la hora
  const hour = data.time.slice(11, 16)

  return (
    <GlassPanel>
      <h2 className="text-lg font-semibold">{beach.name}</h2>
      <p className="text-sm text-gray-500">
        {beach.island} · datos de las {hour}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <DataItem label="Olas" value={formatValue(data.waveHeight, 'm')} />
        <DataItem label="Agua" value={formatValue(data.waterTemp, '°C')} />
        <DataItem label="Aire" value={formatValue(data.airTemp, '°C')} />
        <DataItem label="Viento" value={formatValue(data.windSpeed, 'km/h', 0)} />
        <DataItem label="Rachas" value={formatValue(data.windGusts, 'km/h', 0)} />
        <DataItem label="Nubes" value={formatValue(data.cloudCover, '%', 0)} />
        <DataItem label="Índice UV" value={formatValue(data.uvIndex, '', 0)} />
      </div>
    </GlassPanel>
  )
}

interface DataItemProps {
  /** Nombre del dato, por ejemplo "Olas". */
  label: string
  /** Valor ya formateado, por ejemplo "1.2 m". */
  value: string
}

/**
 * Un dato de la tarjeta: la etiqueta pequeña arriba y el valor en grande debajo.
 * No se exporta porque solo se usa dentro de `BeachCard`.
 */
function DataItem({ label, value }: DataItemProps) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}