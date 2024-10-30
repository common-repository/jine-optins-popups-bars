angular.module('yetienceApp')
    .service('subscriptionAuth', ['$modal', '$rootScope', '$http', 'md5', '$q', function($modal, $rootScope, $http, md5, $q) {

        this.showPaymentDialog = function(package, account_id, button_id) {
            var modalInstance = $modal.open({
                templateUrl: yetience.adminPath + '/src/partials/payment.form.html',
                controller: ['$scope', '$modalInstance', function($modalScope, $modalInstance) {
                    $modalScope.payment = {}
                    $modalScope.payment.account_id = account_id
                    $modalScope.payment.package = package
                    $modalScope.payment.button_id = button_id
                }]
            })
        }

        this.createAccountWithEntity = function(host, entity_id) {

            var D = $q.defer()

            var modalInstance = $modal.open({
                templateUrl: yetience.adminPath + '/src/partials/auth.form.html',
                controller: ['$scope', '$modalInstance', function($modalScope, $modalInstance) {

                    $modalScope.registering = false
                    $modalScope.signup = function(auth) {
                        $modalScope.registering = true
                        auth.entity_id = entity_id
                        auth.password = md5.createHash(auth.password)
                            //auth.account_id = account_id
                        $http.post(host + '/subscription/api/Accounts/create_with_entity_owner', auth)
                            .then(function(res) {

                                $modalScope.registering = false
                                resolveIfOwnerExists(D, res.data.account)
                                $modalInstance.close()
                            })
                    }
                }]
            })

            return D.promise
        }

        function resolveIfOwnerExists(D, account) {
            console.log(account)
            if (account.owner_id) {
                console.log('owner is present on account, resolving')
                D.resolve(account)
                return true
            }

            console.log('owner is absent')
            return false
        }
    }])