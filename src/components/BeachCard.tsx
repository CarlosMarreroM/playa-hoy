/**
 * Tarjeta con las condiciones actuales de una playa.
 *
 * Solo muestra datos: los recibe ya cargados por props. Quien la usa
 * (por ejemplo `BeachList`) se encarga de pedirlos y de calcular la nota.
 */
import type { Beach, BeachConditions } from '../types/beach'
import type { Rating } from '../utils/rating'
import { formatValue } from '../utils/format'
import { GlassPanel } from './GlassPanel'
import { RATING_STYLES } from '../styles/ratingStyles'

interface BeachCardProps {
  /** Playa de la que se muestran los datos. */
  beach: Beach
  /** Condiciones actuales de la playa. */
  conditions: BeachConditions
  /** Nota del día, o `null` si no se ha podido calcular. */
  rating: Rating | null
}

export function BeachCard({ beach, conditions: data, rating }: BeachCardProps) {
  // data.time tiene el formato "2026-10-28T16:00": los caracteres 11 a 15 son la hora
  const hour = data.time.slice(11, 16)

  // Si no hay nota (faltan todos los datos), no hay estilo y no se muestra la píldora
  const style = rating ? RATING_STYLES[rating] : null

  return (
    <GlassPanel className={style?.shadow}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{beach.name}</h2>
          <p className="text-sm text-gray-500">
            {beach.island} · datos de las {hour}
          </p>
        </div>

        {style && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${style.badge}`}
          >
            {style.label}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <DataItem label="Olas" value={formatValue(data.waveHeight, 'm')} />
        <DataItem label="Agua" value={formatValue(data.waterTemp, '°C')} />
        <DataItem label="Aire" value={formatValue(data.airTemp, '°C')} />
        <DataItem
          label="Viento"
          value={formatValue(data.windSpeed, 'km/h', 0)}
        />
        <DataItem
          label="Rachas"
          value={formatValue(data.windGusts, 'km/h', 0)}
        />
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
