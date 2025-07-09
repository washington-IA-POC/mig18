// Servicio para cuentas de ahorros
(function () {
    'use strict';

    angular.module('authApp')
        .factory('savingsService', savingsService);

    savingsService.$inject = ['$http', '$q'];

    function savingsService($http, $q) {
        var service = {
            createSavingsAccount: createSavingsAccount,
            getMyAccounts: getMyAccounts
        };

        var baseUrl = 'https://zwhf4xnv-5000.use2.devtunnels.ms';

        return service;

        // Crear cuenta de ahorros
        function createSavingsAccount(accountData) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/api/savings-account/create', accountData)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        // Obtener mis cuentas
        function getMyAccounts() {
            var deferred = $q.defer();

            $http.get(baseUrl + '/api/savings-account/my-accounts')
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
