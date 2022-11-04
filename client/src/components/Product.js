import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

// Componente de tipo funcional
// Representará la estructura de un producto para que el mismo pueda ser renderizado en otros componentes
function Product(props) {

    const { product } = props;

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
                <Button>Add to Cart</Button>
            </Card.Body>
        </Card>
    )
}

export default Product;