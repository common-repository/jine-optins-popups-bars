angular.module('yetienceApp')
    .controller('buildActivateController', ['$scope', 'configurationFields', 'CommService', 'SettingsService', 'UtilsService', '$state', '$rootScope', function($scope, configurationFields, CommService, SettingsService, UtilsService, $state, $rootScope) {
        $scope.C = CommService

        console.log($rootScope.widget)
        if (!UtilsService.checkNested($rootScope, ['widget', 'configuration', 'when', 'mode'])) {
            console.log('rootscope does not have widget.configuration.when.mode')
            $state.go('build.select')
        }

        $scope.configFields = angular.copy(configurationFields)

        $scope.creating = false



    }])