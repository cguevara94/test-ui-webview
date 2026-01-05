/**
 * Configuración de la aplicación
 * Compatible con WebView de Windows 10/11 para MDM enrollment
 */

/**
 * Configuración para dominios federados
 * En producción, esto debería obtenerse desde el backend
 */
export const federatedDomainConfig = {
  // Dominios federados comunes (ejemplo)
  domains: [
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
  ],
  // Redirigir a login federado si el dominio coincide
  redirectToFederatedLogin: (email) => {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const domain = email.split('@')[1]?.toLowerCase();
    return federatedDomainConfig.domains.includes(domain);
  },
};

/**
 * Configuración de la API
 */
export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || '',
  endpoints: {
    auth: '/api/auth/basic',
    verifyMFA: '/api/auth/verify-mfa',
    resendMFA: '/api/auth/resend-mfa',
  },
};

/**
 * Configuración de WebView
 */
export const webViewConfig = {
  // Timeout para operaciones en WebView (ms)
  timeout: 60000,
  // Usar sessionStorage en lugar de localStorage para mejor compatibilidad
  useSessionStorage: true,
};
