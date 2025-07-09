// Controlador para mostrar cuentas de ahorros
(function () {
    'use strict';

    angular.module('authApp')
        .controller('SavingsAccountsController', SavingsAccountsController);

    SavingsAccountsController.$inject = ['$location', 'savingsService', 'authService'];

    function SavingsAccountsController($location, savingsService, authService) {
        var vm = this;

        // Variables del controlador
        vm.accounts = [];
        vm.isLoading = false;
        vm.error = null;

        // Funciones del controlador
        vm.loadAccounts = loadAccounts;
        vm.viewAccountDetails = viewAccountDetails;
        vm.getTotalBalance = getTotalBalance;
        vm.getActiveAccountsCount = getActiveAccountsCount;

        // Inicialización
        init();

        function init() {
            // Verificar que el usuario esté autenticado
            if (!authService.isAuthenticated()) {
                $location.path('/login');
                return;
            }

            // Cargar las cuentas
            loadAccounts();
        }

        function loadAccounts() {
            vm.isLoading = true;
            vm.error = null;

            savingsService.getMyAccounts()
                .then(function (response) {
                    vm.accounts = response.accounts || [];
                })
                .catch(function (error) {
                    vm.error = error.data?.message || 'Error al cargar las cuentas de ahorros';
                    console.error('Error loading savings accounts:', error);
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function viewAccountDetails(account) {
            // Por ahora solo mostramos un alert, pero aquí se puede navegar a una vista de detalles
            alert('Detalles de la cuenta:\n\n' +
                'Número: ' + account.accountNumber + '\n' +
                'Titular: ' + account.titularName + '\n' +
                'Saldo: $' + account.initialDeposit.toFixed(2) + '\n' +
                'Estado: ' + account.status);
        }

        function getTotalBalance() {
            return vm.accounts.reduce(function (total, account) {
                return total + (account.initialDeposit || 0);
            }, 0);
        }

        function getActiveAccountsCount() {
            return vm.accounts.filter(function (account) {
                return account.status === 'Active';
            }).length;
        }
    }
})();
