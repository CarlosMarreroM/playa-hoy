/**
 * Tarjeta con las condiciones actuales de una playa.
 *
 * Los datos los consigue el hook `useBeachForecast`; la tarjeta solo se
 * encarga de mostrar uno de los tres estados: cargando, error o los datos.
 */
import type { Beach } from '../data/beaches'
import { useBeachForecast } from '../hooks/useBeachForecast'
import { formatValue } from '../utils/format'
import { GlassPanel } from './GlassPanel'

interface BeachCardProps {
  /** Playa de la que se muestran los datos. */
  beach: Beach
}

export function BeachCard({ beach }: BeachCardProps) {
  // El hook se encarga de pedir los datos; la tarjeta solo los muestra
  const state = useBeachForecast(beach.lat, beach.lon)

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