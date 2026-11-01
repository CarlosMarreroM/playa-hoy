/**
 * Componente raíz de la app.
 * En la fase 1 muestra una sola playa; en la fase 2 será la lista completa.
 */
import { BeachCard } from './components/BeachCard'
import { beaches } from './data/beaches'

function App() {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* mx-auto centra, max-w-md limita el ancho en pantallas grandes, p-4 da margen */}
      <main className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-2xl font-bold">¿Playa hoy?</h1>
        <BeachCard beach={beaches[0]} />
      </main>

      {/* Atribución obligatoria de los datos */}
      <footer className="mx-auto max-w-md p-4 text-center text-xs text-gray-500">
        Datos de{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open-Meteo
        </a>{' '}
        y DWD (servicio meteorológico alemán).
      </footer>
    </div>
  )
}

export default App