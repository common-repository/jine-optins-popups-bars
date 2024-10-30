window.defineAutienceActionButton = function(yetience_callback) {
    //honor disable widget setting

    Autience.lifecycle.displayValidation.push(function(widget) {
        //return true = show, false = hide
        if (isActionButtonTheme(widget.themeType)) {
            var widget_enabled = widget.configuration.what.enable

            if (widget_enabled) {
                console.log('enabled')
                return true
            } else {
                console.log('disabled')
                return false
            }
        }
        return true
    })



    //Keep the button on screen when "no" is clicked in yes no popup
    Autience.lifecycle.postRender.push(function(widget) {
        if (isActionButtonTheme(widget.themeType) && widget.theme == "action-button-yesno") {

            // for button 1 - YES
            // if (widget.components.button1Link.values.operation == 'close') {
            if ((Autience.utils.nestedValue(widget, ['components', 'button1Link', 'values', 'operation'])) == 'close') {
                Autience.utils.classListen('yel-yes-button', 'click', function(el) {
                    document.getElementsByClassName("yel-ab-main-wrapper")[0].style.visibility = "visible"
                    document.getElementById("yel-main-box-wrapper").style.display = "none"
                    document.getElementById("yel-circle-wrapper").style.display = "block"

                })
            }

            // for button 2 - NO
            // if (widget.components.button2Link.values.operation == 'close') {
            if ((Autience.utils.nestedValue(widget, ['components', 'button2Link', 'values', 'operation'])) == 'close') {
                Autience.utils.classListen('yel-no-button', 'click', function(el) {
                    document.getElementsByClassName("yel-ab-main-wrapper")[0].style.visibility = "visible"
                    document.getElementById("yel-main-box-wrapper").style.display = "none"
                    document.getElementById("yel-circle-wrapper").style.display = "block"

                })
            }
        }
    })

    //close on closing small popup
    Autience.lifecycle.postRender.push(function(widget) {
        if (isActionButtonTheme(widget.themeType)) {
            Autience.utils.classListen('yel-arrow-box-close', 'click', function(el) {
                console.log('yel-arrow-box-close clicked')
                document.getElementById("yel-arrow-wrapper").style.display = "none"
            })
        }
    })

    //close on closing Large popup
    Autience.lifecycle.postRender.push(function(widget) {
        if (isActionButtonTheme(widget.themeType)) {
            Autience.utils.classListen('yel-mb-close', 'click', function(el) {
                console.log('yel-main-box-close clicked')
                document.getElementById("yel-main-box-wrapper").style.display = "none"
            })
        }
    })

    //big popup on clicking button
    Autience.lifecycle.postRender.push(function(widget) {
        if (isActionButtonTheme(widget.themeType)) {
            document.getElementsByClassName("yel-main-box-wrapper")[0].style.display = "none";
            Autience.utils.classListen('yel-cta-button', 'click', function(el) {
                //Open big popup
                //set css as display:block for yel-main-box-wrapper
                document.getElementsByClassName("yel-main-box-wrapper")[0].style.display = "block";
            })
        }
    })

    //check if it is an action button theme, only then execute the functions
    function isActionButtonTheme(themeType) {
        if (themeType == "ActionButtons")
            return true
        else
            return false
    }


    if (yetience_callback) {
        yetience_callback()
    }
}
