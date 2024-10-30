angular.module('yetienceApp')
    .controller('authFormController', ['$scope', '$modalInstance', function($modalScope, $modalInstance) {
        $modalScope.payment = {}
        $modalScope.payment.account_id = account_id,
            $modalScope.payment.package_id = package_id
        $modalScope.payment.button_id = button_id

        if (!auth.first_name) {
            console.log('first_name cannot be empty')
        }

        if ($modalScope.auth.password.length < 5) {
            window.alert('Password should be atleast 5 characters long')
        }
    }])
