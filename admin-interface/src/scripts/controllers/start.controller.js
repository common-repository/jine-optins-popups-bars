//controller for the start page that shows a video and a button
angular.module('yetienceApp')
    .controller('StartController', ['$scope','$state', '$rootScope','CommService',function($scope,$state,$rootScope,CommService) {
    	
    	$scope.R = $rootScope
        $scope.C = CommService
        
        console.log('website saved inside start controller - '+yetience.website_saved)
    	if(yetience.website_saved){
            //console.log('sending you to select theme page'); 
    		$state.go('list')
            //$state.go('goals')
    	}

    	$scope.premiumPartial= function(){
            return $rootScope.basePath + '/src/partials/gopremium.html'
    	}

        $scope.hideActions = true

    }])