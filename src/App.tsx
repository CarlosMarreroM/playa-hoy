/**
 * Componente raíz de la app.
 * Muestra la lista de playas con buscador, filtro por isla y ordenada por nota.
 */
import { BeachList } from './components/BeachList'

function App() {
  return (
    <div className="min-h-screen bg-sky-50">
      {/* mx-auto centra, max-w-6xl deja sitio para 3 columnas de tarjetas, p-4 da margen */}
      <main className="mx-auto max-w-6xl p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">¿Playa hoy?</h1>
          <p className="text-gray-600">
            Olas, viento y temperatura del agua ahora mismo en las playas de
            Canarias, de mejor a peor para bañarse.
          </p>
        </header>
        <BeachList />
      </main>

      {/* Atribución obligatoria de los datos */}
      <footer className="mx-auto max-w-6xl p-4 text-center text-xs text-gray-500">
        Datos de{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open-Meteo
        </a>{' '}
        y DWD (servicio meteorológico alemán). Ubicación de las playas: ©{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          colaboradores de OpenStreetMap
        </a>
        .
      </footer>
    </div>
  )
}

export default App
