angular.module('yetienceApp')
    .controller('buildIntegrateController', ['$scope', '$rootScope', 'CommService', 'UtilsService', 'WidgetUpdate', function($scope, $rootScope, CommService, UtilsService, WidgetUpdate) {


        var email_subject_sent = null
        $rootScope.from_email_defined = true
        $scope.emailFields = angular.copy($rootScope.components['email-subscriber'].fields)
        $scope.welcomeEmailFields = angular.copy($rootScope.components['welcome-email'].fields)

        var sent_events = [];

        $scope.enableWelcomeEmail = function() {
            $scope.showEmail = true
            $scope.widget.components.welcomeEmail.values.sendWelcomeEmail = true

        }

        $scope.skipToNext = function(widget, customer) {

            // WidgetUpdate.nextFunction($scope.widget, $scope.customer)
        }

        // Set the default welcome message here
        if (UtilsService.checkNested($scope, ['widget', 'components', 'welcomeEmail'])) {
            // if (!$scope.widget.components.welcomeEmail.values.welcomeEmail) {
            if (!UtilsService.checkNested($scope, ['widget', 'components', 'welcomeEmail', 'values', 'welcomeEmail'])) {
                $scope.widget.components.welcomeEmail.values.welcomeEmail = '<div><!--block-->Hello [name],<br>Thanks for subscribing with us.<br><br>Your Business Name</div>'

            }
        }

        //Set default values if it's email theme
        if (WidgetUpdate.isEmailPopup($scope.widget)) {
            console.log('is email');
            $scope.widget.components.emailSubscription.values.provider = 'Yeloni'
            $scope.widget.components.emailSubscription.values.askName = true
            $scope.widget.components.emailSubscription.values.thankyou = 'no'
            $scope.widget.components.emailSubscription.values.list = $rootScope.widget.code
            $rootScope.fetched_lists = true
        } else {
            console.log('not email')
        }


        //check send welcome email value
        $scope.$watch('widget.components.welcomeEmail.values.sendWelcomeEmail', function(newValue, oldValue) {

            if (newValue == false) {
                $rootScope.from_email_defined = true
                $scope.welcome_email_enabled = false
            } else {
                $scope.welcome_email_enabled = true
                $rootScope.from_email_defined = false
            }
        });

        //from email
        $scope.$watch('widget.components.welcomeEmail.values.emailFrom', function(newValue_email, oldValue_email) {
            //when welcome email is enabled and from email is defined -> enable save button
            if ($scope.welcome_email_enabled == true) {
                if (newValue_email) {
                    $rootScope.from_email_defined = true
                } else {
                    $rootScope.from_email_defined = false
                }
            }
        })


        if (UtilsService.checkNested($scope, ['widget', 'components', 'welcomeEmail', 'values', 'ccEnabled'])) {
            $scope.showEmail = $scope.widget.components.welcomeEmail.values.ccEnabled
        }
        $scope.$watch('widget.components.welcomeEmail.values.sendWelcomeEmail', function(new_val, old_val) {
            if ($scope.showEmail == true) {
                if (new_val == true) {
                    // console.log('new is ' + new_val)

                } else {

                    // console.log('new is ' + new_val)
                }
            }
        })
        $scope.$watch('widget.components.welcomeEmail.values.emailFrom', function(new_val, old_val) {
                if ($scope.showEmail == true) {
                    if ((sent_events.indexOf('email_from_filled') < 0) && ($rootScope.fetched_lists == true)) {
                        if (new_val) {
                            sent_events.push('email_from_filled')

                        }
                    }
                }

            })
            //send this event only once
        $scope.$watch('widget.components.welcomeEmail.values.emailSubject', function(new_val, old_val) {
            if ($scope.showEmail == true) {
                if ((sent_events.indexOf('email_subject_filled') < 0) && ($rootScope.fetched_lists == true)) {
                    if (new_val) {
                        sent_events.push('email_subject_filled')

                        email_subject_sent = true
                    } else {

                    }
                }
            }
        })

        $scope.$watch('widget.components.welcomeEmail.values.ccEnabled', function(new_val, old_val) {
            if ($scope.showEmail == true) {
                if (new_val == true) {
                    // console.log('new is ' + new_val)

                } else {

                    // console.log('new is ' + new_val)
                }
            }
        })
        $scope.$watch('widget.components.welcomeEmail.values.ccEmail', function(new_val, old_val) {
            if ($scope.showEmail == true && (sent_events.indexOf('email_cc_filled') < 0)) {
                if (new_val) {
                    sent_events.push('email_cc_filled')
                        // console.log('new is ' + new_val)

                } else {

                    // console.log('new is ' + new_val)
                }
            }
        })
        $scope.emailFocussed = function() {
            if ($scope.showEmail == true) {
                if ((sent_events.indexOf('email_content_clicked') < 0) && ($rootScope.fetched_lists == true)) {
                    sent_events.push('email_content_clicked')
                        // console.log('email focussed')

                }
            }
        }
    }])
