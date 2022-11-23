import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

// Componente funcional
// Representará un formulario para que el usuario llene sus campos

export default function ShippingAddressScreen() {

    // Utilizando 'useNavigate' para el manejo de navegación entre rutas
    const navigate = useNavigate();

    // Accediendo al contexto de React
    const { state, dispatch: ctxDispatch } = useContext(Store);

    // Accediendo al estado para poder preservar la dirección de envío en este formulario
    const { userInfo, cart: { shippingAddress } } = state;

    // Utilizando 'useState' para manejar el ingreso en los campos input del formulario
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    // Método para dar por finalizado la sección del 'Shipping Address' y poder continuar 
    const submitHandler = (e) => {

        e.preventDefault(); // Para evitar que la página se recargue

        // Utilizando 'dispatch' para enviar una acción al contexto de React
        ctxDispatch({

            // Acción
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {

                fullName,
                address,
                city,
                postalCode,
                country
            }
        });

        // Guardar la dirección en el LocalStorage
        localStorage.setItem('shippingAddress', JSON.stringify({
            fullName, address, city, postalCode, country
        }));

        // Navegar a la sección del pago
        navigate('/payment');
    }

    // Utilizando 'useEffect'
    // Para corroborar si el usuario está o no logeado
    useEffect(() => {

        if (!userInfo) {

            // Si no estoy logeado, direccionarnos a la ruta de 'signin'
            // Si luego inicio sesión, que nos direccione a la ruta de 'shipping'
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    return (

        <div>
            {/* Definiendo el título de la pestaña del navegador */}
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>
            {/* Renderizando 'CheckoutSteps' */}
            {/* Los pasos '1' y '2' son los que estarán activos. Ya que estamos logeados y estamos en 'ShippingAddres' */}
            <CheckoutSteps step1 step2></CheckoutSteps>
            <div className='container small-container'>
                <h1 className='my-3'>Shipping Address</h1>
                <Form onSubmit={submitHandler}>
                    {/* Campo para el nombre completo */}
                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {/* Campo para ingresar la dirección */}
                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {/* Campo para ingresar la ciudad */}
                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {/* Campo para ingresar el código postal */}
                    <Form.Group className="mb-3" controlId="postalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {/* Campo para ingresar el país */}
                    <Form.Group className="mb-3" controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        {/* Si todo está correcto, se nos llevará a la sección del 'Checkout' */}
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}


