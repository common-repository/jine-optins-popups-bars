window.defineAutienceWhen = function(yetience_callback) {

    //log for popup displayed
    Autience.lifecycle.display.push(function(widget) {
        //checking if the popup code is present and sending popup_displayed event
        if (document.getElementById(widget.code)) {
            var code = document.getElementById(widget.code).innerHTML
            if (code) {
                Autience.utils.sendEvent('d_popup_displayed');
            } else {
                Autience.utils.sendEvent('popup_empty');
            }
        } else {
            console.log('Widget ' + widget.code + ' is not loaded')
        }

    })

    //Zopim related functionality
    Autience.lifecycle.display.push(function(widget) {

        if (Autience.utils.nestedValue(widget, ['components', 'zopimChat']) && typeof $zopim !== 'undefined') {
            $zopim(function() {

                var yel_body_height = window.innerHeight
                var yel_body_width = window.innerWidth
                var yel_zopim_height = 400
                var yel_zopim_width = 310
                var yel_popup_offset = 76

                $zopim.livechat.window.show();
                var yel_loc = document.getElementById("yel-chat-wrapper").getBoundingClientRect();
                //console.log(yel_body_width)
                //console.log(yel_loc.left)
                //console.log(yel_loc.top)

                $zopim.livechat.window.setOffsetHorizontal(yel_body_width - yel_zopim_width - yel_loc.left - 5);
                $zopim.livechat.window.setOffsetVertical((yel_body_height - yel_zopim_height) - yel_popup_offset);

                if (yel_body_width < 767) {
                    $zopim.livechat.window.setOffsetVertical((yel_body_height - yel_zopim_height) - yel_loc.top);
                    $zopim.livechat.window.setOffsetHorizontal((yel_body_width - yel_zopim_width) / 2);
                }

            });
        }
    })

    //attach listener to display when the event occurs
    Autience.lifecycle.onPageLoad.push(function(widget) {
        console.log('Attaching display on trigger')
            //first check if the  widget is enabled
        if (Autience.utils.nestedValue(widget, ['configuration', 'what', 'enable'])) {
            var when = widget.configuration.when

            var is_mobile = Autience.utils.isMobile()
                // console.log('is mobile- ' + is_mobile)
            var different_for_mobiles = when.smallDifferent
            var device = 'large',
                delay = 0


            if (is_mobile && different_for_mobiles) {
                device = 'small'
            }

            var trigger = when[device]
            var autience_event = trigger
            switch (trigger) {
                //handle these trigger cases differently
                case 'scroll':
                    autience_event = 'scroll_' + when.scroll[device]
                    break
                case 'delay':
                    autience_event = 'load'
                    delay = when.delay[device]
                    break
                case 'link':
                    var link_type = when.link[device]
                    autience_event = 'link_' + link_type
                    Autience['disable_link_' + link_type] = true
                    break
            }

            displayPopupOnEvent(autience_event, delay)
            widget.trigger = {
                trigger: trigger,
                autience_event: autience_event,
                delay: delay
            }

        } else {
            Autience.utils.sendEvent('client_widget_disabled')
            console.log('widget is disabled')
        }

        function displayPopupOnEvent(autience_event, delay) {
            //Listen to the defined event and run the display lifecycle
            console.log('Attached Event Listener for Popup')
            Autience.utils.listenAutienceEvent(autience_event, function(evt) {
                setTimeout(function() {
                    Autience.utils.cycle(Autience.lifecycle.display, widget)
                        // console.log('Popup is triggered')
                        //Autience.utils.sendEvent('popup_triggered')
                }, delay * 1000)

            })
        }

    })


    //adding the analytics tracking code to the body
    Autience.lifecycle.display.push(function(widget) {


        // if (widget.components.commonanalytics.values.measureAnalyticsBoolean && widget.components.commonanalytics.values.analyticsTrackingCode) {
        if ((Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'measureAnalyticsBoolean'])) && (Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'analyticsTrackingCode']))) {

            var yel_measure_analytics = widget.components.commonanalytics.values.measureAnalyticsBoolean;
            var yel_tracking_code = widget.components.commonanalytics.values.analyticsTrackingCode;


            //adding the analytics script
            if (document.body != null) {
                var tracking_code_div = document.createElement("script");
                tracking_code_div.type = "text/javascript";

                var yel_popup_name = 'Yeloni'

                // if (widget.components.commonanalytics.values.analyticsPopupName) 
                if ((Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'analyticsPopupName']))) {
                    var yel_temp_popup_name = widget.components.commonanalytics.values.analyticsPopupName;
                    var yel_popup_name = 'Yeloni-' + yel_temp_popup_name.split(' ').join('-');
                }


                //removing <script> tags
                yel_tracking_code = yel_tracking_code.replace("<script>", " ");
                yel_tracking_code = yel_tracking_code.replace("</script>", " ");

                //removing new lines
                yel_tracking_code = yel_tracking_code.replace(/\n/g, " ");
                //yel_tracking_code = yel_tracking_code.replace("pageview", "Page-Load");

                //adding the code to the script
                tracking_code_div.innerHTML = yel_tracking_code;


                document.body.appendChild(tracking_code_div);

                //send the popup display event
                //sending the page load event

                ga('send', 'event', yel_popup_name, 'Popup-Display');
            }
        }

    })

    //showing the affiliate link if applicable
    Autience.lifecycle.render.push(function(widget) {

        //console.log("show link-- "+Autience.setup.showAffiliateLink)


        // if (Autience.setup.showAffiliateLink)         {
        if ((Autience.utils.nestedValue(Autience, ['setup', 'showAffiliateLink']))) {
            var yelPopups = document.getElementsByClassName('yel-popup-template'),
                noOfPopups = yelPopups.length;

            while (noOfPopups--) {
                //add an element at the end of the yel-popup-template div
                var currentNode = yelPopups[noOfPopups]
                var newNode = document.createElement("div")
                newNode.className = "yel-powered"
                newNode.innerHTML = "Powered by Yeloni"

                currentNode.parentNode.insertBefore(newNode, currentNode.nextSibling)

            }
            //console.log("autience setup")
            //console.dir(Autience.setup.affiliate_code)

            Autience.utils.classListen('yel-powered', 'click', function() {
                var linkhere = ""
                if (Autience.setup.affiliate_code) {
                    linkhere = "?ref=" + Autience.setup.affiliate_code
                }
                var affiliateLink = "http://www.yeloni.com/download.html" + linkhere;
                window.open(affiliateLink, '_blank');
            })
        }

    })

    if (yetience_callback) {
        yetience_callback()
    }
};
