import jwt from 'jsonwebtoken';

/* Función para generar el token */
// Este token servirá para crear solicitudes autenticadas:
// - Actualizar la información del usuario
// - Realizar pedidos
// - etc

export const generateToken = (user) => {

    // Utilizaremos el objeto 'jwt' de 'jsonwebtoken' y llamar a la función 'sign'
    // Tendrá 3 parámetros:
    // - En el primero colocaremos del objeto 'user' sus propiedades (algunasd)
    // - En el segundo colocaremos la clave secreta  de 'jwt'. Es una cadena encriptada para cifrar los datos
    // - En el tercero colocaremos las opciones como las de cuando expirará el token, etc
    return jwt.sign({

        // Propiedades
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin

    },
        process.env.JWT_SECRET, {

        expiresIn: '30d', // El token generado expirará en '30' días
    });
};