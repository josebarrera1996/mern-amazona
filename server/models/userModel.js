/* En este archivo crearemos un Modelo de la B.D con Mongoose */

import mongoose from 'mongoose'; // Importando el ORM 'Mongoose'

// Definiendo un 'Schema'

const userSchema = new mongoose.Schema({

    // Definiendo los campos
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
},
    // Opciones
    {
        // Cada vez que creemos documentos en la colección, se agregarán dos campos:
        // - createdAt
        // - updatedAt
        timestamps: true,
    }
);

// Creando un modelo en base al Schema

const User = mongoose.model('User', userSchema); // La colección será 'Users'

// Exportando este Modelo

export default User;