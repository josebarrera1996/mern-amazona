import { createContext, useReducer } from 'react';

// Creando el contexto de React
// Para guardar los items en un estado global y de esta manera poder utilizarlo en los componentes de la app.
export const Store = createContext();

// Variable para representar el estado inicial 
const initialState = {

    // El primer campo del objeto es 'userInfo'
    userInfo: localStorage.getItem('userInfo')

        // Si hay un usuario logeado, obtener lo almacenado en 'userInfo'
        ? JSON.parse(localStorage.getItem('userInfo'))
        // Si no hay un usuario logeado, el valor inicial será 'null'
        : null,

    // El segundo campo del objeto es 'cart'
    // Que a su vez es un objeto en el que se almacenarán los datos de la dirección de envío y los items del carrito
    cart: {

        // El estado inicial será lo preservado en el LocalStorage (si es que existe 'getItems'). Sino, un objeto vacío
        shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},

        // El estado inicial será lo preservado en el LocalStorage (si es que existe 'getItems'). Sino, un string vacío
        paymentMethod: localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : '',

        // El estado inicial será lo preservado en el LocalStorage (si es que existe 'getItems'). Sino, un arreglo vacío
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    }
};

// Definiendo el Reducer
function reducer(state, action) {

    switch (action.type) {

        // Este caso hace referencia a cuando queremos añadir items al carrito
        case 'CART_ADD_ITEM':

            // Chequear si el item a agregar ya existe en el Carrito, para evitar insertar al mismo más de una vez
            // Solamente incrementaremos la cantidad del mismo
            const newItem = action.payload;

            // Chequear si el item a agregar ya existe en el Carrito
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            );

            const cartItems = existItem

                ? state.cart.cartItems.map((item) =>
                    // Si el item ya existe en el Cartito, actualizaremos el item actual con el nuevo que obtenemos
                    // del 'action.payload'
                    item._id === existItem._id ? newItem :
                        item // Caso contrario, mantener el item anterior en el Carrito
                )
                // Si el item no existe en el Carrito, quiere decir que es un nuevo item y por lo tanto debe ser agregado
                // al final del arreglo
                : [...state.cart.cartItems, newItem];

            // Utilizando 'LocalStorage' para poder almacenar los items en el Carrito
            // La clave en el propio LocalStorage será 'cartItems'.
            // El segundo parámetro es el valor de tipo String que será guardado en la clave.
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            return { ...state, cart: { ...state.cart, cartItems } };

        // En este caso hacemos referencia a cuando queremos quitar items del Carrito
        case 'CART_REMOVE_ITEM': {

            // Realizar un filtro para quitar el item indicado
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );

            // Utilizando 'LocalStorage' para cuando se eliminan los items del Carrito
            // La clave en el propio LocalStorage será 'cartItems'.
            // El segundo parámetro es el valor de tipo String que será guardado en la clave.
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            return { ...state, cart: { ...state.cart, cartItems } };
        }

        // En este caso hacemos referencia a cuando queremos limpiar el carrito
        case 'CART_CLEAR':

            // Retornamos el estado previo y actualizamos a 'cart' al asignarle un arreglo vacío a 'cartItems'
            return { ...state, cart: { ...state.cart, cartItems: [] } };

        // En este caso hacemos referencia a cuando queremos logearnos
        case 'USER_SIGNIN':

            // Retornamos el estado previo y actualizar 'userInfo' con los datos que obtengamos del servidor
            return { ...state, userInfo: action.payload };

        // En este caso hacemos referencia a cuando queremos deslogearnos
        case 'USER_SIGNOUT':

            // Retornamos el estado previo y actualizamos 'userInfo' a 'null'
            // Luego con respecto a el estado del carrito: 'cartItems' será un arreglo vacío , 'shippingAddress' un objeto vacío
            // y 'paymentMethod' una cadena vacía.
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: [],
                    shippingAddress: {},
                    paymentMethod: ''
                }
            };

        // En este caso hacemos referencia a cuando queremos guardar la dirección de envío
        case 'SAVE_SHIPPING_ADDRESS':

            // Retornamos el estado previo y lo que cambiaremos es el estado del carrito.
            // Y dentro de este, solo la dirección de envío. La cuál será actualizada con la acción del payload
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload,
                }
            };

        // En este caso hacemos referencia a cuando queremos guardar el método de pago del pedido
        case 'SAVE_PAYMENT_METHOD':

            // Retornamos el estado previo y lo que cambiaremos es el estado del carrito.
            // Y dentro de este, solo el método de pago del pedido. El cuál será actualizado con la acción del payload.
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };

        default:
            return state;
    }
}

// Componente de tipo 'contenedor' que será aplicado en nuestra app
// Para poder pasar propiedades globales a los componentes hijos
export function StoreProvider(props) {

    // Utilizando 'useReducer'
    const [state, dispatch] = useReducer(reducer, initialState);

    // Este objeto contiene el estado actual del contexto (state)
    // Y 'dispatch' para actualizar al estado en el contexto
    const value = { state, dispatch };

    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}