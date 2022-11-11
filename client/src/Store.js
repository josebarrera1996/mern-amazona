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

            return {

                ...state,
                // La lógica implementada aquí permitirá conservar los items añadidos al cart
                // Y actualizar al mismo cuando agreguemos nuevos
                cart: {
                    ...state.cart,
                    cartItems: [...state.cart.cartItems, action.payload],
                },
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