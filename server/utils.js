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


// Función para comprobar si estamos autenticados

export const isAuth = (req, res, next) => {

    // Obtener el valor del parámetro 'authorization' de 'headers'
    const authorization = req.headers.authorization;

    // Si existe 'authorization'...
    if (authorization) {

        // Obtener el token (omitiendo el valor 'Bearer ')
        const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

        //  Verificar si hay coincidencia en los tokens 
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {

            // Si no hay coincidencia...
            if (err) {

                // Enviar este error
                res.status(401).send({ message: 'Invalid Token' });
            } else {

                // Si hay coincidencia, decodificarlo para obtener la información del usuario
                req.user = decode;

                // Seguir con el siguiente middleware
                next();
            }
        });

    } else {

        // En caso de que no haya token, enviar esta respuesta
        res.status(401).send({ message: 'No Token' });
    }
};