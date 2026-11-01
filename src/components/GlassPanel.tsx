/**
 * Panel que envuelve todas las tarjetas de la app.
 *
 * De momento es un panel blanco normal. En la fase 6 se le dará el estilo
 * de cristal (Liquid Glass) y el cambio se aplicará a toda la app desde aquí.
 */
import type { ReactNode } from 'react'

interface GlassPanelProps {
  /** Lo que va dentro del panel: lo que se pone entre `<GlassPanel>` y `</GlassPanel>`. */
  children: ReactNode
  /** Opcional. Clases extra para casos concretos, como el color de la sombra según la nota. */
  className?: string
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`rounded-3xl bg-white p-4 shadow-md ${className}`}>
      {children}
    </div>
  )
}
