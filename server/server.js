/* Archivo principal de la aplicación */

import express from 'express'; // Importando 'Express'
import mongoose from 'mongoose'; // Importando 'Mongoose'
import dotenv from 'dotenv'; // Importando 'Dotenv' (para cargar el archivo .env en nuestra aplicación)
import seedRouter from './routes/seedRoutes.js'; // Importando el enrutador 'seedRouter'
import productRouter from './routes/productRoutes.js'; // Importando el enrutador 'productRouter'


// Utilizando 'dotenv' para cargar la información del archivo .env en nuestra app

dotenv.config();

// Conectarse a la base de datos de MongoDB

mongoose
    .connect(process.env.MONGODB_URL_LOCAL) // Accediendo a la variable de entorno 'MONGODB_URL_CLOUD' o 'MONGODB_URL_LOCAL'
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });

const app = express(); // Creando una aplicación 'Express'


// Implementando las rutas

app.use('/api/seed', seedRouter); // http://localhost:5000/api/seed + seedRouter

app.use('/api/products', productRouter); // http://localhost:5000/api/products + productRouter


// Levantando el servidor

const port = process.env.PORT || 5000; // Definiendo el puerto

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});