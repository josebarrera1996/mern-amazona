import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';

// Componente funcional
// Representará la sección para elegir el método de pago del pedido
export default function PaymentMethodScreen() {

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();

    // Accediendo al contexto
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const { cart: { shippingAddress, paymentMethod } } = state;


    // Utilizando 'useState'
    // Para manejar el método de pago
    const [paymentMethodName, setPaymentMethod] = useState(

        // El estado inicial será el método alojado en el LocalStorage o 'PayPal' por defecto
        paymentMethod || 'PayPal'
    );


    // Utilizando 'useEffect'
    // Para comprobar si el usuario ha ingresado la dirección para el envío del pedido
    useEffect(() => {

        // Si no la tiene, navegar a el paso previo, que es el de 'shipping'
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);


    // Método para seleccionar el método de pago del pedido
    const submitHandler = (e) => {

        e.preventDefault(); // Para evitar que la página se recargue

        // Despachar la acción 'SAVE_PAYMENT_METHOD' 
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });

        // Guardar el método seleccionado en el estado
        localStorage.setItem('paymentMethod', paymentMethodName);

        // Navegar hacia el último paso, para dar por finalizado el pedido
        navigate('/placeorder');
    }
    

    return (

        <div>
            {/* Renderizar el siguiente componente con 3 secciones resaltadas */}
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <div className="container small-container">
                {/* Cambiar el título de la pestaña del navegador */}
                <Helmet>
                    <title>Payment Method</title>
                </Helmet>
                <h1 className="my-3">Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    {/* Zona de 'Checkbox' */}
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="PayPal"
                            label="PayPal"
                            value="PayPal"
                            checked={paymentMethodName === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Stripe"
                            label="Stripe"
                            value="Stripe"
                            checked={paymentMethodName === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Continue</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
