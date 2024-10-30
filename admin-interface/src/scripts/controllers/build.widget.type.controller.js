angular.module('yetienceApp')
    .controller('widgetTypeController', ['$scope', '$state', '$rootScope', 'SettingsService', 'CommService', 'WidgetUpdate', function($scope, $state, $rootScope, SettingsService, CommService, WidgetUpdate) {

        $scope.R = $rootScope

        //$rootScope.widget = {}
        //console.log("widget type ==")
        //console.dir($scope.R.widgetType)

        var arrayOfWidgetTypes = [];
        $scope.widgetObj = []
            //$scope.themes contains all themes
            //this function is to extract all  the widgettype in arrayOfWidgetTypes
        angular.forEach($scope.themes, function(value, key) {
            arrayOfWidgetTypes.push(value.widgettype);
        })

        //below line is used to push only unique widgettype
        arrayOfWidgetTypes = arrayOfWidgetTypes.filter(function(item, index, arr) {
            return arr.indexOf(item) === index;
        });

        //for each widget type, below function will make separate object
        for (var a = 0; a < arrayOfWidgetTypes.length; a++) {
            $scope[arrayOfWidgetTypes[a]] = [];
            angular.forEach($scope.themes, function(value, key) {
                if (arrayOfWidgetTypes[a] === value.widgettype) {
                    //this contains individual widget type objects : ex : - $scope.Popups or $scope.ActionButtons
                    $scope[arrayOfWidgetTypes[a]].push(value);
                }
            });
            var obj = {};
            obj[arrayOfWidgetTypes[a]] = $scope[arrayOfWidgetTypes[a]].length
                //this contains [{"ActionButtons":4},{"Popups":19}]
            $scope.widgetObj.push(obj);
        }


        $scope.themeType_array = {};

        //this function will get categoryType according to actionType
        $scope.countThemes = function(actionType, categoryType) {

            // console.log(actionType, categoryType)
            angular.forEach($scope[actionType], function(value, key) {
                if (value.categories && value.categories.length > 0) {

                    for (var x = 0; x < value.categories.length; x++) {
                        if ($scope[actionType][categoryType] === undefined) {
                            $scope[actionType] = {};
                            $scope[actionType][categoryType] = [];
                        }
                        if (value.widgettype === actionType && value.categories[x] === categoryType) {

                            $scope[actionType][categoryType].push(value);
                            $scope.themeType_array[actionType] = {};
                            $scope.themeType_array[actionType][categoryType] = $scope[actionType][categoryType].length;
                        }
                    }
                }

            });
        };


        $scope.selectPlacement = function(placement) {
            //console.log("selected a placement:")
            var label = (placement.name).slice(1)
                //console.log(label)



            // $rootScope.widget = SettingsService.createWidget(label)
            $rootScope.widget.placementType = label;

            //dont delete this--
            $rootScope.widgetType = label
                // console.log("widget type ==")
                // console.log($scope.R.widgetType)
            console.log("Widget data from type controller")

            console.dir($rootScope.widget)

            WidgetUpdate.goToNextState()
        }

    }])
