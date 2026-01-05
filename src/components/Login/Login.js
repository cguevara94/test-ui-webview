import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService';
import BasicLogin from './BasicLogin';
import MFAStep from './MFAStep';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('basic'); // 'basic', 'mfa'
  const [username, setUsername] = useState('');
  const [mfaToken, setMfaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar si estamos en WebView de Windows
  const isWebView = authService.isWindowsWebView();

  useEffect(() => {
    // Si estamos en WebView, log para debugging
    if (isWebView) {
      console.log('Modo WebView detectado - Compatible con MDM enrollment');
    }
  }, [isWebView]);

  const handleBasicLogin = async (email, password) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.basicLogin(email, password);
      if (result.success) {
        // Verificar si requiere MFA
        if (result.data?.requiresMFA) {
          setMfaToken(result.data.mfaToken);
          setUsername(email);
          setLoginType('mfa');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Error en el login');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASuccess = () => {
    navigate('/dashboard');
  };

  const handleMFACancel = () => {
    setLoginType('basic');
    setMfaToken(null);
  };

  const renderLoginContent = () => {
    if (loginType === 'mfa') {
      return (
        <MFAStep
          username={username}
          mfaToken={mfaToken}
          onSuccess={handleMFASuccess}
          onCancel={handleMFACancel}
        />
      );
    }

    return (
      <BasicLogin
        onSubmit={handleBasicLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>MDM Enrollment</h1>
          <p className="login-subtitle">Inicia sesión para continuar con el enrollment</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        {renderLoginContent()}
        {isWebView && (
          <div className="webview-notice">
            <p>Modo WebView detectado - Compatible con MDM enrollment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

