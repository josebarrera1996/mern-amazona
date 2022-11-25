import { Container, Navbar, Badge, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen.js';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen.js';
import PaymentMethodScreen from './screens/PaymentMethodScreen.js';


function App() {

  // Lógica para que se pueda visualizar en este componente el número de items agregados al Carrito
  // Y poder obtener información sobre el usuario logeado
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  // Método para poder deslogearse
  const signoutHandler = () => {

    // Llamar a el dispatch
    ctxDispatch({ type: 'USER_SIGNOUT' });

    // Remover 'userInfo' del LocalStorage para completar el deslogeo
    localStorage.removeItem('userInfo');

    // Remover 'shippingAddress' del LocalStorage para completar el deslogeo
    localStorage.removeItem('shippingAddress');

    // Remover 'paymentMethod' del LocalStorage para completar el deslogeo
    localStorage.removeItem('paymentMethod');
  };

  return (

    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        {/* Se mostrará solo un 'Toast' a la vez */}
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {/* Si hay items en el carrito se mostrará lo siguiente */}
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {/* Se mostrará la cantidad de items agregados */}
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  // Si 'userInfo' es verdadero, mostrar lo siguiente
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  // Si 'userInfo' es falso, mostrar lo siguiente
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter >
  );
}

export default App;
