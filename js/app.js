// Configuración principal de la aplicación AngularJS
(function () {
    'use strict';

    // Creación del módulo principal
    angular.module('authApp', ['ngRoute'])
        .config(routeConfig)
        .run(runBlock);

    // Configuración de rutas
    routeConfig.$inject = ['$routeProvider', '$locationProvider'];
    function routeConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .when('/user', {
                templateUrl: 'views/user.html',
                controller: 'UserController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authService, $location) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return false;
                        }
                        if (authService.getUserRole() !== 'User') {
                            $location.path('/error');
                            return false;
                        }
                        return true;
                    }
                }
            })
            .when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'AdminController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authService, $location) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return false;
                        }
                        if (authService.getUserRole() !== 'Admin') {
                            $location.path('/error');
                            return false;
                        }
                        return true;
                    }
                }
            })
            .when('/create-savings', {
                templateUrl: 'views/create-savings.html',
                controller: 'CreateSavingsController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authService, $location) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return false;
                        }
                        return true;
                    }
                }
            })
            .when('/savings-accounts', {
                templateUrl: 'views/savings-accounts.html',
                controller: 'SavingsAccountsController',
                controllerAs: 'vm',
                resolve: {
                    auth: function (authService, $location) {
                        if (!authService.isAuthenticated()) {
                            $location.path('/login');
                            return false;
                        }
                        return true;
                    }
                }
            })
            .when('/error', {
                templateUrl: 'views/error.html',
                controller: 'ErrorController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/login'
            });

        // Habilitar modo HTML5 para URLs limpias (opcional)
        $locationProvider.hashPrefix('');
    }

    // Bloque de inicialización
    runBlock.$inject = ['$rootScope', '$location', 'authService'];
    function runBlock($rootScope, $location, authService) {

        // Verificar autenticación en cada cambio de ruta
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // Si el usuario no está autenticado y no va a login, redirigir a login
            if (!authService.isAuthenticated() && next.originalPath !== '/login' && next.originalPath !== '/error') {
                event.preventDefault();
                $location.path('/login');
            }
        });

        // Manejar errores de cambio de ruta
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            console.error('Error en cambio de ruta:', rejection);
            $location.path('/error');
        });

        // Variables globales útiles
        $rootScope.isLoading = false;
    }

})();
