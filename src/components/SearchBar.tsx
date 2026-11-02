/**
 * Campo para buscar playas por nombre.
 *
 * Es un componente controlado: no guarda el texto, lo recibe en `value`
 * y avisa con `onChange` cada vez que el usuario escribe.
 */

interface SearchBarProps {
  /** Texto que se muestra en el campo. */
  value: string
  /** Se llama con el texto nuevo cada vez que cambia. */
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div>
      {/* La etiqueta solo la leen los lectores de pantalla: el placeholder ya lo explica a la vista */}
      <label htmlFor="beach-search" className="sr-only">
        Buscar playa
      </label>
      <input
        id="beach-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar playa…"
        autoComplete="off"
        className="w-full rounded-full bg-white px-4 py-2 shadow-md outline-none focus:ring-2 focus:ring-sky-400"
      />
    </div>
  )
}
