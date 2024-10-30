window.defineAutienceBack = function(yetience_callback) {
    /*
    Autience.lifecycle.render.push(function(widget) {
        // console.log('inside back button code')
        // console.log(widget.trigger)
        //console.log('checking for  trigger for back button')


        if (((Autience.utils.nestedValue(widget, ['trigger', 'trigger'])) == 'back') && !window.location.hash) {
            //console.log('inserting  trigger for back button')
            var history_length = window.history.length
                //console.log('history length before - ' + history_length)

            setTimeout(function() {
                //console.log('setting hash using window.location.hash')
                window.location.hash = Autience.utils.randomString(); //

                setTimeout(function() {
                    Autience.hash_set = true
                }, 1000)

                setTimeout(function() {
                    //console.log('history length after setting hash using window.location.hash ' + window.history.length)
                    //if history length is still the same that means popup on back button wont work
                    if (history_length == window.history.length) {
                        //console.log('changing hash by changing location')
                        var new_location = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + Autience.utils.randomString()
                        window.location = new_location

                        setTimeout(function() {
                            //console.log('history length after setting hash using window.location ' + window.history.length)
                            if (history_length == window.history.length) {
                                if (window.history.pushState) {
                                    new_location = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + Autience.utils.randomString()
                                        //console.log('inserting using window.history.pushState')
                                    window.history.pushState(null, null, new_location)
                                    setTimeout(function() {
                                        //console.log('history length after pushState- '+window.history.length)
                                    }, 1000)
                                }

                            }
                        }, 1000)
                    }
                }, 1000)
            }, 1000)


        } else {
            //console.log('no need to insert trigger for back button')
            //console.log('hash at this point of time- ' + window.location.hash)
            if (!window.location.hash) {
                console.log('hash is not defined')
            }
        }

    })
    */

    Autience.lifecycle.render.push(function(widget) {
        if ((Autience.utils.nestedValue(widget, ['trigger', 'trigger'])) == 'back') {
            //Add an extra state in the browser with the same url as current one
            if (window.history && window.history.pushState) {
                history.pushState({
                    foo: "bar"
                }, "page 2", window.location.pathname);
            } else {
                console.log('window.history is not defined on this browser')
            }

        }
    })

    if (yetience_callback) {
        yetience_callback()
    }
}
