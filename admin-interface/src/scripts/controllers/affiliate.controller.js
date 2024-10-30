 angular.module('yetienceApp')

 .controller('affiliateController', ['$scope', '$rootScope', '$timeout', 'SettingsService', 'CommService', '$timeout', function($scope, $rootScope, $timeout, SettingsService, CommService, $timeout) {

     $scope.R = $rootScope
     $scope.C = CommService

     $scope.initialize = function() {

         $timeout(function() {
             $scope.affiliateCode = $rootScope.SETUP.affiliate_code
             console.log($scope.affiliateCode)
             $scope.checkBoxEnableLink = $rootScope.SETUP.showAffiliateLink
         }, 500);

     }

     $scope.affiliateClicked = function() {

         if ($scope.checkBoxEnableLink) {
             //checked
             console.log("clicked" + $scope.checkBoxEnableLink);
             SettingsService.showAffiliateLink(true);
         } else {
             //unchecked
             console.log("clicked" + $scope.checkBoxEnableLink);
             SettingsService.showAffiliateLink(false);
         }
     }


     $scope.registerNewAffiliate = function(affiliate) {
         $timeout(function() {
             CommService.addNewAffiliate(affiliate)
                 .then(function() {
                     location.reload();
                 })
         }, 500)
     }

 }])
