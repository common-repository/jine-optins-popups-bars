angular.module('yetienceApp')
    .service('FeatureStatusService', ['$rootScope', function($rootScope, SettingsService) {


        this.mobileScreens = function(widget, feature) {
            feature.priority = 1;
            return {
                display: true,
                current: "Shows only on desktops",
                ideal: "Show on mobiles & desktops",
                icon: "glyphicon glyphicon-phone",
                upgrade: 'Activate for Mobile & Tablet users'
            };
        }

        this.specificPages = function(widget, feature) {
            feature.priority = 2;

            return {
                display: true,
                current: "Shows up on all pages",
                ideal: "Show on selected pages",
                icon: "glyphicon glyphicon-list-alt",
                upgrade: 'Show only on selected pages'
            };
        }

        this.hideAfterCta = function(widget, feature) {
            feature.priority = 3;
            return {
                display: true, //($rootScope.themes[widget.theme].categories.indexOf('subscribe') >= 0),
                current: "Show even after visitor subscribes",
                ideal: "Disable after subscription",
                icon: "glyphicon glyphicon-flash",
                upgrade: 'Disable widget once the visitor subscribes'
            };
        }

        this.thankYouPage = function(widget, feature) {

            //find if the theme is email or not
            feature.priority = 4;
            return {
                display: false, //($rootScope.themes[widget.theme].categories.indexOf('subscribe') >= 0),
                current: "Redirect after subscription",
                ideal: "Keep on the same page",
                icon: "glyphicon glyphicon-send",
                upgrade: 'Keep Visitors on the same page after subscription'
            };
        }


        this.customHtml = function(widget, feature) {
            feature.priority = 5;
            return {
                display: false,
                current: "Make your own widget",
                ideal: "custom html >",
                icon: "glyphicon glyphicon-list-alt",
                upgrade: 'Create a custom widget with your own HTML'
            };
        }

        this.premiumEmail = function(widget, feature) {
            feature.priority = 6;
            return {
                display: false,
                current: "Connect with email provider",
                ideal: " >",
                icon: "glyphicon glyphicon-envelope",
                upgrade: 'Integrate with other email providers'
            };
        }

        this.showAdminFeature = function(widget, feature) {
            feature.priority = 7;
            return {
                display: true,
                current: "Shows to logged in users",
                ideal: "Hide from logged in users",
                icon: "glyphicon glyphicon-user",
                upgrade: 'Disable widget for logged in visitors'
            };
        }



        this.emailSignature = function(widget, feature) {
            feature.priority = 8;
            return {
                display: true,
                current: "Shows to logged in user",
                ideal: "Hide from logged in users",
                icon: "glyphicon glyphicon-envelope",
                upgrade: 'Remove the email signature'
            };
        }


        this.limitByReferrer = function(widget, feature) {
            feature.priority = 9;
            return {
                display: true,
                current: "Shows to logged in users",
                ideal: "Hide from logged in users",
                icon: "glyphicon glyphicon-eye-close",
                upgrade: 'Show to visitors from specific websites'
            };
        }

        this.premiumSubscription = function(widget, feature) {
            feature.priority = 10;
            return {
                display: true,
                current: "",
                ideal: "All the above for 10$/month",
                icon: "glyphicon glyphicon-usd",
                upgrade: 'All features at a discounted price'
            };
        }

    }])
