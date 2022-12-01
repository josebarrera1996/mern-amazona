import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
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
import { toast } from 'react-toastify';

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

        // Cuarto caso
        // Este caso es cuando solicitamos realizar un pago con 'PayPal'
        case 'PAY_REQUEST':

            // Retornamos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos 'loadingPay' a 'true'
            return { ...state, loadingPay: true };

        // Quinto caso
        // Este es el caso cuando el pago con PayPal ha sido exitoso
        case 'PAY_SUCCESS':

            // Retornamos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos 'loadingPay' y 'successPay' a 'true'
            return { ...state, loadingPay: false, successPay: true };

        // Sexto caso
        // Este es un caso en el que ha habido problemas cuando se ha intentado pagar con PayPal
        case 'PAY_FAIL':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos 'loadingPay' a 'false'
            return { ...state, loadingPay: false };

        // Séptimo caso
        // Este es el caso en el que resetearemos el pago con PayPal
        case 'PAY_RESET':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos 'loadingPay' y 'successPay' a 'false'
            return { ...state, loadingPay: false, successPay: false };

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
    const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {

        // Campos
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false
    });


    // Utilizando 'usePayPalScriptReducer' para implementar el reducer de PayPal
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();


    // Función para activar el pago con PayPal
    function createOrder(data, actions) {

        // Retornar una llamada a 'create' del objeto 'actions.order'
        return actions.order

            .create({
                purchase_units: [
                    // Lo que le pasaremos el monto basado en la totalidad de la orden
                    {
                        amount: { value: order.totalPrice },
                    },
                ],
            })

            // Si la acción ha sido exitosa, retornar el 'orderId' de PayPal
            .then((orderID) => {
                return orderID;
            });
    }



    // Función para manejar cuando el pago con PayPal ha sido exitoso (y actualizar la B.D)
    function onApprove(data, actions) {

        // Retornaremos una llamada al método 'capture()' del objeto 'actions.order' 
        return actions.order.capture().then(async function (details) {

            try {

                // Despachar 'PAY_REQUEST'
                dispatch({ type: 'PAY_REQUEST' });

                // Realizar una petición a 'Ajax'
                const { data } = await axios.put(`/api/orders/${order._id}/pay`,
                    
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );

                // Despachar 'PAY_SUCCESS' cuando la llamada ha sido exitosa y cargar al 'payload' con los datos obtenidos
                dispatch({ type: 'PAY_SUCCESS', payload: data });

                // Mostrar con 'toast' una alerta con el siguiente contenido
                toast.success('Order is paid');

            } catch (err) {

                // Si ha surgido algún error, despachar 'PAY_FAIL' y cargar al 'payload' con el mensaje de error
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });

                // Para posteriormente mostrarlo con 'toast' con una alerta
                toast.error(getError(err));
            }
        });
    }



    // Función para manejar con 'toast' el error que obtengamos
    function onError(err) {
        toast.error(getError(err));
    }


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

        if (!order._id || successPay || (order._id && order._id !== orderId)) {

            fetchOrder();

            // Si el pago fue exitoso...
            if (successPay) {

                // Resetear el pago 
                dispatch({ type: 'PAY_RESET' });
            }
        } else {

            // Función para cargar el script de PayPal
            const loadPaypalScript = async () => {

                // Obtener el 'client_id' del servidor
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });

                // Aplicando el dispatch de PayPal
                paypalDispatch({

                    // Accion y valores
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                });

                // Realizando el dispatch con la acción y el valor indicado a continuación
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }

            // Invocando la función
            loadPaypalScript();
        }

    }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);


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
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <LoadingBox />
                                        ) : (
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        )}
                                        {loadingPay && <LoadingBox></LoadingBox>}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
