// Función para obtener los mensajes de 'error' del servidor
export const getError = (error) => { // El argumento que recibirá será el de un objeto de 'error'

    return error.response && error.response.data.message 
        ? error.response.data.message // Retornar el mensaje de error del server
        : error.message; // Caso contrario, retornar un mensaje de error general del propio objeto
};