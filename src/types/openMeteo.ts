export interface MarineResponse {
  latitude: number
  longitude: number
  timezone: string
  hourly: {
    time: string[]
    wave_height: (number | null)[]
    sea_surface_temperature: (number | null)[]
  }
}

export interface WeatherResponse {
  latitude: number
  longitude: number
  timezone: string
  hourly: {
    time: string[]
    temperature_2m: (number | null)[]
    wind_speed_10m: (number | null)[]
    wind_gusts_10m: (number | null)[]
    cloud_cover: (number | null)[]
    uv_index: (number | null)[]
  }
}

