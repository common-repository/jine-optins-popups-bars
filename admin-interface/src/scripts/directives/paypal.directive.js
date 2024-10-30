angular.module('yetienceApp')
    .directive('paypal', ['$rootScope', function($rootScope, $product_id) {

        // Runs during compile
        return {
            restrict: "E",
            scope: {
                button: '=',
                accountId: '=',
                package: '='
            },
            templateUrl: $rootScope.basePath + '/src/partials/paypal.directive.html',
            controller: ['$scope', 'CommService', function($scope, CommService) {
                $scope.$watch('frequency', function(frequency) {
                    if (frequency) {
                        $scope.package_frequency = $scope.package.label + ' ' + $scope.frequency


                    }
                })
            }]
        };

    }]);
