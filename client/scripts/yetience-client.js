var Autience = null

window.defineAutience = function(autience_callback) {

    var cycle = null,
        lifecycle = null

    var lifecycles = ['displayValidation', 'onPageLoad', 'render', 'postRender', 'display', 'beforeClose', 'close', 'afterClose']

    if (Autience != null) {
        return
    }

    Autience = {
        lifecycle: {},
        utils: {},
        listeners: [],
        emitted: {},
        executors: {},
        lifecycle_executed: false
    }

    lifecycles.forEach(function(l) {

        Autience.lifecycle[l] = [function() {
            //console.log('in ' + l + ' lifecycle')
            return true
        }]
    })



    //simple functions with no dependencies
    Autience.executors.defineUtils = function() {

        //1. Ajax object - shifted to common

        //2b. autience utils sendEvent
        Autience.utils.sendEvent = function(event, data) {
            var now = Math.round(new Date().getTime() / 1000);
            // var ten_minutes = 10 * 60
            var six_hours = 6 * 60 * 60
            var created = Autience.utils.nestedValue(Autience, ['setup', 'first_widget_time']);
            var time_gap = now - created

            //logging client events only for 10 minutes after popup creation
            if (created && time_gap > 0 && time_gap < six_hours) {
                // console.log('fresh widget, sending event')
                if (Autience.setup && Autience.setup.id) {
                    window.yetience.sendEvent(event, Autience.setup.id, data)
                }
            }
        }

        //3a. emitAutienceEvent
        Autience.utils.emitAutienceEvent = function(eventName, forget) {
            eventName = "autience_" + eventName
                //only emit if this event was not already emitted
            if (!Autience.emitted[eventName]) {
                var event; // The custom event that will be created
                if (document.createEvent) {
                    event = document.createEvent("HTMLEvents");
                    event.initEvent(eventName, true, true);
                } else {
                    event = document.createEventObject();
                    event.eventType = eventName;
                }

                event.eventName = eventName;

                if (document.createEvent) {
                    document.dispatchEvent(event);
                } else {
                    document.fireEvent("on" + event.eventType, event);
                }
                if (eventName == 'autience_load' || eventName == 'autience_exit') {
                    //Autience.utils.sendEvent('client_' + eventName + '_triggered')
                }

                //console.log('emitting - '+eventName)
                if (!forget) {
                    //this event can happen only once on the page
                    Autience.emitted[eventName] = true
                }
            }
        }


        //3b. listenAutienceEvent
        Autience.utils.listenAutienceEvent = function(eventName, fn) {
            var autience_event = "autience_" + eventName
            Autience.utils.listen(document, autience_event, fn)
        }

        //3c. delayed Listener
        Autience.utils.delayedListenAutienceEvent = function(autience_event, delay, fn) {
            Autience.listenAutienceEvent(autience_event, function() {
                setTimeout(fn, delay)
            })
        }

        //4. getting document height
        Autience.utils.getDocHeight = function() {
            var D = document
            return Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
            )
        }

        //5. createCookies
        Autience.utils.createCookie = function(name, value, permanent) {
            var cookie = name + "=" + value + ";path=/"
            if (permanent) {

                var expiration_date = new Date();
                expiration_date.setFullYear(expiration_date.getFullYear() + 5);
                cookie = cookie + ";expires=" + expiration_date.toGMTString()
            }
            document.cookie = cookie
        }

        Autience.utils.readCookie = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }


        //6. bind function on all elements with the clas
        Autience.utils.executeOnClass = function(class_name, fn) {
            var els = document.getElementsByClassName(class_name)
            if (els) {
                for (var i = 0; i < els.length; i++) {
                    fn(els[i])
                }
            }
        }

        Autience.utils.executeOnId = function(id, fn) {
            var el = document.getElementById(id)
            if (el) {
                fn(el)
            }
        }

        Autience.utils.idListen = function(id, event, fn) {
            Autience.utils.executeOnId(id, function(el) {
                Autience.utils.listen(el, event, fn)
            })
        }


        //7. Listen on elements by class name
        Autience.utils.classListen = function(class_name, evt, fn) {
            Autience.utils.executeOnClass(class_name, function(el) {
                Autience.utils.listen(el, 'click', fn)
            })
        }

        //8. Execute array of functions without input
        Autience.utils.cycle = function(fn_array, widget) {

            if (fn_array) {
                for (var i = 0; i < fn_array.length; i++) {
                    fn_array[i](widget)
                }
            }
        }

        //9. Execute validators in sequence and return true if all are valid
        Autience.utils.checkCycle = function(fn_array, inp) {
            if (fn_array) {
                for (var i = 0; i < fn_array.length; i++) {
                    if (!fn_array[i](inp)) {
                        //console.log('in validateSequence ' + i + ' th function is returning false')
                        return false
                    }
                }
            }
            return true
        }

        //10. get a smart setting value
        Autience.utils.smartSetting = function(extension, key) {
            if (autience_settings && autience_settings.smart && autience_settings.smart[extension]) {
                return autience_settings.smart[extension][key]
            }
        }

        //11. close widget
        Autience.utils.closeWidget = function(widget) {
            Autience.utils.cycle(Autience.lifecycle.close, widget)
            Autience.utils.cycle(Autience.lifecycle.afterClose, widget)
            Autience.utils.sendEvent('popup_closed');
        }

        //12. base64 decoding
        Autience.utils.decode = function(s) {
            if (window.atob) {
                try {
                    var decoded = window.atob(s)
                    return decoded
                } catch (err) {
                    //console.log('Unable to to decode')
                    //console.log(s)
                    return alternateDecode(s)
                }

            }

            function alternateDecode(s) {
                if (!s || s.length == 0) {
                    return ''
                }
                var e = {},
                    i, b = 0,
                    c, x, l = 0,
                    a, r = '',
                    w = String.fromCharCode,
                    L = s.length;
                var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                for (i = 0; i < 64; i++) {
                    e[A.charAt(i)] = i;
                }
                for (x = 0; x < L; x++) {
                    c = e[s.charAt(x)];
                    b = (b << 6) + c;
                    l += 6;
                    while (l >= 8) {
                        ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
                    }
                }
                return r;
            }

        }

        Autience.utils.nestedValue = function(obj, fields) {

            var nested = obj
            for (var i = 0; i < fields.length; i++) {
                nested = nested[fields[i]]

                if (typeof nested == 'undefined') {

                    return null
                }
            }

            return nested
        }

        Autience.utils.stripAndExecuteScript = function(text) {
            var scripts = '';
            var cleaned = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function() {
                scripts += arguments[1] + '\n';
                return '';
            });

            if (window.execScript) {
                window.execScript(scripts);
            } else {
                var head = document.getElementsByTagName('head')[0];
                var scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.innerText = scripts;
                head.appendChild(scriptElement);
                head.removeChild(scriptElement);
            }
            return cleaned;
        }

        Autience.utils.emitLinkClick = function(url, target, evt) {
            Autience.current_link = url
            Autience.current_target = target

            var host = window.location.host
            var host_without_www = host.replace('www.', '')
            var host_with_www = 'www.' + host

            if (url.indexOf(host) >= 0 || url.indexOf(host_with_www) >= 0 || url.indexOf(host_without_www) >= 0) {
                emitAndDisableRedirect('internal')
            } else {
                emitAndDisableRedirect('external')
            }

            emitAndDisableRedirect('any')

            function emitAndDisableRedirect(type) {
                Autience.utils.emitAutienceEvent('link_' + type, true)
                if (Autience['disable_link_' + type]) {
                    evt.preventDefault()
                }
            }
        }

        Autience.utils.redirect = function(url, target) {
            if (!target) {
                window.location = url
            } else {
                window.open(url, target);
            }
        }

        Autience.utils.isDefined = function(a) {
            return (typeof a != 'undefined')
        }

        Autience.utils.isMobile = function() {
            if (/Mobi/.test(navigator.userAgent)) {
                return true
            }
            return false
        }

        Autience.utils.randomString = function() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        Autience.utils.hasFeature = function(feature) {
            //adding return true in the beginning so that we have all features active/
            return true;

            if (Autience.setup && Autience.setup.package_id != 'default') {
                return true
            }

            //All features if premiumSubscription is present
            if (Autience.utils.nestedValue(Autience, ['setup', 'extensions', 'premiumSubscription'])) {
                return true
            }

            if (Autience.utils.nestedValue(Autience, ['setup', 'extensions', feature])) {
                return true
            }

            return false
        }
    }


    //define Listeners for the common events
    Autience.executors.defineListeners = function() {
        //console.log('defining autience listeners')
        Autience.listeners = [{
            target: document,
            trigger: 'scroll',
            reaction: function() {
                var ratio = (window.innerHeight + window.scrollY) / (Autience.utils.getDocHeight());
                var percentage = 25 * Math.floor(ratio * 4.1) //percentage is in multiples of 25
                    //console.log('percentage- ' + percentage)
                Autience.utils.emitAutienceEvent('scroll_' + percentage)
            },
            target_name: 'document'
        }, {
            target: document.body,
            trigger: 'mouseout',
            reaction: function(e) {
                e = e ? e : window.event;
                var from = e.relatedTarget || e.toElement;
                if ((!from || from.nodeName == "HTML") && (!e.clientY || (e.clientY <= 0))) {
                    // console.log('exit is triggered')

                    Autience.utils.emitAutienceEvent('exit')
                }
            },
            target_name: 'body'
        }, {
            target: document.getElementsByTagName('a'),
            trigger: 'click',
            reaction: function(evt_obj, evt_name, el) {
                Autience.utils.emitLinkClick(el.href, el.getAttribute('target'), evt_obj)
            },
            target_name: 'links'
        }, {
            target: window,
            trigger: 'hashchange',
            reaction: function(evt_obj, evt_name, el) {
                //alert('in hashchange '+ window.location.hash )
                if (Autience.hash_set) {
                    //emit this event only after a hash has been set in the current cycle
                    Autience.utils.emitAutienceEvent('back')
                }

            },
            target_name: 'window'
        }, {
            target: window,
            trigger: 'popstate',
            reaction: function(evt_obj, evt_name, el) {
                Autience.utils.emitAutienceEvent('back')
            },
            target_name: 'window'
        }]
    }



    Autience.executors.bindListeners = function() {
        //iterate through all the listeners and bind them
        //console.log('binding autience listeners')
        var listener = null,
            triggers = null

        Autience.listeners.forEach(function(listener) {

            //if trigger is a string, put the single string in an array
            if (typeof listener.trigger === 'string') {
                triggers = [listener.trigger]
            } else {
                triggers = listener.trigger
            }

            triggers.forEach(function(trigger) {
                if (listener.target.length) {

                    //targets are an array of elements
                    for (var i in listener.target) {

                        Autience.utils.listen(listener.target[i], trigger, listener.reaction)
                    }
                } else {

                    //target is a single element
                    Autience.utils.listen(listener.target, trigger, listener.reaction, listener.target_name)
                }
            })
        })
    }

    Autience.executors.displayWidget = function() {
        Autience.utils.cycle(Autience.lifecycle.display)
    }

    Autience.executors.runWidgetCycle = function(widget) {

        var cycle = Autience.utils.cycle

        if (Autience.utils.checkCycle(lifecycle.displayValidation, widget)) {
            cycle(lifecycle.onPageLoad, widget)

            cycle(lifecycle.render, widget)

            cycle(lifecycle.postRender, widget)
        }
    }

    Autience.executors.runLifecycles = function() {
        //console.log('Starting widget lifecycle')
        if (Autience.lifecycle_executed) {
            //ensure that this function is run only once
            return
        }
        if (window.autience_setup) {
            Autience.lifecycle_executed = true
                //decode and convert setup to json
            Autience.setup = JSON.parse(decodeURIComponent(Autience.utils.decode(autience_setup)))
                // console.log(Autience.setup)
            console.log('yeloni client is loaded with ' + Autience.setup.widgets.length + ' widgets ')
                //Autience.utils.sendEvent('client_script_loaded')

            Autience.setup.widgets.forEach(function(widget) {
                Autience.executors.runWidgetCycle(widget)
            })
        } else {
            //console.log('window.autience_setup is not defined')
        }
    }

    //execute defineUtils and defineListeners
    //Everything else happens when some event occurs


    lifecycle = Autience.lifecycle


    function assignAutienceListen(callback) {
        //console.log('inside assignAutienceListen')
        if (window.autience_listen) {
            ////console.log('Autience.utils.listen is assigned')
            Autience.utils.listen = window.autience_listen
            if (callback) {
                callback()
            }
        } else {
            setTimeout(function() {
                assignAutienceListen(callback)
            }, 500)
        }
    }

    assignAutienceListen(function() {
        //console.log('in callback of assignAutienceListen')
        Autience.executors.defineUtils()
        Autience.executors.defineListeners()
        Autience.executors.bindListeners()
        if (autience_callback) {
            autience_callback()
        }
    })

};
