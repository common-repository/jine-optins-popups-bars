angular.module('yetienceApp')
    .service('SettingsService', ['CommService', '$rootScope', 'configurationFields', '$cookies', '$q', 'UtilsService', '$stateParams', '$location', function(CommService, $rootScope, configurationFields, $cookies, $q, UtilsService, $stateParams, $location) {

        this.hasAllFeatures = false;
        var setup = null
        var encode = function(x) {
            return window.btoa(encodeURIComponent(x))
        }

        var decode = function() {

            return decodeURIComponent(window.atob)
        }
        this.encode = encode

        this.decode = decode

        this.setup = function() {
            return setup
        }

        function getWebsiteAndAttach(website_id, check_saved) {
            //get the latest website instance corresponding to the id

            return CommService.getWebsite(website_id)
                .then(function(website) {
                    // if (website.extensions) {
                    //     if (website.extensions.premiumSubscription) {
                    //         //add other extensions when premiumSubscription is found
                    //         console.log('found premiumSubscription - attaching other extensions')
                    //         var extensions = {}
                    //         extensions.mobileScreens = website.extensions.premiumSubscription
                    //         extensions.specificPages = website.extensions.premiumSubscription
                    //         extensions.premiumSubscription = website.extensions.premiumSubscription
                    //         website.extensions = extensions
                    //             // console.log('website after attaching')
                    //             // console.log(website)
                    //     }
                    // }
                    //console.log('check_saved- ' + check_saved + ' website.saved- ' + website.saved)
                    if (website.saved == check_saved) {
                        var package_upgraded = false,
                            new_extension_purchased = false

                        if (setup.package_id != website.package_id) {
                            package_upgraded = true
                        }

                        if (!angular.equals(setup.extensions, website.extensions)) {
                            new_extension_purchased = true
                        }

                        angular.extend(setup, website)

                        addAdvancedConfigurationOnSetup(setup, website)

                        if (check_saved == false) {
                            saveSetup('', 'Yes, Lets Begin', true)
                        } else {
                            if (package_upgraded) {
                                saveSetup("<center>Congratulations! Your are now subscribed to the Premium Version</center>", 'Got it. Thanks', true)
                            }

                            if (new_extension_purchased) {
                                saveSetup("<center>Congratulations! Your have activated an Addon</center>", 'Got it. Thanks', true)
                            }
                        }


                        return $q.resolve(website)
                    } else {
                        return $q.reject()
                    }
                })
        }

        function createWebsiteAndAttach() {
            return CommService.createWebsiteId()
                .then(function(website) {

                    $cookies.put("autience-website-id", website.id)
                    angular.extend(setup, website)
                    saveSetup('', 'Yes, Lets Begin', true)

                    return $q.resolve(website)
                })
        }

        this.initialize = function(cb) {
            //when the page loads, read the setup and upload it to the server
            var setup_on_platform = yetience.readFromPlatform()
            if (setup_on_platform) {
                setup = setup_on_platform
                $rootScope.SETUP = setup
            }

            if (!setup.id) {
                //console.log('NO WEBSITE ON SETUP')
                //website id is not saved on wordpress
                //check if there is a website_id on intermediate cookie
                if ($cookies.get("autience-website-id")) {
                    //attach website from cookie if, if website.saved is false
                    //console.log('trying with website_id fro cookie- ' + $cookies.get("autience-website-id"))
                    getWebsiteAndAttach($cookies.get("autience-website-id"), false)
                        .then(function() {
                            //console.log("Attached website id from cookie")
                            cb()
                        }, function() {
                            //console.log("Cannot attach website id of cookie. Creating a new one")
                            createWebsiteAndAttach().then(cb)
                        })
                } else {
                    //console.log("there is no website id on cookie")
                    createWebsiteAndAttach().then(cb)
                }


            } else {
                //console.log('WEBSITE ID found on setup')

                getWebsiteAndAttach(setup.id, true).then(function() {
                    cb()
                }, function() {
                    //console.log('website is not yet marked as saved.. marking')
                    CommService.markSaved(setup.id).then(function() {
                        //console.log("marked as saved")
                        cb()
                    })
                })
            }

        }



        function addAdvancedConfigurationOnSetup(setup, website) {
            //check and add extensions
            if (setup.widgets) {

                //Add extension tags on configuration so that corresponding form fields can be enabled/disabled
                for (var i = 0; i < setup.widgets.length; i++) {
                    if (hasFeature('hideAfterCta')) {
                        // console.log('added mobileScreens')
                        setup.widgets[i].configuration.hideAfterCta = true
                    }
                    if (hasFeature('mobileScreens')) {
                        // console.log('added mobileScreens')
                        setup.widgets[i].configuration.mobileScreens = true
                    }
                    if (hasFeature('specificPages')) {
                        // console.log('added specificPages')
                        setup.widgets[i].configuration.specificPages = true
                    }
                    if (hasFeature('showAdminFeature')) {
                        setup.widgets[i].configuration.showAdminFeature = true
                            // console.log(setup.widgets[i].configuration)
                    }
                    if (hasFeature('mobileScreens') || hasFeature('specificPages') || hasFeature('showAdminFeature')) {
                        setup.widgets[i].configuration.advancedConfiguration = true
                    }
                }
            }
        }

        this.saveSetup = saveSetup

        function saveSetup(message, label, disable_undo) {

            console.log('setup before saving')
            console.log(setup)
            yetience.saveToPlatform(setup, message, label, disable_undo)
                //console.log('reading after saving')
                //console.log(yetience.readFromPlatform())
            $rootScope.readyToSave = true
        }

        this.addNewWidget = function(theme_id, widget) {
            //pushing will be done at the end
            //setup.widgets.push(widget)

            widget.theme = theme_id
            console.log("ADDING A NEW WIDGET- " + widget.theme)

            var theme = $rootScope.themes[theme_id]
            var categories = []
            categories = theme.categories

            var components = {},
                component_type = null

            //create components object for the widget
            for (var tag in theme.components) {
                component_type = theme.components[tag].component

                components[tag] = {
                    tag: tag,
                    type: component_type,
                    title: theme.components[tag].title
                }

                //components[tag].fields = $rootScope.components[component_type].customizations
                if ($rootScope.components[component_type]) {
                    components[tag].fields = $rootScope.components[component_type].fields
                } else {
                    console.log('ERROR: component ' + component_type + ' is not defined for tag ' + tag)
                }

                components[tag].values = {}
            }

            widget.components = components

            /*
            //configuration is used from the default configuration of the category

            widget.configuration = $rootScope.categories[theme.categories[0]].default
            console.log($rootScope.categories[theme.categories[0]].default)
            */
            //Starting from default configuration defined in configuration.constant
            widget.configuration = configurationFields.default

            //Check if there is already a domain for this setup. If domain exists,mark it on configuration.what

            widget.configuration.what.existing_domain = setup.domain
            widget.configuration.what.existing_account = setup.account_id

            //set premium user as true if it is a premium user
            //widget.configuration.premiumUser = true
            if (setup.features && setup.features.indexOf("advancedConfiguration") >= 0) {

                widget.configuration.advancedConfiguration = true

            }

            CommService.getThemeTemplate(theme_id)
                .then(function(template) {
                    //console.log(template)
                    widget.raw = encode(template)
                    widget.rendered = encode(template)
                })
        }

        this.hasFeature = hasFeature

        function hasFeature(feature) {
            var now = Math.round(new Date().getTime() / 1000);
            if (setup) {
                if (setup.package_id != 'default') {
                    return true
                }
                //All features if premiumSubscription is present
                if (setup.extensions && setup.extensions.premiumSubscription && setup.extensions.premiumSubscription > now) {
                    this.hasAllFeatures = true;
                    return true
                }
                if (setup.extensions && setup.extensions[feature] && setup.extensions[feature] > now) {
                    return true
                }
            }

            return false
        }

        this.isPremium = function() {
            if (setup.package_id && setup.package_id != 'default') {
                return true
            }
        }

        this.showAffiliateLink = function(show) {

            setup.showAffiliateLink = show;
            saveSetup("Please click on the 'Save Changes' button below", "Save Changes", false);
        }


        this.createWidget = function(theme) {
            return {
                code: UtilsService.getRandomCode(),
                initialization: {},
                theme: theme
            }
        }

        this.getWidget = function(index) {
            return setup.widgets[index]
        }

        this.pushWidget = pushWidget

        function pushWidget(widget) {
            setup.widgets.push(widget)
        }

        this.setWidget = setWidget

        function setWidget(widget, index) {
            setup.widgets[index] = widget
        }


        this.SaveCurrentPopup = function() {
            console.log('Calling Save Popup')


            //for adding premium provider as provider
            if ($rootScope.premiumProviderSelected) {
                $rootScope.widget.components.emailSubscription.values.provider = $rootScope.widget.components.emailSubscription.values.premiumProvider
                console.log('premiumProvider added')
                    //end premium provider part
            }
            if (!$rootScope.widget.configuration.what.name) {
                $rootScope.widget.configuration.what.name = "My First Popup"
            }
            //if create mode, then add to SettingsService.setup
            //otherwise update based on index
            var mode = $stateParams.mode
            var index = $location.search().index
            console.log('mode - ' + mode + ' index- ' + index)
            if (mode == 'create') {
                console.log('pushing widget')
                    //checking if there are no widgets created earlier and only then creating first_widget_time
                if (!setup.first_widget_time) {
                    console.log('adding first_widget_time')
                    setup.first_widget_time = Math.round(new Date().getTime() / 1000);
                }
                pushWidget($rootScope.widget)
                saveSetup('<center>Currently this widget will be seen on exit.<br>Change the settings from the <b>Configure</b> section.<br><br>If something does not work as expected, please contact me on jine.feather@gmail.com</center>', 'Click here to Save')
            } else {
                setWidget($rootScope.widget, index)
                saveSetup('<center>This Widget has been Updated</center>', 'Save')
            }


        }
    }])
