import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

// Definiendo un 'reducer' para manejar los distintos estados al enviar una petición 'ajax'
// El 1er parámetro hace referencia al 'estado' actual
// El 2do parámetro es la 'acción' que cambia el estado y crea uno nuevo
function reducer(state, action) {

    // Utilizando 'switch' para comparar los tipos de acciones 
    switch (action.type) {

        // Primer caso
        // Este es el inicial y sucede cuando enviamos una petición 'Ajax' al servidor
        case 'FETCH_REQUEST':

            // Retornamos un nuevo estado (preservando el anterior) y actualizamos 'loading' y 'error'
            return { ...state, loading: true, error: '' };

        // Segundo caso
        // Este es el caso posterior al primero y básicamente es el que traerá los productos
        case 'FETCH_SUCCESS':

            // Retornamos un nuevo estado (preservando el anterior) y actualizamos 'loading', 'error' y 'order'
            // donde en este último le asignaremos los datos que traigamos del servidor
            return { ...state, loading: false, order: action.payload, error: '' };

        // Tercer caso
        // Este es el peor de los casos y sucederá cuando exista algún tipo de error con la petición 'Ajax'
        case 'FETCH_FAIL':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos a 'loading' a 'false' y llenar el campo 'error' con la acción de tipo 'payload' que contiene un 'mensaje'
            return { ...state, loading: false, error: action.payload };

        // Caso que se ejecutará cuando ninguno de los casos anteriores se cumpla
        default:

            // Retornará el estado actual
            return state;
    }
}

// Componente funcional
// Representará los detalles de una orden
export default function OrderScreen() {

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();


    // Obteniendo el parámetro 'id' de la petición
    const params = useParams();

    const { id: orderId } = params; // Renombrarlo como 'orderId'


    // Accediendo al contexto de React
    const { state } = useContext(Store);

    const { userInfo } = state;


    // Utilizando 'useReducer' para implementar el reducer creado
    const [{ loading, error, order }, dispatch] = useReducer(reducer, {

        // Campos
        loading: true,
        order: {},
        error: '',
    });


    // Utilizando 'useEffect' para poder traer los datos de la orden creada recientemente
    useEffect(() => {

        const fetchOrder = async () => {

            try {

                // Despachar esta acción para dar inicio a la petición Ajax
                dispatch({ type: 'FETCH_REQUEST' });

                // Obtener los datos de la orden gracias a su ID
                const { data } = await axios.get(`/api/orders/${orderId}`, {

                    // Enviar el token de autorización
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });

                // Si todo ha sido exitoso, asignar los datos obtenidos al payload
                dispatch({ type: 'FETCH_SUCCESS', payload: data });

            } catch (err) {

                // En caso de error, despachar esta acción y asignar al payload el error. Que se mostrará por alerta
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        // Si el usuario no está conectado, dirigirse a la sección de 'login'
        if (!userInfo) {
            return navigate('/login');
        }

        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }

    }, [order, userInfo, orderId, navigate]);


    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>Order {orderId}</title>
            </Helmet>
            <h1 className="my-3">Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {order.shippingAddress.address},
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                ,{order.shippingAddress.country}
                            </Card.Text>
                            {order.isDelivered ? (
                                <MessageBox variant="success">
                                    Delivered at {order.deliveredAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Delivered</MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {order.paymentMethod}
                            </Card.Text>
                            {order.isPaid ? (
                                <MessageBox variant="success">
                                    Paid at {order.paidAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Paid</MessageBox>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {order.orderItems.map((item) => (
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
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${order.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
