angular.module('yetienceApp')
    .controller('emailListController', ['$scope', '$modalInstance', 'CommService', '$rootScope', 'SettingsService', 'WidgetCode', function($modalScope, $modalInstance, CommService, $rootScope, SettingsService, WidgetCode) {

        console.log('Widget Code inside modal- ' + WidgetCode)
        var website_id = $rootScope.SETUP.id,
            list = WidgetCode
        $modalScope.sub = { list: null }



        //fetch emails from database
        $modalScope.list_loaded = false
        $modalScope.fetchSubscribers = function(website_id, list, page_to_fetch) {
            CommService.getEmails(website_id, list, page_to_fetch)
                .then(function(subscriber_list) {
                    $modalScope.list_loaded = true
                    $modalScope.sub.list = subscriber_list

                    if (subscriber_list.length > 0) {
                        console.log('got subscriber_list')
                            // console.log(subscriber_list)
                        $modalScope.hideNext = false
                    } else {
                        //$modalScope.current_page = page_to_fetch - 1
                        $modalScope.hideNext = true
                    }
                }, function(err) {
                    console.log(err)
                })
        }


        $modalScope.current_page = 0
        $modalScope.fetchSubscribers(website_id, list, $modalScope.current_page)

        // if (!$modalScope.current_page || $modalScope.current_page > 0) {
        //     $modalScope.current_page = 0
        //     $modalScope.fetchSubscribers(website_id, list, $modalScope.current_page)
        // }


        $modalScope.next = function(option) {
                switch (option) {
                    case 'next':
                        $modalScope.current_page++
                            break
                    case 'previous':
                        $modalScope.current_page--
                            break
                }

                if ($modalScope.current_page >= 0) {
                    $modalScope.fetchSubscribers(website_id, list, $modalScope.current_page)
                } else {
                    $modalScope.current_page = 0
                }
            }
            //converting timestamp to date
        $modalScope.convertedTime = function(timestamp) {
            var a = new Date(timestamp * 1000);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
            var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
            var time = date + ' ' + month + ' ' + year;
            return time;
        }
    }])