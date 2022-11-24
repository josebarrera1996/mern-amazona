import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';


// Componente funcional
// Representará la sección para registrarse
export default function SignupScreen() {

    // Utilizando 'useNavigate' para el manejo de la navegación
    const navigate = useNavigate();

    // Utilizando 'useLocation' para acceder a el objeto de ubicación actual
    const { search } = useLocation(); // Accediendo a 'search'

    // Intentar acceder a el parámetro 'shipping' de la URL
    const redirectInUrl = new URLSearchParams(search).get('redirect');

    // Verificar si 'redirectInUrl' y por lo tanto almacenar 'shipping'. Caso contrario, almacenar '/' que representa al Home
    const redirect = redirectInUrl ? redirectInUrl : '/';

    // Utilizando 'useState' para el manejo de 'name', 'email' y de la 'password'
    const [name, setName] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');

    // Accediendo al contexto
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const { userInfo } = state; // Acciendo a 'userInfo' del estado

    // Método para poder registrarnos
    const submitHandler = async (e) => {

        e.preventDefault(); // Para evitar que la página se recargue

        // Chequear si ambas contraseñas coinciden (password & confirmPassword)
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {

            // Realizar una petición Ajax para conectarnos con el servidor
            const { data } = await axios.post('/api/users/signup', {

                // Cuerpo de la petición
                name, email, password
            });

            // Después del inicio de sesión exitoso, enviar una acción a través de dispatch
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });

            // Utilizando 'LocalStorage' para poder recordar lo ingresado y no volver a logearnos
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Luego, redireccionar al usuario a lo que se fije en la variable 'redirect'
            // Si no existe, direccionarnos a la página principal (Home)
            navigate(redirect || '/');

        } catch (error) {

            // Mostrar los errores que obtenemos del 'server' a través de un 'toast'
            toast.error(getError(error));
        }
    }


    // Utilizando 'useEffect'
    // Para comprobrar si estoy logeado o no
    useEffect(() => {

        // Si hay un usuario logeado
        if (userInfo) {

            // Redireccionar al usuario, según el valor almacenado en 'redirect'
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);


    return (

        <Container className='small-container'>
            {/* Para que la pestaña del navegador tenga el siguiente título */}
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className="my-3">Sign Up</h1>
            <Form onSubmit={submitHandler}>
                {/* Sección 'name' */}
                <Form.Group className="mb-3" controlId="name">
                    {/* Label */}
                    <Form.Label>Name</Form.Label>
                    {/* Campo input */}
                    <Form.Control
                        type="text"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                {/* Sección 'email' */}
                <Form.Group className="mb-3" controlId="email">
                    {/* Label */}
                    <Form.Label>Email</Form.Label>
                    {/* Campo input */}
                    <Form.Control
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                {/* Sección 'password' */}
                <Form.Group className="mb-3" controlId="password">
                    {/* Label */}
                    <Form.Label>Password</Form.Label>
                    {/* Campo input */}
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                {/* Sección 'confirmPassword' */}
                <Form.Group className="mb-3" controlId="confirmPassword">
                    {/* Label */}
                    <Form.Label>Password</Form.Label>
                    {/* Campo input */}
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign Up</Button>
                </div>
                <div className="mb-3">
                    Already have an account?{' '}
                    {/* Si el usuario no está logeado, redireccionarlo a la sección para logearse. Luego de hacerlo,
                        direccionarlo a la sección para dar por finalizada la compra ('shipping'') */}
                    <Link to={`/signin?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    )
}
