angular.module('yetienceApp')
    .controller('extensionSaleController', ['$scope', 'CommService', 'SettingsService', '$rootScope', 'localStorageService', function($scope, CommService, SettingsService, $rootScope, localStorageService) {
        $scope.C = CommService
        $scope.SS = SettingsService
        $scope.website_id = SettingsService.setup().id
        $scope.R = $rootScope

        $scope.referrer_id = SettingsService.setup().referrer_id;



        $scope.activate = function(key) {
            //console.log('key is ' + key)
            CommService.activateKey(key)
                .then(function(status_object) {
                    var status = status_object.status
                        // console.log('status of activation is ')
                        // console.log(status)

                    if (status == 'activated') {
                        document.getElementById('yel-activation-status').innerHTML = 'All Premium features are activated on this website'
                        setTimeout(function() {
                            location.reload()
                        }, 2000);
                    } else {
                        document.getElementById('yel-activation-status').innerHTML = status
                    }
                })
        }



        $scope.extensionSalePartial = function() {
            return $rootScope.basePath + '/src/partials/extension.sale.html'
        }

    }])
