window.defineAutienceWhere = function(yetience_callback) {

    Autience.lifecycle.displayValidation.push(function(widget) {
        //return true = show, false = hide
        var showAdmin = widget.configuration.showAdmin

        if (showAdmin != null) { //by default it's not defined
            if (!showAdmin) { //if it is set to false - don't show to logged in users
                if (is_logged_in) {
                    // console.log('dont show popup to admin - logged in as admin')
                    return false
                } else {
                    // console.log('dont show popup to admin - not logged in')
                    return true
                }
            }
        }
        return true

    })

    Autience.lifecycle.displayValidation.push(function(widget) {
        var isMobile = Autience.utils.isMobile()

        if (isMobile && !Autience.utils.hasFeature('mobileScreens')) {
            console.log('Popup is not shown on mobile in lite version')
            return false
        }
        if (isMobile && Autience.utils.hasFeature('mobileScreens')) {
            if (Autience.utils.nestedValue(widget, ['configuration', 'when', 'smallEnabled'])) {
                console.log('enabled on small screen')
                return true
            } else {
                console.log('disabled on small screens')
                return false
            }
        }
        // console.log('default')
        return true
    })


    Autience.lifecycle.displayValidation.push(function(widget) {
        var where = widget.configuration.where
        var cat = null
        var where_categories = widget.configuration.where_categories
        var where_titles = widget.configuration.where_titles



        if (autience_is_home) {
            return where.home
        }

        if (window.autience_page_name == 'checkout') {
            return where.checkout
        }

        switch (where.other) {
            case 'all':
                return true
            case 'none':
                return false
            case 'specific':
                switch (where.specific.selector) {
                    case 'pageType':
                        switch (window.autience_post_type) {
                            case 'post':
                                return where.pageTypes.posts
                            case 'product':
                                return where.pageTypes.products
                            case 'page':
                                return where.pageTypes.pages
                        }
                        break;
                    case 'category':

                        for (var i = 0; i < window.autience_categories.length; i++) {
                            cat = autience_categories[i].cat_ID
                            if (where_categories.indexOf(cat) >= 0 || where_categories.indexOf(cat.toString()) >= 0) {

                                return true
                            }
                        }

                        console.log('returning false')
                        return false
                        break;
                    case 'title':

                        var index = where_titles.indexOf(window.autience_post_id)

                        console.log('title at ' + index)
                        return (index >= 0)
                        break;
                }

        }

        return true
    })

    //for hide on specific pages
    Autience.lifecycle.displayValidation.push(function(widget) {
        var where = widget.configuration.where
        var cat = null
        var where_categories_hide = widget.configuration.where_categories_hide
        var where_titles_hide = widget.configuration.where_titles_hide

        console.log('widget is')
        console.log(widget)
        
        if (where.hideOn && where.hideOn.hideselector){
                    switch (where.hideOn.hideselector) {
                        case 'pageType':
                            switch (window.autience_post_type) {
                                case 'post':
                                    return !(where.pageTypes.posts)
                                case 'product':
                                    return !(where.pageTypes.products)
                                case 'page':
                                    return !(where.pageTypes.pages)
                            }
                            break;
                        case 'category':
        
                            for (var i = 0; i < window.autience_categories.length; i++) {
                                cat = autience_categories[i].cat_ID
                                if (where_categories_hide.indexOf(cat) >= 0 || where_categories_hide.indexOf(cat.toString()) >= 0) {
        
                                    return false
                                }
                            }
                            return true
                            break;
                        case 'title':
        
                            var index = where_titles_hide.indexOf(window.autience_post_id)
        
                            // console.log('title at ' + index)
                            //return true - show
                            return (index < 0)

                            break;
                    }
        
        
        
                return false
            } else{
                return true
            }
    })




    if (yetience_callback) {
        yetience_callback()
    }
};
