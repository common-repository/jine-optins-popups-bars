angular.module('yetienceApp')
    .directive('emailConnector', ['$rootScope', function($rootScope) {
        // Runs during compile
        return {
            controller: ['$rootScope', '$element', '$scope', 'SettingsService', 'CommService', 'UtilsService', function($rootScope, $element, $scope, SettingsService, CommService, UtilsService) {
                var provider_list = $rootScope.emailProviders

                var premium_providers_array = $rootScope.components['email-subscriber'].premiumProviders


                $scope.openPopup = function() {

                    console.log('provider - ' + $scope.provider)
                    var provider_is_premium = null
                        //if it is a premium provider, then it will be true, else it will be false
                    if (premium_providers_array.indexOf($scope.provider) == -1) {
                        provider_is_premium = false
                    } else {
                        provider_is_premium = true
                    }


                    //if it is a premium provider and the feature premiumEmail is not activated, show the premiumMessage box, else continue with the flow

                    if ((provider_is_premium == true) && !SettingsService.hasFeature('premiumEmail')) {
                        UtilsService.premiumMessage($scope.provider + ' email provider is available in Premium Version')
                    } else {
                        //if activecampaign is selected, show the url and key textboxes which will be then saved to the api, these will be used for subscription
                        if ($scope.provider && $scope.provider == 'ActiveCampaign') {


                            // console.log($scope.emailConfig.activecampaignKey);
                            var activecampaign_data = {}

                            activecampaign_data.url = $scope.emailConfig.activecampaignUrl;
                            activecampaign_data.api_key = $scope.emailConfig.activecampaignKey

                            CommService.setupActivecampaign(activecampaign_data)
                                .then(function(res) {
                                    // console.log('setupActivecampaign complete')
                                    // console.log(res)
                                    $scope.emailConfig.list = $scope.emailConfig.activecampaignKey
                                    $scope.fetched_lists = true
                                })
                        } else if ($scope.provider && $scope.provider == 'Sendy') {


                            // console.log($scope.emailConfig.sendyUrl);
                            // console.log($scope.emailConfig.sendyKey);
                            var sendy_data = {}

                            sendy_data.url = $scope.emailConfig.sendyUrl;
                            sendy_data.list = $scope.emailConfig.sendyKey

                            CommService.setupSendy(sendy_data)
                                .then(function() {
                                    console.log('setupsendy complete')
                                    $scope.emailConfig.list = $scope.emailConfig.sendyKey
                                    $scope.fetched_lists = true
                                })
                        } else {

                            console.log('provider - ' + $scope.provider)
                            window.open(generate_auth_url[$scope.provider](), "Mailchimp",
                                "width=640,height=480,left=350,top=350,location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1")
                            pollForLists()
                        }

                    }



                }

                var generate_auth_url = {
                    Mailchimp: function() {
                        var URI = encodeURIComponent(yetience.server + '/api/Mailchimps/from_mailchimp?website_id=' + SettingsService.setup().id);
                        // console.log('client_id- ' + provider_list[$scope.provider].client_id)
                        var auth_uri = ('https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=' + provider_list[$scope.provider].client_id + '&redirect_uri=' + URI);

                        // console.log(auth_uri)
                        return auth_uri
                    },
                    Aweber: function() {
                        var URI = encodeURIComponent(yetience.server + '/api/Awebers/login?website_id=' + SettingsService.setup().id);
                        // console.log('client_id- ' + provider_list[$scope.provider].client_id)
                        var auth_uri = (yetience.server + '/api/awebers/login?website_id=' + SettingsService.setup().id);

                        // console.log(auth_uri)
                        return auth_uri
                    },
                    GetResponse: function() {

                        // console.log('client_id- ' + provider_list[$scope.provider].client_id)
                        var auth_uri = ('https://app.getresponse.com/oauth2_authorize.html?response_type=code&client_id=' + provider_list[$scope.provider].client_id + '&state=' + SettingsService.setup().id);
                        console.log(auth_uri)
                        return auth_uri

                    },
                    ActiveCampaign: function() {
                        // CommService.setupActivecampaign()

                    }
                }


                $scope.$watch('provider', function(new_val, old_val) {
                    if (new_val) {
                        console.log('provider selected ' + new_val)
                        if (premium_providers_array.indexOf(new_val) == -1) {
                            provider_is_premium = false
                        } else {
                            provider_is_premium = true
                        }

                        //if new provider is not yeloni, set fetched_lists to false -> show the connect with {{}} button
                        if (new_val.indexOf('yeloni') < 0) {
                            $scope.fetched_lists = false
                        }

                        if ((provider_is_premium == true) && !SettingsService.hasFeature('premiumEmail')) {
                            UtilsService.premiumMessage($scope.provider + ' email provider is available in Premium Version')
                            $scope.provider = old_val
                                // console.log(new_val, old_val)
                            $rootScope.widget.components.emailSubscription.values.provider = old_val
                        } else {
                            fetchAndAssignLists(new_val)
                        }
                    }
                })


                $scope.fetched_lists = false
                $scope.list_requested = false

                function pollForLists() {
                    fetchAndAssignLists($scope.provider)
                    setTimeout(function() {
                        if (!$scope.fetched_lists) {
                            pollForLists()
                        }
                    }, 3000)
                }

                $scope.$watch('list_requested', function(new_val, old_val) {
                    console.log('list_requested is ', new_val, old_val)
                    if (new_val == true) {
                        $rootScope.email_list_requested = true
                    }
                })

                function fetchAndAssignLists(provider) {


                    if (provider && provider.indexOf('Yeloni') < 0 && provider.indexOf('ActiveCampaign') < 0 && provider.indexOf('Sendy') < 0) {
                        CommService.getEmailLists($scope.provider, SettingsService.setup().id)
                            .then(function(lists) {
                                $scope.list_requested = true
                                if ($scope.provider == 'Yeloni') {
                                    lists.lists = 'New List'
                                }

                                // console.log('lists.lists')
                                // console.log(lists.lists)
                                if (lists.lists != null) {
                                    $scope.fetched_lists = true
                                        // console.log('emailConfig.lists')
                                        // console.log($scope.emailConfig.lists)
                                    if ($scope.emailConfig) {
                                        $scope.emailConfig.lists = lists.lists
                                            //pushAllToArray(lists.lists, $scope.emailConfig.lists)
                                    }

                                    if ($scope.emailFields && $scope.emailFields.length > 1) {
                                        console.log('Assigning lists on emailFields')
                                        $scope.emailFields[1].templateOptions.options = lists.lists
                                    } else {
                                        console.log('emailFields does not have two elements')
                                        console.log($scope.emailFields)
                                    }
                                }
                            })
                    } else {

                        //if it's activecampaign or yeloni, don't fetch lists
                        if (provider.indexOf('ActiveCampaign') >= 0) {
                            // $scope.emailConfig.list = $rootScope.widget.code
                            // $scope.fetched_lists = true
                        } else if (provider.indexOf('Sendy') >= 0) {
                            // console.log('444444444444444444444444444444444444444')
                            // $scope.emailConfig.list = $rootScope.widget.code
                            // $scope.fetched_lists = true
                        } else {
                            $scope.emailConfig.list = $rootScope.widget.code
                            $scope.fetched_lists = true

                        }
                    }

                }

                function pushAllToArray(src, dst) {
                    if (dst.length == 0) {
                        for (var i = 0; i < src.length; i++) {
                            dst.push(src[i])
                        }
                    }

                }
                //


            }],
            restrict: 'A',
            template: "<div ng-hide='!list_requested || fetched_lists'><button type='button' class='btn btn-primary'  ng-click='openPopup()'><i class='glyphicon glyphicon-envelope'></i> Connect Yeloni to your {{provider}} Account</button><br><small class='text-muted'>This opens a new window where you can login to your {{provider}} Account</small></div>",
            scope: {
                provider: '@',
                emailConfig: '=',
                emailFields: '='
            }

        }
    }])
