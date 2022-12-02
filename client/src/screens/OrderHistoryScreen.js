import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { Button } from 'react-bootstrap';

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
            // Actualizaremos las 'órdenes' con los datos que vienen de la acción de tipo 'payload' (que contiene todos los productos)
            // También se actualizará a 'loading' a 'false'.
            return { ...state, orders: action.payload, loading: false }

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

// Componente funcional
// Mostrará las órdenes realizadas por un usuario en específico
export default function OrderHistoryScreen() {


    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();


    // Accediendo al contexto
    const { state } = useContext(Store);

    const { userInfo } = state;


    // Utilizando 'useReducer' para implementar el reducer definido anteriormente
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {

        // Campos
        loading: true,
        error: '',
    });


    // Utilizando 'useEffect' para traer las órdenes del servidor
    useEffect(() => {

        const fetchData = async () => {

          // Despachar 'FETCH_REQUEST'
          dispatch({ type: 'FETCH_REQUEST' });

          try {

            // Realizando la petición ajax al servidor
            const { data } = await axios.get(
              `/api/orders/mine`,
    
            // Verificar el token
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            // Después de que la llamada ha sido exitosa, asignar los datos al 'payload'
            dispatch({ type: 'FETCH_SUCCESS', payload: data });

          } catch (error) {

            // En caso de error, despachar 'FETCH_FAIL' para mostrar por alerta el mensaje de error
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(error),
            });
          }
        };

        // Invocar 'fetchData'
        fetchData();

      }, [userInfo]);



    return (

        <div>
            <Helmet>
                <title>Order History</title>
            </Helmet>

            <h1>Order History</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'No'}
                                </td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => {
                                            navigate(`/order/${order._id}`);
                                        }}
                                    >
                                        Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
