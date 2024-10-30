angular.module('yetienceApp')
    .service('Component', ['$rootScope', function($rootScope) {
        var css_update = {

        }
        var updater = {
            innerText: function(el, value) {

                el.html(value)
            },
            initialization: function(el, value, values, tag, widget) {
                widget.initialization[tag] = '<!-- Initialization for Autience ' + widget.theme + ' -->' + value
            },
            innerHtml: function(el, value, values, tag, widget) {
                el.html(value)
                    //mark that widget has some custom_html
                widget.custom_html = true
            },
            textSize: function(el, value) {
                el.css('font-size', value)
                el.css('line-height', value + 4 + 'px')
            },
            bold: function(el, value) {
                if (value == true) {
                    el.css('font-weight', 'bold')
                }

                if (value == false) {
                    el.css('font-weight', "")
                }
            },
            italic: function(el, value) {
                if (value == true) {
                    el.css('font-style', 'italic')
                }
                if (value == false) {
                    el.css('font-style', "")
                }
            },
            hide: function(el, value) {
                if (value == true) {
                    el.children().css('visibility', 'hidden')
                } else {
                    el.children().css('visibility', '')
                }
            },
            image: function(el, value) {
                el.attr('src', value)
            },
            font: function(el, value) {
                if (!value || value == 'Default' || value == '') {
                    el.css('font-family', '')
                } else {
                    el.css('font-family', value)
                }
            },

            backgroundColor: function(el, value) {
                if (!value || value.length == 0) {
                    el.css('background-color', '')
                } else {
                    el.css('background-color', value)
                }
            },
            color: function(el, value) {
                if (!value || value.length == 0) {
                    el.css('color', '')
                } else {
                    el.css('color', value)
                }
            },
            backgroundImage: function(el, value, values) {

                if (values.showImage && value && value.length > 0) {
                    el.css('background-image', 'url("' + value + '")')

                } else {
                    el.css('background-image', '')
                }
            },
            opacity: function(el, value) {
                el.css('opacity', value)
            },
            displayImage: function(el, value) {
                el.find('img')[0].src = value
            },
            redirectTo: function(el, value) {
                el.attr('href', value)
            },
            redirectOn: function(el, value) {
                if (value == 'same') {
                    el.attr('target', '_self')
                } else {
                    el.attr('target', '_blank')
                }
            },
            height: function(el, value) {

                return el.css('height', value + 'px')
            },
            width: function(el, value) {

                return el.css('width', value + 'px')
            },
            operation: function(el, value, values, tag, widget) {
                //this is for buttons
                if (value == 'close') {
                    el.addClass('autience-close-' + widget.code)
                    el.removeClass('autience-redirect-' + tag)
                }
                else if (value == 'chat') {
                    el.addClass('autience-open-chat');
                }
                else {
                    el.addClass('autience-redirect-' + tag)
                    el.removeClass('autience-close-' + widget.code)
                }
            },
            styles: function(el, value) {
                el.html(value)
            }
        }

        var getter = {
            innerText: function(el) {
                return el.html().trim()
            },
            innerHtml: function(el) {
                return el.html()
            },
            bold: function(el) {
                return (el.css('font-weight') == 'bold')
            },
            italic: function(el) {
                return (el.css('font-style') == 'italic')
            },
            image: function(el) {
                return el.attr('src')
            },
            showImage: function(el) {

                return (el.css('background-image') && el.css('background-image').length > 0 && el.css('background-image') != 'none')
            },
            opacity: function(el) {
                return parseFloat(el.css('opacity'))
            },
            displayImage: function(el) {
                //display image for a linked image
                var images = el.find("img");

                if (images.length == 1) {
                    return images[0].src
                }
            },
            redirectTo: function(el) {
                return el.attr('href')
            },
            redirectOn: function(el) {
                return (el.attr('target') == '_blank') ? 'new' : 'same'
            },
            height: function(el) {
                return parseInt(el.prop('offsetHeight'))
            },
            width: function(el) {
                return parseInt(el.prop('offsetWidth'))
            },

            backgroundColor: function(el) {
                var current_color = el.css('background-color')
                return current_color
            },
            color: function(el) {
                return rgb2hex(el.css('color'))
            },
            font: function(el) {
                return el.css('font-family')
            },
            textSize: function(el) {
                var font_size_px = el.css('font-size')
                var font_size = null
                if (font_size_px) {
                    font_size = parseInt(font_size_px.replace('px', ''))
                }
                return font_size
            },
            styles: function(el, value) {
                return el.html()
            }
        }

        for (var key in css_update) {
            updater[key] = cssUpdater(css_update[key])
            getter[key] = cssGetter(css_update[key])
        }

        function cssUpdater(css_key) {
            return function(el, value) {
                if (value) {
                    el.css(css_key, value)
                } else {
                    el.css(css_key, null)
                }
            }
        }

        function cssGetter(css_key) {
            return function(el) {
                return el.css(css_key)
            }
        }


        this.update = function(element, values, tag, widget) {


            for (var key in values) {
                if (updater[key]) {
                    updater[key](element, values[key], values, tag, widget)
                }

            }
        }

        this.estimate = function(element, values, fields) {
            //get initial values of component attributes from css
            if(!fields){
                console.log('fields not defined ')
                console.log(values)
                return
            }
            fields.forEach(function(f) {
                if (!values.hasOwnProperty(f.key) && getter[f.key]) {
                    values[f.key] = getter[f.key](element)
                }

            })
        }

        function rgb2hex(orig) {
            var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
        }
    }])