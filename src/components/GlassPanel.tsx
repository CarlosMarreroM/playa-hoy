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
}

export function GlassPanel({ children }: GlassPanelProps) {
  return <div className="rounded-3xl bg-white p-4 shadow-md">{children}</div>
}