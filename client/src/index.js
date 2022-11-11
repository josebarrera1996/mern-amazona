import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './Store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Envolviendo a 'App' para poder dar contexto a toda la aplicación en general */}
    <StoreProvider>
      {/* Utilizando HelmetProvider para actualizar el titulo de la pestaña cada vez
        que cambiemos de producto */}
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

