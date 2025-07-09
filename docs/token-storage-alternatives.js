// Ejemplo de implementación con sessionStorage (más seguro)
// Reemplazar en authService.js:

// Función auxiliar para guardar el token (versión sessionStorage)
function setToken(token) {
    $window.sessionStorage.setItem('jwt_token', token);
}

// Función auxiliar para obtener el token
function getToken() {
    return $window.sessionStorage.getItem('jwt_token');
}

// Función auxiliar para eliminar el token
function removeToken() {
    $window.sessionStorage.removeItem('jwt_token');
}

// VENTAJAS de sessionStorage:
// - Se elimina automáticamente al cerrar el navegador
// - Más seguro para datos sensibles
// - Reduce riesgo de ataques XSS persistentes

// DESVENTAJAS:
// - El usuario debe hacer login cada vez que abre el navegador
// - Se pierde al cerrar todas las pestañas
