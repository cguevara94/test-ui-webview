// Polyfills para compatibilidad con WebView - deben ir primero
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Mostrar indicador de carga inmediatamente
var rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif; text-align: center; color: #333; background: #f5f5f5; min-height: 100vh; display: flex; align-items: center; justify-content: center;"><div><p style="font-size: 16px; margin: 0;">Cargando aplicación...</p></div></div>';
}

// Función para inicializar la aplicación con manejo de errores
function initApp() {
  try {
    console.log('[MDM] Inicializando aplicación...');
    
    var root = document.getElementById('root');
    if (!root) {
      throw new Error('Elemento root no encontrado en el DOM');
    }

    console.log('[MDM] Elemento root encontrado');
    console.log('[MDM] React version:', React.version);
    console.log('[MDM] Renderizando aplicación...');

    // Renderizar aplicación usando JSX (Babel lo transpilará)
    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      root
    );
    
    console.log('[MDM] Aplicación renderizada correctamente');
  } catch (error) {
    console.error('[MDM] Error al inicializar la aplicación:', error);
    console.error('[MDM] Tipo de error:', typeof error);
    console.error('[MDM] Mensaje:', error.message);
    console.error('[MDM] Stack:', error.stack);
    
    // Fallback: mostrar mensaje de error detallado
    var rootEl = document.getElementById('root');
    if (rootEl) {
      var errorMsg = error.message || 'Error desconocido';
      var errorDetails = error.stack || 'No hay detalles disponibles';
      rootEl.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif; text-align: center; background: #fff; color: #d32f2f; min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;"><div style="max-width: 600px;"><h1 style="color: #d32f2f; margin-bottom: 20px;">Error al cargar la aplicación</h1><p style="margin: 10px 0; font-size: 16px;"><strong>' + errorMsg + '</strong></p><details style="margin-top: 20px; text-align: left;"><summary style="cursor: pointer; color: #1976d2; margin-bottom: 10px;">Detalles técnicos</summary><pre style="background: #f5f5f5; padding: 15px; overflow: auto; font-size: 12px; margin-top: 10px; text-align: left; white-space: pre-wrap; word-wrap: break-word;">' + errorDetails + '</pre></details><p style="margin-top: 20px;"><button onclick="window.location.reload()" style="padding: 12px 24px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Recargar página</button></p></div></div>';
    }
  }
}

// Verificar que el DOM esté listo antes de inicializar
function startApp() {
  console.log('[MDM] Estado del documento:', document.readyState);
  
  if (document.readyState === 'loading') {
    console.log('[MDM] Esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', function() {
      console.log('[MDM] DOMContentLoaded disparado');
      setTimeout(initApp, 100);
    });
  } else {
    console.log('[MDM] DOM ya está listo, inicializando...');
    // Pequeño delay para asegurar que todo esté listo
    setTimeout(initApp, 100);
  }
}

// Iniciar aplicación
console.log('[MDM] Script cargado, iniciando aplicación...');
startApp();

