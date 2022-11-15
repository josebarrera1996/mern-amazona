import { useContext } from "react";
import { Col, Row, ListGroup, Button, Card } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from '../Store';
import { Link, useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import axios from 'axios';


// Componente de tipo funcional
// En este componente se mostrarán todos los items que hemos sumado al carrito
export default function CartScreen() {

    // Utilizando 'useNavigate' para navegar
    const navigate = useNavigate();

    // Accedemos al contexto
    const { state, dispatch: ctxDispatch } = useContext(Store);

    // Desconstructurando al 'state' para acceder a los items del Carrito
    const { cart: { cartItems } } = state;

    // Función para aumentar o disminuir la cantidad de item's del Carrito
    const updateCartHandler = async (item, quantity) => {

        // Accediendo al producto 
        const { data } = await axios.get(`/api/products/${item._id}`);

        // Chequear si hay stock suficiente para poder sumar el producto al Carrito 
        // Si el stock del producto en cuestión es menor que la cantidad que se quiere de el...
        if (data.countInStock < quantity) {

            window.alert('Sorry. Product is out of stock');
            return;
        }

        // Para poder añadir un item al Carrito, se necesita enviar (dispatch) una acción en el contexto
        ctxDispatch({

            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity }, // Se incrementará o decrementará la cantidad de 1 en 1
        });
    }

    // Función para remover los items del Carrito
    const removeItemHandler = (item) => {

        // Llamamos a la acción 'CART_REMOVE_ITEM'
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    }

    // Función para direccionarnos a logearnos (si es que no lo estamos) o para finalizar la compra (si es que estamos logeados)
    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    };

    return (

        <div>
            <Helmet>
                {/* Estableciendo el título de la pestaña a el siguiente mensaje */}
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                {/* En esta columna mostraremos los items del Carrito */}
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        // Si no hay items en el carrito, renderizar el componente 'MessageBox'
                        <MessageBox>
                            Cart is empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="img-fluid rounded img-thumbnail"
                                            ></img>{' '}
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            {/* Botón para decrementar la cantidad del item (no podremos seguir decrementando si la cantidad es '1') */}
                                            <Button
                                                variant="light"
                                                disabled={item.quantity === 1}
                                                onClick={() => updateCartHandler(item, item.quantity - 1)}
                                            >
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>{' '}
                                            <span>{item.quantity}</span>{' '}
                                            {/* Botón para incrementar la cantidad del item */}
                                            <Button
                                                variant="light"
                                                // Deshabilitar la posibilidad de seguir aumentando si no hay stock suficiente
                                                onClick={() => updateCartHandler(item, item.quantity + 1)}
                                                disabled={item.quantity === item.countInStock}
                                            >
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            {/* Botón para eliminar el item */}
                                            <Button variant="light" onClick={() => removeItemHandler(item)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    {/* En esta columna se mostrará una sección para mostrar el subtotal y la posibilidad de proceder con la compra 'Checkout' */}
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        {/* Botón para poder realizar un 'Checkout' */}
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkoutHandler }
                                            // El botón estará deshabilitado si no hay items en el Carrito
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
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

