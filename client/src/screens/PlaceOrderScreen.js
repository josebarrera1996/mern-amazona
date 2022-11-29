import { useReducer, useContext, useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';


// Definiendo un 'reducer' para manejar los distintos estados al enviar una petición 'ajax'
// El 1er parámetro hace referencia al 'estado' actual
// El 2do parámetro es la 'acción' que cambia el estado y crea uno nuevo
const reducer = (state, action) => {

    // Utilizando 'switch' para comparar los tipos de acciones 
    switch (action.type) {

        // Primer caso
        // Este es el inicial y sucede cuando enviamos una petición 'Ajax' al servidor
        case 'CREATE_REQUEST':

            // Retornaremos un nuevo estado (en donde preservamos los anteriores valores del estado)
            // Y lo único que actualizamos es 'loading' a 'true'. Esto último será utilizado para mostrar
            // algo cuando se este este cargando
            return { ...state, loading: true }

        // Segundo caso
        // Este es el caso posterior al primero y básicamente es la orden que se realizó
        case 'CREATE_SUCCESS':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos 'loading' a 'false'
            return { ...state, loading: false };

        // Tercer caso
        // Este es el peor de los casos y sucederá cuando exista algún tipo de error con la petición 'Ajax'
        case 'CREATE_FAIL':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos 'loading' a 'false'
            return { ...state, loading: false };

        default:

            // Retornará el estado actual
            return state;
    }
}



// Componente funcional
// En este componente se visualizará todo los pasos previos que completó el usuario con respecto al pedido
export default function PlaceOrderScreen() {

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();


    // Utilizando 'useReducer' para el manejo del pedido
    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    });


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
    const placeOrderHandler = async () => {

        try {

            // Despachar la acción 'CREATE_REQUEST' para manejar el envío de la petición Ajax
            dispatch({ type: 'CREATE_REQUEST' });

            // Enviar la petición Ajax
            const { data } = await axios.post('/api/orders',
                
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                // Debemos de estar autentiticado, es por ello que enviamos el token de JWT
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            // Luego de haber enviado la petición, limpiar el carrito...
            ctxDispatch({ type: 'CART_CLEAR' });

            // También despachar 'CREATE_SUCCESS'
            dispatch({ type: 'CREATE_SUCCESS' });

            // Limpiar el LocalStorage
            localStorage.removeItem('cartItems');

            // Navegar hacia la orden recien creada
            navigate(`/order/${data.order._id}`);

        } catch (err) {

            // En caso de error, despachar 'CREATE_FAIL' y mostrar el error mediante una alerta personalizada
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
        }
    };


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
                                        {/* En caso de que 'loading' es true, renderizar 'LoadingBox' */}
                                        {
                                            loading && <LoadingBox></LoadingBox>
                                        }
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
