angular.module('yetienceApp')
    .directive('pitchPay', ['$rootScope', function($rootScope) {

        // Runs during compile
        return {
            restrict: "E",
            scope: {
                feature: "=feature"
            },
            templateUrl: $rootScope.basePath + '/src/partials/pitch.pay.directive.html',
            controller: ['$scope', 'CommService', 'SettingsService', '$rootScope', 'localStorageService',
                function($scope, CommService, SettingsService, $rootScope, localStorageService) {


                    $scope.C = CommService
                    $scope.SS = SettingsService
                    $scope.website_id = SettingsService.setup().id
                    $scope.R = $rootScope
                    $scope.referrer_id = SettingsService.setup().referrer_id;

                    $scope.addNewReferralCode = function(ref_code, featureLabel) {
                        //console.log(ref_code)
                        if (!$scope.referrer_id && ref_code) {
                            CommService.addReferralCode(ref_code)
                                .then(function() {
                                    //show the 'referral code added' message on front end
                                    //and hide the textbox
                                    var statusMsg = document.getElementById('yel-referral-status-' + featureLabel).style.display = "block";
                                    var statusMsg = document.getElementById('yel-referral-' + featureLabel).style.display = "none";
                                })
                        }
                    }

                    $scope.showPaymentDetails = function(featureLabel) {
                        //console.log('yel-ext-'+featureLabel+'-details')
                        document.getElementById('yel-ext-' + featureLabel + '-details').style.display = "none";
                        document.getElementById('yel-ext-' + featureLabel + '-payment').style.display = "block";
                    }

                    $scope.showAddonDetails = function(featureLabel) {
                        document.getElementById('yel-ext-' + featureLabel + '-details').style.display = "block";
                        document.getElementById('yel-ext-' + featureLabel + '-payment').style.display = "none";
                    }

                    $scope.priceForFeature = function(label, duration) {
                        var sixMonthPrice = 30;
                        var yearlyPrice = 50;
                        var sixMonthPriceCombinedFeature = 60;
                        var yearlyPriceCombinedFeature = 100;

                        if (duration == 6) {
                            if (label == 'premiumSubscription') {
                                //asking for a 6month price of combined extension
                                return sixMonthPriceCombinedFeature;
                            } else {
                                //asking for a 6month price of single extension
                                return sixMonthPrice;
                            }
                        } else if (duration == 12) {
                            if (label == 'premiumSubscription') {
                                //asking for a yearly price of combined extension
                                return yearlyPriceCombinedFeature;
                            } else {
                                //asking for a yearly price of single extension
                                return yearlyPrice;
                            }
                        }

                    }

                    $scope.isReferrerPresent = function() {
                        if ($rootScope.SETUP.referrer_id) {
                            return true;
                        } else {
                            return false;
                        }

                    }


                    $scope.displayPriceForFeature = function(label) {
                        var price = 5;
                        if (label == 'premiumSubscription') {
                            price = 10
                        }
                        return price;
                    }

                    $scope.featureIcon = function(feature) {
                        return "glyphicon-" + feature.icon
                    }

                    function randomInteger(max, min) {
                        return Math.round(min + Math.random() * (max - min));
                    }


                }
            ]
        };

    }]);
