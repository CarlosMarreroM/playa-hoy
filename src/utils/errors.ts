/**
 * Mensajes de error para el usuario.
 */
import axios from 'axios'

/**
 * Convierte un error de la petición en un mensaje que se pueda mostrar al usuario.
 *
 * En un `catch`, TypeScript no sabe qué tipo tiene el error, así que llega como
 * `unknown` y hay que ir comprobando qué es.
 *
 * @param error El error capturado en el `catch`.
 * @returns Un mensaje en español para mostrar en la tarjeta.
 */
export function getErrorMessage(error: unknown): string {
  // Errores de axios: la API respondió con error, se pasó el tiempo o no hay conexión
  if (axios.isAxiosError(error)) {
    // Hubo respuesta, pero con un código de error (400, 500…)
    if (error.response) {
      return `El servicio respondió con un error (${error.response.status}).`
    }

    // No hubo respuesta porque se superó el `timeout` de la instancia
    if (error.code === 'ECONNABORTED') {
      return 'El servicio tardó demasiado en responder.'
    }

    // No hubo respuesta por otro motivo: sin internet, dominio mal escrito…
    return 'No se pudo conectar. Revisa tu conexión.'
  }

  // Errores normales de JavaScript, como el `throw new Error(...)` de `toBeachConditions`
  if (error instanceof Error) {
    return error.message
  }

  // Cualquier otra cosa que no esperábamos
  return 'Ha ocurrido un error inesperado.'
}
