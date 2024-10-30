angular.module('yetienceApp')
    .controller('buildController', ['$scope', 'SettingsService', '$state', '$rootScope', '$stateParams', '$location', 'WidgetUpdate', 'localStorageService', 'UtilsService', function($scope, SettingsService, $state, $rootScope, $stateParams, $location, WidgetUpdate, localStorageService, UtilsService) {
        //console.log('INSIDE BUIlD CONTROLLER')


        $scope.S = $state
        $scope.R = $rootScope
        $scope.mode = $stateParams.mode
        $scope.W = WidgetUpdate
        $scope.SS = SettingsService.setup()

        if (!yetience.website_saved) {
            $state.go('start')
        }

        var index = $location.search().index
        if ($scope.mode != 'edit' && $scope.mode != 'create') {
            //before we had goals
            // $state.go('list')

            //when we had goals
            //$state.go('goals')

            //when we have filter in select
            //console.log("IAM GOING TO LIST NOW.")
            $state.go('list')
        }

        if ($scope.mode == 'edit') {
            $rootScope.widget = SettingsService.getWidget(index)
            if (!$rootScope.widget) {
                $state.go('list')
            }
        } else {
            //check if there is a widget on the local storage
            $rootScope.widget = localStorageService.get('widget')
        }
        //Watch for changes in widget and save them to local storage
        $rootScope.$watch('widget', function(newWidget, oldWidget) {
            if (newWidget) {
                //console.log('noticed a change in widget, saving it')
                localStorageService.set('widget', newWidget)
            }
        }, true)


        $scope.customer = {}

        $scope.controls = {
            create: ['select', 'design', 'integrate', 'configure', 'activate'],
            edit: ['design', 'configure']

        }
        $scope.titles = {
            select: 'Select',
            design: 'Design',
            integrate: 'Autoresponse',
            configure: 'Configure',
            activate: 'Activate'
        }

        $scope.currentState = function() {
            //console.log($state.get('build'))
        }

        $scope.disableSave = function() {

            //if it's an email widget and lists are not defined, then disable the save popup button
            if ($rootScope.isEmailTheme == true && $scope.W.states[$scope.W.current.state].tabTitle == 'Autoresponse') {
                if ($rootScope.from_email_defined == true) {
                    return false
                } else {
                    return true
                }
            }

            //if not email widget, don't disable
            return false
        }

    }])
