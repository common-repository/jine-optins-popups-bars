angular.module('yetienceApp')
    .service('WidgetUpdate', ['CommService', '$state', '$timeout', 'SettingsService', 'UtilsService', '$rootScope', function(CommService, $state, $timeout, SettingsService, UtilsService, $rootScope) {

        var current = {
            state: null,
            working: false
        }

        this.current = current
        console.log("update service: this - ")
        console.dir(this.current)

        var states = {
            /*goals:{
                show: false,
                tabTitle: 'Business Goals',
                create: true,
                edit: false
            },
            placement:{
                show: false,
                tabTitle: 'Widget Placement',
                create: true,
                edit: false
            },*/
            select: {
                show: false,
                tabTitle: 'Choose a Design',
                create: true,
                edit: false,
                saveOnCompletion: false
            },
            design: {
                show: true,
                title: function(widget) {
                    /*
                        If email subscription theme, then button title is 'Integrate'
                        Otherwise, button title is 'Save my Design'
                    */
                    // if (UtilsService.checkNested(widget, ['components', 'emailSubscription'])) {
                    //     return 'Integrate'
                    // } else {
                    //     return 'Save my Design'
                    // }
                    if (isEmailPopup(widget)) {
                        return 'Autoresponse'
                    } else {
                        return 'Save my Design'
                    }
                },
                tabTitle: 'Customize',
                create: true,
                edit: true,
                operation: 'saveTemplate',
                saveOnCompletion: function(widget) {
                    //Save this if it is not an email widget
                    //if it's an email widget, don't save

                    if (isEmailPopup(widget)) {
                        return false
                    } else {
                        return true
                    }
                }
            },
            integrate: {
                show: 'true',
                title: 'Save Popup',
                operation: 'saveEmailTemplate',
                tabTitle: 'Autoresponse',
                create: function(widget) {
                    //if email sub widget - retur
                    if (widget) {
                        $rootScope.isEmailTheme = ($rootScope.themes[widget.theme].categories.indexOf('subscribe') >= 0)
                        return ($rootScope.themes[widget.theme].categories.indexOf('subscribe') >= 0)
                    } else {
                        $rootScope.isEmailTheme = false
                        return false
                    }
                },
                edit: function(widget) {
                    //if email sub widget - retur
                    if (widget) {
                        return ($rootScope.themes[widget.theme].categories.indexOf('subscribe') >= 0)
                    } else {
                        return false
                    }
                },
                saveOnCompletion: true
            }
            /*,
                        launch: {
                            show: true,
                            operation: 'launchPopup',
                            tabTitle: 'Launch',
                            create: true,
                            edit: true
                        }
                        */
        }
        this.states = states

        this.goToNextState = goToNextState

        function goToNextState() {
            // console.log("current state:");
            // console.dir(current)

            var next_state = nextStates['build.' + current.state]
                // console.log("current state = "+current.state)
                // console.log("next state = "+next_state)
            if (next_state) {
                $state.go(next_state)
            }
        }

        var nextStates = {
            "build.goals": "build.placement",
            "build.placement": "build.select",
            "build.select": "build.design",
            "build.design": "build.integrate"

            //before we had goals
            //"build.design": "build.launch.statistics"
            //"build.configure": "build.activate"
        }

        this.nextFunction = function(widget, customer) {
            var operation = states[current.state].operation
            if (operation) {
                //set working as true
                current.working = true
                operations[operation](widget, customer, function() {
                    $timeout(function() {
                        current.working = false
                        goToNextState()
                    }, 50)

                })
            } else {
                goToNextState()
            }
        }

        var operations = {
            saveEmailTemplate: function(widget, customer, cb) {

                if (UtilsService.checkNested(widget, ['components', 'welcomeEmail', 'values', 'sendWelcomeEmail'])) {
                    if (widget.components.welcomeEmail.values.sendWelcomeEmail == true) {
                        CommService.addWelcomeEmail(widget)
                            .then(function(status) {
                                console.log('status is ' + status)
                                savePopup(widget)
                                cb()
                            })
                    } else {
                        savePopup(widget)
                        cb()
                    }
                } else {
                    savePopup(widget)
                    cb()
                }


            },

            saveTemplate: function(widget, customer, cb) {
                widget.rendered = getWidget()

                return getStyles()
                    .then(function(content) {
                        theme_styles = content
                        return getCommonStyles()
                    })
                    .then(function(content) {
                        common_styles = content
                        widget.styles = attachStyles(theme_styles, common_styles)
                        savePopup(widget)

                        cb()
                    })

            },
            updateWidget: function(widget, customer, cb) {
                if (widget.widget_id) {
                    //existing widget, update before proceeding
                    CommService.updateWidget(widget)
                        .then(function(widget) {
                            SettingsService.saveSetup('Your Widget has been Updated', 'Click here to Save Changes')

                            cb()
                        })
                } else {
                    //new widget. proceed
                    cb()
                }

            },
            createWidget: function(widget, customer, cb) {

                //Take the widget on scope and create a new widget on the server
                CommService.createWidget(SettingsService.setup().id, widget, customer)
                    .then(function(created_widget) {


                        widget.widget_id = created_widget.widget.widget_id

                        // if (widget.configuration.what.domain)

                        if (UtilsService.checkNested(widget, ['configuration', 'what', 'domain'])) {
                            SettingsService.setup().domain = widget.configuration.what.domain
                        }
                        SettingsService.saveSetup('Your Widget has been Created', 'Click here to Save Changes')
                    })
            }
        }

        function getWidget() {
            var html = document.getElementById('widget-design').innerHTML

            rendered_widget = window.btoa(encodeURIComponent(html))

            return rendered_widget
        }

        function getStyles() {
            return CommService.getStyleContent("autience-theme-style")
        }

        function getCommonStyles() {
            return CommService.getStyleContent("autience-common-style")
        }

        function attachStyles(theme_styles, common_styles) {
            var merged_styles = theme_styles + '\n' + common_styles

            widget_styles = window.btoa(encodeURIComponent(merged_styles))

            return widget_styles
        }

        function savePopup(widget) {
            var save_now = compute(states[current.state], 'saveOnCompletion', widget)
            if (save_now) {
                SettingsService.SaveCurrentPopup()
            }
        }

        this.isEmailPopup = isEmailPopup

        function isEmailPopup(widget) {
            if (widget) {
                return ($rootScope.themes[widget.theme].categories.indexOf('subscribe') >= 0)
            } else {
                return false
            }
        }

        this.compute = compute

        function compute(obj, key, value) {
            //if obj.key is a string, return the string
            //if it is a function, compute with value as input and return
            if (angular.isFunction(obj[key])) {
                return obj[key](value)
            } else {
                return obj[key]
            }
        }
    }])
