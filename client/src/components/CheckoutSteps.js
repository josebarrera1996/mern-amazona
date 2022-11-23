import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Componente funcional
// Representará un encabezado, mostrando los pasos a completar para realizar el Checkout
export default function CheckoutSteps(props) {

    return (

        <Row className="checkout-steps">
            {/* Se aplicarán estilos dependiendo de si se cumplen las condiciones. Más en específico,
                se resaltarán las secciones completadas y en la que estemos actualmente */}
            <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
            <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
            <Col className={props.step3 ? 'active' : ''}>Payment</Col>
            <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
        </Row>
    );
}