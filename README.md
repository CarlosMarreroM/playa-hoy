# ¿Playa hoy?

App web que te dice si merece la pena ir hoy a una playa de Canarias, con datos reales de olas, viento y temperatura del agua.

> En desarrollo. Sigue el progreso en el [tablero del proyecto](https://github.com/users/CarlosMarreroM/projects/4).

## Qué hará

- Elegir playas de Tenerife (y más adelante del resto de islas).
- Ver olas, viento, temperatura del agua y del aire.
- Una nota del día calculada por la app: **hoy sí / regular / hoy no**.

## Stack

- **React + TypeScript** con **Vite**
- **Tailwind CSS** para los estilos
- **axios** para las peticiones a la API
- **ESLint + Prettier** (con `prettier-plugin-tailwindcss` para ordenar las clases)

## Hoja de ruta

- [x] Fase 0: preproyecto
- [ ] Fase 1: una playa con datos reales
- [ ] Fase 2: todas las playas y nota del día
- [ ] Fase 3: detalle, rutas y favoritos
- [ ] Fase 4: gráficas y caché
- [ ] Fase 5: mapa
- [ ] Fase 6: tests y pulido

Cada fase tiene su issue con las tareas y se sigue en el tablero de GitHub Projects.

## Estructura

```
src/
├── data/
│   └── beaches.ts   # Lista de playas (nombre, isla, latitud, longitud)
├── App.tsx
└── main.tsx
```

La lista de playas es un archivo de datos propio; la API solo aporta la previsión.

## Arrancar en local

```bash
npm install
npm run dev
```

## Datos

Previsión meteorológica y marina de [Open-Meteo](https://open-meteo.com/), con datos del Deutscher Wetterdienst (DWD).
