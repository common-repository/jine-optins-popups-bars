angular.module('yetienceApp')
    .directive('emailElement', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            controller: ['$scope', '$attrs', '$rootScope', '$element', 'UtilsService', '$timeout', function($scope, $attrs, $rootScope, $element, UtilsService, $timeout) {

                var element = $attrs.emailElement,
                    provider = null,
                    name_display = null,
                    form = null,
                    name_input = null,
                    email_input = null
                var hidden_form = document.getElementById('hidden-email-form')
                var email_name, name_name, scripts_added = false

                //adding html, execute scripts on the hidden form based on the entered code
                if (element == 'form') {
                    $scope.$watch('widget.components.emailSubscription.values.emailCode', function(emailCode) {
                        console.log('Watcher fired for emailCode')
                        hidden_form.innerHTML = emailCode

                        $timeout(function() {
                            //get all the script tags and add to the hidden form manually
                            var inside_scripts = hidden_form.getElementsByTagName('script')
                                //add these scripts manually
                            var script_count = inside_scripts.length
                            for (var i = 0; i < script_count; i++) {

                                var scriptElement = document.createElement('script');
                                scriptElement.setAttribute('type', 'text/javascript');
                                scriptElement.setAttribute('src', inside_scripts[i].src)

                                //only add scripts with an src
                                hidden_form.appendChild(scriptElement)

                            }

                            //Add any hidden input fields into the form ex: constant contact
                            var form_input_elements = hidden_form.getElementsByTagName('input')
                            for (var i = 0; i < form_input_elements.length; i++) {
                                //if the type is hidden, then copy this into the display form
                                if (form_input_elements[i].type == 'hidden') {
                                    //$element.append(form_input_elements[i].outerHTML)
                                    document.getElementById('autience-hidden-email-elements')
                                        .innerHTML = document.getElementById('autience-hidden-email-elements')
                                        .innerHTML + form_input_elements[i].outerHTML
                                }

                            }

                        }, 0)

                    })
                }

                //watch the emailSubscription form and update the display form with the ids required by the providers
                $scope.$watch('widget.components.emailSubscription.values', function(emailOptions) {
                    console.log('Watcher fired for widget.components.emailSubscription.values')
                    if (emailOptions && emailOptions.provider && emailOptions.emailCode) {
                        provider = UtilsService.findMatchingElement($rootScope.emailProviders, 'label', emailOptions.provider)

                        //add the entered code to the hidden form


                        $timeout(function() {
                            switch (element) {
                                case 'form':
                                    console.log('updating form element')

                                    if (hidden_form.getElementsByTagName('form') && hidden_form.getElementsByTagName('form').length > 0) {
                                        form = hidden_form.getElementsByTagName('form')[0]

                                        $element.prop('action', form.action)
                                        $element.prop('method', form.method)
                                        $element.prop('name', provider.form_field_name)
                                    }
                                    console.log('updated form element')
                                    break
                                case 'name':
                                    console.log('updating name element')
                                    $element.prop('name', provider.name_field_name)

                                    //check if the namefield is to be shown or hidden
                                    if (!name_display) {
                                        name_display = $element.css('display')
                                    }
                                    if (!emailOptions.askName) {
                                        $element.css('display', 'none')
                                    } else {
                                        $element.css('display', name_display)
                                    }
                                    console.log('updated name element')

                                    break
                                case 'email':
                                    console.log('updating email element')

                                    email_name = null
                                    if (provider.email_field_name) {
                                        email_name = provider.email_field_name
                                    } else if (provider.email_input_id) {
                                        email_input = getElementWithId(hidden_form.getElementsByTagName('input'), provider.email_input_id)
                                        email_name = email_input.name
                                    }
                                    if (email_name) {
                                        $element.prop('name', email_name)
                                    }

                                    console.log('updated email element')

                                    break
                                case 'submit':
                                    $element.prop('id', 'autience-subscription-submit')
                                    break
                                case 'email-error':
                                    $element.prop('id', 'autience-email-error')
                                    break
                                case 'name-error':
                                    $element.prop('id', 'autience-name-error')
                                    break
                            }
                        }, 1000)

                    }
                }, true)


                function getElementWithId(elements, id) {
                    for (var i in elements) {
                        if (elements[i].id == id)
                            return elements[i]
                    }
                }


            }]
        }
    }])
