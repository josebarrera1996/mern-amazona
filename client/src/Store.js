import { createContext, useReducer } from 'react';

/* 
Todo lo desarrollado aquí será para crear un contexto en el que se puedan guardar 'items' en un carrito, el cuál
estará situado en el 'Navbar'. Todo esto gracias a la presencia de un 'estado global'.
*/

// Creando el contexto de React
// Para guardar los items en un estado global y de esta manera poder utilizarlo en los componentes de la app.
export const Store = createContext();

// Variable para representar el estado inicial 
const initialState = {

    // El primer campo del objeto es 'cart'
    // Que a su vez es un objeto en el que se almacenarán los items del carrito
    cart: {
        cartItems: [], // Por defecto será un arreglo vacío
    },
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

            return { ...state, cart: { ...state.cart, cartItems } };

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