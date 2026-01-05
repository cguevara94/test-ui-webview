import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { authService } from './auth/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[App] Componente montado');
    
    // Verificar autenticación al cargar
    const checkAuth = () => {
      try {
        console.log('[App] Verificando autenticación...');
        // Verificar autenticación básica
        const basicAuth = authService.isBasicAuthenticated();
        console.log('[App] Autenticación:', basicAuth);
        setIsAuthenticated(basicAuth);
      } catch (error) {
        console.error('[App] Error verificando autenticación:', error);
        setError(error.message);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log('[App] Estado de carga completado');
      }
    };

    checkAuth();
  }, []);

  // Detectar si estamos en WebView de Windows
  useEffect(() => {
    try {
      if (authService.isWindowsWebView()) {
        console.log('[App] Ejecutándose en WebView de Windows');
        // Agregar clases CSS específicas para WebView si es necesario
        document.body.classList.add('windows-webview');
      }
    } catch (error) {
      console.error('[App] Error detectando WebView:', error);
    }
  }, []);

  // Mostrar error si hay uno
  if (error) {
    return (
      <div className="app-loading">
        <div style={{ color: '#d32f2f', padding: '20px', textAlign: 'center' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Recargar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('[App] Mostrando estado de carga');
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  console.log('[App] Renderizando rutas, autenticado:', isAuthenticated);
  
  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </div>
  );
}

export default App;

