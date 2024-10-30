angular.module('yetienceApp')
    .service('CommService', ['$http', '$q', '$rootScope', 'md5', function($http, $q, $rootScope, md5) {
        var api_server = yetience.server

        this.addWelcomeEmail = function(widget) {
            var welcome_email = widget.components.welcomeEmail.values,
                email_subscription = widget.components.emailSubscription.values,
                widget_id = widget.code,
                welcome_email_details = {
                    website_id: $rootScope.SETUP.id,
                    widget_id: widget_id,
                    send_welcome_email: email_subscription.sendWelcomeEmail,
                    welcome_email: welcome_email.welcomeEmail,
                    from_email: welcome_email.emailFrom,
                    email_subject: welcome_email.emailSubject
                }

            if (welcome_email.ccEnabled) {
                welcome_email_details.cc_enabled = true
                welcome_email_details.cc_email = welcome_email.ccEmail
            } else {
                welcome_email_details.cc_enabled = false
            }

            return postAndResolve('/api/EmailSubscriptions/add_email_message', welcome_email_details)
        }

        this.updateReview = function(status) {
            return putAndResolve('/api/websites/' + $rootScope.SETUP.id, {
                website_id: $rootScope.SETUP.id,
                wp_review_complete: status
            })
        }

        this.addNewAffiliate = function(affiliate) {
            affiliate.website_id = $rootScope.SETUP.id
            console.log(affiliate)
            return putAndResolve('/subscription/api/Affiliates/create_affiliate', affiliate)
                .then(function(new_affiliate) {
                    console.log('new_affiliate is')
                    console.log(new_affiliate.id)
                    return putAndResolve('/api/websites/' + $rootScope.SETUP.id, {
                        affiliate_code: new_affiliate.id
                    })
                })
        }

        this.addReferralCode = function(referrerId) {
            return putAndResolve('/api/websites/' + $rootScope.SETUP.id, {
                    referrer_id: referrerId
                })
                .then(function() {
                    //console.log("added a new referral code for this website")
                    //add it to the ref.json file
                })
        }

        function getReferrer() {
            var D = $q.defer()
            $http.get(window.yetience.path + "/referrer_id.json")
                .then(function(json) {
                    console.log('referrer found')
                    console.log(json.data.referrer)
                    D.resolve(json.data.referrer)

                })
                .catch(function(err) {
                    console.log('error occured trying to read referrer')
                    console.log(err)
                    D.resolve(null)
                })
            return D.promise
        }
        this.activateKey = function(key) {
            return postAndResolve('/subscription/api/premiumSubscriptions/premium', {
                'key': key,
                'website_id': $rootScope.SETUP.id
            })
        }

        this.setupSendy = function(sendy_data) {
            //console.log('in setupSendy')
            //console.log(sendy_data)
            return putAndResolve('/api/sendys/setup', {
                'SendyData': sendy_data,
                'website_id': $rootScope.SETUP.id
            })
        }

        this.setupActivecampaign = function(activecampaign_data) {
            return postAndResolve('/api/ActiveCampaigns/setup', {
                'ActivecampaignData': activecampaign_data,
                'website_id': $rootScope.SETUP.id
            })
        }

        this.updateFeedback = function(feedback_status) {

            return putAndResolve('/api/Websites/' + $rootScope.SETUP.id, {
                feedback_working: feedback_status
            })
        }

        this.getEmails = function(website_id, list, page) {
            var current_page = page * 10
            var limit = 10
            return getAndResolve('/api/EmailSubscriptions?filter[where][website_id]=' + website_id + '&[where][list]=' + list + '&filter[limit]=' + limit + '&filter[skip]=' + current_page + '&filter[order]=timestamp%20DESC')
        }

        this.sendFeedbackEmail = function(feedback_object) {
            console.log('in sendFeedbackEmail')
            console.log(feedback_object)
            var data_obj = {}
            data_obj.website_id = $rootScope.SETUP.id
            data_obj.domain = $rootScope.SETUP.initial_domain
            return postAndResolve('/api/Websites/feedback/', {
                feedback_object: feedback_object,
                data: data_obj
            })
            console.log('sent feedbackemail')
        }

        this.updateDetectedEmail = function(emails_array) {
            return putAndResolve('/api/Websites/' + $rootScope.SETUP.id, {
                detectedEmail: emails_array
            })
        }

        this.getEmailLists = function(provider, website_id) {
            return getAndResolve('/api/EmailSubscriptions/lists?provider=' +
                provider + '&website_id=' + website_id)
        }

        this.getGoals = function() {
            return getAndResolve('/api/Goals', arrayToObject('label'))
        }

        this.markSaved = function(website_id) {
            return putAndResolve('/api/Websites/' + website_id, {
                saved: true
            })
        }

        this.createNewEvent = function createNewEvent(event, data) {
            console.log("ET: " + event + " D: " + data)
            yetience.sendEvent(event, $rootScope.SETUP.id, data);
        }


        this.getWebsite = function(id) {
            //console.log('getting website')
            return getAndResolve('/api/Websites/' + id)
        }

        this.createWebsiteId = function() {
            return getReferrer()
                .then(function(referrer_id) {
                    console.log('referrer_id is')
                    console.log(referrer_id)
                    return postAndResolve('/api/Websites', {
                        platform: yetience.platform,
                        initial_domain: window.location.host,
                        product_id: yetience.product,
                        extensions: {
                            premiumSubscription: true
                        },
                        createdVersion: yetience.version,
                        referrer_id: referrer_id
                    })
                })
                .catch(function(err) {
                    console.log('referrer problem in createWebsiteId,ignoring referrer ')
                    return postAndResolve('/api/Websites', {
                        platform: yetience.platform,
                        initial_domain: window.location.host,
                        product_id: yetience.product,
                        createdVersion: yetience.version
                    })
                })

        }

        this.getNetworks = function() {
            return getAndResolve('/api/Networks')
        }

        this.getAllDetails = function(product_id) {
            //console.log('inside getAllDetails')
            return getAndResolve('/api/Products/all_details?product=' + product_id)
        }

        this.getProductDetails = function(product_id) {
            return getAndResolve('/api/Products/' + product_id)
        }

        this.getThemes = function() {
            return getAndResolve('/api/Themes', arrayToObject('label'))
        }

        this.getCategories = function() {
            return getAndResolve('/api/Categories', arrayToObject('label'))
        }

        this.getComponents = function() {
            return getAndResolve('/api/Components', arrayToObject('label'))
        }

        this.getEmailProviders = function() {
            return getAndResolve('/api/EmailProviders', arrayToObject('label'))
        }


        this.getThemeTemplate = function(theme_id) {
            return getAndResolve('/themes/' + theme_id + '/' + theme_id + '-template.html', null, $rootScope.staticPath)
        }

        this.getPackages = function() {
            return getAndResolve('/subscription/api/Packages', arrayToObject('label'))
        }

        this.getFeatures = function() {
            return getAndResolve('/subscription/api/Features', arrayToObject('label'))
        }

        this.getCustomizations = getCustomizations

        function getCustomizations(component_id) {
            return getAndResolve('/api/components/' + component_id + '/api/' + component_id + '-customization.json', null, $rootScope.staticPath)
        }

        this.getThemeDetails = function(theme_id) {

        }

        this.getNetwork = function(network_id) {

        }


        this.createWidget = function(website_id, widget, customer) {
            //console.log('creating new widget')
            widget.website_id = website_id
            widget.product_id = yetience.product

            if (customer && customer.password) {
                customer.password = md5.createHash(customer.password)
            }
            return postAndResolve('/api/Widgets/create_new', {
                widget: widget,
                customer: customer
            })
        }

        this.createWidgetOnServer = function(website_id, widget) {
            //console.log('creating new widget')
            widget.website_id = website_id
            widget.product_id = yetience.product
            if (widget.widget_id) {
                return putAndResolve('/api/Widgets', widget)
            } else {
                return postAndResolve('/api/Widgets', widget)
            }

        }

        this.updateWidget = function(widget) {
            return putAndResolve('/api/Widgets/' + widget.widget_id, widget)
        }

        this.uploadSetup = function(website_id, setup) {

        }

        this.getStyleContent = function(id) {
            var el = document.getElementById(id)
            var url = el.getAttribute("href")
            return getAndResolve(url, null, '')
        }

        function postAndResolve(url, data, transform, base) {
            return comm(url, 'post', transform, data, base)
        }

        function putAndResolve(url, data, transform, base) {
            return comm(url, 'put', transform, data, base)
        }

        function getAndResolve(url, transform, base) {
            return comm(url, 'get', transform, null, base)
        }

        function comm(url, method, transform, data, base) {
            if (!base && base != '') {
                base = api_server
            }
            var D = $q.defer()
                //console.log('making ' + method + ' call to ' + url)
            $http[method](base + url, data)
                .then(function(res) {
                    if (transform) {
                        D.resolve(transform(res.data))
                    } else {
                        D.resolve(res.data)
                    }
                }, function(err) {
                    alert('Unable to connect to server. Please refresh the page and try again')
                    console.log("HTTP ERROR")
                    console.log(err)
                    var error_to_send = err
                    if (err.data) {
                        error_to_send = err.data
                        if (err.data.error) {
                            error_to_send = err.data.error
                        }
                    }
                    D.reject()
                })
            return D.promise
        }

        function arrayToObject(keyAttribute) {
            return function(data) {
                var obj = {}
                data.forEach(function(a) {
                    obj[a[keyAttribute]] = a
                })

                return obj
            }
        }



    }])
