angular.module('yetienceApp')
    .service('UtilsService', ['$modal', '$state', function($modal, $state) {

        this.emailOptions = [{
            label: "multiple",
            question: "Do you want to create multiple popups?"
        }, {
            label: "themes",
            question: "Do you need access to Premium Themes?"
        }, {
            label: "guide",
            question: "Do you want a free guide for making the best use popups for your website?"
        }, {
            label: "statistics",
            question: "Do you want a Daily report of conversions using the Popup?"
        }]

        this.findMatchingElement = function(arr, key, value) {

            for (var i in arr) {
                if (arr[i][key] == value) {
                    return arr[i]
                }
            }

        }

        this.stripAndExecuteScript = function(text) {
            console.log('inside stripAndExecuteScript')

            var scripts = '';
            var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function() {
                console.log('arguments')
                console.log(arguments)
                scripts += arguments[1] + '\n';
                return '';
            });

            console.log('cleaned html without script')
            console.log(cleaned)

            console.log('scripts inside html')
            console.log(scripts)

            if (window.execScript) {
                window.execScript(scripts);
            } else {
                var head = document.getElementsByTagName('head')[0];
                var scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.innerText = scripts;
                head.appendChild(scriptElement);
                head.removeChild(scriptElement);
            }
            return cleaned;
        }

        this.premiumMessage = function(message) {
            modalMessage('Please Upgrade', message, false)
        }

        this.modalMessage = modalMessage

        function modalMessage(title, message, hide_buttons) {
            var modalInstance = $modal.open({
                templateUrl: yetience.adminPath + '/src/partials/modal.message.html',
                controller: ['$scope', '$modalInstance', function($modalScope, $modalInstance) {
                    $modalScope.message = message
                    $modalScope.hideButtons = hide_buttons
                    $modalScope.title = title

                    $modalScope.gotoUpgrade = function() {
                        $state.go('extensions')
                        modalInstance.close()
                    }

                    $modalScope.closeModal = function() {
                        modalInstance.dismiss()
                    }
                }]
            })
        }

        this.getRandomCode = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        this.checkNested = function(obj, params) {
            var nested = obj
            for (var i in params) {
                if (typeof nested[params[i]] == 'undefined') {
                    return false
                }
                nested = nested[params[i]]
            }

            return true
        }
    }])
