import React, { useState, useEffect, useRef } from 'react';
import './Login.css';

const MFAStep = ({ username, mfaToken, onSuccess, onCancel }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutos
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus en el primer input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Timer para expiración del código MFA
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError('El código ha expirado. Por favor, solicita uno nuevo.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus en el siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si se llenó el código, verificar automáticamente
    if (newCode.every((digit) => digit !== '') && newCode.length === 6) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Manejar backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      inputRefs.current[5]?.focus();
      handleVerifyCode(pastedData);
    }
  };

  const handleVerifyCode = async (codeToVerify) => {
    setIsLoading(true);
    setError('');

    try {
      // En producción, esto debe llamar a tu backend
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mfaToken,
          code: codeToVerify,
        }),
      });

      if (!response.ok) {
        throw new Error('Código inválido');
      }

      const data = await response.json();
      if (data.success) {
        // Guardar token de sesión
        sessionStorage.setItem('authToken', data.token);
        onSuccess();
      } else {
        setError(data.error || 'Código inválido');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Error al verificar el código. Por favor, intenta de nuevo.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mfaToken }),
      });

      if (response.ok) {
        setTimer(300); // Reiniciar timer
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        alert('Código reenviado. Revisa tu aplicación de autenticación.');
      } else {
        setError('Error al reenviar el código. Por favor, intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al reenviar el código. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mfa-step">
      <div className="mfa-header">
        <h2>Verificación en dos pasos</h2>
        <p>Ingresa el código de 6 dígitos de tu aplicación de autenticación</p>
        <p className="mfa-username">{username}</p>
      </div>

      <div className="mfa-code-input">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading || timer === 0}
            className="mfa-digit-input"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="mfa-timer">
        <p>Código válido por: {formatTime(timer)}</p>
      </div>

      <div className="mfa-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleResendCode}
          disabled={isLoading || timer > 240}
        >
          Reenviar código
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>

      <div className="mfa-help">
        <p>¿No recibiste el código? Verifica tu aplicación de autenticación.</p>
      </div>
    </div>
  );
};

export default MFAStep;

