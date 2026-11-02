/**
 * Fila de botones para filtrar las playas por isla.
 *
 * Es un componente controlado: recibe la isla elegida en `value` y avisa
 * con `onChange` cuando el usuario pulsa otra.
 */
import { ISLANDS, type Island } from '../data/beaches'

/** Isla elegida en el filtro, o `'all'` para ver todas. */
export type IslandOption = Island | 'all'

interface IslandFilterProps {
  /** Opción elegida ahora. */
  value: IslandOption
  /** Se llama con la opción nueva cuando el usuario pulsa un botón. */
  onChange: (value: IslandOption) => void
}

/** Opciones del filtro: "Todas" primero y después cada isla. */
const OPTIONS: { value: IslandOption; label: string }[] = [
  { value: 'all', label: 'Todas' },
  ...ISLANDS.map((island) => ({ value: island, label: island })),
]

export function IslandFilter({ value, onChange }: IslandFilterProps) {
  return (
    // En el móvil no caben todas: la fila se desplaza en horizontal
    <div
      role="group"
      aria-label="Filtrar por isla"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
    >
      {OPTIONS.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            // Indica a los lectores de pantalla qué botón está activo
            aria-pressed={selected}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap ${
              selected
                ? 'bg-sky-600 text-white'
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
