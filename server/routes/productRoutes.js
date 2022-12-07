/* En este archivo definiremos las rutas relacionadas al manejo de los productos */

import express from 'express'; // Importando 'Express'
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js'; // Importando el Modelo

// Creando el enrutador

const productRouter = express.Router(); // Accediendo a 'Router'


/* Definiendo las rutas */

// Método para traer todos los productos (registros)
productRouter.get('/', async (req, res) => {

    const products = await Product.find();
    res.send(products);
});

// Método para traer las categorías (únicas) de los productos
productRouter.get('/categories', expressAsyncHandler(async (req, res) => {

    // Método para traer los registros no duplicados
    const categories = await Product.find().distinct('category');

    res.send(products);
}));

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

