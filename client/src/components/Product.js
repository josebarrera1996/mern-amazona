import axios from 'axios';
import { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

// Componente de tipo funcional
// Representará la estructura de un producto para que el mismo pueda ser renderizado en otros componentes
function Product(props) {

    const { product } = props;

    // Accedemos al contexto
    const { state, dispatch: ctxDispatch } = useContext(Store);

    // Desconstructurando al 'state' para acceder a los items del Carrito
    const { cart: { cartItems } } = state;

    // Método para añadir productos al Carrito
    const addToCartHandler = async (item) => {

        // Chequear si el el producto actual existe en el Carrito o no
        const existItem = cartItems.find((x) => x._id === product._id);

        // Si existe, incrementaremos la cantidad en '1'
        const quantity = existItem ? existItem.quantity + 1 : 1;

        // Accediendo al producto 
        const { data } = await axios.get(`/api/products/${item._id}`);

        // Chequear si hay stock suficiente para poder sumar el producto al Carrito 
        // Si el stock del producto en cuestión es menor que la cantidad que se quiere de el...
        if (data.countInStock < quantity) {

            window.alert('Sorry. Product is out of stock');
            return;
        }

        // Enviar la acción
        ctxDispatch({

            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    return (

        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className='card-img-top' alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                {/* Renderizando el componente 'Rating' */}
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text><strong>${product.price}</strong></Card.Text>
                {/* Verificar si hay stock suficiente... */}
                {product.countInStock === 0 ? (
                    // Si no hay el suficiente stock del producto, deshabilitar el botón
                    <Button variant="light" disabled>
                        Out of stock
                    </Button>
                ) : (
                    // Si lo hay, mostrar este botón para permitirnos añadir el producto al Carrito
                    <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
                )}
            </Card.Body>
        </Card>
    )
}

export default Product;