import { useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer } from "react";
import axios from 'axios';
import { Row, Col, ListGroup, Card, Badge, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils'; // Para el manejo de errores
import { Store } from '../Store'; // Para manejar el contexto general

// Definiendo un 'reducer' para manejar los distintos estados al enviar una petición 'ajax'
// El 1er parámetro hace referencia al 'estado' actual
// El 2do parámetro es la 'acción' que cambia el estado y crea uno nuevo
const reducer = (state, action) => {

    // Utilizando 'switch' para comparar los tipos de acciones 
    switch (action.type) {

        // Primer caso
        // Este es el inicial y sucede cuando enviamos una petición 'Ajax' al servidor
        case 'FETCH_REQUEST':

            // Retornaremos un nuevo estado (en donde preservamos los anteriores valores del estado)
            // Y lo único que actualizamos es 'loading' a 'true'. Esto último será utilizado para mostrar
            // algo cuando se este este cargando
            return { ...state, loading: true }

        // Segundo caso
        // Este es el caso posterior al primero y básicamente es el que traerá los productos
        case 'FETCH_SUCCESS':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos los 'productos' con los datos que vienen de la acción de tipo 'payload' (que contiene todos los productos)
            // También se actualizará a 'loading' a 'false'.
            return { ...state, product: action.payload, loading: false }

        // Tercer caso
        // Este es el peor de los casos y sucederá cuando exista algún tipo de error con la petición 'Ajax'
        case 'FETCH_FAIL':

            // Retornaremos un nuevo estado (en donde preservaremos los anteriores valores del estado)
            // Actualizaremos a 'loading' a 'false' y llenar el campo 'error' con la acción de tipo 'payload' que contiene un 'mensaje'
            return { ...state, loading: false, error: action.payload }

        // Caso que se ejecutará cuando ninguno de los casos anteriores se cumpla
        default:

            // Retornará el estado actual
            return state;
    }
}

// Componente de tipo funcional
// En este se renderizará el componente a nivel individual

function ProductScreen() {

    // Utilizando 'useParams' para capturar el parámetro de la URL
    const params = useParams();
    const { slug } = params; // Obteniendo el valor del parámetro 'slug'

    /* Utilizando 'useReducer' para manejar los estados al conectarnos con el servidor */
    // Definiremos un arreglo que contendrá 2 valores:
    // - Un objeto -> product, loading y error
    // - dispatch -> Para llamar una acción y actualizar el estado 
    const [{ loading, error, product }, dispatch] = useReducer((reducer), {

        // Estado por defecto de las propiedades
        product: [],
        loading: true,
        error: '',
    });


    // Utilizando 'useEffect' para traer los productos 
    useEffect(() => {

        const fetchData = async () => {

            // Antes de realizar una petición 'Ajax' al servidor
            // Actualizar el estado de 'loading' al 'despachar' FETCH_REQUEST'
            dispatch({ type: 'FETCH_REQUEST' });

            try {
                const result = await axios.get(`/api/products/slug/${slug}`); // Accediendo a el producto

                // Después de haber realizado la petición 'Ajax' al servidor
                // Actualizar los estados de 'loading' y 'product' al despachar 'FETCH_SUCCESS'
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (error) {

                // Si hubo un error, actualizar el estado de 'loading' y 'error' al despachar 'FETCH_FAIL'
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        };

        fetchData(); // Invocando la fusión asíncrona
    }, [slug]); // Se renderizará cada vez que haya un cambio en el estado del 'slug'

    // Utilizaremos 'useContext' para poder tener acceso al estado del propio contexto
    // Y la posibilidad de cambiarlo. Respecto a esto se renombra a 'dispatch' para poder
    // diferenciarlo del componente actual en el Reducer
    const { state, dispatch: ctxDispatch } = useContext(Store); 

    // Método para añadir items al Carrito
    const addToCartHandler = () => {

        // Para poder añadir un item al Carrito, se necesita enviar (dispatch) una acción en el contexto
        ctxDispatch({

            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity: 1 }, // Se incrementará la cantidad de 1 en 1
        });
    };

    return (
        
        // Si 'loading' es true, mostrar lo siguiente
        loading ? <LoadingBox /> :
            // Si hay un error, mostrar lo siguiente:
            error ? <MessageBox variant='danger'>{error}</MessageBox> :
                // Caso contrario, mostrar los detalles del producto
                <div>
                    <Row>
                        <Col md={6}>
                            <img
                                className='img-large'
                                src={product.image}
                                alt={product.name}
                            >
                            </img>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Helmet>
                                        <title>{product.name}</title>
                                    </Helmet>
                                    <h1>{product.name}</h1>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating
                                        rating={product.rating}
                                        numReviews={product.numReviews}
                                    >
                                    </Rating>
                                </ListGroup.Item>
                                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                                <ListGroup.Item>
                                    Description:
                                    <p>{product.description}</p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>${product.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                    {/* Chequear si hay stock suficiente */}
                                                    {product.countInStock > 0 ? (
                                                        <Badge bg="success">In Stock</Badge>
                                                    ) : (
                                                        <Badge bg="danger">Unavailable</Badge>
                                                    )}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {/* Chequear si hay stock para añadirlo al Carrito */}
                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <div className="d-grid">
                                                    <Button onClick={addToCartHandler} variant="primary">
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
    )
}

export default ProductScreen;