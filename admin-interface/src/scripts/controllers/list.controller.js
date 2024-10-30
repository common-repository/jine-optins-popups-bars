angular.module('yetienceApp')
    .controller('ListController', ['$scope', 'SettingsService', '$state', '$rootScope', 'UtilsService', 'CommService', 'UpgradeService', '$location', 'localStorageService', '$modal', 'configurationFields', '$timeout', 'FeatureStatusService', 'WidgetUpdate', function($scope, SettingsService, $state, $rootScope, UtilsService, CommService, UpgradeService, $location, localStorageService, $modal, configurationFields, $timeout, FeatureStatusService, WidgetUpdate) {

        //console.log($rootScope)
        var review_url = 'https://wordpress.org/support/plugin/yeloni-free-exit-popup/reviews/#new-post';

        localStorageService.remove('widget')

        if (!yetience.website_saved) {
            $state.go('start')
        }
        $scope.R = $rootScope
        $scope.C = CommService
        $scope.U = UpgradeService
        $scope.S = SettingsService
        $scope.FS = FeatureStatusService

        //console.dir($scope.R)
        //$scope.displayCounter = 1;

        $scope.list_show_extensions = false
        $scope.yelFirstShowFeedback = false;

        $scope.C = CommService
        $scope.configFields = angular.copy(configurationFields)

        $scope.M = $modal;


        $scope.list = {}
        $rootScope.$on('setup_initialized', function() {
            if (SettingsService.setup().widgets && SettingsService.setup().widgets.length == 0) {
                //there are no widgets

                //$location.path('/create/build/select')
                //$location.path('/create/build/goals')

                $location.path('/create/build/select')


            } else {
                $scope.list.widgets = SettingsService.setup().widgets


                if (!SettingsService.setup().feedback_working) {
                    //show modal for feedback when feedback_working is not defined

                    /*var modalInstance = $modal.open({
                        size: 'md',
                        backdrop: 'static',
                        keyboard: false,
                        templateUrl: yetience.adminPath + '/src/partials/modal.popup.feedback.html',
                        controller: 'ModalFeedbackController'
                    })*/

                    //display the div on the list.html page and add required questions
                    $scope.yelFirstShowFeedback = true;
                    //console.log("in SettingsService")

                }

            }

        })

        if (SettingsService.setup()) {
            $scope.list.widgets = SettingsService.setup().widgets

            if ($scope.list.widgets.length == 0) {
                //$location.path('/create/build/goals')
                $location.path('/create/build/select')
            }
        }

        $scope.returnImagePath = function(widget) {
            var theme = widget.theme
            var path = 'http://theme.autience.com/themes/' + theme + '/' + theme + "-screenshot.jpg";
            return path;
        }

        $scope.clickedRecommends = function(item) {
            $timeout(function() {
                window.open(item.link, '_blank');
            }, 500)

        }

        $scope.yelShowAffiliate = function() {
            $timeout(function() {
                $location.path('/affiliate')
            }, 500)
        }

        $scope.yel_show_extensions = function() {
            $timeout(function() {
                $location.path('/extensions')
            }, 100)
        }

        $scope.yelShowFeedback = function() {
            // console.log($scope.yelFirstShowFeedback)
            return $scope.yelFirstShowFeedback;
        }

        $scope.toggle_list_show_extensions = function() {
            $scope.list_show_extensions = $scope.list_show_extensions === false ? true : false;
        }

        $scope.extensionSalePartial = function() {
            return $rootScope.basePath + '/src/partials/extension.sale.html'
        }

        $scope.addNewWidget = function() {

            //taking the user to the select page
            $location.path('/create/build/select')

        }

        $scope.changeEnable = function(state, name) {
            var message = 'This Widget will be Disabled'
            var label = 'Disable'
            if (state) {
                message = 'This Widget will be Enabled'
                label = 'Enable'
            }

            //console.log(message)
            SettingsService.saveSetup('<center>' + message + '</center>', label)
        }

        $scope.isEmailTheme = function(index) {
            var widgets = SettingsService.setup().widgets
                // if (widgets[index].components.emailSubscription) {
                // if (!UtilsService.checkNested(widgets[index], ['components', 'emailSubscription'])) {
            if (WidgetUpdate.isEmailPopup(widgets[index])) {
                if (UtilsService.checkNested(widgets[index], ['components', 'emailSubscription', 'values', 'provider'])) {
                    var current_widget_provider = widgets[index].components.emailSubscription.values.provider

                    if (current_widget_provider.indexOf('Yeloni') >= 0) {
                        return true
                    }
                }
            }
            return false
        }

        $scope.emailListModal = function(index) {

            var modalInstance = $modal.open({
                size: 'md',
                templateUrl: yetience.adminPath + '/src/partials/modal.email.list.html',
                controller: 'emailListController',
                resolve: {
                    WidgetCode: function() {
                        return SettingsService.setup().widgets[index].code
                    }
                }
            })

        }



        $scope.removeWidget = function(index) {
            var widgets = SettingsService.setup().widgets
            var name = widgets[index].configuration.what.name

            //console.log('name- ' + name)
            widgets.splice(index, 1)
            SettingsService.saveSetup('<center>This Popup will be Deleted</center>', 'Delete')
        }


        $scope.configure = function(index) {
            //if (SettingsService.hasFeature('advancedConfiguration')) {
            $rootScope.widget = SettingsService.setup().widgets[index]
            $rootScope.isEmailTheme = ($rootScope.themes[$rootScope.widget.theme].categories.indexOf('subscribe') >= 0)
            var modalInstance = $modal.open({
                size: 'md',
                templateUrl: yetience.adminPath + '/src/partials/modal.configure.html',
                controller: ['$scope', 'SettingsService', function($scope, SettingsService) {
                    $scope.S = SettingsService
                    $scope.R = $rootScope
                    $scope.C = CommService
                    $scope.U = UpgradeService
                    $scope.W = WidgetUpdate
                    $scope.oneAtATime = true
                    $scope.configureReturnPath = function() {
                        return yetience.adminPath + '/src/partials/build.configure.html'
                    }

                    $scope.save = function() {
                        modalInstance.close()
                            //console.log($rootScope.widget)
                        SettingsService.saveSetup('<center>Your Widget will be Updated</center>', 'Save Changes')
                    }

                    $scope.disableConfigSave = function() {
                        if ($rootScope.email_list_requested == true) {
                            return true
                        } else {
                            return false
                        }
                    }


                    //$scope.sections = ['whom','when','where','']
                }]
            })

            $rootScope.configureModal = modalInstance

            /*
            }else{
                UtilsService.premiumMessage('Configuration Options are available on Premium Version. Please upgrade..')
            }
            */

        }


        $scope.hide_inpage_popup_feedback = function() {
            var feedback = {};
            feedback.freeAdvice = 'no';
            feedback.community = 'no';
            feedback.working = "CLOSED";
            $scope.sendFeedback(feedback, 'closed');
        }



        //from list controller
        $scope.sendFeedback = function(feedback, closed) {
            document.getElementById('yel-popup-feedback-inpage').style.display = "none";

            //console.log('feedback is')
            //console.log(feedback)

            CommService.sendFeedbackEmail(feedback)
                .then(function(status) {
                    console.log(status)
                    console.log('back to ListController after sending feedback email')
                    if (!closed) {
                        console.log('email sent')
                    }


                })
        }

        /*$scope.close= function()
        {
            $modalInstance.close();
        }


        */

        $scope.showClose = function(feedback) {
            switch (feedback.working) {
                case "yes":
                    return (feedback.freeAdvice == 'no' && feedback.community == 'no')
                case "no":
                    return true

            }
            return false
        }

        $scope.feedbackComplete = function(feedback) {
            switch (feedback.working) {
                case "yes":
                    return (feedback.freeAdvice && feedback.email && feedback.email.length > 3)
                case "no":
                    return (feedback.email)
                case "issues":
                    return (feedback.email)

            }

            return false
        }


        $scope.reviewClicked = function() {
            // console.log('reviewClicked')
            window.open(review_url)
            CommService.updateReview('YES')
                .then(function() {

                })
        }

        $scope.reviewClosed = function() {
            document.getElementById('yel-popup-review').style.display = "none";
            CommService.updateReview('CLOSED')
                .then(function() {

                })
        }

    }])
