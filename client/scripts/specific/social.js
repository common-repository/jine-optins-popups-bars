window.defineAutienceSocial = function(yetience_callback) {
    //console.log('injecting social.js')
    if (Autience) {
        //console.log('really injecting social.js')
        Autience.lifecycle.postRender.push(function(widget) {

            Autience.setup.networks.forEach(function(N) {
                //console.log(N)
                bindAutienceShare(N.label, 'autience-network-' + N.label, N.sharing_link, N.sharing_param)
            })


            function bindAutienceShare(network, button_id, share_link, share_param) {

                //console.log('binding ' + network + ' to ' + button_id)

                var Config = {
                    Link: "a.share",
                    Width: 500,
                    Height: 500
                }
                var encoded_url = encodeURIComponent(window.location)

                Autience.utils.idListen(button_id, 'click', PopupHandler)

                function PopupHandler(e) {
                    console.log('clicked on ' + network)


                    console.log('share_link- ' + share_link)
                    console.log('share_param- ' + share_param)

                    e = (e ? e : window.event);
                    var t = (e.target ? e.target : e.srcElement);

                    // popup position
                    var
                        px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
                        py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);

                    // open popup
                    var popup = window.open(share_link + '?' + share_param + '=' + encoded_url, "social",
                        "width=" + Config.Width + ",height=" + Config.Height +
                        ",left=" + px + ",top=" + py +
                        ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
                    if (popup) {
                        popup.focus();
                        if (e.preventDefault) e.preventDefault();
                        e.returnValue = false;
                    }

                    return !!popup;
                }
            }

        })

        if (yetience_callback) {
            yetience_callback()
        }
    }
};