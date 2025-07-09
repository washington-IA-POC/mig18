// Controlador para la vista de administrador
(function () {
    'use strict';

    angular.module('authApp')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['authService', 'backendService'];

    function AdminController(authService, backendService) {
        var vm = this;

        // Variables del controlador
        vm.userInfo = null;
        vm.welcomeMessage = 'Bienvenido, administrador';
        vm.testMessage = '';
        vm.isTestingAccess = false;
        vm.healthStatus = '';

        // Funciones del controlador
        vm.testAdminAccess = testAdminAccess;
        vm.checkBackendHealth = checkBackendHealth;

        // Activar el controlador
        activate();

        function activate() {
            // Obtener información del usuario
            vm.userInfo = authService.getUserInfo();

            if (vm.userInfo && vm.userInfo.username) {
                vm.welcomeMessage = 'Bienvenido, administrador ' + vm.userInfo.username;
            }

            // Verificar estado del backend automáticamente
            checkBackendHealth();
        }

        function testAdminAccess() {
            vm.isTestingAccess = true;
            vm.testMessage = '';

            backendService.testAdminAccess()
                .then(function (response) {
                    vm.isTestingAccess = false;
                    vm.testMessage = response.message || 'Acceso de administrador confirmado';
                })
                .catch(function (error) {
                    vm.isTestingAccess = false;
                    vm.testMessage = 'Error al probar acceso: ' + (error.data?.message || 'Error de conexión');
                });
        }

        function checkBackendHealth() {
            backendService.checkHealth()
                .then(function (response) {
                    vm.healthStatus = response.status + ' - ' + new Date(response.timestamp).toLocaleString();
                })
                .catch(function (error) {
                    vm.healthStatus = 'Error de conexión con el backend';
                });
        }
    }

})();
