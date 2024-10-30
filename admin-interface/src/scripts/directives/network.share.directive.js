angular.module('yetienceApp')
    .directive('networkShare', [function() {
        // Runs during compile
        return {
            controller: ['$scope', '$attrs', '$rootScope','$element', function($scope, $attrs, $rootScope,$element) {
                console.log('inside network directive')
                $scope.staticPath = $rootScope.staticPath
                $scope.pluginPath = $rootScope.pluginPath
                
                $element.addClass('autience-social-share')
                $element.attr('id','autience-network-'+$scope.network)
            }],
            restrict: 'A',
            template: '<img ng-src="{{pluginPath}}/common/images/social-icons/round/{{network}}.png" />',
            scope:{
            	network:'@'
            }

        }
    }])