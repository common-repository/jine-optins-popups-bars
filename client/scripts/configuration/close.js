window.defineAutienceClose = function(yetience_callback) {

    //this function changes the close image url based on the url's http or https
    Autience.lifecycle.onPageLoad.push(function(widget) {
        //check the browser url to see if its http or https
        var yel_current_url = window.location.href
        if (yel_current_url.indexOf('https') >= 0) {
            //url is an https
            //console.log("a https url "+window.location.href)
            if (document.getElementsByClassName('yeloni-close-image-url')) {
                //get the current close button image
                var yel_div_list = document.getElementsByClassName('yeloni-close-image-url'),
                    yel_lt = yel_div_list.length;
                while (yel_lt--) {
                    var yel_img_url = yel_div_list[yel_lt].src;
                    if (yel_img_url.indexOf('https:') < 0) {
                        //image is from an http source
                        console.log("url is https and image is from an http source")
                        yel_div_list[yel_lt].src = "https://dl.dropboxusercontent.com/u/59065865/cross.png";
                    }

                }
            }
        } else {
            //url is http - do nothing!
            console.log("a http url " + window.location.href)
        }
    })

    /*var yeloni_comment = 'This widget is powered by yeloni.com. Get one for your site today.'
    //show comments before widget
    Autience.lifecycle.postRender.push(function(widget) {
        if (document.getElementById(widget.code)) {
            var top_comment = document.createComment(yeloni_comment);
            // console.log(widget.themeType)
            var yel_widget_wrapper = wrapperClass(widget.themeType)
            var popup = document.getElementsByClassName(yel_widget_wrapper)[0]
            document.getElementById(widget.code).insertBefore(top_comment, popup);
        } else {
            console.log('Widget ' + widget.code + ' is not loaded')
        }

    })*/

    function wrapperClass(themeType) {
        if (themeType == 'ActionButtons') {
            return 'yel-cta-wrapper'
        } else {
            return 'yel-popup-template'
        }
    }

    /*
    //show comments after widget
    Autience.lifecycle.postRender.push(function(widget) {
        var bottom_comment = document.createComment(yeloni_comment);
        if (document.getElementById(widget.code)) {
            document.getElementById(widget.code).appendChild(bottom_comment);
        } else {
            console.log('Widget ' + widget.code + ' is not loaded')
        }
    })
    */

    //attach close functionality to the close button
    //close button has an id called autience-close-widget_id
    Autience.lifecycle.postRender.push(function(widget) {
        Autience.utils.classListen('autience-close-' + widget.code, 'click', function(el) {
            Autience.utils.closeWidget(widget)
        })
    })

    Autience.lifecycle.postRender.push(function(widget) {

        Autience.utils.idListen('autience-close-' + widget.code, 'click', function(el) {
            //if the user clicks the close button on a link trigger, check if we need to redirect

            if (Autience.utils.nestedValue(widget, ['trigger', 'trigger']) == 'link' && Autience.utils.nestedValue(widget, ['configuration', 'when', 'link', 'close'])) {
                Autience.utils.redirect(Autience.current_link, Autience.current_target)
            }
        })
    })


    //hiding the facebook page like after popup close - only for facebook-page-like theme
    Autience.lifecycle.postRender.push(function(widget) {

        Autience.utils.idListen('autience-close-' + widget.code, 'click', function(el) {
            if (document.getElementById("yel-facebook-popup")) {
                document.getElementById("yel-facebook-popup").display = "none";
            }
        })
    })

    //for close clicking outside
    Autience.lifecycle.postRender.push(function(widget) {
            if (Autience.utils.nestedValue(widget, ['configuration', 'close', 'outside'])) {
                //console.log('close on clicking outside')

                Autience.utils.classListen('yel-popup-main-wrapper', 'click', function() {
                    //console.log('clicked outside')
                    Autience.utils.closeWidget(widget)
                })
                Autience.utils.classListen('yel-popup-template', 'click', function(e) {
                    e.stopPropagation();
                })
            }
        }) //close lifecycle


    //adding event listeners for analytics
    Autience.lifecycle.postRender.push(function(widget) {


        // if (widget.components.commonanalytics.values.measureAnalyticsBoolean) {
        if (Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'measureAnalyticsBoolean'])) {
            var yel_measure_analytics = widget.components.commonanalytics.values.measureAnalyticsBoolean;

            var yel_popup_name = 'Yeloni'

            // if (widget.components.commonanalytics.values.analyticsPopupName) {
            if (Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'analyticsPopupName'])) {
                var yel_temp_popup_name = widget.components.commonanalytics.values.analyticsPopupName;
                var yel_popup_name = 'Yeloni-' + yel_temp_popup_name.split(' ').join('-');
            }

            //listening for linkedimage clicks
            Autience.utils.classListen('yel-atr-linked-image', 'click', function(el) {
                //send the popup display event
                //alert('pinterest follow clicked22')
                ga('send', 'event', yel_popup_name, 'Linked-Image-Click');
            });

            //listening for linkedtext clicks
            Autience.utils.classListen('yel-atr-linked-text', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'Linked-Text-Click');
            });

            //listening for button clicks
            //========do something for yes no buttons
            Autience.utils.classListen('yel-atr-button', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'Button-Click');
            });

            Autience.utils.classListen('yel-yes-button', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'Yes-Button-Click');
            });
            Autience.utils.classListen('yel-no-button', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'No-Button-Click');
            });

            Autience.utils.classListen('yel-pinterest-follow-image', 'click', function(el) {
                //send the popup display event
                //alert('pinterest follow clicked')
                ga('send', 'event', yel_popup_name, 'Pinterest-Follow-Click');
            });

            //social share popup begin
            Autience.utils.idListen('autience-network-pinterest', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'Pinterest-Follow-Click');
            });
            Autience.utils.idListen('autience-network-facebook', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'facebook-Follow-Click');
            });
            Autience.utils.idListen('autience-network-twitter', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'twitter-Follow-Click');
            });
            Autience.utils.idListen('autience-network-googleplus', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'googleplus-Follow-Click');
            });
            Autience.utils.idListen('autience-network-linkedin', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'linkedin-Follow-Click');
            });
            Autience.utils.idListen('autience-network-reddit', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'reddit-Follow-Click');
            });
            Autience.utils.idListen('autience-network-whatsapp', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'whatsapp-Follow-Click');
            });
            Autience.utils.idListen('autience-network-flipboard', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'flipboard-Follow-Click');
            });
            Autience.utils.idListen('autience-network-baidu', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'baidu-Follow-Click');
            });
            Autience.utils.idListen('autience-network-sinaweibo', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'sinaweibo-Follow-Click');
            });
            Autience.utils.idListen('autience-network-slashdot', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'slashdot-Follow-Click');
            });
            Autience.utils.idListen('autience-network-vkontakte', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'vkontakte-Follow-Click');
            });
            //social share popup end

            //email popup subscribe event
            Autience.utils.classListen('yel-ep-submit-button', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'Subscribe-Button-Click');
            });
            Autience.utils.classListen('yel-email-popup-button-large', 'click', function(el) {
                //send the popup display event
                ga('send', 'event', yel_popup_name, 'Subscribe-Button-Click');
            });
            //email popup subscribe event end
        }

    })



    Autience.lifecycle.close.push(function(widget) {
        document.getElementById(widget.code).style.visibility = 'hidden'
        if (widget.default_display) {
            document.getElementById(widget.code).style.display = widget.default_display
        }
    })


    //close the zopim window if needed
    Autience.lifecycle.close.push(function(widget) {
        if (typeof $zopim != 'undefined') {
            $zopim.livechat.window.hide();
        }
    })


    //send an analytics event is applicable
    Autience.lifecycle.close.push(function(widget) {


        // if (widget.components.commonanalytics.values.measureAnalyticsBoolean) {
        if(Autience.utils.nestedValue(widget,['components','commonanalytics','values','measureAnalyticsBoolean'])){
            var yel_measure_analytics = widget.components.commonanalytics.values.measureAnalyticsBoolean;


            var yel_popup_name = 'Yeloni'

            // if (widget.components.commonanalytics.values.analyticsPopupName) 

            if(Autience.utils.nestedValue(widget,['components','commonanalytics','values','analyticsPopupName'])){
                var yel_temp_popup_name = widget.components.commonanalytics.values.analyticsPopupName;
                var yel_popup_name = 'Yeloni-' + yel_temp_popup_name.split(' ').join('-');
            }

            //send the popup display event
            ga('send', 'event', yel_popup_name, 'Popup-Closed');

        }
    })


    Autience.lifecycle.postRender.push(function(widget) {
        //Show an alertbox before the browser window closes
        console.log('before close')
        console.log(widget)

        if (Autience.utils.nestedValue(widget, ['configuration', 'close', 'alert'])) {
            window.onbeforeunload = function(e) {
                return Autience.utils.nestedValue(widget, ['configuration', 'close', 'message'])
            };
        }
    })

    if (yetience_callback) {
        yetience_callback()
    }
};
