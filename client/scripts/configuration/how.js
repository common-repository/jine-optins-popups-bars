window.defineAutienceHow = function(yetience_callback) {

    Autience.lifecycle.display.push(function(widget) {
        //core function which shows the popup
        if (document.getElementById(widget.code)) {
            document.getElementById(widget.code).style.visibility = 'visible'
            widget.default_display = document.getElementById(widget.code).style.display
            document.getElementById(widget.code).style.display = 'block'
        } else {
            console.log('Widget ' + widget.code + ' is not loaded')
        }

    })



    //if analytics is enabled send an popup display event
    Autience.lifecycle.display.push(function(widget) {


        // if (widget.components.commonanalytics.values.measureAnalyticsBoolean)
        var yel_measure_analytics = Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'measureAnalyticsBoolean'])
        if (yel_measure_analytics) {
            var yel_popup_name = 'Yeloni'

            // if (widget.components.commonanalytics.values.analyticsPopupName) {
            if (Autience.utils.nestedValue(widget, ['components', 'commonanalytics', 'values', 'analyticsPopupName'])) {
                var yel_temp_popup_name = widget.components.commonanalytics.values.analyticsPopupName;
                var yel_popup_name = 'Yeloni-' + yel_temp_popup_name.split(' ').join('-');
            }
        }
    })



    //function to add widget rendered into a wrapper div
    Autience.lifecycle.render.push(function(widget) {

        console.log("WIDGET IS --")
        console.dir(widget)

        //create a new widget with a wrapper if it does not already exist
        if (!document.getElementById(widget.code) || true) {

            //based on the type of widget render it differently.
            //types of widgets are selected by widget.widgetType
            //the list of all types is in widget_type_data.json - name field

            var widgetDiv = document.createElement('div')
            widgetDiv.id = widget.code
            var typeOfWidget = widget.themeType;

            //console.log("widget.placementType:"+ widget.placementType)
            console.log('Type of Popup- ' + typeOfWidget)

            switch (typeOfWidget) {
                case "Popups":
                    console.log("THIS IS OF TYPE - Popups");
                    widgetDiv.style.visibility = 'hidden'
                    widgetDiv.className = "yel-popup-main-wrapper"

                    var base64_decoded = Autience.utils.decode(widget.rendered)

                    if (!base64_decoded || base64_decoded.length == 0) {
                        Autience.utils.sendEvent('client_template_empty')
                    }
                    var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
                    widgetDiv.innerHTML = inner_html
                    // widgetDiv.style.background = "url('" + window.yetience.path + "/common/images/opaque-bg.png') top left repeat"
                    widgetDiv.style.background="rgba(0, 0, 0, 0.5)";
                    document.body.appendChild(widgetDiv)
                    break;

                case "ActionButtons":
                    console.log("THIS IS OF TYPE - ActionButtons");
                    widgetDiv.className = "yel-ab-main-wrapper"


                    var base64_decoded = Autience.utils.decode(widget.rendered)
                    if (!base64_decoded || base64_decoded.length == 0) {
                        Autience.utils.sendEvent('client_template_empty')
                    }
                    var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
                    widgetDiv.innerHTML = inner_html
                    widgetDiv.className = "yel-ab-main-wrapper";
                    document.body.appendChild(widgetDiv)

                    //shift the elements to the right
                    if (document.getElementById("yel-main-box-wrapper")) {
                        document.getElementById("yel-main-box-wrapper").className = "yel-main-box-wrapper";
                    }

                    if (document.getElementById("yel-circle-wrapper")) {
                        document.getElementById("yel-circle-wrapper").className = "yel-circle-wrapper";
                    }

                    if (document.getElementById("yel-arrow-wrapper")) {
                        document.getElementById("yel-arrow-wrapper").className = "yel-arrow-wrapper";
                        console.log("DONE")

                    }

                    //hide the two boxes and show only the cta button
                    document.getElementById("yel-main-box-wrapper").style.display = "none"

                    document.getElementById("yel-arrow-wrapper").style.display = "none"
                    //show the arrow box after 5 secs
                    setTimeout(function() {
                        document.getElementById("yel-arrow-wrapper").style.display = "block"
                    }, 5000);

                    break;

                case "InpostWidgets":
                    //code
                    console.log("THIS IS OF TYPE - InpostWidgets");

                    var articles = document.getElementsByTagName("article");
                    var x = articles[0].querySelectorAll("p");

                    var numberOfElements = x.length;
                    var parentNode = x[0].parentNode;

                    // if (widget.components.inpostPosition.values.postStart) {
                    if (Autience.utils.nestedValue(widget, ['components', 'inpostPosition', 'values', 'postStart'])) {
                        parentNode.insertBefore(ElemToInsert(widget), x[0]);
                    }

                    // if (widget.components.inpostPosition.values.postCenter) {
                    if (Autience.utils.nestedValue(widget, ['components', 'inpostPosition', 'values', 'postCenter'])) {
                        console.log(numberOfElements)
                        console.log("center:" + (Math.round(numberOfElements / 2) - 1))
                        parentNode.insertBefore(ElemToInsert(widget), x[Math.round(numberOfElements / 2) - 1]);
                    }

                    // if (widget.components.inpostPosition.values.postEnd) {
                    if (Autience.utils.nestedValue(widget, ['components', 'inpostPosition', 'values', 'postEnd'])) {
                        parentNode.insertBefore(ElemToInsert(widget), x[numberOfElements]);
                    }

                    break;

                case "Sliders":
                    console.log("THIS IS OF TYPE - Sliders");
                    widgetDiv.className = "yel-slider-main-wrapper"

                    var base64_decoded = Autience.utils.decode(widget.rendered)
                    if (!base64_decoded || base64_decoded.length == 0) {
                        Autience.utils.sendEvent('client_template_empty')
                    }
                    var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
                    widgetDiv.innerHTML = inner_html
                    widgetDiv.className = "yel-slider-main-wrapper yel-slider-left";
                    document.body.appendChild(widgetDiv)

                    break;

                case "Bars":
                    console.log("THIS IS OF TYPE - Bars");
                    widgetDiv.className = "yel-bars-main-wrapper"

                    //THIS NEEDS TO BE WRITTEN BETTER HERE
                    // if (widget.components.barPosition.values.topscroll) {
                    if (Autience.utils.nestedValue(widget, ['components', 'barPosition', 'values', 'topscroll'])) {
                        widgetDiv.className = "yel-bars-main-wrapper yel-bar-template-render-top";

                        var bodyclass = document.createAttribute("class");
                        bodyclass.value = "body-move";
                        document.getElementsByTagName("body")[0].setAttributeNode(bodyclass);
                        console.log("added class yel-bar-template-render");


                    }
                    // else if (widget.components.barPosition.values.topfixed) {
                    else if (Autience.utils.nestedValue(widget, ['components', 'barPosition', 'values', 'topfixed'])) {
                        widgetDiv.className = "yel-bars-main-wrapper yel-bar-template-render-top";
                        console.log("added class yel-bar-template-render")
                    }
                    // else if (widget.components.barPosition.values.bottomscroll) {
                    else if (Autience.utils.nestedValue(widget, ['components', 'barPosition', 'values', 'bottomscroll'])) {
                        widgetDiv.className = "yel-bars-main-wrapper yel-bar-template-render-bottom";
                        console.log("added class yel-bar-template-render")
                    }
                    // else if (widget.components.barPosition.values.bottomfixed) {
                    else if (Autience.utils.nestedValue(widget, ['components', 'barPosition', 'values', 'bottomfixed'])) {
                        widgetDiv.className = "yel-bars-main-wrapper yel-bar-template-render-bottom";
                        console.log("added class yel-bar-template-render")
                    }

                    var base64_decoded = Autience.utils.decode(widget.rendered)
                    if (!base64_decoded || base64_decoded.length == 0) {
                        Autience.utils.sendEvent('client_template_empty')
                    }

                    var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
                    widgetDiv.innerHTML = inner_html
                    document.body.insertBefore(widgetDiv, document.body.firstChild);
                    break;

                case "Sidebar":
                    //code
                    console.log("THIS IS OF TYPE - Sidebar");
                    break;

                case "ContentGating":
                    //code
                    break;

                case "Mats":
                    var base64_decoded = Autience.utils.decode(widget.rendered)
                    if (!base64_decoded || base64_decoded.length == 0) {
                        Autience.utils.sendEvent('client_template_empty')
                    }
                    var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
                    widgetDiv.innerHTML = inner_html
                    widgetDiv.className = "yel-mat-main-wrapper yel-mat-onload";

                    var ydiv = document.createElement("div");
                    ydiv.id = "yel-wrap";
                    ydiv.className = "yel-wrap"
                    ydiv.appendChild(widgetDiv)
                    // Move the body's children into this wrapper
                    while (document.body.firstChild) {
                        ydiv.appendChild(document.body.firstChild);
                    }

                    // Append the wrapper to the body
                    document.body.appendChild(ydiv);

                    //check for scroll and hide the element after its outside viewport
                    yelTrackScroll(widgetDiv);

                    break;

                default:
                    console.log("WIDGET TYPE NOT DEFINED - DEFAULTING TO POPUPS")
                    //defaulting to popups
                    widgetDiv.style.visibility = 'hidden'
                    widgetDiv.className = "yel-popup-main-wrapper"

                    var base64_decoded = Autience.utils.decode(widget.rendered)

                    if (!base64_decoded || base64_decoded.length == 0) {
                        Autience.utils.sendEvent('client_template_empty')
                    }
                    var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
                    widgetDiv.innerHTML = inner_html
                    // widgetDiv.style.background = "url('" + window.yetience.path + "/common/images/opaque-bg.png') top left repeat"
                    widgetDiv.style.background="rgba(0, 0, 0, 0.5)";
                    document.body.appendChild(widgetDiv)
                    break;

            }





            //document.body.appendChild(widgetDiv)


        } else {
            //console.log('widget with code ' + widget.code + ' already exists')
        }

    })

    function yelTrackScroll(widget) {
        //get the height of the widget
        var widgetHeight = document.getElementById(widget.id).style.height;
        console.log("Height:" + widgetHeight)
    }

    function ElemToInsert(widget) {
        var widgetDiv = document.createElement('div')
        widgetDiv.className = "yel-inline-wrapper"
        widgetDiv.id = ""
        var base64_decoded = Autience.utils.decode(widget.rendered)
        if (!base64_decoded || base64_decoded.length == 0) {
            Autience.utils.sendEvent('client_template_empty')
        }
        var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
        widgetDiv.innerHTML = inner_html;
        widgetDiv.style.background="rgba(0, 0, 0, 0.5)";
        // widgetDiv.style.background = "url('" + window.yetience.path + "/common/images/opaque-bg.png') top left repeat"

        return widgetDiv;
    }

    // var giveMePopupBaby = function(widgetDiv) {
    //     console.log("THIS IS OF TYPE - Popups");
    //     widgetDiv.style.visibility = 'hidden'
    //     widgetDiv.className = "yel-popup-main-wrapper"

    //     var base64_decoded = Autience.utils.decode(widget.rendered)
    //     if (!base64_decoded || base64_decoded.length == 0) {
    //         Autience.utils.sendEvent('client_template_empty')
    //     }
    //     var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
    //     widgetDiv.innerHTML = inner_html
    //     widgetDiv.style.background = "url('" + window.yetience.path + "/common/images/opaque-bg.png') top left repeat"
    //     document.body.appendChild(widgetDiv)
    // }

    Autience.lifecycle.render.push(function(widget) {
        var styles_to_add = decodeURIComponent(Autience.utils.decode(widget.styles))

        //addStyle(styles_to_add)


        var head = document.head || document.getElementsByTagName('head')[0]
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = styles_to_add;
        } else {
            style.appendChild(document.createTextNode(styles_to_add));
        }

        head.appendChild(style);
    })

    if (yetience_callback) {
        yetience_callback()
    }
};
