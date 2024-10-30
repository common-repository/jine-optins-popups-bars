angular.module('yetienceApp')
    .controller('MainController', ['$scope', '$rootScope', 'SettingsService', 'CommService', '$location', '$state', function($scope, $rootScope, SettingsService, CommService, $location, $state) {

        $scope.R = $rootScope
        $scope.R.readyToSave = false
        $scope.R.Y = yetience
        $scope.premiumText = false
        $scope.C = CommService


        $scope.viewExtensions = function() {
            $state.go('extensions')
        }

        $rootScope.basePath = yetience.adminPath
            //console.log('Inside MainController')

        $scope.onStartPage = function() {
            return ($location.path() == '/start')
        }

        $scope.activeTab = function(paths) {
            //check if paths exist in the current location
            var current_path = $location.path()
            for (var i in paths) {
                if (current_path.indexOf(paths[i]) >= 0) {
                    return 'active yel-activeitem'
                }
            }
            return ''
        }

        $scope.packageTitle = function() {

            for (var i in $rootScope.packages) {
                if ($rootScope.packages[i].label == SettingsService.setup().package_id) {
                    return $rootScope.packages[i].name
                }
            }
            return ''
        }

        $scope.canBeUpgraded = function() {
                return (SettingsService.setup().package_id == 'default')
            }
            //initialize settings service
            //SettingsService.initialize()

        //define path for static files to be received from the server
        $rootScope.staticPath = yetience.static
        $rootScope.pluginPath = yetience.path

        //Fetch other objects
        //1. Fetch product details
        //2. Fetch themes

        $rootScope.setup_initialized = false
        SettingsService.initialize(function() {

            $scope.S = SettingsService.setup()
            console.log(' SettingsService.setup()')
            var active_extensions_object = SettingsService.setup().extensions
            var active_extensions_length = Object.keys(active_extensions_object).length
            if (active_extensions_length > 0) {
                console.log('premium')
                $scope.premiumText = true
            } else {
                console.log('non premium')
            }

            //console.log('calling all details')
            CommService.getAllDetails(yetience.product)
                .then(function(all_details) {
                    console.log('All details')
                    console.log(all_details)
                    angular.extend($rootScope, all_details.details)


                    //for premium email provider
                    var temp = {}
                    temp.key = "premiumProvider"
                    temp.type = 'select'
                    var temp_array = []
                    var email_providers_array = $rootScope.components['email-subscriber'].fields[0].templateOptions.options
                        //get the list of all premium email providers and put them in an array, this will be used in email connector directive for checking if the provider is premium or not
                    for (i = email_providers_array.length - 1; i >= 0; i--) {
                        if (email_providers_array[i].premium == true) {
                            temp_array.push(email_providers_array[i].id)
                                // $rootScope.components['email-subscriber'].fields[0].templateOptions.options.splice(i, 1)
                        }
                    }

                    //put the array on rootScope so that it is accesible later
                    $rootScope.components['email-subscriber'].premiumProviders = temp_array
                        /*
                        for (var cat in $rootScope.categories) {
                            for (var key in $rootScope.themes) {

                                var theme = $rootScope.themes[key]

                                if (theme.categories.indexOf(cat) >= 0) {
                                    if (!$rootScope.categories[cat].themes) {
                                        $rootScope.categories[cat].themes = []
                                    }
                                    $rootScope.categories[cat].themes.push(theme)
                                }
                            }
                        }
                        */
                    postInitialization()
                }, function(err) {
                    console.log('error while getting all details')
                    console.log(err)
                })

            function postInitialization() {

                SettingsService.setup().networks = $rootScope.networks

                //console.log('added Networks')
                //console.log(SettingsService.setup())
                $rootScope.setup_initialized = true
                $rootScope.$emit('setup_initialized')

                if (document.getElementById('yetience-content')) {
                    document.getElementById('yetience-content').style.display = "block"
                }

                if (document.getElementById('yetience-loader')) {
                    document.getElementById('yetience-loader').style.display = "none"
                }
                console.log('root scope:')
                console.dir($rootScope.SETUP)
                    //ask user to review on wordpress if it's an old user or a new user
                if (!$rootScope.SETUP.wp_review_complete || $rootScope.SETUP.wp_review_complete == 'PENDING') {
                    $rootScope.reviewed = false
                } else {
                    $rootScope.reviewed = true
                }

                //console.log('Fetched data in ' + (Date.now() - autience_initiated_at) + ' milliseconds')
            }

        })

    }])
