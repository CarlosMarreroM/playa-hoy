/**
 * Cliente de la API de Open-Meteo.
 *
 * Open-Meteo sirve la previsión marina y la del tiempo desde dos servidores
 * distintos, así que hay una instancia de axios para cada uno. Las dos comparten
 * la misma configuración (tiempo máximo de espera y zona horaria de Canarias).
 *
 * El resto de la app no usa axios directamente: llama a `getMarine` y `getWeather`.
 *
 * Datos: Open-Meteo (https://open-meteo.com) y DWD (servicio meteorológico alemán).
 */
import axios from 'axios'
import type { MarineResponse, WeatherResponse } from '../types/openMeteo'

/** Tiempo máximo de espera de cada petición, en milisegundos. */
const TIMEOUT_MS = 10_000

/** Días de previsión que se piden. En la fase 1 solo hace falta el de hoy. */
const FORECAST_DAYS = 1

/** Variables horarias que se piden a la API marina. */
const MARINE_VARIABLES = ['wave_height', 'sea_surface_temperature']

/** Variables horarias que se piden a la API del tiempo. */
const WEATHER_VARIABLES = [
  'temperature_2m',
  'wind_speed_10m',
  'wind_gusts_10m',
  'cloud_cover',
  'uv_index',
]

/** Instancia de axios para la API marina (oleaje y temperatura del agua). */
export const marineApi = axios.create({
  baseURL: 'https://marine-api.open-meteo.com/v1',
  timeout: TIMEOUT_MS,
  params: { timezone: 'Atlantic/Canary' },
})

/** Instancia de axios para la API del tiempo (temperatura, viento, nubes y UV). */
export const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: TIMEOUT_MS,
  params: { timezone: 'Atlantic/Canary' },
})

/**
 * Pide la previsión marina por horas de un punto: altura de ola y temperatura
 * del agua para hoy.
 *
 * @param latitude - Latitud del punto, en grados.
 * @param longitude - Longitud del punto, en grados.
 * @param signal - Opcional. Permite cancelar la petición, por ejemplo cuando el
 *   componente se desmonta antes de recibir la respuesta.
 * @returns La respuesta de la API tal cual llega, sin transformar.
 * @throws Error de axios si la petición falla, tarda más de `TIMEOUT_MS` o se
 *   cancela con `signal`.
 */
export async function getMarine(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<MarineResponse> {
  const response = await marineApi.get<MarineResponse>('/marine', {
    params: {
      latitude,
      longitude,
      hourly: MARINE_VARIABLES.join(','),
      forecast_days: FORECAST_DAYS,
    },
    signal,
  })

  return response.data
}

/**
 * Pide la previsión del tiempo por horas de un punto: temperatura del aire,
 * viento, rachas, nubosidad e índice UV para hoy.
 *
 * @param latitude - Latitud del punto, en grados.
 * @param longitude - Longitud del punto, en grados.
 * @param signal - Opcional. Permite cancelar la petición, por ejemplo cuando el
 *   componente se desmonta antes de recibir la respuesta.
 * @returns La respuesta de la API tal cual llega, sin transformar.
 * @throws Error de axios si la petición falla, tarda más de `TIMEOUT_MS` o se
 *   cancela con `signal`.
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  const response = await weatherApi.get<WeatherResponse>('/forecast', {
    params: {
      latitude,
      longitude,
      hourly: WEATHER_VARIABLES.join(','),
      forecast_days: FORECAST_DAYS,
    },
    signal,
  })

  return response.data
}
