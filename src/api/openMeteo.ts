/**
 * Cliente de la API de Open-Meteo.
 *
 * Open-Meteo sirve la previsión marina y la del tiempo desde dos servidores
 * distintos, así que hay una instancia de axios para cada uno. Las dos comparten
 * la misma configuración (tiempo máximo de espera y zona horaria de Canarias).
 *
 * El resto de la app no usa axios directamente: llama a `getMarineBatch` y
 * `getWeatherBatch` (varios puntos en una petición) o a `getMarine` y
 * `getWeather` (un solo punto).
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

/** Coordenadas de un punto de la costa, en grados. */
export interface Coordinates {
  lat: number
  lon: number
}

/**
 * Convierte una lista de puntos en los parámetros `latitude` y `longitude`.
 * Open-Meteo acepta varias coordenadas separadas por comas y devuelve una
 * respuesta por punto, en el mismo orden.
 */
function toCoordinateParams(points: Coordinates[]) {
  return {
    latitude: points.map((point) => point.lat).join(','),
    longitude: points.map((point) => point.lon).join(','),
  }
}

/**
 * Con un solo punto la API devuelve un objeto; con varios, un array.
 * Esta función devuelve siempre un array para tratar los dos casos igual.
 *
 * @throws {Error} Si no llega una respuesta por cada punto pedido.
 */
function toResponseList<T>(data: T | T[], expected: number): T[] {
  const list = Array.isArray(data) ? data : [data]

  if (list.length !== expected) {
    throw new Error('La previsión no ha llegado completa')
  }

  return list
}

/**
 * Pide la previsión marina por horas de varios puntos en una sola petición:
 * altura de ola y temperatura del agua para hoy.
 *
 * @param points - Puntos de los que se pide la previsión.
 * @param signal - Opcional. Permite cancelar la petición, por ejemplo cuando el
 *   componente se desmonta antes de recibir la respuesta.
 * @returns Una respuesta por punto, en el mismo orden que `points`.
 * @throws Error de axios si la petición falla, tarda más de `TIMEOUT_MS` o se
 *   cancela con `signal`.
 */
export async function getMarineBatch(
  points: Coordinates[],
  signal?: AbortSignal,
): Promise<MarineResponse[]> {
  const response = await marineApi.get<MarineResponse | MarineResponse[]>(
    '/marine',
    {
      params: {
        ...toCoordinateParams(points),
        hourly: MARINE_VARIABLES.join(','),
        forecast_days: FORECAST_DAYS,
      },
      signal,
    },
  )

  return toResponseList(response.data, points.length)
}

/**
 * Pide la previsión del tiempo por horas de varios puntos en una sola petición:
 * temperatura del aire, viento, rachas, nubosidad e índice UV para hoy.
 *
 * @param points - Puntos de los que se pide la previsión.
 * @param signal - Opcional. Permite cancelar la petición.
 * @returns Una respuesta por punto, en el mismo orden que `points`.
 * @throws Error de axios si la petición falla, tarda más de `TIMEOUT_MS` o se
 *   cancela con `signal`.
 */
export async function getWeatherBatch(
  points: Coordinates[],
  signal?: AbortSignal,
): Promise<WeatherResponse[]> {
  const response = await weatherApi.get<WeatherResponse | WeatherResponse[]>(
    '/forecast',
    {
      params: {
        ...toCoordinateParams(points),
        hourly: WEATHER_VARIABLES.join(','),
        forecast_days: FORECAST_DAYS,
      },
      signal,
    },
  )

  return toResponseList(response.data, points.length)
}

/**
 * Pide la previsión marina de un solo punto.
 *
 * @param latitude - Latitud del punto, en grados.
 * @param longitude - Longitud del punto, en grados.
 * @param signal - Opcional. Permite cancelar la petición.
 * @returns La respuesta de la API tal cual llega, sin transformar.
 */
export async function getMarine(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<MarineResponse> {
  const [response] = await getMarineBatch(
    [{ lat: latitude, lon: longitude }],
    signal,
  )
  return response
}

/**
 * Pide la previsión del tiempo de un solo punto.
 *
 * @param latitude - Latitud del punto, en grados.
 * @param longitude - Longitud del punto, en grados.
 * @param signal - Opcional. Permite cancelar la petición.
 * @returns La respuesta de la API tal cual llega, sin transformar.
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  const [response] = await getWeatherBatch(
    [{ lat: latitude, lon: longitude }],
    signal,
  )
  return response
}
