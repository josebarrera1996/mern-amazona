/* Archivo principal de la aplicación */

import express from 'express'; // Importando 'Express'
import mongoose from 'mongoose'; // Importando 'Mongoose'
import dotenv from 'dotenv'; // Importando 'Dotenv' (para cargar el archivo .env en nuestra aplicación)
import data from './data.js';

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


app.get('/api/products', (req, res) => {
    res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
    const product = data.products.find(x => x.slug === req.params.slug);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product not found´' });
    }
});

app.get('/api/products/:id', (req, res) => {
    const product = data.products.find(x => x._id === req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product not found´' });
    }
});

// Levantando el servidor

const port = process.env.PORT || 5000; // Definiendo el puerto

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});