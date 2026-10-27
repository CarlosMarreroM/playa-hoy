import { useEffect } from 'react';
import { toBeachConditions } from '../utils/transform'

const COORDS = 'latitude=28.47&longitude=-16.25&timezone=Atlantic/Canary';

const URL_MARINA =
  `https://marine-api.open-meteo.com/v1/marine?${COORDS}` +
  '&hourly=wave_height,sea_surface_temperature';

const URL_TIEMPO =
  `https://api.open-meteo.com/v1/forecast?${COORDS}` +
  '&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,cloud_cover,uv_index';

// Función reutilizable: hace el fetch, comprueba el estado y devuelve el JSON
async function getJSON(url: string, signal?: AbortSignal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status} en ${url}`);
  return response.json();
}

export function PruebaFetch() {
  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      try {
        // Las dos peticiones van en paralelo
        const [marina, tiempo] = await Promise.all([
          getJSON(URL_MARINA, controller.signal),
          getJSON(URL_TIEMPO, controller.signal),
        ]);
        // console.log('Marina:', marina);
        // console.log('Tiempo:', tiempo);
        console.log(toBeachConditions(marina, tiempo))
      } catch (error) {
        if (controller.signal.aborted) return; // cancelado a propósito, no es un error
        console.error('Error:', error);
      }
    }

    cargar();
    return () => controller.abort(); // si el componente desaparece, cancela los fetch
  }, []);

  return <p>Mira la consola</p>;
}
