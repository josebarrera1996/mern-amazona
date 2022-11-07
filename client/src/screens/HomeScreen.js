import { useEffect, useReducer } from "react";
import axios from 'axios';
import logger from 'use-reducer-logger'; // Para logear los cambios de estado
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from "react-helmet-async";


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
            return { ...state, products: action.payload, loading: false }

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
// En este se renderizarán los productos
function HomeScreen() {

    /* Utilizando 'useReducer' para manejar los estados al conectarnos con el servidor */
    // Definiremos un arreglo que contendrá 2 valores:
    // - Un objeto -> products, loading y error
    // - dispatch -> Para llamar una acción y actualizar el estado 
    const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {

        // Estado por defecto de las propiedades
        products: [],
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
                const result = await axios.get('/api/products'); // Accediendo a los productos del servidor

                // Después de haber realizado la petición 'Ajax' al servidor
                // Actualizar los estados de 'loading' y 'products' al despachar 'FETCH_SUCCESS'
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (error) {

                // Si hubo un error, actualizar el estado de 'loading' y 'error' al despachar 'FETCH_FAIL'
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
            }
        };

        fetchData(); // Invocando la fusión asíncrona
    }, []); // Se renderizará una sola vez, cuando accedamos a este componente


    return (

        <div>
            <Helmet>
                <title>Amazona</title>
            </Helmet>
            <h1>Featured Products</h1>
            <div className="products">
                {/* Si 'loading' es true, mostrar lo siguiente */}
                {loading ? (
                    <div>Loading...</div>
                ) :
                    // Si se produce un error, mostrar lo siguiente
                    error ? (
                        <div>{error}</div>
                    ) : (
                        // Si 'loading' es false y no hay ningún error, mostrar los productos
                        <Row>
                            {products.map((product) => (
                                <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                                    {/* Renderizando el componente 'Product' */}
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
            </div>
        </div>
    )
}

export default HomeScreen;