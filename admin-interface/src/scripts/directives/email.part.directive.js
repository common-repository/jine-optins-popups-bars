angular.module('yetienceApp')
    .directive('emailPart', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            controller: ['$scope', '$attrs', '$rootScope', '$element', 'UtilsService', '$timeout', function($scope, $attrs, $rootScope, $element, UtilsService, $timeout) {

                //console.log("Email Part: "+$attrs.emailPart)

                //assigning id's
                switch ($attrs.emailPart) {
                    case 'form':
                        $element.prop('id', 'autience-emailform-form-' + $rootScope.widget.code)
                        break;
                    case 'name':
                        $element.prop('id', 'autience-emailform-name-' + $rootScope.widget.code)
                        break;
                    case 'email':
                        $element.prop('id', 'autience-emailform-email-' + $rootScope.widget.code)
                        break;
                    case 'submit':
                        $element.prop('id', 'autience-emailform-submit-' + $rootScope.widget.code)
                        break;
                    case 'name-error':
                        $element.prop('id', 'autience-emailform-name-error-' + $rootScope.widget.code)
                        break;
                    case 'email-error':
                        $element.prop('id', 'autience-emailform-email-error-' + $rootScope.widget.code)
                        break;

                } //end switch

                if($attrs.emailPart == 'name'){
                    $rootScope.$watch('widget.components.emailSubscription.values.askName',function(new_val){

                        if(new_val == false){
                            $element.css('display','none')
                        }
                        if(new_val == true){
                            $element.css('display','inline-block')
                        }
                    })
                }


            }]
        }
    }])