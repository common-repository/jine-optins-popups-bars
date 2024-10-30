window.defineAutienceRedirect = function(yetience_callback) {
    Autience.lifecycle.postRender.push(function(widget) {

        var component_array = []

        for (var tag in widget.components) {
            component_array.push({
                tag: tag,
                component: widget.components[tag]
            })
        }

        component_array.forEach(function(item) {
            Autience.utils.executeOnClass('autience-redirect-' + item.tag, function(el) {
                console.log('found redirect button ' + item.tag)

                Autience.utils.listen(el, 'click', function() {
                    //console.log('redirect button clicked')
                    //console.log(item.component)
                    var operation = item.component.values.operation
                    var url = null
                    switch (operation) {
                        case 'redirect':
                            url = item.component.values.redirectTo
                            break
                        case 'redirectClicked':
                            url = Autience.current_link
                            break
                    }

                    console.log('redirect to ' + url)
                    switch (item.component.values.redirectOn) {
                        case 'same':

                            Autience.utils.redirect(url)
                            break

                        case 'new':

                            Autience.utils.redirect(url, '_blank')
                            break
                    }

                    Autience.utils.closeWidget(widget)
                })
            })
        })

    })

    if (yetience_callback) {
        yetience_callback()
    }


};