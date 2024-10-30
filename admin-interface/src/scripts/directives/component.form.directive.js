angular.module('yetienceApp')
    .directive('componentForm', ['$rootScope', function($rootScope) {
        // Runs during compile
        return {
            controller: ['$scope', '$element', 'CommService', '$modal', '$stateParams', '$rootScope', 'SettingsService', 'UtilsService', 'WidgetUpdate', function($scope, $element, CommService, $modal, $stateParams, $rootScope, SettingsService, UtilsService, WidgetUpdate) {
                $scope.cust = {
                    fields: [],
                    values: {}
                }
                $scope.oneAtATime = false
                $scope.R = $rootScope
                $scope.isOpen = {}

                var initial_values = null

                $scope.current = {}
                $scope.highlightedTag = null
                $scope.expandedTag = null

                $scope.hideEmail = function(tag) {
                    // console.log('tag is ' +tag);
                    // console.log('current state is ' + WidgetUpdate.current.state);

                    var hidden = false

                    var current_state = WidgetUpdate.current.state
                    if (current_state == 'integrate')
                        hidden = true

                    //|| tag == 'namePlaceholder' || tag == 'emailPlaceholder'
                    if (tag == 'emailSubscription' || tag == 'welcomeEmail')
                        hidden = !hidden

                    return hidden

                }
                $scope.hoveredOn = function(tag) {
                    $scope.highlightedTag = tag
                    $rootScope.$emit('highlightComponent', tag)
                }

                $scope.hoveredOut = function(tag) {
                    $scope.highlightedTag = null
                    $rootScope.$emit('unHighlightComponent', tag)
                }

                $rootScope.$on('highlight_component', function(evt, tag) {
                    $scope.highlightedTag = tag

                    $scope.$apply()
                })

                $rootScope.$on('expand_component', function(evt, tag) {

                    console.log('expand event received')
                    if ($scope.isOpen[tag]) {
                        //collapse if already open
                        $scope.isOpen[tag] = false
                    } else {
                        expandTag(tag)
                    }


                    $scope.$apply()
                })

                $scope.clickedOn = function(tag) {
                    expandTag(tag)

                }

                $scope.copy = function(src, dest, component) {
                    angular.copy(src, dest)

                    if (component.type == 'email-subscription') {
                        //for email-subcription component, provider values to the options field
                        angular.copy($rootScope.emailProviders, dest[0].templateOptions.options)

                    }
                }

                $scope.componentFormPartial = function() {
                    return yetience.adminPath + '/src/partials/component.form.html'
                }

                function expandTag(tag) {
                    for (var i in $scope.isOpen) {
                        $scope.isOpen[i] = false
                    }
                    $scope.isOpen[tag] = true
                }

                $rootScope.primary_modal = null

                // setTimeout(higlightPrimaryComponent, 1000)
                //higlightPrimaryComponent()

                //if there is a primary component, open its configuration in a modal
                //before user can edit the widget
                function higlightPrimaryComponent() {
                    var current_theme = $rootScope.widget.theme
                    var current_category = $rootScope.themes[current_theme].categories[0]
                    var primary = $rootScope.categories[current_category].primary
                    var compulsory = $rootScope.categories[current_category].compulsory
                    if (!primary || !$rootScope.widget.components[primary]) {
                        return
                    }

                    console.log('primary component- ' + primary)

                    $rootScope.primary_modal = $modal.open({
                        size: 'md',
                        templateUrl: $scope.componentFormPartial(),
                        backdrop: 'static',
                        keyboard: false,
                        controller: ['$scope', 'CommService', function($scope, CommService) {
                            //attach tag, component and componentFields
                            $scope.tag = primary
                            $scope.component = $rootScope.widget.components[primary]
                            $scope.componentFields = []
                            $scope.form_in_modal = true
                            angular.copy($scope.component.fields, $scope.componentFields)

                            $scope.savePrimary = function() {
                                // console.log('selected')
                                // console.log($scope.component.values.thankyou)
                                var selected_thankyou_page = $scope.component.values.thankyou
                                    //if thankyou page is selected and it is not the default page
                                if (selected_thankyou_page && selected_thankyou_page != 'yeloni') {
                                    //check if the thankYouPage feature exists, if it doesn't show the premium message modal
                                    if (!SettingsService.hasFeature('thankYouPage')) {
                                        UtilsService.premiumMessage('This is available only after purchasing Custom Thankyou Page Extension')
                                    } else {
                                        //continue with the execution
                                        $rootScope.primary_modal.close()
                                        if ($scope.component.values.provider == 'Yeloni2') {
                                            sendEmailProviderRequestAsFeedback()
                                        }
                                    }
                                } else {
                                    $rootScope.primary_modal.close()
                                    if ($scope.component.values.provider == 'Yeloni2') {
                                        sendEmailProviderRequestAsFeedback()
                                    }
                                }

                            }

                            function sendEmailProviderRequestAsFeedback() {
                                var feedback = {}
                                feedback.request_provider = $scope.component.values.customProvider


                                if (!$scope.component.values.feedback_sent) {
                                    CommService.sendFeedbackEmail(feedback)
                                }
                                //ensure that this feedback is sent only once
                                $scope.component.values.feedback_sent = true

                                console.log('custom component is', $scope.component.values.customProvider)
                            }

                            $scope.primaryValid = function() {
                                if (compulsory && !$scope.component.values[compulsory]) {
                                    return false
                                }

                                return true
                            }
                        }]
                    })

                    console.log($rootScope.primary_modal)
                }


                $rootScope.$on('$stateChangeSuccess', function() {
                        console.log('STATE HAS CHANGED')
                            //console.log($rootScope.primary_modal)
                        if ($rootScope.primary_modal) {
                            console.log('closing modal')
                            $rootScope.primary_modal.close()
                        }
                    })
                    //watch the email and name field placeholders and assign it to their respective positions
                $scope.$watch('R.widget.components.namePlaceholder.values.text', function(newValue, oldValue, scope) {
                    $scope.namePlaceholder = newValue;
                });
                $scope.$watch('R.widget.components.emailPlaceholder.values.text', function(newValue, oldValue, scope) {
                    $scope.emailPlaceholder = newValue;
                });



            }],
            restrict: 'E',
            //template: '<formly-form model="cust.values" fields="cust.fields"></formly><br>{{cust.values}}'
            templateUrl: $rootScope.basePath + '/src/partials/component.form.directive.html'
        }
    }])
