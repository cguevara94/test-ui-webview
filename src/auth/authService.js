/**
 * Servicio de autenticación
 * Maneja login básico y utilidades de autenticación
 * Compatible con WebView de Windows 10/11 para MDM enrollment
 */
class AuthService {
  constructor() {
    // Inicialización si es necesaria
  }

  /**
   * Login básico (usuario/contraseña)
   * Compatible con dominios federados - redirige a login federado si es necesario
   * Nota: En producción, esto debería usar un backend seguro
   */
  async basicLogin(username, password) {
    try {
      // Verificar si es un dominio federado
      const domain = username.split('@')[1];
      if (domain && this.isFederatedDomain(domain)) {
        // Para dominios federados, normalmente se redirige al proveedor de identidad
        // En un escenario real, esto se manejaría en el backend
        console.log('Dominio federado detectado:', domain);
      }

      // En producción, esto debe hacerse en el backend
      // Aquí simulamos la autenticación básica
      // Para desarrollo, aceptamos cualquier credencial
      const response = await fetch('/api/auth/basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Si el endpoint no existe (desarrollo), simular autenticación exitosa
      if (!response || response.status === 404) {
        // Simulación para desarrollo - en producción esto debe validarse en el backend
        const mockToken = 'mock_token_' + Date.now();
        sessionStorage.setItem('authToken', mockToken);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('loginTime', new Date().toISOString());
        
        return { 
          success: true, 
          data: { 
            token: mockToken,
            username: username
          } 
        };
      }

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      // Guardar token en sessionStorage (compatible con WebView)
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('loginTime', new Date().toISOString());
      
      return { success: true, data };
    } catch (error) {
      console.error('Error en login básico:', error);
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
  }

  /**
   * Verificar si un dominio es federado
   * En producción, esto debería consultarse desde el backend
   */
  isFederatedDomain(domain) {
    if (!domain) return false;
    const lowerDomain = domain.toLowerCase();
    // Lista de dominios federados comunes (ejemplo)
    const federatedDomains = [
      'outlook.com',
      'hotmail.com',
      'live.com',
      'msn.com'
    ];
    return federatedDomains.includes(lowerDomain);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isBasicAuthenticated() {
    return !!sessionStorage.getItem('authToken');
  }

  /**
   * Obtener cuenta activa del usuario autenticado
   */
  getBasicAccount() {
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('authToken');
    if (username && token) {
      return { username, token };
    }
    return null;
  }

  /**
   * Cerrar sesión del usuario
   */
  logoutBasic() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('loginTime');
    return { success: true };
  }

  /**
   * Verificar si estamos en WebView de Windows
   * Detecta WebView2 (Edge Chromium) y WebView antiguo (EdgeHTML)
   */
  isWindowsWebView() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const isWindows = /Windows|Win32|Win64/.test(userAgent);
    
    // WebView2 tiene un user agent específico
    const isWebView2 = /Edg\/|EdgA\/|EdgiOS\//.test(userAgent) && 
                       !/Chrome/.test(userAgent.replace(/Edg.*?/, ''));
    
    // WebView antiguo (EdgeHTML) - típicamente usado en Windows 10
    const isEdgeHTML = /Edge\/\d+/.test(userAgent) && 
                       !/Chrome/.test(userAgent);
    
    // También puede detectarse por la ausencia de navegadores conocidos en Windows
    const isWindowsWithoutBrowser = isWindows && 
                                     !/Chrome|Firefox|Safari|Opera/.test(userAgent) &&
                                     !isWebView2 && !isEdgeHTML;
    
    return isWebView2 || isEdgeHTML || isWindowsWithoutBrowser;
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;

