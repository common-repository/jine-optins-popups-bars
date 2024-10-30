angular.module('yetienceApp')
    .directive('tag', [function() {
        // Runs during compile
        return {
            controller: ['$scope', '$element', '$attrs', '$rootScope', 'Component', '$compile', '$timeout', 'CommService', function($scope, $element, $attrs, $rootScope, Component, $compile, $timeout, CommService) {
                /*
                    1. Get the model corresponding to this component
                    2. Get the customizations corresponding to this component
                */
                //console.log('component is: ')
                //console.log($scope.widget.components)
                //console.log('tag is: ')
                //console.log($attrs.tag)
                var inner = null,
                    addClass = null,
                    initialization = null

                var component_type = $scope.widget.components[$attrs.tag].type
                var component = $rootScope.components[component_type]
                var mouse_x = null,
                    mouse_y = null
                $element.on('mouseover', function(evt) {
                    evt.stopPropagation()
                    mouse_x = evt.clientX
                    mouse_y = evt.clientY
                        //highiglight only if the mouse is still

                    $element.addClass('yel-component')
                    isMouseStill(function() {
                        $rootScope.$emit('highlight_component', $attrs.tag)
                    }, 500)


                })

                $element.on('mouseout', function(evt) {
                    mouse_x = evt.clientX
                    mouse_y = evt.clientY

                    evt.stopPropagation()

                    $element.removeClass('yel-component')
                })

                $element.on('click', function(evt) {
                    evt.stopPropagation()
                    $rootScope.$emit('expand_component', $attrs.tag)
                })

                if ($scope.widget.components[$attrs.tag]) {

                    //we want to get the attributes after rendering is complete, so added a delay
                    $timeout(function() {
                        Component.estimate($element, $scope.widget.components[$attrs.tag].values, $scope.widget.components[$attrs.tag].fields)
                    }, 1000)

                } else {
                    console.log('ERROR - could not get component with tag ' + $attrs.tag)
                }

                if ($rootScope.components[component_type]) {
                    inner = component.inner
                    addClass = component.addClass
                    initialization = component.initialization
                }

                if (inner) {
                    $element.html(inner)

                    $compile($element.contents())($scope);
                }

                if (addClass) {
                    $element.addClass(addClass)
                }
                if (initialization) {
                    $scope.widget.initialization[$attrs.tag] = initialization
                }


                //Watch component form values and update the template accordingly
                $scope.$watch(function() {
                    return $scope.widget.components[$attrs.tag].values

                }, function(values) {

                    if (values) {
                        Component.update($element, values, $attrs.tag, $scope.widget)
                    }
                }, true)

                $rootScope.$on('highlightComponent', function(evt, tag) {
                    if (tag == $attrs.tag) {
                        $element.addClass('yel-component')
                    }
                })

                $rootScope.$on('unHighlightComponent', function(evt, tag) {
                    if (tag == $attrs.tag) {
                        $element.removeClass('yel-component')
                    }
                })

                function isMouseStill(fn, delay) {
                    //console.log('checking if mouse is still')
                    var init_x = mouse_x
                    var init_y = mouse_y
                    setTimeout(function() {
                        //console.log('diff_x- '+(mouse_x - init_x)+' diff_y- '+(mouse_y - init_y))
                        var diff_x = (mouse_x - init_x)
                        var diff_y = (mouse_y - init_y)
                        if (diff_x == 0 && diff_y == 0) {
                            fn()
                        }
                    }, delay)
                }

            }],
            restrict: 'A'
        }
    }])
