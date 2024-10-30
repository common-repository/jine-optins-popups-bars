angular.module('yetienceApp')
    .controller('buildSelectController', ['$scope', 'SettingsService', '$state', '$rootScope', 'CommService', 'UtilsService', 'WidgetUpdate', '$modal', 'UpgradeService', function($scope, SettingsService, $state, $rootScope, CommService, UtilsService, WidgetUpdate, $modal, UpgradeService) {

        $scope.rowLimit = 3
        $scope.C = CommService
        var seenAllThemes = false
        var sentEvent = false;

        console.dir($rootScope)
        $scope.categoryOrder = ['subscribe', 'offer', 'share']
        $scope.goalDetails = {
                share: {
                    title: 'Social Sharing',
                    callToAction: 'Increase Social Following'
                },
                subscribe: {
                    title: 'Email Subscription',
                    callToAction: 'Build your Email List'
                },
                offer: {
                    title: 'Offers / Sales',
                    callToAction: 'Convert Visitors to Buyers'
                },
                chat: {
                    title: 'Chat Starters'
                }
            }
            //setting the default value
            //$scope.selectWidgetGoal = $scope.goalType[0];

        $scope.placementTypes = {
            Popups: {
                title: 'Popup',
                tooltip: "Popups appear as a lightbox on the center of a partially darkened page. Visitors can close the popup easily."
            },
            ActionButtons: {
                title: 'Action Button',
                tooltip: "Action buttons are small round buttons that stay stationary on the bottom right of a page. When the visitor clicks on them, a box with the call-to-action is seen."
            }
        };
        $scope.themesInPlacement = {}
        var ordered_theme_keys = Object.keys($rootScope.themes).sort(function(theme1, theme2) {
            return ($rootScope.themes[theme1].order - $rootScope.themes[theme2].order)
        })

        Object.keys($scope.placementTypes).map(function(placement_type) {
            //console.log('filtering placement_type ' + placement_type)
            $scope.themesInPlacement[placement_type] = ordered_theme_keys.filter(function(theme_key) {
                //console.log('filtering themes - ' + theme_key)
                return ($rootScope.themes[theme_key].widgettype == placement_type)
            })
        })


        $scope.showTheme = function(goalSelected, layoutSelected, theme, category) {
            var goal_is_selected = false;
            var layout_is_selected = layoutSelected[theme.widgettype];

            theme.categories.map(function(goal) {
                goal_is_selected = goal_is_selected | goalSelected[goal]
            })

            return goal_is_selected && layout_is_selected
        }

        $scope.selectTheme = function(label, theme) {


            if (label == 'blank-popup' && !SettingsService.hasFeature('customHtml')) {

                //if the user does not have acces to premium themes, show an alert message
                UtilsService.premiumMessage('Custom HTML Popup is available as a Premium Extension')
                return

            }



            console.log("Widget data from select controller")
            console.dir($rootScope.widget)

            $rootScope.widget = SettingsService.createWidget(label)

            //Assign goalType, widgetType and placementType

            $rootScope.widget.goalType = theme.categories[0];
            $rootScope.widget.placementType = theme.widgettype;
            // 2 below are to support older widgets
            $rootScope.widgetType = theme.widgettype;
            $rootScope.widget.themeType = theme.widgettype;


            console.log("CREATED WIDGET")
            console.log($rootScope.widget)

            WidgetUpdate.goToNextState()

        }

        $scope.isVisible = function() {
            if (sentEvent == false) {
                seenAllThemes = true
                sentEvent = true;
            }

        }
    }])
