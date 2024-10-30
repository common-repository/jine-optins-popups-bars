angular.module('yetienceApp')
    .controller('GoPremiumController', ['$scope', '$rootScope', 'SettingsService', '$modal', 'subscriptionAuth', 'CommService', '$state', 'localStorageService', function($scope, $rootScope, SettingsService, $modal, subscriptionAuth, CommService, $state, localStorageService) {
        localStorageService.remove('widget')
        if (!yetience.website_saved) {
            $state.go('start')
        }

        $scope.R = $rootScope
        $scope.S = SettingsService.setup()
        $scope.payment = {}



        $scope.showInModal = function(text) {
            //console.log('clicked')
            var modalInstance = $modal.open({
                templateUrl: yetience.adminPath + '/src/partials/feature.description.html',
                controller: ['$scope', '$modalInstance', function($modalScope, $modalInstance) {
                    $modalScope.description = text

                }]
            })
        }

        $scope.upgrade = function(package) {
            //first check if there is an account with the current website id
            //if there is an account, then show the payment buttons
            //if there is no account, then ask for registration and then show the payment


            CommService.getWebsite(SettingsService.setup().id)
                .then(function(website) {
                    //console.log("YC: Clicked on Upgrade Package");

                    if (website.account_id) {
                        //account id exists, show the payment
                        //form for the selected package
                        showPaymentForm(package, website.account_id)

                    } else {
                        //show registration dialog and then show payment screen
                        subscriptionAuth.createAccountWithEntity(yetience.server, SettingsService.setup().id)
                            .then(function(account) {
                                //console.log('YC:Account created');
                                //console.log('Account created')
                                console.log(account)
                                showPaymentForm(package, account.id)

                            })
                    }
                })
        }

        function showPaymentForm(package, account_id) {
            subscriptionAuth.showPaymentDialog(package, account_id, "XQB79ZF33Z5N4")
        }

    }])
