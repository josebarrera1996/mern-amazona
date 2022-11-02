/* Archivo principal de la aplicación */

import express from 'express'; // Importando 'Express'
import data from './data.js';

const app = express(); // Creando una aplicación 'Express'


app.get('/api/products', (req, res) => {
    res.send(data.products);
});

// Levantando el servidor

const port = process.env.PORT || 5000; // Definiendo el puerto

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});