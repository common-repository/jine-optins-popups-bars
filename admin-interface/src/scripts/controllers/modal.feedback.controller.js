angular.module('yetienceApp')
    .controller('ModalFeedbackController', ['$scope', 'CommService', '$modalInstance', 'configurationFields', function($scope, CommService, $modalInstance, configurationFields) {
        $scope.C = CommService
        $scope.configFields = angular.copy(configurationFields)

        $scope.sendFeedback = function(feedback) {



            CommService.sendFeedbackEmail(feedback)

            $modalInstance.close();
        }

        $scope.close = function() {
            $modalInstance.close();
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

        $scope.showClose = function(feedback) {
            switch (feedback.working) {
                case "yes":
                    return (feedback.freeAdvice == 'no' && feedback.community == 'no')
                case "no":
                    return true

            }
            return false
        }
    }])
