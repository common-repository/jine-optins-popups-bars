angular.module('yetienceApp')
    .controller('buildLaunchStatisticsController', ['$scope', 'configurationFields', 'CommService', 'SettingsService', 'UtilsService', '$state', '$rootScope', '$stateParams', '$location', 'localStorageService', function($scope, configurationFields, CommService, SettingsService, UtilsService, $state, $rootScope, $stateParams, $location, localStorageService) {
        //savePopup()

        console.log('in buildLaunchStatisticsController')
        $scope.C = CommService
        $scope.configFields = angular.copy(configurationFields)

        console.log('bait index ' + baitIndex())
        $scope.configFields.statistic[0].templateOptions.label = UtilsService.emailOptions[baitIndex()].question

        $scope.U = UtilsService


        if ($rootScope.SETUP.statsEmails) {
            //$state.go('build.launch.package')
            console.log('Setup already has statsEmails')
            savePopup()
        } else {
            console.log('Setup does not have stats Emails')
        }


        $scope.email_reason = function() {

            var reason = 'email_reason_' + UtilsService.emailOptions[baitIndex()].label

            console.log('reason- ' + reason)


        }

        function baitIndex() {
            var question_array = UtilsService.emailOptions
            var email_question = localStorageService.get('email_question')

            if (!email_question) {

                var option = Math.floor(question_array.length * Math.random());
                console.log(question_array[option].label)
                email_question = localStorageService.set('email_question', option);

            }

            return email_question;
        }



        $scope.next = function() {
            savePopup()
        }

        $scope.submit = function(statistics) {
            if (statistics.statistic.mode == 'yes') {

                var email_string = statistics.statistic.email
                if (email_string) {
                    var email_array = email_string.split(",");
                    //console.log('email string- '+email_string)
                    //console.log('email array')
                    for (var i in email_array) {
                        email_array[i] = email_array[i].trim()
                    }
                    console.log(email_array)

                    if (email_array) {

                        CommService.updateStatsEmails(email_array)
                            .then(function() {
                                savePopup()
                            })
                    }
                } else {
                    savePopup()
                }

            } else {
                savePopup()
            }
        }

        function savePopup() {
            SettingsService.SaveCurrentPopup()
        }

        $scope.$watch('statistics.statistic.mode', function(val) {

            if (val == 'yes') {}
            if (val == 'no') {}


        }, true)

    }])
