/* En este archivo definiremos las rutas relacionadas al manejo de las órdenes */

import express from 'express'; // Importando 'Express'
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js'; // Importando el Modelo
import { isAuth } from '../utils.js'; // Para chequear si el usuario está autenticado


// Creando el enrutador

const orderRouter = express.Router(); // Accediendo a 'Router'


/* Definiendo las rutas */

// Ruta para poder concretar la orden
orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {

    // Preparando la nueva orden
    const newOrder = new Order({

        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
    });

    // Guardando el nuevo registro en la B.D
    const order = await newOrder.save();

    // Enviar esta respuesta con el mensaje y la orden creada
    res.status(201).send({ message: 'New Order Created', order });
}));

// Ruta para poder acceder a una orden
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {

    // Obtenemos los datos de la órden que coincida con el parámetro 'id'
    const order = await Order.findById(req.params.id);

    // Si la orden existe..
    if (order) {

        // Enviar los datos de la misma
        res.send(order);

    } else {

        // En caso de error, enviar este mensaje de error
        res.status(404).send({ message: 'Order Not Found' });
    }
}));


// Exportando este módulo

export default orderRouter;

