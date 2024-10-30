window.defineAutienceWhom = function(yetience_callback) {
    if (Autience) {
        Autience.lifecycle.display.push(function(widget) {
            //create cookies as required
            Autience.utils.createCookie("autience-displayed-visitor-" + widget.code, true, true)
            Autience.utils.createCookie("autience-displayed-session-" + widget.code, true)

        })

        Autience.lifecycle.displayValidation.push(function(widget) {



            // if (widget.configuration.whom.cta == true)
            if ((Autience.utils.nestedValue(widget, ['configuration', 'whom', 'cta'])) == true)
                console.log('cta is set to ' + widget.configuration.whom.cta)
            if (Autience.utils.readCookie("autience-visitor-subscribed-" + widget.code)) {
                console.log('visitor subscribed, do not show popup')
                return false
            }

            return true
        })


        Autience.lifecycle.displayValidation.push(function(widget) {
            if (Autience.utils.nestedValue(widget, ['configuration', 'whom', 'once'])) {
                // console.log('once is ' + widget.configuration.whom.once)
                switch (widget.configuration.whom.once) {
                    case 'visitor':
                        if (Autience.utils.readCookie("autience-displayed-visitor-" + widget.code)) {
                            console.log('visitor cookie exists')
                            return false
                        }
                        break
                    case 'session':
                        if (Autience.utils.readCookie("autience-displayed-session-" + widget.code)) {
                            console.log('session cookie exists')
                            return false
                        }
                        break

                    case 'always':
                        return true
                        break
                }
            }

            return true
        })

        if (yetience_callback) {
            yetience_callback()
        }
    }


};
