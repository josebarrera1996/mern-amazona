/* Esta ruta servirá para borrar datos previos e insertar nuevos */

import express from 'express'; // Importando 'Express'
import Product from '../models/productModel.js'; // Importando el Modelo 'Product'
import data from '../data.js'; // Importando los datos

// Creando un enrutador

const seedRouter = express.Router(); // Accediendo a 'Router'

/* Definiendo las rutas */

// Ruta para borrar productos anteriores e insertar nuevos
seedRouter.get('/', async (req, res) => {

    // Remover los productos (registros) anteriores
    await Product.remove({}); // Método para eliminar todos los registros previos

    // Crear nuevos productos (registros), provenientes de 'data'
    const createdProducts = await Product.insertMany(data.products);

    // Enviando lo generado
    res.send({ createdProducts });
});


// Exportando este módulo

export default seedRouter;
