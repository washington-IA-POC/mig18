// Utilidades para inspeccionar el token JWT
// Ejecutar en la consola del navegador

// 1. Ver el token raw
console.log('Token:', localStorage.getItem('jwt_token'));

// 2. Decodificar el payload (solo para debug - NO usar en producción)
function decodeJWT(token) {
    if (!token) return null;
    try {
        const parts = token.split('.');
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// 3. Ver información del usuario
const tokenData = decodeJWT(localStorage.getItem('jwt_token'));
console.log('User Info:', {
    username: tokenData?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
    email: tokenData?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    role: tokenData?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    exp: new Date(tokenData?.exp * 1000), // Fecha de expiración
    isExpired: tokenData?.exp < Date.now() / 1000
});

// 4. Limpiar token (simular logout)
// localStorage.removeItem('jwt_token');
