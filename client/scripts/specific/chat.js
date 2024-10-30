window.defineAutienceChat = function(yetience_callback) {
    if (Autience) {
        Autience.lifecycle.postRender.push(function(widget) {

            Autience.setup.networks.forEach(function(N) {
                bindAutienceChat("zopim")
            })


            function bindAutienceChat(chatProvider) {
                //close popup
                Autience.utils.classListen('autience-open-chat', 'click', function() {
                    if (typeof $zopim != 'undefined') {
                        $zopim.livechat.window.show();
                    } else {
                        console.log('Zopim is not installed')
                    }
                })

            }
        })


        Autience.lifecycle.display.push(function(widget) {
            if (typeof $zopim != 'undefined') {
                //for zopim popup to be shown as "in the popup"
                var yel_body_height = window.innerHeight;
                var yel_body_width = window.innerWidth;
                var yel_zopim_height = 400;
                var yel_zopim_width = 310;
                var yel_popup_offset = 76;
                var chat_wrapper = document.getElementById("yel-chat-wrapper")

                if (chat_wrapper) {
                    var yel_loc = chat_wrapper.getBoundingClientRect();

                    $zopim(function() {
                        //open the chat if it is closed
                        $zopim.livechat.window.show();

                        //change location
                        $zopim.livechat.window.setOffsetHorizontal(yel_body_width - yel_zopim_width - yel_loc.left - 5);
                        $zopim.livechat.window.setOffsetVertical((yel_body_height - yel_zopim_height) - yel_popup_offset);

                        /*var ua = navigator.userAgent.toLowerCase(),
                        platform = navigator.platform.toLowerCase();
                        platformName = ua.match(/ip(?:ad|od|hone)/) ? ‘ios’ : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || [‘other’])[0],
                        isMobile = /ios|android|webos/.test(platformName);*/
                        console.log(yel_body_width)
                        if (yel_body_width < 481) {
                            console.log("ot is mobile")
                            $zopim.livechat.window.setOffsetVertical((yel_body_height - yel_zopim_height) - yel_popup_offset);
                        }

                    })
                }



            }
        })

        if (yetience_callback) {
            yetience_callback()
        }
    }


};