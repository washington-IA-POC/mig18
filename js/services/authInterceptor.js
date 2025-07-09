// Interceptor para autenticación JWT
(function () {
    'use strict';

    angular.module('authApp')
        .factory('authInterceptor', authInterceptor)
        .config(configInterceptor);

    authInterceptor.$inject = ['$q', '$window', '$location'];

    function authInterceptor($q, $window, $location) {
        return {
            request: request,
            responseError: responseError
        };

        function request(config) {
            // Obtener el token del localStorage
            var token = $window.localStorage.getItem('jwt_token');

            // Si existe token y la petición es a la API del backend, agregar el header Authorization
            if (token && (config.url.indexOf('https://zwhf4xnv-5000.use2.devtunnels.ms/') !== -1 || config.url.indexOf('/api/') !== -1)) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        }

        function responseError(response) {
            // Si recibimos un 401 (No autorizado), redirigir al login
            if (response.status === 401) {
                // Limpiar token corrupto o expirado
                $window.localStorage.removeItem('jwt_token');
                $location.path('/login');
            }

            // Si recibimos un 403 (Prohibido), redirigir a error
            if (response.status === 403) {
                $location.path('/error');
            }

            return $q.reject(response);
        }
    }

    // Configurar el interceptor
    configInterceptor.$inject = ['$httpProvider'];
    function configInterceptor($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

})();
