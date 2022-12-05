import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';


// Definiendo un 'reducer' para manejar los distintos estados al enviar una petición 'ajax'
// El 1er parámetro hace referencia al 'estado' actual
// El 2do parámetro es la 'acción' que cambia el estado y crea uno nuevo
const reducer = (state, action) => {

    // Utilizando 'switch' para comparar los tipos de acciones 
    switch (action.type) {

        // Primer caso
        // Este es el inicial y sucede cuando enviamos una petición 'Ajax' al servidor
        case 'UPDATE_REQUEST':

            // Retornaremos un nuevo estado (en donde preservamos los anteriores valores del estado)
            // Actualizaremos 'loadingUpdate' a 'true'
            return { ...state, loadingUpdate: true };

        // Segundo caso
        // Este es el caso que seguirá después que la llamada ajax haya sido exitosa
        case 'UPDATE_SUCCESS':

            // Retornaremos un nuevo estado (en donde preservamos los anteriores valores del estado)
            // Actualizaremos 'loadingUpdate' a 'false'
            return { ...state, loadingUpdate: false };

        // Tercer caso
        // Este es el peor de los casos y sucederá cuando exista algún tipo de error con la petición 'Ajax'
        case 'UPDATE_FAIL':

            // Retornaremos un nuevo estado (en donde preservamos los anteriores valores del estado)
            // Actualizaremos 'loadingUpdate' a 'false'
            return { ...state, loadingUpdate: false };

        // Caso que se ejecutará cuando ninguno de los casos anteriores se cumpla
        default:

            // Retornará el estado actual
            return state;
    }
};



// Componente funcional
// Representará la sección del perfil del usuario
export default function ProfileScreen() {


    // Accediendo al contexto
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const { userInfo } = state;


    // Utilizando 'useState' para el manejo de los estados en los inputs
    const [name, setName] = useState(userInfo.name);

    const [email, setEmail] = useState(userInfo.email);

    const [password, setPassword] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');


    // Utilizando 'useReducer' para implementar el Reducer definido previamente
    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });


    // Método para actualizar el perfil del usuario
    const submitHandler = async (e) => {

        e.preventDefault(); // Para evitar que la página se recargue

        try {

            // Realizar la petición 'Ajax' para conectarnos con el servidor y enviar los datos actualziados
            const { data } = await axios.put('/api/users/profile',
                
                {
                    name,
                    email,
                    password,
                },

                // Pedir el token para comprobar que estemos correctamente autenticados
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            // Despachar 'UPDATE_SUCCESS'
            dispatch({
                type: 'UPDATE_SUCCESS',
            });

            // Despachar 'USER_SIGNIN' y enviar los datos obtenidos al actualizar
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });

            // Almacenar en el LocalStorage los datos nuevos
            localStorage.setItem('userInfo', JSON.stringify(data));

            toast.success('User updated successfully');

        } catch (err) {

            // En caso de error, despachar 'FETCH_FAIL'
            dispatch({
                type: 'FETCH_FAIL',
            });

            // Para luego, mediante una alerta, mostrar el mensaje
            toast.error(getError(err));
        }
    }


    return (

        <div className="container small-container">
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h1 className="my-3">User Profile</h1>
            <form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Update</Button>
                </div>
            </form>
        </div>
    )
}
