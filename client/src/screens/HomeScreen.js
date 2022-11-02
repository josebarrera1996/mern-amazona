import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';

// Componente de tipo funcional
// En este se renderizarán los productos

function HomeScreen() {

    // Utilizando 'useState' para el manejo de los productos 
    const [products, setProducts] = useState([]);


    // Utilizando 'useEffect' para traer los productos 
    useEffect(() => {

        const fetchData = async () => {
            const result = await axios.get('/api/products'); // Accediendo a los productos del servidor
            setProducts(result.data); // Actualizando el estado con lo obtenido en 'result'
        };

        fetchData(); // Invocando la fusión asíncrona
    }, []); // Se renderizará una sola vez, cuando accedamos a este componente


    return (

        <div>
            <h1>Featured Products</h1>
            <div className="products">
                {
                    products.map((product) => (
                        <div className="product" key={product.slug}>
                            <Link to={`/product/${product.slug}`}>
                                <img src={product.image} alt={product.name} />
                            </Link>
                            <div className="product-info">
                                <Link to={`/product/${product.slug}`}>
                                    <p>{product.name}</p>
                                </Link>
                                <p><strong>${product.price}</strong></p>
                                <button>Add to cart</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default HomeScreen;