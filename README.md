# Sistema de Autenticación JWT - Frontend AngularJS 1.8

Este proyecto implementa un sistema completo de autenticación basado en JWT usando AngularJS 1.8, con un diseño moderno y funcional en tonos verdes.

## 🚀 Características

- **Autenticación JWT**: Login seguro con tokens JWT
- **Control de acceso por roles**: Soporte para ROL_USER y ROL_ADMIN
- **Protección de rutas**: Middleware de autenticación automático
- **Diseño responsivo**: Interfaz adaptable con paleta de colores verdes
- **Interceptor HTTP**: Manejo automático de tokens en requests
- **Validación de formularios**: Validación en tiempo real
- **Manejo de errores**: Gestión completa de errores de autenticación

## 📁 Estructura del Proyecto

```
produ/
├── index.html                 # Página principal
├── styles/
│   └── main.css              # Estilos CSS con paleta verde
├── js/
│   ├── app.js                # Configuración principal y rutas
│   ├── services/
│   │   ├── authService.js    # Servicio de autenticación
│   │   └── authInterceptor.js # Interceptor para tokens JWT
│   └── controllers/
│       ├── loginController.js    # Controlador de login
│       ├── userController.js     # Controlador vista usuario
│       ├── adminController.js    # Controlador vista admin
│       ├── errorController.js    # Controlador página error
│       └── navController.js      # Controlador navegación
└── views/
    ├── login.html            # Vista de login
    ├── user.html             # Vista de usuario
    ├── admin.html            # Vista de administrador
    └── error.html            # Vista de error
```

## 🛠️ Instalación y Uso

### Prerequisitos

- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)
- Backend API REST funcionando en: `https://zwhf4xnv-5000.use2.devtunnels.ms/`

### Instalación Rápida

1. **Clonar o descargar el proyecto**
2. **Instalar dependencias:**
   ```bash
   cd produ
   npm install
   ```
3. **Iniciar servidor:**
   ```bash
   npm start
   ```
4. **Abrir navegador:** `http://localhost:3000`

### Scripts Disponibles

- `npm start` - Iniciar servidor de producción
- `npm run dev` - Iniciar servidor de desarrollo (con auto-restart)
- `npm run install-deps` - Reinstalar dependencias

### Inicio Rápido con Scripts

**Windows:**
- Doble click en `start-node-server.bat` - Servidor normal
- Doble click en `start-dev-server.bat` - Servidor de desarrollo

**Manual:**
```bash
# Navegar al proyecto
cd "c:\Users\wmym\Desktop\produ"

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor
npm start
```

### Estructura de la API

El backend debe implementar los siguientes endpoints:

**Login:**
```http
POST https://zwhf4xnv-5000.use2.devtunnels.ms/api/auth/signin
Content-Type: application/json

{
  "username": "user",
  "password": "user123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 2,
  "username": "user",
  "email": "user@example.com",
  "role": "User"
}
```

**Token JWT contiene:**
```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "2",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "user",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "user@example.com",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "User",
  "exp": 1752070970,
  "iss": "LoginJwtApiNet",
  "aud": "LoginJwtApiNet"
}
```

**Endpoints de prueba:**
- `GET /heath` - Verificar estado del backend
- `GET /api/test/user` - Probar acceso de usuario (requiere token)
- `GET /api/test/admin` - Probar acceso de administrador (requiere token)

## 🔐 Funcionalidades de Seguridad

### Autenticación
- Login con email y contraseña
- Validación de credenciales contra API REST
- Almacenamiento seguro de JWT en localStorage
- Verificación automática de expiración de tokens

### Autorización

- **User**: Acceso a `/user`
- **Admin**: Acceso a `/admin`
- Redirección automática según rol después del login
- Protección de rutas mediante resolvers

### Interceptor HTTP
- Adjunta automáticamente el token JWT en header `Authorization: Bearer <token>`
- Maneja errores 401 (token expirado/inválido) redirigiendo a login
- Maneja errores 403 (sin permisos) redirigiendo a página de error

## 🎨 Diseño y UI

### Paleta de Colores Verde
- **Verde Primario**: #2E7D32
- **Verde Oscuro**: #1B5E20
- **Verde Claro**: #E8F5E8
- **Verde Medio**: #4CAF50

### Características de Diseño
- Diseño responsivo y moderno
- Animaciones suaves (fade-in)
- Formularios con validación visual
- Estados de carga con spinners
- Mensajes de error y éxito claros

## 🔄 Flujo de la Aplicación

1. **Acceso Inicial**: Redirección automática a `/login` si no hay token
2. **Login**: 
   - Validación de formulario
   - Envío de credenciales a API
   - Almacenamiento de JWT
   - Redirección según rol
3. **Navegación Protegida**: 
   - Verificación de token en cada ruta
   - Validación de roles
   - Redirección a error si no autorizado
4. **Logout**: Limpieza de token y redirección a login

## 🌐 Rutas Disponibles

- `/login` - Página de inicio de sesión
- `/user` - Panel de usuario (solo ROL_USER)
- `/admin` - Panel de administrador (solo ROL_ADMIN)
- `/error` - Página de error para accesos no autorizados

## ⚙️ Configuración Avanzada

### Cambiar URL de API
Editar en `js/services/authService.js`:
```javascript
$http.post('/api/auth/login', {
    // Cambiar por tu endpoint
```

### Personalizar Validación de Token
Modificar en `js/services/authService.js` la función `parseJWT()` según la estructura de tu token.

### Ajustar Roles
Editar las validaciones de rol en `js/app.js` en las configuraciones de ruta.

## 🐛 Troubleshooting

### Problemas Comunes

1. **Token no se envía en requests**
   - Verificar que el interceptor esté configurado correctamente
   - Revisar que las URLs contengan `/api/`

2. **Redirección infinita**
   - Verificar que el backend devuelva el rol correcto en el JWT
   - Comprobar configuración de rutas

3. **Errores de CORS**
   - Configurar headers CORS en el backend
   - Verificar que el backend acepte requests desde el frontend

## 📝 Notas de Desarrollo

- **AngularJS 1.8**: Versión legacy, no confundir con Angular moderno
- **Sin TypeScript**: Código JavaScript puro ES5/ES6
- **Sin dependencias externas**: Solo AngularJS y CSS puro
- **Modular**: Código organizado en servicios y controladores separados

## 🔒 Consideraciones de Seguridad

### Almacenamiento del Token
- **Ubicación**: localStorage del navegador
- **Clave**: `jwt_token`
- **Duración**: Persistente hasta logout o expiración
- **Acceso**: JavaScript del mismo dominio

### Verificar Token en el Navegador
```javascript
// Ver token almacenado
localStorage.getItem('jwt_token')

// Eliminar token (logout manual)
localStorage.removeItem('jwt_token')
```

### Alternativas de Almacenamiento
- **localStorage** (actual): Persistente entre sesiones
- **sessionStorage**: Solo durante la sesión del navegador
- **httpOnly Cookies**: Más seguro, pero requiere cambios en backend

### Otras Consideraciones
- Validación de expiración de tokens del lado cliente
- Limpieza automática de tokens inválidos
- Protección de rutas con resolvers
- Headers CORS configurados en el servidor Node.js

---

**¡Tu sistema de autenticación JWT está listo para usar!** 🎉
