angular.module('yetienceApp')
    .directive('extensionPaypal', ['$rootScope', function($rootScope) {
        // Runs during compile
        return {
            controller: ['$scope', '$attrs', '$rootScope', '$element', function($scope, $attrs, $rootScope, $element) {
                //console.log('inside extensionPaypal',$scope.websiteid, $scope.price,$scope.feature)
                $scope.getButtonCode = function() {
                    return $rootScope.paypalButtons[$scope.price].buttonId
                }

            }],
            restrict: 'A',
            templateUrl: $rootScope.basePath + '/src/partials/extension.paypal.partial.html',
            scope: {
                websiteid: '@',
                price: '@',
                feature: '@',
                referrerCode: '@'
            }

        }
    }])
