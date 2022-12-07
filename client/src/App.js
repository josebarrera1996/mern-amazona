import { Container, Navbar, Badge, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import { useContext, useState, useEffect } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen.js';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen.js';
import PaymentMethodScreen from './screens/PaymentMethodScreen.js';
import PlaceOrderScreen from './screens/PlaceOrderScreen.js';
import OrderScreen from './screens/OrderScreen.js';
import OrderHistoryScreen from './screens/OrderHistoryScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';


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

    // Redireccionarnos a 'signin'
    window.location.href = '/signin';
  };

  // Utilizando 'useState' para manejar la sección de 'Categorías'
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const [categories, setCategories] = useState([]);


  // Utilizando 'useEffect' para traer las categorías de los productos
  useEffect(() => {

    const fetchCategories = async () => {

      try {

        // Petición 'Ajax' al servidor
        const { data } = await axios.get(`/api/products/categories`);

        // Actualizar 'categories' con lo obtenido anteriormente
        setCategories(data);

      } catch (err) {

        // En caso de error, mostrar el mensaje en alerta
        toast.error(getError(err));
      }
    };

    // Invocando
    fetchCategories();
  }, []);


  return (

    <BrowserRouter>
      <div className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }>
        {/* Se mostrará solo un 'Toast' a la vez */}
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand='lg'>
            <Container>
            <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
              <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
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
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path='/orderhistory' element={<OrderHistoryScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
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
