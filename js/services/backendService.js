// Servicio para probar conectividad con el backend
(function () {
    'use strict';

    angular.module('authApp')
        .factory('backendService', backendService);

    backendService.$inject = ['$http', '$q'];

    function backendService($http, $q) {
        var service = {
            checkHealth: checkHealth,
            testUserAccess: testUserAccess,
            testAdminAccess: testAdminAccess
        };

        var baseUrl = 'https://zwhf4xnv-5000.use2.devtunnels.ms';

        return service;

        // Verificar estado del backend
        function checkHealth() {
            var deferred = $q.defer();

            $http.get(baseUrl + '/health')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        // Probar acceso de usuario
        function testUserAccess() {
            var deferred = $q.defer();

            $http.get(baseUrl + '/api/test/user')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        // Probar acceso de administrador
        function testAdminAccess() {
            var deferred = $q.defer();

            $http.get(baseUrl + '/api/test/admin')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    }

})();
