import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Envolviendo a 'App' para poder dar contexto a toda la aplicación en general */}
    <StoreProvider>
      {/* Utilizando HelmetProvider para actualizar el titulo de la pestaña cada vez
        que cambiemos de producto */}
      <HelmetProvider>
        {/* Utilizando este proveedor para poder aplicar PayPal en la aplicación */}
        <PayPalScriptProvider deferLoading={true}>
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

