import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = () => {
      try {
        // Obtener información del usuario desde autenticación básica
        const account = authService.getBasicAccount();
        if (account) {
          setUserInfo({
            name: account.username,
            email: account.username,
            provider: 'Basic Auth',
          });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error cargando información del usuario:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    try {
      // Logout básico
      authService.logoutBasic();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar autenticación básica de todos modos
      authService.logoutBasic();
      // Forzar navegación al login
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>MDM Enrollment</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <div className="welcome-section">
            <h2>¡Bienvenido!</h2>
            {userInfo && (
              <div className="user-info">
                <div className="user-avatar">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <p className="user-name">{userInfo.name}</p>
                  <p className="user-email">{userInfo.email}</p>
                  <p className="user-provider">
                    Autenticado con: <span>{userInfo.provider}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-content">
            <div className="info-section">
              <h3>Estado de Enrollment</h3>
              <div className="status-badge success">
                <span className="status-icon">✓</span>
                <span>Autenticación exitosa</span>
              </div>
              <p className="info-text">
                Tu dispositivo está listo para continuar con el proceso de enrollment en MDM.
              </p>
            </div>

            <div className="info-section">
              <h3>Información de la Sesión</h3>
              <div className="session-info">
                <div className="info-item">
                  <span className="info-label">Método de autenticación:</span>
                  <span className="info-value">{userInfo?.provider}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">WebView detectado:</span>
                  <span className="info-value">
                    {authService.isWindowsWebView() ? 'Sí (Windows)' : 'No'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Hora de inicio de sesión:</span>
                  <span className="info-value">
                    {new Date().toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

