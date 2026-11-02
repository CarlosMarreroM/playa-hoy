/**
 * Tipos propios de la app: las playas y sus condiciones.
 * Los tipos de las respuestas de la API están aparte, en `openMeteo.ts`.
 */
import type { Island } from '../data/islands'

/** Una playa de la lista de `src/data/beaches.ts`. */
export interface Beach {
  /** Identificador único, en minúsculas y con guiones. Se usa como `key` de React. */
  id: string
  name: string
  /** Isla de la playa. Al ser `Island` y no `string`, una errata da error al compilar. */
  island: Island
  lat: number
  lon: number
}

/**
 * Condiciones de una playa en una hora concreta.
 * Cualquier valor puede ser `null` si Open-Meteo no tiene dato para esa hora.
 */
export interface BeachConditions {
  /**
   * Hora en formato ISO 8601 sin offset (ej. "2026-10-27T14:00"),
   * ya en la zona horaria pedida.
   * Viene de `hourly.time`.
   */
  time: string

  /**
   * Altura significativa de las olas, en metros.
   * Junta olas de viento y mar de fondo (swell) en un solo valor.
   * Viene de `wave_height` (API marina).
   */
  waveHeight: number | null

  /**
   * Temperatura del agua en la superficie del mar, en °C.
   * Viene de `sea_surface_temperature` (API marina).
   */
  waterTemp: number | null

  /**
   * Temperatura del aire a 2 m del suelo, en °C.
   * Viene de `temperature_2m` (API del tiempo).
   */
  airTemp: number | null

  /**
   * Velocidad del viento a 10 m del suelo en ese momento, en km/h.
   * Viene de `wind_speed_10m` (API del tiempo).
   */
  windSpeed: number | null

  /**
   * Racha máxima de viento a 10 m del suelo durante la hora anterior, en km/h.
   * Viene de `wind_gusts_10m` (API del tiempo).
   */
  windGusts: number | null

  /**
   * Parte del cielo cubierta por nubes, en % (0 a 100).
   * Viene de `cloud_cover` (API del tiempo).
   */
  cloudCover: number | null

  /**
   * Índice UV de esa hora (desde 0), teniendo en cuenta las nubes.
   * Viene de `uv_index` (API del tiempo).
   */
  uvIndex: number | null
}

/** Una playa junto con sus condiciones actuales. */
export interface BeachForecast {
  beach: Beach
  conditions: BeachConditions
}
