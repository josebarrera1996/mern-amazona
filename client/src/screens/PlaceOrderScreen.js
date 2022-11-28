import { useContext, useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';

// Componente funcional
// En este componente se visualizará todo los pasos previos que completó el usuario con respecto al pedido
export default function PlaceOrderScreen() {

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();


    // Accediendo al contexto de React
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const { cart, userInfo } = state;


    // Método para redondear los valores númericos (y la gran mayoría de punto flotante)
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

    // Calculando los precios de los items del carrito
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );

    // Calculando el precio de costo del envió del pedido
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);

    // Calculando el precio de los impuestos
    cart.taxPrice = round2(0.15 * cart.itemsPrice);

    // Calculando el total, al sumar -> el precio de la totalidad de los items + costo de envío + impuestos
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;


    // Método para dar por realizado al pedido
    const placeOrderHandler = async () => { };


    // Utilizando 'useEffect' para chequear si el usuario ha elegido un método de pago para el pedido
    useEffect(() => {

        // Si no lo ha hecho, navegar a la sección 'payment'
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);



    return (

        <div>
            {/* Renderizando este componente con 4 pasos completados */}
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            {/* Utilizando 'Helmet' para definir el título de la pestaña */}
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1 className='my-3'>Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                                {cart.shippingAddress.country}
                            </Card.Text>
                            {/* Posibilidad de editar la dirección de envío del pedido */}
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </Card.Text>
                            {/* Posibilidad de modificar el método de pago */}
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            {/* Posibilidad de modificar los items almacenados en el Carrito */}
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cart.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${cart.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
