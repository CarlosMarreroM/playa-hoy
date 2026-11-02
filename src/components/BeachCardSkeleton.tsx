/**
 * Tarjeta provisional que se muestra mientras cargan los datos.
 *
 * Tiene la misma forma que `BeachCard` (título, píldora y 7 datos) pero con
 * bloques grises que parpadean. Así el usuario ve que algo está cargando y
 * la página no cambia de tamaño cuando llegan los datos.
 */
import { GlassPanel } from './GlassPanel'

/** Número de datos de la tarjeta real: olas, agua, aire, viento, rachas, nubes y UV. */
const DATA_ITEMS = 7

export function BeachCardSkeleton() {
  return (
    // Los bloques no tienen texto, así que los lectores de pantalla no leen nada.
    // El aviso de "cargando" lo pone `BeachList`
    <GlassPanel className="@container h-full animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="h-5 w-2/3 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
        </div>
        <div className="h-7 w-16 shrink-0 rounded-full bg-gray-200" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 @sm:grid-cols-3">
        {Array.from({ length: DATA_ITEMS }, (_, index) => (
          <div key={index}>
            <div className="h-4 w-12 rounded bg-gray-100" />
            <div className="mt-2 h-7 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
