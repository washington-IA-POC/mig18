// Controlador para la página de error
(function () {
    'use strict';

    angular.module('authApp')
        .controller('ErrorController', ErrorController);

    ErrorController.$inject = ['$location', 'authService'];

    function ErrorController($location, authService) {
        var vm = this;

        // Variables del controlador
        vm.errorMessage = 'Acceso no autorizado o error inesperado';
        vm.canGoBack = false;

        // Funciones del controlador
        vm.goToLogin = goToLogin;
        vm.goBack = goBack;

        // Activar el controlador
        activate();

        function activate() {
            // Verificar si hay una página anterior válida
            vm.canGoBack = window.history.length > 1;
        }

        function goToLogin() {
            // Limpiar sesión y redirigir al login
            authService.logout();
            $location.path('/login');
        }

        function goBack() {
            if (vm.canGoBack) {
                window.history.back();
            } else {
                vm.goToLogin();
            }
        }
    }

})();
