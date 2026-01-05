// Polyfills para compatibilidad con WebView - deben ir primero
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Función para inicializar la aplicación con manejo de errores
function initApp() {
  try {
    var rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Elemento root no encontrado');
    }

    // Renderizar aplicación
    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      rootElement
    );
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    // Fallback: mostrar mensaje de error
    var root = document.getElementById('root');
    if (root) {
      root.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;"><h1>Error al cargar la aplicación</h1><p>' + (error.message || 'Error desconocido') + '</p><p>Por favor, recarga la página.</p></div>';
    }
  }
}

// Verificar que el DOM esté listo antes de inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

