angular.module('yetienceApp')
    .controller('businessGoalsController', ['$scope', '$state', '$rootScope', 'SettingsService', 'CommService', 'WidgetUpdate', function($scope, $state, $rootScope, SettingsService, CommService, WidgetUpdate) {

        $scope.R = $rootScope


        $scope.selectGoal = function(goal) {

            var label = (goal.label).slice(1);

            $rootScope.widget = {}
            $rootScope.widget.goalType = label;

            console.log("Widget data from goal controller")
            console.dir($rootScope.widget)

            WidgetUpdate.goToNextState()
        }

    }])
