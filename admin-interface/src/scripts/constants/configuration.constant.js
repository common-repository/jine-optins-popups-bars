angular.module('yetienceApp')
    .constant('configurationFields', {
        what: [{
            type: "input",
            key: "what.name",
            templateOptions: {
                placeholder: "Eg: Christmas Sales Popup. 3 characters minimum",
                label: "Give Your Widget a Name",
                minlength: 3
            }
        }, {
            type: "checkbox",
            key: "what.enable",
            defaultValue: true,
            templateOptions: {
                label: "Enable this popup ( you can also enable it later )"
            }
        }, {
            className: "section-label",
            template: "<hr /><div><strong>  </strong></div>",
            hideExpression: "model.what.existing_domain"
        }, {
            key: "what.domain",
            type: "input",
            hideExpression: "model.what.existing_domain",
            templateOptions: {
                label: "Enter your primary domain ",
                placeholder: "http://www.yourwebsite.com",
                description: "Your widget will work only on this domain",
                required: true
            }

        }, {
            className: "section-label",
            template: "<hr /><div><strong>  </strong></div>",
            hideExpression: "model.what.existing_domain"
        }, {
            key: 'what.hasStaging',
            type: "checkbox",
            hideExpression: "model.what.existing_domain",
            templateOptions: {
                label: "I am using a staging / test server",
            }

        }, {
            key: "what.staging",
            type: "input",
            hideExpression: "!model.what.hasStaging",
            templateOptions: {
                label: "Enter your staging domain"

            }
        }, {
            className: "section-label",
            template: "<hr /><div><strong>  </strong></div>",
            hideExpression: "model.what.existing_domain"
        }, {
            key: "what.register",
            type: "checkbox",
            hideExpression: "model.what.existing_account",
            templateOptions: {
                label: "Create a free Yeloni account to save my settings"
            }
        }],
        when: [{
            type: "radio",
            key: "when.large",
            templateOptions: {
                label: "Select a trigger to show the popup",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "When the mouse moves towards the top of the browser, near the close button (only for desktops)",
                    id: "exit"
                }, {
                    show: "Show on Page Load",
                    id: "load"
                }, {
                    show: "Show after a time delay",
                    id: "delay"
                }, {
                    show: "Show when visitor scrolls down",
                    id: "scroll"
                }, {
                    show: "Show when visitor clicks a link",
                    id: "link"
                }, {
                    show: "Show when visitor clicks Back button of the Browser",
                    id: "back"
                }]
            }
        }, {
            type: "radio",
            key: "when.scroll.large",
            hideExpression: "(model.when.large != 'scroll')",
            defaultValue: 25,
            templateOptions: {
                label: "How far should the visitor scroll before triggering the popup",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "25% of the content",
                    id: 25
                }, {
                    show: "50% of the content",
                    id: 50
                }, {
                    show: "Bottom of the Page",
                    id: 100
                }]
            }
        }, {
            type: "input",
            key: "when.delay.large",
            hideExpression: "(model.when.large != 'delay')",
            "defaultValue": 5,
            templateOptions: {
                label: "After how many seconds should the popup show up?",
                type: "number",
                "placeholder": "Enter delay"
            }
        }, {
            type: "radio",
            key: "when.link.large",
            hideExpression: "(model.when.large != 'link')",
            defaultValue: "any",
            templateOptions: {
                label: "What kind of link should trigger the popup?",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "Any kind of link",
                    id: "any"
                }, {
                    show: "Links to pages within your website",
                    id: "internal"
                }, {
                    show: "Links to pages outside your website",
                    id: "external"
                }]
            }
        }, {
            className: "section-label",
            hideExpression: "(model.when.mode != 'advanced' || model.advancedConfiguration != true && model.mobileScreens != true)",
            template: "<hr />"
        }, {
            type: "checkbox",
            key: "when.link.close",
            hideExpression: "(model.when.large != 'link' )",
            defaultValue: true,
            templateOptions: {
                label: "Redirect to the clicked link when the user closes the Popup"
            }
        }, {
            className: "section-label",

            template: "<hr /><div><strong>Display on Mobiles & Tablets (Premium)</strong></div>"
        }, {
            type: "checkbox",
            key: "when.smallEnabled",
            defaultValue: false,
            templateOptions: {
                label: "Show popup on mobile and tablet screens"
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.mobileScreens != true)"
            }
        }, {
            type: "checkbox",
            key: "when.smallDifferent",
            defaultValue: false,
            templateOptions: {
                label: "Use a different trigger for small screens (tablet, mobile)"
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.mobileScreens != true)"
            }
        }, {
            type: "radio",
            key: "when.small",
            hideExpression: "(model.when.smallDifferent != true)",
            templateOptions: {
                label: "Select a trigger for small screens (tablet, mobile)",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "Show on page load",
                    id: "load"
                }, {
                    show: "Show after a time delay",
                    id: "delay"
                }, {
                    show: "Show when visitor scrolls down",
                    id: "scroll"
                }, {
                    show: "Show when visitor clicks a link",
                    id: "link"
                }, {
                    show: "Show when visitor clicks 'Back' button of the browser",
                    id: "back"
                }]
            }
        }, {
            type: "input",
            key: "when.delay.small",
            hideExpression: "(model.when.small != 'delay')",
            templateOptions: {
                label: "After how many seconds should the popup show up?",
                type: "number",
                "placeholder": "Enter a positive value"

            }
        }, {
            type: "radio",
            key: "when.scroll.small",
            hideExpression: "(model.when.small != 'scroll')",
            defaultValue: 25,
            templateOptions: {
                label: "How far should the visitor scroll before triggering the popup",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "25% of the page",
                    id: 25
                }, {
                    show: "50% of the page",
                    id: 50
                }, {
                    show: "Bottom of the page",
                    id: 100
                }]
            }
        }, {
            type: "radio",
            key: "when.link.small",
            hideExpression: "(model.when.small != 'link')",
            templateOptions: {
                label: "What kind of link should trigger the popup?",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "Any link",
                    id: "any"
                }, {
                    show: "Links to internal pages (within your website)",
                    id: "internal"
                }, {
                    show: "Links to external pages (other websites)",
                    id: "external"
                }]
            }
        }],
        where: [{
            className: "section-label",
            template: "<div><strong>On which pages should the popup show up?</strong></div>"
        }, {
            key: "where.home",
            type: "checkbox",
            templateOptions: {
                label: "Show on Home Page"
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.specificPages != true)"
            },
            defaultValue: false
        }, {
            key: "where.checkout",
            type: "checkbox",
            templateOptions: {
                label: "Show on Product Checkout Page (to avoid cart abandonment)"
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.specificPages != true)"
            }
        }, {
            className: "section-label",
            template: "<hr /><div><strong>  </strong></div>"
        }, {
            type: "radio",
            key: "where.showOrHide",
            templateOptions: {
                label: "Display Settings",
                labelProp: "display",
                valueProp: "value",
                options: [{
                    display: "Show On these pages ",
                    value: "show"
                }, {
                    display: "Hide On these pages ",
                    value: "hide"
                }]
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.specificPages != true)"
            }
        }, {
            type: "radio",
            key: "where.other",
            hideExpression: "(model.where.showOrHide != 'show')",
            defaultValue: "all",
            templateOptions: {
                label: "Which other pages do you want to show the popup on?",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "All other pages",
                    id: "all"
                }, {
                    show: "No other pages",
                    id: "none"
                }, {
                    show: "A specific set of pages",
                    id: "specific"
                }]
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.specificPages != true)"
            }
        }, {
            className: "section-label",
            template: "<hr /><div><strong>  </strong></div>"
        }, {
            type: "radio",
            key: "where.specific.selector",
            hideExpression: "(model.where.other != 'specific' || model.where.showOrHide != 'show')",
            templateOptions: {
                label: "How would you like to select the set of pages?",
                defaultValue: "pageType",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "by Page Type",
                    id: "pageType"
                }, {
                    show: "by Category",
                    id: "category"
                }, {
                    show: "by Page title",
                    id: "title"
                }]
            }
        }, {
            key: "where_titles",
            type: "multiCheckbox",
            hideExpression: "(model.where.showOrHide != 'show' || model.where.other != 'specific' || model.where.specific.selector != 'title')",
            templateOptions: {
                label: "Select Pages where popup is to be shown",
                options: [],
                valueProp: 'ID',
                labelProp: 'post_title'
            }
        }, {
            key: "where_categories",
            type: "multiCheckbox",
            hideExpression: "(model.where.showOrHide != 'show' || model.where.other != 'specific' || model.where.specific.selector != 'category')",
            templateOptions: {
                label: "Select Categories where popup is to be shown",
                options: [],
                valueProp: 'cat_ID',
                labelProp: 'name'
            }
        }, {
            className: "section-label",
            hideExpression: "(model.where.showOrHide != 'show' || model.where.other != 'specific' || model.where.specific.selector != 'pageType')",
            template: "<div><strong>Show on these types </strong></div>"
        }, {
            key: "where.pageTypes.pages",
            type: "checkbox",
            hideExpression: "(model.where.showOrHide != 'show' || model.where.other != 'specific' || model.where.specific.selector != 'pageType')",
            templateOptions: {
                label: "Pages"
            }
        }, {
            key: "where.pageTypes.posts",
            type: "checkbox",
            hideExpression: "(model.where.showOrHide != 'show' || model.where.other != 'specific' || model.where.specific.selector != 'pageType')",
            templateOptions: {
                label: "Posts"
            }
        }, {
            key: "where.pageTypes.products",
            type: "checkbox",
            hideExpression: "(model.where.showOrHide != 'show' || model.where.other != 'specific' || model.where.specific.selector != 'pageType')",
            templateOptions: {
                label: "Products"
            }
        }, {
            type: "radio",
            key: "where.hideOn.hideselector",
            hideExpression: "(model.where.showOrHide != 'hide')",
            templateOptions: {
                label: "How would you like to select the set of pages to hide the Popup?",
                defaultValue: "pageType",
                labelProp: "show",
                valueProp: "id",
                options: [{
                    show: "by Page Type",
                    id: "pageType"
                }, {
                    show: "by Category",
                    id: "category"
                }, {
                    show: "by Page title",
                    id: "title"
                }]
            }
        }, {
            key: "where_titles_hide",
            type: "multiCheckbox",
            hideExpression: "(model.where.showOrHide != 'hide' || model.where.hideOn.hideselector != 'title')",
            templateOptions: {
                label: "Select Pages where popup is to be hidden",
                options: [],
                valueProp: 'ID',
                labelProp: 'post_title'
            }
        }, {
            key: "where_categories_hide",
            type: "multiCheckbox",
            hideExpression: "(model.where.showOrHide != 'hide' || model.where.hideOn.hideselector != 'category')",
            templateOptions: {
                label: "Select Categories where popup is to be hidden",
                options: [],
                valueProp: 'cat_ID',
                labelProp: 'name'
            }
        }, {
            className: "section-label",
            hideExpression: "(model.where.showOrHide != 'hide' || model.where.hideOn.hideselector != 'pageType')",
            template: "<div><strong>Hide on these types </strong></div>"
        }, {
            key: "where.pageTypes.pages",
            type: "checkbox",
            hideExpression: "(model.where.showOrHide != 'hide' || model.where.hideOn.hideselector != 'pageType')",
            templateOptions: {
                label: "Pages"
            }
        }, {
            key: "where.pageTypes.posts",
            type: "checkbox",
            hideExpression: "(model.where.showOrHide != 'hide' || model.where.hideOn.hideselector != 'pageType')",
            templateOptions: {
                label: "Posts"
            }
        }, {
            key: "where.pageTypes.products",
            type: "checkbox",
            hideExpression: "(model.where.showOrHide != 'hide' || model.where.hideOn.hideselector != 'pageType')",
            templateOptions: {
                label: "Products"
            }
        }],
        whom: [{
            type: "radio",
            key: "whom.once",
            defaultValue: "always",
            templateOptions: {
                labelProp: "title",
                valueProp: "value",
                options: [{
                    title: "Show only once per Visitor",
                    value: "visitor"
                }, {
                    title: "Show only once per Session",
                    value: "session"
                }, {
                    title: "Show whenever triggered",
                    value: "always"
                }]
            }

        }, {
            className: "section-label",

            template: "<hr /><div><strong>Display widgets based on action (Premium)</strong></div>"
        }, {
            key: "whom.cta",
            type: "checkbox",
            templateOptions: {
                label: "Hide after visitor takes the required action. eg: email signup (Premium)"
            },
            expressionProperties: {
                'templateOptions.disabled': "(model.advancedConfiguration != true && model.hideAfterCta != true)"
            }
        }],
        how: [{
            type: "radio",
            key: "how.mode",
            defaultValue: "default",
            templateOptions: {
                label: "How should the popup be shown?",
                labelProp: "title",
                valueProp: "value",
                options: [{
                    title: "Default Setting",
                    value: "default"
                }, {
                    title: "Advanced Setting (Premium Feature)",
                    value: "advanced",
                    readOnly: true
                }]
            }

        }, {
            type: "select",
            key: "how.animation",
            hideExpression: "(model.how.mode != 'advanced' || model.advancedConfiguration != true)",
            templateOptions: {
                label: "Select Animation Style for popup (coming soon)",
                "multiple": false,
                labelProp: "type",
                valueProp: "type",
                options: [{
                    type: "bounce",

                }, {
                    type: "flash"
                }, {
                    type: "Pulse"
                }, {
                    type: "Rubber Band"
                }, {
                    type: "Shake"
                }, {
                    type: "swing"
                }, {
                    type: "Tada"
                }, {
                    type: "Wobble"
                }, {
                    type: "Jello"
                }, {
                    type: "Bounce In"
                }, {
                    type: "Bounce In Down"
                }, {
                    type: "bounceInRight"
                }, {
                    type: "bounceInUp"
                }, {
                    type: "bounceOut"
                }, {
                    type: "bounceOutDown"
                }, {
                    type: "bounceOutLeft"
                }, {
                    type: "bounceOutRight"
                }, {
                    type: "bounceOutUp"
                }, {
                    type: "fadeIn"
                }, {
                    type: "fadeInDown"
                }, {
                    type: "fadeInDownBig"
                }, {
                    type: "fadeInLeft"
                }, {
                    type: "fadeInLeftBig"
                }, {
                    type: "fadeInRight"
                }, {
                    type: "fadeInRightBig"
                }, {
                    type: "fadeInUpBig"
                }, {
                    type: "fadeOut"
                }, {
                    type: "fadeOutDown"
                }, {
                    type: "fadeOutDownBig"
                }, {
                    type: "fadeOutLeft"
                }, {
                    type: "fadeOutLeftBig"
                }, {
                    type: "fadeOutRight"
                }, {
                    type: "fadeOutRightBig"
                }, {
                    type: "fadeOutUp"
                }, {
                    type: "fadeOutUpBig"
                }, {
                    type: "flip"
                }, {
                    type: "flipInX"
                }, {
                    type: "flipInY"
                }, {
                    type: "flipOutX"
                }, {
                    type: "flipOutY"
                }, {
                    type: "lightSpeedIn"
                }, {
                    type: "lightSpeedOut"
                }, {
                    type: "rotateIn"
                }, {
                    type: "rotateInDownLeft"
                }, {
                    type: "rotateInDownRight"
                }, {
                    type: "rotateInUpLeft"
                }, {
                    type: "rotateInUpRight"
                }, {
                    type: "rotateOut"
                }, {
                    type: "rotateOutDownLeft"
                }, {
                    type: "rotateOutDownRight"
                }, {
                    type: "rotateOutUpLeft"
                }, {
                    type: "rotateOutUpRight"
                }, {
                    type: "slideInUp"
                }, {
                    type: "slideInDown"
                }, {
                    type: "slideInLeft"
                }, {
                    type: "slideInRight"
                }, {
                    type: "slideOutUp"
                }, {
                    type: "slideOutDown"
                }, {
                    type: "slideOutLeft"
                }, {
                    type: "slideOutRight"
                }, {
                    type: "zoomIn"
                }, {
                    type: "zoomInDown"
                }, {
                    type: "zoomInLeft"
                }, {
                    type: "zoomInRight"
                }, {
                    type: "zoomInUp"
                }, {
                    type: "zoomOut"
                }, {
                    type: "zoomOutDown"
                }, {
                    type: "slideOutUp"
                }, {
                    type: "zoomOutLeft"
                }, {
                    type: "zoomOutRight"
                }, {
                    type: "zoomOutUp"
                }, {
                    type: "hinge"
                }, {
                    type: "rollIn"
                }, {
                    type: "rollOut"
                }]
            }
        }],
        statistic: [{
            type: "radio",
            key: "statistic.mode",
            defaultValue: "default",
            templateOptions: {
                label: "Do you want a Daily report of conversions using the Popup?",
                labelProp: "title",
                valueProp: "value",
                options: [{
                    title: "Yes",
                    value: "yes"
                }, {
                    title: "No",
                    value: "no"
                }]
            }

        }, {
            key: "statistic.email",
            type: "input",
            hideExpression: "(model.statistic.mode != 'yes')",
            templateOptions: {
                type: "text",
                label: "Enter Email Address",
                description: "PS: If you are a developer, please enter email address of the Marketing incharge. You can enter multiple email addresses separated by a comma",
                rows: 4,
                cols: 15
            }
        }],
        close: [{
            key: "close.outside",
            type: "checkbox",
            templateOptions: {
                label: "Close on clicking outside the Popup"
            }
        }, {
            key: "close.alert",
            type: "checkbox",
            templateOptions: {
                label: "Show an Alert Message when user clicks on Browser's Close Button"
            }
        }, {
            key: "close.message",
            type: "input",
            hideExpression: "(model.close.alert != true)",
            templateOptions: {
                type: "text",
                description: "Message to display when close button is clicked"
            }
        }],
        account: [{
            key: "first_name",
            type: "input",
            templateOptions: {
                required: true,
                label: "First Name",
                minlength: 2,
                minlengthValidationMessage: 'Must be at least 2 characters'
            }
        }, {
            key: "last_name",
            type: "input",
            templateOptions: {
                label: "Last Name"
            }
        }, {
            key: "email",
            type: "input",
            templateOptions: {
                label: "Email Address",
                type: "email",
                required: true
            }
        }, {
            key: "password",
            type: "input",
            templateOptions: {
                label: "Password",
                description: "Atleast 5 characters",
                type: "password",
                "minlength": 5,
                required: true
            }
        }],
        feedback: [{
            className: "section-label",
            template: "<!--How is your Popup working?-->",
            hideExpression: "(model.working)"
        }, {
            type: "radio",
            key: "working",
            templateOptions: {
                labelProp: "field",
                valueProp: "value",
                options: [{
                    field: "Yes. It works just as expected.",
                    value: "yes"
                }, {
                    field: "No, It does not work as expected",
                    value: "no"
                }]
            },
            hideExpression: "(model.working)"
        }, {
            className: "section-label",
            template: "That's Awesome!<br>",
            hideExpression: "(model.working != 'yes') || model.freeAdvice"
        }, {
            key: "description",
            type: "textarea",
            hideExpression: "(model.working != 'no')",
            templateOptions: {
                label: "Tell us what went wrong:",
                rows: 4,
                cols: 15
            }
        }, {
            key: "freeAdvice",
            type: "radio",
            templateOptions: {
                label: "Would you like your Website to be reviewed by a Conversion Expert from Yeloni? (The first review is absolutely free)",
                labelProp: "field",
                valueProp: "value",
                options: [{
                    field: "Yes",
                    value: "yes"
                }, {
                    field: "No",
                    value: "no"
                }]
            },
            hideExpression: "model.working != 'yes' || model.freeAdvice"
        }, {
            key: "community",
            type: "radio",
            templateOptions: {
                label: "Would you like to receive notifications on new feature updates?",
                labelProp: "field",
                valueProp: "value",
                options: [{
                    field: "Yes",
                    value: "yes"
                }, {
                    field: "No",
                    value: "no"
                }]
            },
            hideExpression: "model.working != 'yes' || model.freeAdvice!='no' || model.community"
        }, {
            key: "email",
            type: "input",
            templateOptions: {
                type: "email",
                placeholder: "john.doe@gmail.com",
                label: "Your Email Address?"
            },
            hideExpression: "!(model.freeAdvice == 'yes'|| model.community == 'yes')"
        }, {
            key: "email",
            type: "input",
            templateOptions: {
                label: "Your Email Address?",
                type: "email",
                placeholder: "john.doe@gmail.com"
            },
            hideExpression: "!(model.working == 'no' && model.description.length > 3)"
        }, {
            className: "section-label",
            template: "Thank you for choosing Yeloni. If you have any questions, write to me at jine.feather@gmail.com",
            hideExpression: "!(model.freeAdvice == 'no' && model.community == 'no')"
        }, {
            className: "section-label",
            template: "Please keep the plugin activated for the next 24 hours so that support team can analyze your website for possible issues.",
            hideExpression: "!(model.working != 'yes' && model.email)"
        }],
        showAdmin: [{
            type: "radio",
            key: "showAdmin",
            expressionProperties: {
                'templateOptions.disabled': "(model.showAdminFeature != true || model.advancedConfiguration != true)"
            },
            defaultValue: true,
            templateOptions: {
                labelProp: "title",
                valueProp: "value",
                options: [{
                    title: "Everyone",
                    value: true
                }, {
                    title: "Visitors who are not loggedin (Premium)",
                    value: false
                }]
            }
        }],
        default: {
            "premiumUser": false,
            "what": {
                "enable": true
            },
            "when": {
                "large": "exit",
                "link": {
                    "large": "any",
                    "close": true
                },
                "smallDifferent": false,
                "mode": "default",
                "scroll": {
                    "large": 25,
                    "small": 25
                }
            },
            "where": {
                "mode": "default",
                "home": true,
                "other": "all",
                "specific": {
                    "selector": "pageType"
                }
            },
            "whom": {
                "mode": "default",
                "once": "always"
            },
            "how": {
                "mode": "default"
            },
            "close": {
                "mode": "default"
            }
        }
    })
