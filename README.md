# Ninja React - MDM Enrollment Authentication

Aplicación React 17 con sistema de autenticación básico compatible con WebView de Windows 10/11 para MDM enrollment.

## Características

- ✅ Login básico con usuario y contraseña
- ✅ Soporte para MFA (Multi-Factor Authentication)
- ✅ Compatible con WebView de Windows 10/11 (WebView2 y EdgeHTML)
- ✅ Soporte para dominios federados
- ✅ Diseño responsive y moderno
- ✅ Manejo de estados de autenticación
- ✅ Sin dependencias de Microsoft (Azure, MSAL, etc.)
- ✅ JavaScript compatible con WebView (ES5/ES6 transpilado)

## Requisitos

- Node.js 14 o superior
- npm o yarn

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno (opcional):
Crea un archivo `.env` en la raíz del proyecto si necesitas configurar endpoints personalizados:

```env
REACT_APP_API_BASE_URL=https://tu-api.com
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Construcción

Para crear la build de producción:

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Compatibilidad con WebView de Windows

Esta aplicación está diseñada específicamente para ser compatible con el WebView utilizado en Windows 10/11 durante el proceso de enrollment en MDM. Las características específicas incluyen:

### Tecnologías Web Compatibles

- **JavaScript**: Transpilado a ES5/ES6 compatible con WebView2 (Chromium) y EdgeHTML
- **Polyfills**: Incluye `core-js` y `regenerator-runtime` para compatibilidad
- **Babel**: Configurado para generar código compatible con IE 11 y Edge 18+
- **Almacenamiento**: Uso de `sessionStorage` en lugar de `localStorage` para mejor compatibilidad
- **Detección**: Detección automática de WebView de Windows (WebView2 y EdgeHTML)
- **Meta Tags**: Optimizados para WebView con `X-UA-Compatible` y configuración de viewport

### Características de Compatibilidad

- ✅ Transpilación a ES5/ES6 para máxima compatibilidad
- ✅ Polyfills para APIs modernas
- ✅ Detección automática de WebView
- ✅ Uso de sessionStorage (más compatible que localStorage en WebView)
- ✅ Sin dependencias pesadas que puedan causar problemas en WebView
- ✅ Código JavaScript estándar sin features experimentales

### Dominios Federados

La aplicación detecta automáticamente dominios federados comunes y puede redirigir al proveedor de identidad correspondiente. En producción, esto debe manejarse desde el backend.

## Estructura del Proyecto

```
ninja-react/
├── public/
│   └── index.html          # HTML con meta tags optimizados para WebView
├── src/
│   ├── auth/
│   │   ├── config.js       # Configuración de la aplicación
│   │   └── authService.js  # Servicio de autenticación básica
│   ├── components/
│   │   ├── Login/
│   │   │   ├── Login.js       # Componente principal de login
│   │   │   ├── BasicLogin.js  # Formulario de login básico
│   │   │   ├── MFAStep.js     # Componente de verificación MFA
│   │   │   └── Login.css
│   │   └── Dashboard/
│   │       ├── Dashboard.js
│   │       └── Dashboard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js            # Entry point con polyfills
│   └── index.css
├── package.json
├── webpack.config.js       # Configuración con Babel para compatibilidad
└── README.md
```

## Autenticación

### Login Básico

El login básico requiere un backend que maneje la autenticación. En producción, nunca debes enviar credenciales directamente desde el frontend. El componente está preparado para llamar a un endpoint `/api/auth/basic`.

**Nota**: En modo desarrollo, si el endpoint no existe, se simula una autenticación exitosa para facilitar el desarrollo. Esto debe eliminarse en producción.

### MFA (Multi-Factor Authentication)

El componente MFA está diseñado para trabajar con códigos TOTP (Time-based One-Time Password) de 6 dígitos. Requiere un backend que:
- Genere tokens MFA
- Verifique códigos MFA
- Reenvíe códigos MFA

Endpoints esperados:
- `POST /api/auth/verify-mfa` - Verificar código MFA
- `POST /api/auth/resend-mfa` - Reenviar código MFA

### Dominios Federados

La aplicación puede detectar dominios federados y prepararse para redirigir al proveedor de identidad. En producción, esto debe manejarse desde el backend que determine el proveedor de identidad correcto basado en el dominio del email.

## Configuración de Webpack y Babel

El proyecto está configurado para generar código compatible con WebView:

- **Babel Preset Env**: Transpila a ES5/ES6 compatible con IE 11 y Edge 18+
- **Core-js**: Polyfills para APIs modernas
- **Regenerator Runtime**: Soporte para async/await
- **Targets**: IE 11, Edge 18+, Chrome 70+

## Notas de Desarrollo

- En producción, asegúrate de implementar un backend seguro para el login básico
- El MFA requiere integración con un backend que maneje la verificación
- Los tokens de sesión se almacenan en `sessionStorage` para compatibilidad con WebView
- La aplicación detecta automáticamente si está ejecutándose en WebView de Windows
- No se incluyen dependencias de Microsoft (Azure, MSAL, etc.) para mantener el proyecto independiente
- El código está optimizado para cargar rápidamente en WebView

## Testing en WebView de Windows

Para probar la aplicación en un entorno similar a WebView:

1. Construye la aplicación: `npm run build`
2. Sirve los archivos estáticos desde la carpeta `dist/`
3. Abre la aplicación en Edge WebView2 o en el WebView de Windows

## Licencia

MIT
