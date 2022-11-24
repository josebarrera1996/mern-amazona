/* En este archivo definiremos las rutas relacionadas al manejo de los productos */

import express from 'express'; // Importando 'Express'
import expressAsyncHandler from 'express-async-handler'; // Importando 'express-async-handler'
import User from '../models/userModel.js'; // Importando el Modelo
import bcrypt from 'bcryptjs'; // Importando 'Bcryptjs'
import { generateToken } from '../utils.js';

// Creando el enrutador

const userRouter = express.Router(); // Accediendo a 'Router'

/* Definiendo las rutas */
// Se utilizará 'expressAsyncHandler' para el manejo de errores en las funciones asíncronas. Esto será manejado en 'server.js'

// Ruta para poder registrarnos
userRouter.post('/signup', expressAsyncHandler(async (req, res) => {

    // Preparando el documento a insertar
    const newUser = new User({

        // Campos
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
    });

    // Insertándolo en la B.D
    const user = await newUser.save();

    // Enviando la respuesta de lo obtenido
    res.send({

        // Campos
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    });
}));

// Ruta para poder logearnos
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {

    /* Vefificar si el usuario ya se encuentra registrado (gracias a su email)  */

    // Traer los datos del usuario gracias a su email
    const user = await User.findOne({ email: req.body.email });

    // Chequear si existe...
    if (user) { // Si existe...

        // Verificar si la contraseña ingresada coincida con la contraseña alojada en la B.D (encriptada)
        if (bcrypt.compareSync(req.body.password, user.password)) { // Si coinciden...

            // Enviar toda la información (incluido el token)
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });

            return;
        }
    }

    // Si el email o la contraseña ingresada son incorrectas...
    res.status(401).send({ message: 'Invalid email or password' });
}));


// Exportando este módulo

export default userRouter;