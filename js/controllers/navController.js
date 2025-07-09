// Controlador para la navegación
(function () {
    'use strict';

    angular.module('authApp')
        .controller('NavController', NavController);

    NavController.$inject = ['$scope', '$location', 'authService'];

    function NavController($scope, $location, authService) {
        // Variables del controlador
        $scope.isAuthenticated = false;
        $scope.userRole = '';
        $scope.isLoginPage = false;

        // Funciones del controlador
        $scope.logout = logout;

        // Activar el controlador
        activate();

        function activate() {
            // Observar cambios en la autenticación
            $scope.$watch(function () {
                return authService.isAuthenticated();
            }, function (newValue) {
                $scope.isAuthenticated = newValue;
                if (newValue) {
                    $scope.userRole = getUserRoleDisplay(authService.getUserRole());
                } else {
                    $scope.userRole = '';
                }
            });

            // Observar cambios en la ruta para detectar página de login
            $scope.$watch(function () {
                return $location.path();
            }, function (newPath) {
                $scope.isLoginPage = (newPath === '/login' || newPath === '/');
            });
        }

        function logout() {
            authService.logout();
            $location.path('/login');
        }

        function getUserRoleDisplay(role) {
            switch (role) {
                case 'User':
                    return 'Usuario';
                case 'Admin':
                    return 'Administrador';
                default:
                    return '';
            }
        }
    }

})();
