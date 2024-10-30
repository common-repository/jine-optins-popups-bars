angular.module('yetienceApp')
    .controller('buildLaunchPackageController',  ['$scope', 'SettingsService', 'CommService', 'UpgradeService', '$stateParams','$state', function($scope, SettingsService, CommService, UpgradeService, $stateParams, $state) {
        if (SettingsService.isPremium()) {
            if ($stateParams.mode == 'edit') {
                SettingsService.saveSetup('Your Widget has been Updated', 'Click here to Save Changes')
            } else {
                SettingsService.saveSetup('Your Widget has been Created', 'Click here to Save Changes')
            }
        }

        $scope.C = CommService
        $scope.U = UpgradeService

        $scope.launching = false
        $scope.launch = function(widget) {
            $scope.launching = true
            CommService.createWidgetOnServer(SettingsService.setup().id, widget)
                .then(function(res) {
                    widget.widget_id = res.widget_id

                    if (SettingsService.setup().widgets.length < 2) {
                        widget.configuration.what.name = "My First Popup"
                    }
                    console.log('setup after creating widget')
                    console.log(SettingsService.setup())
                    SettingsService.saveSetup('Your Widget has been Created', 'Click here to Save Changes')
                    console.log('setup after saving')
                    console.log(SettingsService.setup())
                })
        }
    }])