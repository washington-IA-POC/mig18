// Controlador para la vista de usuario
(function () {
    'use strict';

    angular.module('authApp')
        .controller('UserController', UserController);

    UserController.$inject = ['authService', 'backendService'];

    function UserController(authService, backendService) {
        var vm = this;

        // Variables del controlador
        vm.userInfo = null;
        vm.welcomeMessage = 'Bienvenido, usuario';
        vm.testMessage = '';
        vm.isTestingAccess = false;

        // Funciones del controlador
        vm.testUserAccess = testUserAccess;

        // Activar el controlador
        activate();

        function activate() {
            // Obtener información del usuario
            vm.userInfo = authService.getUserInfo();

            if (vm.userInfo && vm.userInfo.username) {
                vm.welcomeMessage = 'Bienvenido, ' + vm.userInfo.username;
            }
        }

        function testUserAccess() {
            vm.isTestingAccess = true;
            vm.testMessage = '';

            backendService.testUserAccess()
                .then(function (response) {
                    vm.isTestingAccess = false;
                    vm.testMessage = response.message || 'Acceso de usuario confirmado';
                })
                .catch(function (error) {
                    vm.isTestingAccess = false;
                    vm.testMessage = 'Error al probar acceso: ' + (error.data?.message || 'Error de conexión');
                });
        }
    }

})();
