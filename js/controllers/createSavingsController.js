// Controlador para crear cuenta de ahorros
(function () {
    'use strict';

    angular.module('authApp')
        .controller('CreateSavingsController', CreateSavingsController);

    CreateSavingsController.$inject = ['$location', 'savingsService', 'authService'];

    function CreateSavingsController($location, savingsService, authService) {
        var vm = this;

        // Variables del formulario
        vm.currentStep = 1;
        vm.totalSteps = 3;
        vm.isLoading = false;
        vm.error = null;
        vm.success = null;
        vm.createdAccount = null;

        // Datos del formulario
        vm.formData = {
            titularName: '',
            identificationNumber: '',
            identificationType: '',
            phoneNumber: '',
            address: '',
            initialDeposit: null
        };

        // Opciones para tipo de identificación
        vm.identificationTypes = [
            { value: 'cedula', label: 'Cédula' },
            { value: 'pasaporte', label: 'Pasaporte' },
            { value: 'ruc', label: 'RUC' }
        ];

        // Funciones del controlador
        vm.nextStep = nextStep;
        vm.prevStep = prevStep;
        vm.submitForm = submitForm;
        vm.goToUserDashboard = goToUserDashboard;
        vm.createAnotherAccount = createAnotherAccount;
        vm.getStepTitle = getStepTitle;
        vm.getStepDescription = getStepDescription;
        vm.isStepValid = isStepValid;

        // Inicialización
        init();

        function init() {
            // Verificar que el usuario esté autenticado
            if (!authService.isAuthenticated()) {
                $location.path('/login');
                return;
            }
        }

        function nextStep() {
            if (vm.currentStep < vm.totalSteps && isStepValid(vm.currentStep)) {
                vm.currentStep++;
                vm.error = null;
            }
        }

        function prevStep() {
            if (vm.currentStep > 1) {
                vm.currentStep--;
                vm.error = null;
            }
        }

        function submitForm() {
            if (!isStepValid(vm.currentStep)) {
                vm.error = 'Por favor complete todos los campos requeridos';
                return;
            }

            vm.isLoading = true;
            vm.error = null;

            // Preparar datos para envío
            var accountData = {
                titularName: vm.formData.titularName,
                identificationNumber: vm.formData.identificationNumber,
                identificationType: vm.formData.identificationType,
                phoneNumber: vm.formData.phoneNumber,
                address: vm.formData.address,
                initialDeposit: parseFloat(vm.formData.initialDeposit)
            };

            savingsService.createSavingsAccount(accountData)
                .then(function (response) {
                    vm.success = true;
                    vm.createdAccount = response.accountInfo;
                    vm.currentStep = vm.totalSteps + 1; // Mostrar pantalla de éxito
                })
                .catch(function (error) {
                    vm.error = error.data?.message || 'Error al crear la cuenta de ahorros';
                    console.error('Error creating savings account:', error);
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        function goToUserDashboard() {
            $location.path('/user');
        }

        function createAnotherAccount() {
            // Resetear formulario
            vm.currentStep = 1;
            vm.formData = {
                titularName: '',
                identificationNumber: '',
                identificationType: '',
                phoneNumber: '',
                address: '',
                initialDeposit: null
            };
            vm.error = null;
            vm.success = null;
            vm.createdAccount = null;
        }

        function getStepTitle(step) {
            switch (step) {
                case 1:
                    return 'Información Personal';
                case 2:
                    return 'Datos de Contacto';
                case 3:
                    return 'Depósito Inicial';
                default:
                    return 'Cuenta Creada';
            }
        }

        function getStepDescription(step) {
            switch (step) {
                case 1:
                    return 'Ingrese su nombre completo y documento de identidad';
                case 2:
                    return 'Proporcione sus datos de contacto';
                case 3:
                    return 'Establezca el monto del depósito inicial';
                default:
                    return 'Su cuenta de ahorros ha sido creada exitosamente';
            }
        }

        function isStepValid(step) {
            switch (step) {
                case 1:
                    return vm.formData.titularName &&
                        vm.formData.identificationNumber &&
                        vm.formData.identificationType;
                case 2:
                    return vm.formData.phoneNumber &&
                        vm.formData.address;
                case 3:
                    return vm.formData.initialDeposit &&
                        parseFloat(vm.formData.initialDeposit) > 0;
                default:
                    return false;
            }
        }
    }
})();
