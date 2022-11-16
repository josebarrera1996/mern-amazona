import { Container, Form, Button } from "react-bootstrap";
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';

// Componente de tipo funcional
// Representa la sección para logearnos
function SigninScreen() {

    // Utilizando 'useLocation' para acceder a el objeto de ubicación actual
    const { search } = useLocation(); // Accediendo a 'search'

    // Intentar acceder a el parámetro 'shipping' de la URL
    const redirectInUrl = new URLSearchParams(search).get('redirect');

    // Verificar si 'redirectInUrl' y por lo tanto almacenar 'shipping'. Caso contrario, almacenar '/' que representa al Home
    const redirect = redirectInUrl ? redirectInUrl : '/';

    return (

        <Container className='small-container'>
            {/* Para que la pestaña del navegador tenga el siguiente título */}
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className="my-3">Sign In</h1>
            <Form>
                {/* Sección 'email' */}
                <Form.Group className="mb-3" controlId="email">
                    {/* Label */}
                    <Form.Label>Email</Form.Label>
                    {/* Campo input */}
                    <Form.Control type="email" required />
                </Form.Group>
                {/* Sección 'password' */}
                <Form.Group className="mb-3" controlId="password">
                    {/* Label */}
                    <Form.Label>Password</Form.Label>
                    {/* Campo input */}
                    <Form.Control type="password" required />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="mb-3">
                    New customer?{' '}
                    {/* Si el usuario es nuevo, redireccionar al mismo a la sección para registrarse. Luego de registrarse
                        direccionarlos a la sección para dar por finalizada la compra ('shipping') */}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    )
}

export default SigninScreen;