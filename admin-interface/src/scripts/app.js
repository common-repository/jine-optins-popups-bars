//Initialize the app and route configuration here

angular.module('yetienceApp', ['ui.router', 'formly', 'formlyBootstrap', 'jsonFormatter', 'ui.bootstrap', 'angular-md5', 'ngCookies', 'LocalStorageModule', 'angularTrix'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    if (yetience.website_saved) {
        $urlRouterProvider.otherwise('/list')
    } else {
        $urlRouterProvider.otherwise('/start')
    }


    $stateProvider
        .state('start', {
            url: '/start',
            templateUrl: yetience.adminPath + '/src/partials/start.html',
            controller: 'StartController'
        })
        .state('list', {
            url: '/list',
            templateUrl: yetience.adminPath + '/src/partials/list.html',
            controller: 'ListController'
        })
        .state('premium', {
            url: '/premium',
            templateUrl: yetience.adminPath + '/src/partials/gopremium.html',
            controller: 'GoPremiumController'
        })
        .state('build', {
            url: '/:mode/build',
            templateUrl: yetience.adminPath + '/src/partials/build.html',
            controller: 'buildController'
        })
        .state('build.goals', {
            url: '/goals',
            templateUrl: yetience.adminPath + '/src/partials/build.business.goal.html',
            controller: 'businessGoalsController'
        })
        .state('build.placement', {
            url: '/placement',
            templateUrl: yetience.adminPath + '/src/partials/build.widget.type.html',
            controller: 'widgetTypeController'
        })

    .state('build.select', {
            url: '/select',
            templateUrl: yetience.adminPath + '/src/partials/build.select.html',
            controller: 'buildSelectController'
        })
        .state('build.design', {
            url: '/design',
            templateUrl: yetience.adminPath + '/src/partials/build.design.html',
            controller: 'buildDesignController'
        })
        .state('build.integrate', {
            url: '/integrate',
            templateUrl: yetience.adminPath + '/src/partials/build.integrate.html',
            controller: 'buildIntegrateController'
        })
        .state('extensions', {
            url: '/extensions',
            templateUrl: yetience.adminPath + '/src/partials/extensions.html',
            controller: 'extensionSaleController'
        })
        .state('affiliate', {
            url: '/affiliate',
            templateUrl: yetience.adminPath + '/src/partials/affiliate.html',
            controller: 'affiliateController'
        })
        .state('support', {
            url: '/support',
            templateUrl: yetience.adminPath + '/src/partials/support.html',
            controller: ''
        })
        /*
        .state('recommend', {
            url: '/recommend',
            templateUrl: yetience.adminPath + '/src/partials/recommend.html',
            controller: 'recommendController'
        })

        .state('build.configure', {
            url: '/configure',
            templateUrl: yetience.adminPath + '/src/partials/build.configure.html',
            controller: 'buildConfigureController'
        })
        .state('build.activate', {
            url: '/activate',
            templateUrl: yetience.adminPath + '/src/partials/build.activate.html',
            controller: 'buildActivateController'
        })
        .state('build.launch', {
            url: '/launch',
            template:'<div ui-view></div>',
            controller: 'buildLaunchController'
        })
        .state('build.launch.statistics', {
            url: '/statistics',
            templateUrl: yetience.adminPath + '/src/partials/build.launch.statistics.html',
            controller: 'buildLaunchStatisticsController'
        })
        .state('build.launch.package', {
            url: '/package',
            templateUrl: yetience.adminPath + '/src/partials/build.launch.package.html',
            controller: 'buildLaunchPackageController'
        })
        .state('goals', {
            url: '/goals',
            templateUrl: yetience.adminPath + '/src/partials/goals.html',
            controller: 'GoalsController'
        })
        */
}])
