angular.module('yetienceApp')
    .directive('goals', ['$rootScope', function($rootScope) {
        // Runs during compile
        return {
            controller: ['$scope', '$attrs', '$element', function($scope, $attrs, $element) {
                console.log('inside Goal directive')
                $scope.R = $rootScope
                if ($rootScope.goals)
                    console.log()
                else
                    setTimeout(function() {
                        var list = $scope.R.goals
                    }, 1000);


            }],
            restrict: 'A',
            template: '<div ng-repeat="key in R.goals[label].components"> {{key}} </div>',
            scope: {
                label: '@'
            }

        }
    }])
