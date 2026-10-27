import type { MarineResponse, WeatherResponse } from '../types/openMeteo'
import type { BeachConditions } from '../types/beach'

/**
 * Convierte un número en texto de dos cifras, con un cero delante si hace falta.
 * Ej.: 9 → "09", 14 → "14".
 */
function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Busca la posición de la hora actual en el array de horas de Open-Meteo.
 *
 * Construye la hora actual con el mismo formato que la API ("2026-10-27T14:00")
 * y la busca en el array.
 *
 * Limitación: usa la hora del navegador, mientras que la API devuelve la hora
 * de Canarias (`timezone=Atlantic/Canary`). Desde otra zona horaria, por ejemplo
 * Madrid, el resultado tendría una hora de diferencia.
 * TODO: calcular la hora de Canarias con `Intl.DateTimeFormat` y `timeZone`.
 *
 * @param times Array de horas de la respuesta (`hourly.time`).
 * @returns La posición de la hora actual, o -1 si no está en el array.
 */
export function getCurrentHourIndex(times: string[]): number {
  const now = new Date()

  const year = now.getFullYear()
  const month = pad(now.getMonth() + 1)
  const day = pad(now.getDate())
  const hour = pad(now.getHours())

  const currentHour = `${year}-${month}-${day}T${hour}:00`

  return times.indexOf(currentHour)
}

/**
 * Junta las respuestas de las APIs marina y del tiempo en las condiciones
 * de la playa para la hora actual.
 *
 * Calcula un índice para cada API por separado, para no depender de que
 * los dos arrays de horas empiecen en el mismo momento.
 *
 * @param marine Respuesta de la API marina.
 * @param weather Respuesta de la API del tiempo.
 * @returns Las condiciones de la hora actual. Un valor es `null` si la API no lo tiene.
 * @throws {Error} Si alguna de las dos respuestas no tiene datos de la hora actual.
 */
export function toBeachConditions(
  marine: MarineResponse,
  weather: WeatherResponse,
): BeachConditions {
  const marineIndex = getCurrentHourIndex(marine.hourly.time)
  const weatherIndex = getCurrentHourIndex(weather.hourly.time)

  if (marineIndex === -1 || weatherIndex === -1) {
    throw new Error('No hay datos para la hora actual')
  }

  return {
    time: marine.hourly.time[marineIndex],
    waveHeight: marine.hourly.wave_height[marineIndex] ?? null,
    waterTemp: marine.hourly.sea_surface_temperature[marineIndex] ?? null,
    airTemp: weather.hourly.temperature_2m[weatherIndex] ?? null,
    windSpeed: weather.hourly.wind_speed_10m[weatherIndex] ?? null,
    windGusts: weather.hourly.wind_gusts_10m[weatherIndex] ?? null,
    cloudCover: weather.hourly.cloud_cover[weatherIndex] ?? null,
    uvIndex: weather.hourly.uv_index[weatherIndex] ?? null
  }
}