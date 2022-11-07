/* Archivo principal de la aplicación */

import express from 'express'; // Importando 'Express'
import data from './data.js';

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

// Levantando el servidor

const port = process.env.PORT || 5000; // Definiendo el puerto

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});