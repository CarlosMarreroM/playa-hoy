# ¿Playa hoy?

App web que te dice si merece la pena ir hoy a una playa de Canarias, con datos reales de olas, viento y temperatura del agua.

**Demo:** <https://carlosmarrerom.github.io/playa-hoy/>

> En desarrollo. Sigue el progreso en el [tablero del proyecto](https://github.com/users/CarlosMarreroM/projects/4).

## Qué hace ahora

- Muestra las condiciones actuales de una playa de Tenerife con datos reales: olas, temperatura del agua y del aire, viento, rachas, nubes e índice UV.
- Enseña en todo momento si está cargando, si ha habido un error o los datos.
- Se ve bien en el móvil.

## Qué hará

- Elegir playas de Tenerife (y más adelante del resto de islas).
- Una nota del día calculada por la app: **hoy sí / regular / hoy no**.
- Detalle por horas, favoritos, gráficas y mapa.

## Stack

- **React + TypeScript** con **Vite**
- **Tailwind CSS** para los estilos
- **axios** para las peticiones a la API
- **ESLint + Prettier** (con `prettier-plugin-tailwindcss` para ordenar las clases)
- **GitHub Actions + GitHub Pages** para el despliegue automático en cada push a `main`

## Hoja de ruta

- [x] Fase 0: preproyecto
- [x] Fase 1: una playa con datos reales
- [ ] Fase 2: todas las playas y nota del día
- [ ] Fase 3: detalle, rutas y favoritos
- [ ] Fase 4: gráficas y caché
- [ ] Fase 5: mapa
- [ ] Fase 6: tests y pulido

Cada fase tiene su issue con las tareas y se sigue en el tablero de GitHub Projects.

## Estructura

```
src/
├── api/
│   └── openMeteo.ts      # Llamadas a Open-Meteo (instancias de axios)
├── components/
│   ├── BeachCard.tsx     # Tarjeta con las condiciones de una playa
│   └── GlassPanel.tsx    # Contenedor común de las tarjetas
├── data/
│   └── beaches.ts        # Lista de playas (nombre, isla, latitud, longitud)
├── types/
│   ├── beach.ts          # Tipos propios de la app (BeachConditions)
│   └── openMeteo.ts      # Tipos de las respuestas de la API
├── utils/
│   ├── errors.ts         # Mensajes de error para el usuario
│   ├── format.ts         # Formato de los valores en pantalla
│   └── transform.ts      # Respuestas de la API → BeachConditions
├── App.tsx
└── main.tsx
```

La lista de playas es un archivo de datos propio; la API solo aporta la previsión. El despliegue está en `.github/workflows/deploy.yml`.

## Arrancar en local

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de producción en dist/
npm run preview   # sirve el build en local para comprobarlo
```

## Decisiones técnicas

- **axios en lugar de `fetch`.** Antes de usar axios, hice una llamada de prueba con `fetch`: solo lanza error si falla la red, y los errores HTTP (400, 500…) hay que comprobarlos a mano con `response.ok`. axios lanza el error en los dos casos, convierte el JSON automáticamente y permite configurar un tiempo máximo de espera.
- **Una instancia de axios por API.** Open-Meteo sirve la previsión marina y la del tiempo desde servidores distintos. Cada instancia tiene su URL base, un `timeout` y la zona horaria de Canarias por defecto, para que nunca falte en una petición.
- **`Promise.all` para las dos APIs.** Las peticiones del mar y del tiempo salen a la vez en lugar de una detrás de otra, así que la espera es la de la más lenta y no la suma de las dos.
- **Dos niveles de tipos.** Los tipos de `types/openMeteo.ts` reflejan el JSON tal como llega (arrays paralelos por horas). Una función de transformación los convierte en `BeachConditions`, el tipo que usa la interfaz. Si cambiara la API, solo habría que tocar la transformación.
- **Estado como unión discriminada.** El estado de la petición es `loading`, `error` o `success`, y cada uno lleva solo sus datos. Así es imposible tener a la vez datos y error, y TypeScript obliga a tratar cada caso.
- **Cancelación con `AbortController`.** Si la tarjeta desaparece antes de que lleguen los datos, la petición se cancela en la limpieza del `useEffect`.
- **Variables separadas por comas.** Open-Meteo documenta las listas de variables separadas por comas, así que se envían con `join(',')` en lugar de dejar que axios use su formato con corchetes (`hourly[]=`).

### Limitaciones conocidas

- La hora actual se calcula con la hora del navegador, mientras que la API devuelve la hora de Canarias. Desde otra zona horaria, los datos tendrían una hora de desfase. Pendiente de calcularla con `Intl.DateTimeFormat`.

## Datos

Previsión meteorológica y marina de [Open-Meteo](https://open-meteo.com/), con datos del Deutscher Wetterdienst (DWD).
