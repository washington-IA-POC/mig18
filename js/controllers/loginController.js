// Controlador para la página de login
(function () {
    'use strict';

    angular.module('authApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'authService', '$scope'];

    function LoginController($location, authService, $scope) {
        var vm = this;

        // Variables del controlador
        vm.credentials = {
            username: '',
            password: ''
        };
        vm.loginForm = {};
        vm.errorMessage = '';
        vm.isLoading = false;
        vm.currentStep = 'username'; // 'username' o 'password'
        vm.showPasswordStep = false;

        // Funciones del controlador
        vm.login = login;
        vm.clearError = clearError;
        vm.goBack = goBack;
        vm.continueToPassword = continueToPassword;

        // Verificar si ya está autenticado al cargar la página
        activate();

        function activate() {
            if (authService.isAuthenticated()) {
                redirectBasedOnRole();
            }
        }

        function continueToPassword() {
            // Limpiar errores previos
            vm.errorMessage = '';

            // Validar que el usuario esté ingresado y sea válido
            if (!vm.credentials.username || vm.credentials.username.length < 3) {
                vm.errorMessage = 'Por favor ingresa un usuario válido';
                // Marcar el campo como tocado para mostrar el error
                if (vm.loginForm.username) {
                    vm.loginForm.username.$setTouched();
                }
                return;
            }

            // Cambiar al paso de contraseña
            vm.currentStep = 'password';
            vm.showPasswordStep = true;

            // Enfocar el campo de contraseña después de un breve delay
            setTimeout(function () {
                const passwordField = document.getElementById('password');
                if (passwordField) {
                    passwordField.focus();
                }
            }, 100);
        }

        function goBack() {
            vm.currentStep = 'username';
            vm.showPasswordStep = false;
            vm.credentials.password = '';
            vm.errorMessage = '';
        }

        function login() {
            // Limpiar errores previos
            vm.errorMessage = '';

            // Validar formulario completo
            if (!vm.credentials.username || vm.credentials.username.length < 3) {
                vm.errorMessage = 'Por favor ingresa un usuario válido';
                return;
            }

            if (!vm.credentials.password || vm.credentials.password.length < 3) {
                vm.errorMessage = 'Por favor ingresa una contraseña válida';
                return;
            }

            vm.isLoading = true;

            authService.login(vm.credentials)
                .then(function (response) {
                    vm.isLoading = false;
                    console.log('Login exitoso:', response);
                    redirectBasedOnRole();
                })
                .catch(function (error) {
                    vm.isLoading = false;
                    console.error('Error en login:', error);
                    handleLoginError(error);
                });
        }

        function redirectBasedOnRole() {
            const role = authService.getUserRole();

            if (role === 'User') {
                $location.path('/user');
            } else if (role === 'Admin') {
                $location.path('/admin');
            } else {
                vm.errorMessage = 'Rol de usuario no válido';
                authService.logout();
            }
        }

        function handleLoginError(error) {
            if (error?.message) {
                vm.errorMessage = error.message;
            } else if (error && typeof error === 'string') {
                vm.errorMessage = error;
            } else {
                vm.errorMessage = 'Error de autenticación. Verifique sus credenciales.';
            }
        }

        function clearError() {
            vm.errorMessage = '';
        }

        // Limpiar errores cuando el usuario escriba
        $scope.$watchGroup(['vm.credentials.username', 'vm.credentials.password'], function () {
            if (vm.errorMessage) {
                vm.clearError();
            }
        });
    }

})();
