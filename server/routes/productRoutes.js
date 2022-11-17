/* En este archivo definiremos las rutas relacionadas al manejo de los productos */

import express from 'express'; // Importando 'Express'
import Product from '../models/productModel.js'; // Importando el Modelo

// Creando el enrutador

const productRouter = express.Router(); // Accediendo a 'Router'


/* Definiendo las rutas */

// Método para traer todos los productos (registros)
productRouter.get('/', async (req, res) => {

    const products = await Product.find();
    res.send(products);
});

// Método para traer un producto en particular, gracias a al acceder al parámetro 'slug'
productRouter.get('/slug/:slug', async (req, res) => {

    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

// Método para traer un producto en particular, gracias a al acceder al parámetro 'id'
productRouter.get('/:id', async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});

// Exportando este módulo

export default productRouter;

