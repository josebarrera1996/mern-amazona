/* En este archivo crearemos un Modelo de la B.D con Mongoose */

import mongoose from 'mongoose'; // Importando el ORM 'Mongoose'

// Definiendo un 'Schema'

const orderSchema = new mongoose.Schema({

    // Arreglo de documentos anidados
    orderItems: [

        // Campos para los 'items'
        {
            slug: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            // Referencia a el modelo de 'Product'
            product: {

                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],

    // Documento anidado 'shippingAddress' (dirección para el envío del pedido)
    shippingAddress: {

        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true },

    paymentResult: {

        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },

    // Campos para poder obtener el total del pedido
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // Referencia al modelo 'User' (guardar la referencia del usuario que realizó el pedido)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
    // Opciones
    {
        // Cada vez que creemos documentos en la colección, se agregarán dos campos:
        // - createdAt
        // - updatedAt
        timestamps: true,
    }
)

// Creando un modelo en base al Schema

const Order = mongoose.model('Order', orderSchema);

// Exportando este Modelo

export default Order;