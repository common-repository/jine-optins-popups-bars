angular.module('yetienceApp')
    .controller('buildDesignController', ['$scope', 'SettingsService', '$state', '$rootScope', 'CommService', 'UtilsService', function($scope, SettingsService, $state, $rootScope, CommService, UtilsService) {

        $scope.staticPath = $rootScope.staticPath
        $scope.C = CommService
        var theme_styles = null,
            common_styles = null

        if (!UtilsService.checkNested($rootScope, ['widget', 'theme'])) {
            console.log('rootScope does not have widget.theme')
            $state.go('build.select')
        }


        $scope.saveTemplate = function() {
            //take the template inside the designer, encode it and save it on the widget
           
        }

        $scope.themeBase = function() {
            if ($scope.widget.theme) {
                return $rootScope.staticPath + '/themes/' + $scope.widget.theme
            } else {
                return null
            }
        }

        $scope.themeUrl = function(theme) {
            if (theme) {
                return $rootScope.staticPath + '/themes/' + theme + '/' + theme + '-template.html'
            } else {
                return null
            }

        }

        $scope.themeCss = function(theme) {
            if (theme) {
                return $rootScope.staticPath + '/themes/' + theme + '/' + theme + '-styles.css'
            }
        }

        $scope.commonCss = function() {
            return $rootScope.staticPath + '/themes/popup-common-styles.css'
        }

        //if the widget object changes, and there is no theme id
        //assign all the attributes required for a new widget
        $scope.$watch('widget.theme', function(newTheme) {
            //console.log('Widget theme selected')

            
            if (newTheme && !$scope.widget.components) {
                console.log("in build.design--")
                //console.dir($scope.widget)
                SettingsService.addNewWidget(newTheme, $scope.widget)
            }
        })

        $scope.$watch('widget.rendered', function(rendered) {
            if (rendered) {
                $scope.widget_template = decodeURIComponent(window.atob(rendered))
            }
        }, true)

        $scope.storedTemplate = function() {
            if (document.getElementById("widget-design")) {
                return document.getElementById("widget-design").innerHTML
            }

        }

        

    }])