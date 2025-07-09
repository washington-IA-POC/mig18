// Servicio de autenticación
(function () {
    'use strict';

    angular.module('authApp')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', '$window'];

    function authService($http, $q, $window) {
        var service = {
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getToken: getToken,
            getUserRole: getUserRole,
            getUserInfo: getUserInfo
        };

        return service;

        // Función para realizar login
        function login(credentials) {
            var deferred = $q.defer();

            $http.post('https://zwhf4xnv-5000.use2.devtunnels.ms/api/auth/signin', {
                username: credentials.username,
                password: credentials.password
            })
                .then(function (response) {
                    // Si el login es exitoso, guardar el token
                    if (response.data && response.data.token) {
                        setToken(response.data.token);
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject('Token no recibido');
                    }
                })
                .catch(function (error) {
                    deferred.reject(error.data || 'Error de autenticación');
                });

            return deferred.promise;
        }

        // Función para cerrar sesión
        function logout() {
            removeToken();
        }

        // Verificar si el usuario está autenticado
        function isAuthenticated() {
            var token = getToken();
            if (!token) {
                return false;
            }

            try {
                var payload = parseJWT(token);

                // Verificar si el token ha expirado
                if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                    removeToken();
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Error parsing JWT:', error);
                removeToken();
                return false;
            }
        }

        // Obtener el token del localStorage
        function getToken() {
            return $window.localStorage.getItem('jwt_token');
        }

        // Obtener el rol del usuario desde el token JWT
        function getUserRole() {
            var token = getToken();
            if (!token) {
                return null;
            }

            try {
                var payload = parseJWT(token);
                // El backend devuelve roles como "User" o "Admin" en el claim "role"
                var role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                return role || null;
            } catch (error) {
                console.error('Error getting user role:', error);
                return null;
            }
        }

        // Obtener información del usuario desde el token JWT
        function getUserInfo() {
            var token = getToken();
            if (!token) {
                return null;
            }

            try {
                var payload = parseJWT(token);
                return {
                    username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                    email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                    exp: payload.exp,
                    iat: payload.iat
                };
            } catch (error) {
                console.error('Error getting user info:', error);
                return null;
            }
        }

        // Función auxiliar para guardar el token
        function setToken(token) {
            $window.localStorage.setItem('jwt_token', token);
        }

        // Función auxiliar para eliminar el token
        function removeToken() {
            $window.localStorage.removeItem('jwt_token');
        }

        // Función auxiliar para parsear JWT
        function parseJWT(token) {
            try {
                var parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Token JWT inválido');
                }

                var payload = parts[1];

                // Decodificar base64url
                payload = payload.replace(/-/g, '+').replace(/_/g, '/');

                // Agregar padding si es necesario
                switch (payload.length % 4) {
                    case 0: break;
                    case 2: payload += '=='; break;
                    case 3: payload += '='; break;
                    default:
                        throw new Error('Token JWT mal formado');
                }

                var decoded = $window.atob(payload);
                return JSON.parse(decoded);
            } catch (error) {
                throw new Error('Error al decodificar JWT: ' + error.message);
            }
        }
    }

})();
