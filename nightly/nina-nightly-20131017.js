/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Holds all Nina classes and stuff related to these classes
* such as widgets, styles for widgets, static fields that allow widgets to
* talk back and forth and AJAX stuff for communicating with the Nina server
* components.
* @namespace 
* @name Nina
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
*/
/*jslint browser: true, bitwise: true, plusplus: true */
window.Nina = (function () {
    "use strict";
    return {
        /**
        * Causes one object to inherit another as a prototype.
        * @function 
        * @name Nina.beget
        * @param {Native.String} [o] The object to inherit.
        * @returns {Native.Object} The new object.
        */
        beget: function (o) {
            var F = function () { return; };
            F.prototype = o;
            return new F();
        },
        assert: function (outcome, description) {
            if (!outcome) {
                window.Nina.UI.Widget.log(description);
            }
        },
        /**
        * Creates a UUID.  
        * http://www.rfc-archive.org/getrfc.php?rfc=4122 4.4.  Algorithms for Creating a UUID from Truly Random or Pseudo-Random Numbers
        * @function
        * @public
        * @name Rendition.UI.createUUID
        * @returns {Native.String} New GUID/UUID.
        */
        createUUID: function () {
            var s = [], hexDigits = '0123456789ABCDEF', i, uuid;
            for (i = 0; i < 32; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            /*bits 12-15 of the time_hi_and_version field to 0010*/
            s[12] = '4';
            /*bits 6-7 of the clock_seq_hi_and_reserved to 01*/
            s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
            uuid = s.join('');
            return uuid.substring(0, 8) + '-' + uuid.substring(8, 12) + '-' + uuid.substring(12, 16) + '-' + uuid.substring(16, 20) + '-' + uuid.substring(20, 32);
        },
        /**
        * Tests a value to see if it's a number.
        * @function 
        * @name Nina.isNumber
        * @param {Native.Object} [value] The object to test.
        * @returns {Native.Boolean} When the value is a number then returns true otherwise false.
        */
        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },
        /**
        * Tests a value to see if it's an array.
        * @function 
        * @name Nina.isArray
        * @param {Native.Object} [value] The object to test.
        * @returns {Native.Boolean} When the value is an array then returns true otherwise false.
        */
        isArray: function (value) {
            return value && typeof value === 'object' &&
                typeof value.length === 'number' &&
                !(value.propertyIsEnumerable('length'));
        },
        /**
        * Holds all widgets and supporting methods.  
        * @namespace 
        * @memberOf Nina
        */
        UI: {
            /**
            * Global counter of widgets that have ever been instantiated in this session.  Used to create ids for widgets.
            * @var
            * @type Native.Integer
            * @name widgetIdCount
            * @memberOf Nina.UI
            * @public
            */
            widgetIdCount: 0,
            /**
            * Updates the style of stacked dialogs, giving some the focused style and others the unfocused style.
            * @function
            * @type Native.Function
            * @name stylizeDialogs
            * @memberOf Nina.UI
            * @public
            */
            stylizeDialogs: function () {
                var d;
                for (d in this.widgets.dialogs) {
                    if (this.widgets.dialogs.hasOwnProperty(d)) {
                        this.widgets.dialogs[d].stylize();
                    }
                }
            },
            /**
            * Point class for Nina.UI.Widget objects.
            * @class
            * @type Native.Object
            * @name Point
            * @memberOf Nina.UI
            * @public
            */
            Point: {
                /**
                * The horizontal coordinate.
                * @field
                * @name x
                * @type Native.Number
                * @memberOf Nina.UI.Point
                */
                x: 0,
                /**
                * The vertical coordinate.
                * @field
                * @name y
                * @type Native.Number
                * @memberOf Nina.UI.Point
                */
                y: 0
            },
            /**
            * Rectangle class for Nina.UI.Widget objects.
            * @class
            * @type Native.Object
            * @name Rect
            * @memberOf Nina.UI
            * @public
            */
            Rect: {
                /**
                * The horizontal coordinate.
                * @field
                * @name x
                * @type Native.Number
                * @memberOf Nina.UI.Rect
                */
                x: 0,
                /**
                * The vertical coordinate.
                * @field
                * @name y
                * @type Native.Number
                * @memberOf Nina.UI.Rect
                */
                y: 0,
                /**
                * The height of the rectangle.
                * @field
                * @name h
                * @type Native.Number
                * @memberOf Nina.UI.Rect
                */
                h: 0,
                /**
                * The width of the rectangle.
                * @field
                * @name w
                * @type Native.Number
                * @memberOf Nina.UI.Rect
                */
                w: 0
            },
            /**
            * Padding class for Nina.UI.Widget objects.
            * @class
            * @type Native.Object
            * @name Padding
            * @memberOf Nina.UI
            * @public
            */
            Padding: {
                /**
                * The top amount of padding in pixels.
                * @field
                * @name t
                * @type Native.Number
                * @memberOf Nina.UI.Padding
                */
                t: 0,
                /**
                * The right amount of padding in pixels.
                * @field
                * @name r
                * @type Native.Number
                * @memberOf Nina.UI.Padding
                */
                r: 0,
                /**
                * The bottom amount of padding in pixels.
                * @field
                * @name b
                * @type Native.Number
                * @memberOf Nina.UI.Padding
                */
                b: 0,
                /**
                * The left amount of padding in pixels.
                * @field
                * @name l
                * @type Native.Number
                * @memberOf Nina.UI.Padding
                */
                l: 0
            },
            /**
            * Border class for Nina.UI.Widget objects.
            * @class
            * @type Native.Object
            * @name Border
            * @memberOf Nina.UI
            * @public
            */
            Border: {
                /**
                * The size of the border in pixels.
                * @field
                * @name size
                * @type Native.Number
                * @memberOf Nina.UI.Border
                */
                size: 0,
                /**
                * The style of the border.  E.g.: 'solid', 'dashed', etc..
                * @field
                * @name style
                * @type Native.String
                * @memberOf Nina.UI.Border
                */
                style: '',
                /**
                * The color of the border in standard CSS color code.
                * @field
                * @name color
                * @type Native.String
                * @memberOf Nina.UI.Border
                */
                color: ''
            },
            /**
            * The active dialog.
            * @var
            * @type Nina.UI.Dialog
            * @name activeDialog
            * @memberOf Nina.UI
            * @public
            */
            activeDialog: undefined,
            /**
            * The top CSS z-index for Nina.UI.Dialog objects.
            * @var
            * @type Nina.UI.Number
            * @name topZIndex
            * @memberOf Nina.UI
            * @public
            */
            topZIndex: 0,
            /**
            * The top modal CSS z-index for Nina.UI.Dialog objects.
            * @var
            * @type Nina.UI.Number
            * @name topModalZIndex
            * @memberOf Nina.UI
            * @public
            */
            topModalZIndex: 100,
            /**
            * Prototype for Nina.UI.WidgetStyle implementations.
            * @class
            * @type Native.Object
            * @name WidgetStyle
            * @memberOf Nina.UI
            * @public
            */
            WidgetStyle: {
                /**
                * The unique id of this Nina.UI.WidgetStyle.
                * @field
                * @name id
                * @type Native.String
                * @memberOf Nina.UI.WidgetStyle
                */
                id: '',
                /**
                * The name of this widget Nina.UI.WidgetStyle.
                * @field
                * @name type
                * @type Native.String
                * @memberOf Nina.UI.WidgetStyle
                */
                type: 'WidgetStyle',
                /**
                * The default font family for all widgets.
                * @field
                * @name defaultFontFamily
                * @type Native.String
                * @memberOf Nina.UI.WidgetStyle
                */
                defaultFontFamily: 'Segoe UI Light, Segoe UI, Lucida Grande, Verdana, Arial, Helvetica, sans-serif'
            },
            /**
            * Collection of widgets implementing Nina.UI.Widget.
            * @class
            * @type Native.Object
            * @name widgets
            * @memberOf Nina.UI
            * @public
            */
            widgets: {
                /**
                * Array of Nina.UI.Dialog instances.
                * @field
                * @name Dialogs
                * @type Native.Array
                * @memberOf Nina.UI
                */
                dialogs: {},
                /**
                * The Nina.UI.TaskBar.
                * @field
                * @name Dialogs
                * @type Native.String
                * @memberOf Nina.UI
                */
                taskBar: undefined,
                /**
                * Collection of Nina.UI.widgets.
                * @field
                * @name widgets
                * @type Native.Object
                * @memberOf Nina.UI
                */
                widgets: {}
            },
            /**
            * Set of styles for objects implementing Nina.UI.Widget.
            * @namespace
            * @type Native.Object
            * @name Style
            * @memberOf Nina.UI
            * @public
            */
            Style: {},
            /**
            * Prototype for objects implementing Nina.UI.Widget.
            * @class
            * @type Native.Object
            * @name Widget
            * @memberOf Nina.UI
            * @public
            */
            Widget: {
                /**
                * The unique id of this Nina.UI.Widget.
                * @field
                * @name id
                * @type Native.String
                * @memberOf Nina.UI.Widget
                */
                id: '',
                /**
                * The type of this Nina.UI.Widget.
                * @field
                * @name type
                * @type Native.String
                * @memberOf Nina.UI.Widget
                */
                type: 'Widget',
                /**
                * When set true in an event handler the default event will not occur.
                * @field
                * @name cancelDefault
                * @type Native.Boolean
                * @memberOf Nina.UI.Widget
                */
                cancelDefault: false,
                /**
                * Updates an elements width, height, left (x) and top (y).
                * @function
                * @type Native.Function
                * @name updateElementRect
                * @memberOf Nina.UI.Widget
                * @param {Native.HTMLElement} [e] The element to resize.
                * @param {Native.Integer} [w] The new width of the element.
                * @param {Native.Integer} [h] The new height of the element.
                * @param {Native.Integer} [x] The new left (x) of the element.
                * @param {Native.Integer} [y] The new top (y) of the element.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                updateElementRect : function (e, w, h, x, y) {
                    e.style.width = w + 'px';
                    e.style.height = h + 'px';
                    e.style.left = x + 'px';
                    e.style.top = y + 'px';
                    return this;
                },
                /**
                * Converts a Nina.UI.Rect object into a string for debugging.
                * @function
                * @type Native.Function
                * @name rectToString
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.Rect} [rect] The Nina.UI.Rect to convert to a string.
                * @returns {Native.String} String representation of the Nina.UI.Rect object.
                * @public
                */
                rectToString: function (rect) {
                    return "x:" + rect.x + ",y:" + rect.y + ",w:" + rect.w + ",h:" + rect.h;
                },
                /**
                * Clips the text to a specified with adding "..." to text that exceeds the width parameter.
                * @function
                * @type Native.Function
                * @name clipText
                * @memberOf Nina.UI.Widget
                * @param {Native.HTMLElement} [obj] The element to clip.
                * @param {Native.Number} [width] The maximum width of the element before clipping occurs.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                clipText: function (obj, width) {
                    if (obj.originalText === undefined) {
                        obj.originalText = obj.innerText || obj.textContent;
                    }
                    this.setTextContent(obj, obj.originalText);
                    var i = obj.originalText.length;
                    while (width < obj.offsetWidth) {
                        i--;
                        if (i < 0) { return this; }
                        this.setTextContent(obj, obj.originalText.substring(0, i) + "...");
                    }
                    return this;
                },
                /**
                * Sets the text content of an HTML Element.
                * @function
                * @type Native.Function
                * @name setTextContent
                * @memberOf Nina.UI.Widget
                * @param {Native.HTMLElement} [obj] The object to set text.
                * @param {Native.String} [text] The text to set.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                setTextContent: function (obj, text) {
                    if (obj.innerText) {
                        obj.innerText = text;
                    } else {
                        obj.textContent = text;
                    }
                    return this;
                },
                /**
                * Prevents selection of the elements passed to this function.
                * @function
                * @type Native.Function
                * @name noSelect
                * @memberOf Nina.UI.Widget
                * @param {Native.Array} [eles] The array list of elements to prevent selection.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                noSelect: function (eles) {
                    try {
                        var x, t = function () { return false; };
                        for (x = 0; eles.length > x; x++) {
                            eles[x].onselectstart = t;
                            eles[x].unselectable = "on"; // For IE and Opera
                            eles[x].style.userSelect = "none";
                            eles[x].style.webkitUserSelect = "none";
                            eles[x].style.MozUserSelect = "none";
                        }
                    } catch (ignore) { }
                    return this;
                },
                /**
                * Returns a CSS formatted string from the Nina.UI.Padding object.
                * @function
                * @type Native.Function
                * @name pad
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.Padding} [padRect] The Nina.UI.Padding object to convert to a CSS string.
                * @param {Native.Number} [width] The maximum width of the element before clipping occurs.
                * @returns {Native.String} CSS padding string.
                * @public
                */
                pad: function (padRect) {
                    return padRect.t + 'px ' + padRect.r + 'px ' + padRect.b + 'px ' + padRect.l + 'px';
                },
                /**
                * Returns a CSS formatted string from the Nina.UI.Border object.
                * @function
                * @type Native.Function
                * @name border
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.Border} [padRect] The Nina.UI.Border to turn into a CSS string.
                * @param {Native.Number} [width] The maximum width of the element before clipping occurs.
                * @returns {Native.String} CSS border string.
                * @public
                */
                border: function (obj) {
                    return obj.style + ' ' + obj.size + 'px ' + obj.color;
                },
                /**
                * Appends the result of a function, an element a HTML string or an array of elements, function and strings to a HTML Element.
                * @function
                * @type Native.Function
                * @name appendObj
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.HTMLElement} [parentNode] The HTML Element to append to..
                * @param {Native.Object} [obj] The function, element, string or array of functions elements and strings to append.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                appendObj: function (parentNode, obj) {
                    if (typeof obj === 'string'
                            || typeof obj === 'number'
                            || typeof obj === 'boolean') { // string, number, boolean goes in as Html
                        parentNode.innerHTML = obj;
                        return this;
                    }
                    if (obj.nodeType !== undefined) { // Element goes in as child node
                        parentNode.appendChild(obj);
                        return this;
                    }
                    if (typeof obj === 'function') { // function gets applied recursively
                        this.appendObj(parentNode, obj.apply(this, []));
                        return this;
                    }
                    if (window.Nina.isArray(obj)) { // array elements get applied recursively
                        var l = obj.length, x;
                        for (x = 0; l > x; x++) {
                            this.appendObj(parentNode, obj[x]);
                        }
                        return this;
                    }
                    // null, undefined, blah don't do anything
                    return this;
                },
                /**
                * Gets the Nina.UI.Rect defined by the element.
                * @function
                * @type Native.Function
                * @name getRect
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.HTMLElement} [obj] The HTML Element to get the Nina.UI.Rect for.
                * @returns {Nina.UI.Rect} The Nina.UI.Rect for the HTML element passed to the function.
                * @public
                */
                getRect: function (obj) {
                    return { x: obj.offsetLeft, y: obj.offsetTop, w: obj.offsetWidth, h: obj.offsetHeight };
                },
                /**
                * Gets the position of the mouse within the HTML element in the second parameter.
                * @function
                * @type Native.Function
                * @name mouse
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.Object} [e] The browser's event object.
                * @param {Nina.UI.HTMLElement} [obj] The HTML Element to get the mouse's position on.
                * @returns {Nina.UI.Point} Nina.UI.Point that represents the position of the mouse.
                * @public
                */
                mouse: function (e, obj) {
                    e = e || window.event;
                    var objPos = this.position(obj),
                        mousePos = this.mouseLiteral(e);
                    return { x: mousePos.x - objPos.x, y: mousePos.y - objPos.y };
                },
                /**
                * Creates an HTML Element.  Same as document.createElement() but with slightly less typing.
                * @function
                * @type Native.Function
                * @name createElement
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.String} [eleType] The type of element to create.
                * @returns {Nina.UI.HTMLElement} The HTML element created.
                * @public
                */
                createElement: function (eleType) {
                    return document.createElement(eleType);
                },
                /**
                * Gets position of an element relevant to the browser window.
                * @function
                * @type Native.Function
                * @name position
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.HTMLElement} [e] The element to get the position of.
                * @returns {Nina.UI.Point} Nina.UI.Point that represents the position of the HTML element passed to the function.
                * @public
                */
                position: function (e) {
                    var x = 0, y = 0;
                    while (e.offsetParent) {
                        x += e.offsetLeft;
                        y += e.offsetTop;
                        x -= e.scrollLeft;
                        y -= e.scrollTop;
                        e = e.offsetParent;
                    }
                    return { x: x, y: y };
                },
                /**
                * Gets the document.documentElement's height and width.
                * @function
                * @type Native.Function
                * @name client
                * @memberOf Nina.UI.Widget
                * @returns {Nina.UI.Rect} Nina.UI.Rect that represents the dimensions of the browser window. The x and y members are always zero.
                * @public
                */
                client: function () {
                    return {
                        x: 0,
                        y: 0,
                        w: document.documentElement.clientWidth,
                        h: document.documentElement.clientHeight
                    };
                },
                /**
                * Extracts the literal mouse position from the browser's event object.
                * @function
                * @type Native.Function
                * @name mouseLiteral
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.HTMLElement} [e] The browser event object.
                * @returns {Nina.UI.Point} Nina.UI.Point that represents the position of the mouse relative to the browser window.
                * @public
                */
                mouseLiteral: function (e) {
                    return { x: window.document.documentElement.scrollLeft + e.clientX, y: window.document.documentElement.scrollTop + e.clientY };
                },
                /**
                * Safely creates a message in the debugging console by checking to see if it exists first then sending the message.
                * @function
                * @type Native.Function
                * @name log
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.HTMLElement} [message] The message to display in the box.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                log: function (message) {
                    if (window.console) {
                        window.console.log(message);
                    }
                    return this;
                },
                /**
                * Creates a nifty little floating HTML box to display debugging data if you can't be bothered to use Console.log or this.log.
                * @function
                * @type Native.Function
                * @name debug
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.String} [message] The message to display in the box.
                * @param {Nina.UI.Boolean} [persist] When true the previous message will stay in the box and be moved down.  When false the previous message will be removed.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                debug: function (message, persist) {
                    window.ninaDebugMessageBox = window.ninaDebugMessageBox || this.createElement('div');
                    var d = window.ninaDebugMessageBox;
                    d.style.position = 'absolute';
                    d.style.zIndex = '99999';
                    d.style.padding = '5px';
                    d.style.height = '250px';
                    d.style.overflow = 'scroll';
                    d.style.top = '25px';
                    d.style.color = 'black';
                    d.style.background = '#CCC';
                    d.style.border = 'solid 1px #555';
                    function resize() {
                        d.style.left = parseInt(window.Nina.UI.Widget.client().w, 10) - 300 + 'px';
                    }
                    if (d.parentNode === null) {
                        document.body.appendChild(d);
                        window.addEventListener('resize', resize, false);
                        resize();
                    }
                    if (persist) {
                        d.innerHTML = message + d.innerHTML;
                    } else {
                        d.innerHTML = message;
                    }
                    return this;
                },
                /**
                * Used by Nina.UI.Widget implementers to fire event procedures internally.
                * @function
                * @type Native.Function
                * @name raiseEvent
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.String} [eventName] Name of the event to execute.
                * @param {Nina.UI.Object} [e] The event object defined by the browser.
                * @param {Nina.UI.HTMLElement} [element] The HTML Element associated with this event or undefined if there is no element.
                * @param {Nina.UI.Array} [eventArguments] An array list of additional arguments to provide the function subscribed to the event.
                * @returns {Native.Boolean} When true, cancelDefault was set or called.
                * @public
                */
                raiseEvent: function (eventName, e, element, eventArguments) {
                    return this.executeEvent(this.events[eventName], e, element, eventArguments);
                },
                /**
                * Adds a function to an event for this widget.  When the event occurs the function will execute in the context of this widget.
                * Setting this.cancelDefault = true; will cancel the default event.
                * @function
                * @type Native.Function
                * @name addEventListener
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.String} [eventName] The name of the event, such as 'click', 'resize' or 'init'.
                * @param {Nina.UI.Function} [procedure] The function to execute when the event occurs.
                * @throws {Exception} If the event name cannot be found.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                addEventListener: function (eventName, procedure) {
                    var errMsg = 'Cannot attach to event handler ' + eventName + ' to ' + this.type;
                    if (window.Nina.isArray(this.events[eventName])) {
                        if (this.events[eventName].indexOf(procedure) === -1) {
                            this.events[eventName].push(procedure);
                        }
                    } else {
                        throw errMsg;
                    }
                    return this;
                },
                /**
                * Removes a function from an event for this widget.  This function must reference the function to remove.
                * @function
                * @type Native.Function
                * @name removeEventListener
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.String} [eventName] The name of the event, such as 'click', 'resize' or 'init'.
                * @param {Nina.UI.Function} [procedure] The function to remove.
                * @throws {Exception} If the event procedure cannot be found.
                * @returns {Native.Object} The widget to which this function belongs.
                * @public
                */
                removeEventListener: function (eventName, procedure) {
                    var events = this.events[eventName],
                        errMsg = 'Cannot detach from event handler ' + eventName + ' on ' + this.type + '.  No such event.',
                        l,
                        x;
                    if (window.Nina.isArray(this.events[eventName])) {
                        l = this.events.length;
                        for (x = 0; l > x; x++) {
                            if (events[x] === procedure) {
                                events.splice(x, 1);
                                return this;
                            }
                        }
                        throw errMsg;
                    }
                    throw errMsg;
                },
                /**
                * Used by Nina.UI.Widget implementers to fire event procedures internally.
                * @function
                * @type Native.Function
                * @name executeEvent
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.Array} [eventArray] An array list of functions subscribed to the event listener.
                * @param {Nina.UI.Object} [e] The event object defined by the browser.
                * @param {Nina.UI.HTMLElement} [element] The HTML Element associated with this event or undefined if there is no element.
                * @param {Nina.UI.Array} [eventArguments] An array list of additional arguments to provide the function subscribed to the event.
                * @returns {Native.Boolean} When true, cancelDefault was set or called.
                * @public
                */
                executeEvent: function (eventArray, e, element, eventArguments) {
                    this.cancelDefault = false;
                    if (eventArguments === undefined) {
                        eventArguments = [undefined, this.interface, undefined];
                    } else {
                        eventArguments.unshift(e, this.interface, element);
                    }
                    var l = eventArray.length, x;
                    for (x = 0; l > x; x++) {
                        eventArray[x].apply(this.interface, eventArguments);
                    }
                    return this.cancelDefault;
                },
                /**
                * Used to create event subscriptions from the arguments passed to the 
                * Nina.UI.Widget's constructor arguments.  Returns an array
                * containing the event argument or and empty array.
                * @function
                * @type Native.Function
                * @name addInitalEvents
                * @memberOf Nina.UI.Widget
                * @param {Nina.UI.Function} [eventProcedure] The function passed to the constructor.
                * @returns {Native.Array} Array of event procedures passed for this event.
                * @public
                */
                addInitalEvents: function (eventProcedure) {
                    if (typeof eventProcedure === 'function') {
                        return [eventProcedure];
                    }
                    return [];
                }
            }
        }
    };
}());/* START dialog.js */
﻿/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Creates a DHTML based dialog.  The dialog contains control boxes, a title bar, an entry in the Nina.UI.TaskBar if it's visible, 
* resizable, control boxes etc. dozens of events to attach to.
* @constructor
* @name dialog
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.Widget
* @requires Nina
* @requires Nina.UI
* @requires Nina.UI.Style.dialog
* @memberOf Nina.UI
* @param {Native.Object} [args] Parameters for the dialog.
* @param {Native.Number} [args.state=0] The state of the Nina.UI.dialog.  0: Normal, 1: minimized, 2: maximized, 3: hidden.
* @param {Nina.UI.Rect} [args.rect] The Nina.UI.Rect of the Nina.UI.dialog.
* @param {Native.Boolean} [args.resizable=true] When set true the Nina.UI.dialog will be resizable. When set false the Nina.UI.dialog will be resizable.
* @param {Native.Boolean} [args.showContentWhileMoving=false] When set true content will be shown while moving and resizing.  When set false a preview will be shown while moving and resizing.
* @param {Native.Boolean} [args.centerVertically=false] When true this Nina.UI.dialog will be centered vertically when the position is next updated or moveToCenter is called.
* @param {Native.Boolean} [args.centerHorizontally=false] When true this Nina.UI.dialog will be centered horizontally when the position is next updated or moveToCenter is called.
* @param {Nina.UI.Style} [args.style=Nina.UI.Style] The Nina.UI.Style of this Nina.UI.dialog.
* @param {Native.Boolean} [args.modal=false] When set true the Nina.UI.dialog will be in modal mode, appearing on top of everything and preventing access to background elements.
* @param {Native.Boolean} [args.modalCanClose=false] When set true, the close control box will be enabled even when in modal mode.
* @param {Native.Boolean} [args.moveable=true] When set false the Nina.UI.dialog cannot be moved.
* @param {Native.Boolean} [args.alwaysOnTop=false] When set true the dialog will appear above all other Nina.UI.dialog instances.
* @param {Native.Boolean} [args.dontInit=false] When set true the dialog will not initialize until you call the Nina.UI.dialog.Init method.
* @param {Native.Boolean} [args.hidden=false] When set true the dialog will be hidden.
* @param {Native.Boolean} [args.hiddenFromTaskBar=false] When set true the dialog will be hidden from the task bar.
* @param {Native.String} [args.title] The title of the Nina.UI.dialog.
* @example ///Create a simple reference to a new dialog, set the title and make it modal.///
*var myDialog = Nina.UI.dialog({
*	title:'My Dialog',
*	modal: true
*});
* @example <caption>Attach to an event when you create the dialog.</caption>
*var myDialog = Nina.UI.dialog({
*	title:'My Dialog',
*	close:function(e,dialog){
*	    dialog.title('Can\'t close me.');
*		dialog.preventDefault();
*		return;
*	}
*});
* @example <caption>Attach to an event after you create the dialog</caption>
*var myDialog = Nina.UI.dialog({
*	title:'My Dialog'
*});
*myDialog.addEventListener('close',function(e,dialog){
*   dialog.title('Can\'t close me.');
*	dialog.preventDefault();
*	return;
*},false);
*/
Nina.UI.dialog = function (args) {
    args = args || {};
    var self = Nina.beget(Nina.UI.Widget);
    self.publicMembers = {};
    self.style = args.style || Nina.UI.Style.dialog();
    self.type = 'dialog';
    // setup events, set events from args
    self.events = {
        /**
        * Occurs after the Nina.UI.dialog is initialized.
        * @event
        * @name init
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        init: self.addInitalEvents(args.init),
        /**
        * Occurs before the Nina.UI.dialog is being disposed.
        * @event
        * @name dispose
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        dispose: self.addInitalEvents(args.dispose),
        /**
        * Occurs before the Nina.UI.dialog is being shown.
        * @event
        * @name show
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        show: self.addInitalEvents(args.show),
        /**
        * Occurs before the Nina.UI.dialog is hidden.
        * @event
        * @name hide
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        hide: self.addInitalEvents(args.hide),
        /**
        * Occurs before the Nina.UI.dialog is closed.
        * @event
        * @name close
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        close: self.addInitalEvents(args.close),
        /**
        * Occurs before the Nina.UI.dialog is minimized.
        * @event
        * @name minimize
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        minimize: self.addInitalEvents(args.minimize),
        /**
        * Occurs before the Nina.UI.dialog is maximized.
        * @event
        * @name maximize
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        maximize: self.addInitalEvents(args.maximize),
        /**
        * Occurs before the Nina.UI.dialog is restored.
        * @event
        * @name restore
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        restore: self.addInitalEvents(args.restore),
        /**
        * Occurs while the Nina.UI.dialog is moved.
        * @event
        * @name move
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        move: self.addInitalEvents(args.move),
        /**
        * Occurs while the Nina.UI.dialog is resized.
        * @event
        * @name resize
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        resize: self.addInitalEvents(args.resize),
        /**
        * Occurs when the Nina.UI.dialog is stylized.
        * @event
        * @name stylize
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        stylize: self.addInitalEvents(args.stylize),
        /**
        * Occurs when the Nina.UI.dialog title is changed.
        * @event
        * @name titleChanged
        * @memberOf Nina.UI.dialog
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.dialog instance.
        */
        titleChanged: self.addInitalEvents(args.titleChanged)
    };
    self.createPublicMembers = function () {
        // API Interface
        
        /**
        * When used in an event listener, prevents the default event.
        * @function
        * @name preventDefault
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.preventDefault = function () {
            self.cancelDefault = true;
            return self.publicMembers;
        };
        /**
        * Closes the Nina.UI.dialog.
        * @function
        * @name close
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.close = function () {
            self.close();
            return self.publicMembers;
        };
        /**
        * Initializes the Nina.UI.dialog.  Should only be run once and only if dontInit argument was used during instantiation.
        * @function
        * @name init
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.init = function () {
            self.init();
            return self.publicMembers;
        };
        /**
        * Minimizes the Nina.UI.dialog if it isn't already minimized.
        * @function
        * @name minimize
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.minimize = function () {
            self.minimize();
            return self.publicMembers;
        };
        /**
        * Maximizes the Nina.UI.dialog if it is not already maximized.
        * @function
        * @name maximize
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.maximize = function () {
            self.maximize();
            return self.publicMembers;
        };
        /**
        * Restores the the Nina.UI.dialog to the original size if it is maximized.
        * @function
        * @name restore
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.restore = function () {
            self.restore();
            return self.publicMembers;
        };
        /**
        * When returns true the Nina.UI.dialog is the active Nina.UI.dialog, otherwise false.
        * @function
        * @name isActive
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Native.Boolean} True the Nina.UI.dialog is the active Nina.UI.dialog, otherwise false.
        */
        self.publicMembers.isActive = function () {
            return self.isActive();
        };
        /**
        * Sets any number of objects as the title of the Nina.UI.dialog.
        * @function
        * @name title
        * @param {Native.Object} [obj] Sets any number of objects as the title of the Nina.UI.dialog.
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.title = function (obj) {
            return self.title(obj);
        };
        /**
        * Moves the Nina.UI.dialog to the center of the browser. If centerHorizontally and/or centerVertically are set.
        * @function
        * @name moveToCenter
        * @param {Nina.UI.Rect} [rect] The new Nina.UI.Rect to set.
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.moveToCenter = function () {
            self.moveToCenter();
            return self.publicMembers;
        };
        /**
        * Places the Nina.UI.dialog in a new position.
        * @function
        * @name setPosition
        * @param {Nina.UI.Point} [point] The new Nina.UI.Point to set.
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.setPosition = function (point) {
            var rect = { x: point.x, y: point.y, w: self.rect.w, h: self.rect.h };
            self.setRect(rect);
            return self.publicMembers;
        };
        /**
        * Sets the Nina.UI.dialog to a new size and position.
        * @function
        * @name setRect
        * @param {Nina.UI.Rect} [rect] The new Nina.UI.Rect to set.
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.setRect = function (rect) {
            self.setRect(rect);
            return self.publicMembers;
        };
        /**
        * Shows the Nina.UI.dialog if hidden.
        * @function
        * @name show
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.show = function () {
            self.show();
            return self.publicMembers;
        };
        /**
        * Hides the Nina.UI.dialog if visible.
        * @function
        * @name hide
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.hide = function () {
            self.hide();
            return self.publicMembers;
        };
        /**
        * Applies the current Nina.UI.Style.dialog to the Nina.UI.dialog.
        * @function
        * @name redraw
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.redraw = function () {
            self.moveToCenter();
            self.stylize();
            return self.publicMembers;
        };
        /**
        * Adds a function to an event for this widget.   When the event occurs the function will execute in the context of this widget. 
        * Calling dialog.preventDefault() will cancel the default event.
        * @function
        * @name addEventListener
        * @param {Nina.UI.String} [eventName] The name of the event to subscribe to.
        * @param {Nina.UI.Function} [procedure] The function to execute when the event is raised.
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.addEventListener = function (eventName, procedure, capturePhase) {
            self.addEventListener(eventName, procedure, capturePhase);
            return self.publicMembers;
        };
        /**
        * Removes a function from an event for this widget.  This function must match exactly the function to remove.
        * @function
        * @name removeEventListener
        * @param {Nina.UI.String} [eventName] The name of the event to unsubscribe from.
        * @param {Nina.UI.Function} [procedure] The function to execute when the event is raised.
        * @memberOf Nina.UI.dialog
        * @public
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.removeEventListener = function (eventName, procedure, capturePhase) {
            self.removeEventListener(eventName, procedure, capturePhase);
            return self.publicMembers;
        };
        /**
        * The Nina.UI.Style.dialog of this Nina.UI.dialog.
        * @field
        * @name style
        * @type Nina.UI.Style.dialog
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.style = self.style;
        /**
        * When set true, the dialog will be centered horizontally when moveToCenter.
        * @field
        * @name centerHorizontally
        * @type Native.Boolean
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.centerHorizontally = self.centerHorizontally;
        /**
        * When set true, the dialog will be centered vertically when moveToCenter.
        * @field
        * @name centerVertically
        * @type Native.Boolean
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.centerVertically = self.centerVertically;
        /**
        * The session unique id of the dialog.
        * @field
        * @name id
        * @type Native.String
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.id = self.id;
        /**
        * The type of widget. Returns Dialog.
        * @field
        * @name type
        * @type Native.String
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.type = self.type;
        /**
        * If the Nina.UI.dialog is modal, then true otherwise false.
        * @function
        * @name isModal
        * @memberOf Nina.UI.dialog
        * @returns {Native.Boolean} If the Nina.UI.dialog is modal, then true otherwise false.
        */
        self.publicMembers.isModal = function () {
            return self.modal;
        };
        /**
        * When true, the content of the Nina.UI.dialog will show the content while moving.
        * @field
        * @name showContentWhileMoving
        * @type Native.Boolean
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.showContentWhileMoving = self.showContentWhileMoving;
        /**
        * When true, the Nina.UI.dialog can be resized.
        * @field
        * @name resizable
        * @type Native.Boolean
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.resizable = self.resizable;
        /**
        * Sets any number of objects as the content of the Nina.UI.dialog. Can be a string, function or array of strings or functions.
        * @function
        * @name content
        * @param {Nina.UI.Object} [obj] The new content.
        * @memberOf Nina.UI.dialog
        * @returns {Nina.UI.dialog} Nina.UI.dialog instance.
        */
        self.publicMembers.content = function (obj) {
            self.appendObj(self.content, obj);
            return self.publicMembers;
        };
        /**
        * The current Nina.UI.Rect of this Nina.UI.dialog.
        * @field
        * @name rect
        * @type Nina.UI.Rect
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.rect = self.rect;
        /**
        * The current state of the Nina.UI.dialog.  0: Normal, 1: minimized, 2: maximized, 3: hidden.
        * @field
        * @name state
        * @type Native.Number
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.state = self.state;
        /**
        * When true the dialog will be drawn on top of other non modal dialogs.
        * @field
        * @name alwaysOnTop
        * @type Native.Number
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.alwaysOnTop = self.alwaysOnTop;
        /**
        * When true the dialog will be moveable if false, the dialog cannot move.
        * @field
        * @name moveable
        * @type Native.Number
        * @memberOf Nina.UI.dialog
        */
        self.publicMembers.moveable = self.moveable;
        return self;
    };
    // start the dialog
    self.init = function init() {
        // raise init event
        if (self.raiseEvent('init', undefined, undefined, undefined)) { return self; };
        // create an id for this widget
        self.id = Nina.UI.widgetIdCount++;
        // set (most) Boolean arguments  ---> for Booleans not default ? not default : default. 
        self.modal = args.modal === true ? true : false;
        self.modalCanClose = args.modalCanClose === true ? true : false;
        self.resizable = args.resizable === false ? false : true;
        self.moveable = args.moveable === false ? false : true;
        self.alwaysOnTop = args.alwaysOnTop === true ? true : false;
        self.dontInit = args.dontInit === true ? true : false;
        self.hidden = args.hidden === true ? true : false;
        self.hiddenFromTaskBar = args.hiddenFromTaskBar === true ? true : false;
        self.showContentWhileMoving = args.showContentWhileMoving === true ? true : false;
        // everything holder
        self.dialog = this.createElement('div');
        self.dialog.style.position = 'absolute';
        self.dialog.style.overflow = 'hidden';
        window.document.body.appendChild(self.dialog);
        // content
        self.content = this.createElement('div');
        self.content.style.position = 'absolute';
        self.dialog.appendChild(self.content);
        // control borders
        // title
        self.titleBar = this.createElement('div');
        self.titleBar.style.position = 'absolute';
        self.titleBar.style.overflow = 'hidden';
        self.dialog.appendChild(self.titleBar);
        // title text
        self.titleBarText = this.createElement('div');
        self.titleBarText.style.display = 'inline-block';
        self.titleBar.appendChild(self.titleBarText);
        // minimize button
        self.minimizeButton = this.createElement('button');
        self.minimizeButton.style.position = 'absolute';
        if (!self.modal) {
            self.titleBar.appendChild(self.minimizeButton);
        }
        // maximize button
        self.maximizeButton = this.createElement('button');
        self.maximizeButton.style.position = 'absolute';
        if (!self.modal) {
            self.titleBar.appendChild(self.maximizeButton);
        }
        // close
        self.closeButon = this.createElement('button');
        self.closeButon.style.position = 'absolute';
        if ((!self.modal) || self.modalCanClose) {
            self.titleBar.appendChild(self.closeButon);
        }
        // n
        self.n = this.createElement('div');
        self.n.style.position = 'absolute';
        self.dialog.appendChild(self.n);
        // s
        self.s = this.createElement('div');
        self.s.style.position = 'absolute';
        self.dialog.appendChild(self.s);
        // e
        self.e = this.createElement('div');
        self.e.style.position = 'absolute';
        self.dialog.appendChild(self.e);
        // w
        self.w = this.createElement('div');
        self.w.style.position = 'absolute';
        self.dialog.appendChild(self.w);
        // ne
        self.ne = this.createElement('div');
        self.ne.style.position = 'absolute';
        self.dialog.appendChild(self.ne);
        // se
        self.se = this.createElement('div');
        self.se.style.position = 'absolute';
        self.dialog.appendChild(self.se);
        // sw
        self.sw = this.createElement('div');
        self.sw.style.position = 'absolute';
        self.dialog.appendChild(self.sw);
        // nw
        self.nw = this.createElement('div');
        self.nw.style.position = 'absolute';
        self.dialog.appendChild(self.nw);
        // preview
        self.preview = this.createElement('div');
        if (!self.publicMembers.showContentWhileMoving) {
            self.preview.style.position = 'absolute';
            self.preview.style.visibility = 'hidden';
            self.preview.style.background = self.style.previewBackground;
            self.preview.style.outline = self.border(self.style.previewOutline);
            self.preview.style.zIndex = '99999';
            window.document.body.appendChild(self.preview);
        }
        // modal background
        self.modalBackground = this.createElement('div');
        if (self.modal) {
            self.modalBackground.style.position = 'absolute';
            self.modalBackground.style.top = '0px';
            self.modalBackground.style.left = '0px';
            self.modalBackground.style.width = self.client().w + 'px';
            self.modalBackground.style.height = self.client().h + 'px';
            self.modalBackground.style.background = self.style.modalBackground;
            window.document.body.appendChild(self.modalBackground);
        }
        // apply no select
        self.noSelect([self.titleBar, self.titleBarText, self.n, self.s, self.e,
        self.w, self.ne, self.se, self.sw, self.nw, self.closeButon,
        self.maximizeButton, self.minimizeButton, self.preview]);
        // setup initial rect
        args.rect = args.rect || {};
        self.publicMembers.rect = self.rect = {
            x: args.rect.x || self.style.rect.x,
            y: args.rect.y || self.style.rect.y,
            w: args.rect.w || self.style.rect.w,
            h: args.rect.h || self.style.rect.h
        };
        // resize centering
        self.centerVertically = args.centerVertically === undefined ? false : args.centerVertically;
        self.centerHorizontally = args.centerHorizontally === undefined ? false : args.centerHorizontally;
        // add dialog to set of dialogs
        Nina.UI.widgets.dialogs[self.id] = self;
        // add dialog to set of widgets
        Nina.UI.widgets.widgets[self.id] = self;
        // set zIndex
        self.dialog.style.zIndex = ++Nina.UI.topZIndex;
        // make the dialog the active dialog
        Nina.UI.activeDialog = self;
        // apply stuff
        self.title(args.title);
        self.setRect(self.rect);
        self.moveToCenter();
        // stylize all dialogs to update active status
        Nina.UI.stylizeDialogs();
        // attach events
        self.titleBar.addEventListener('dblclick', self.maxRestoreButtonEvent, true);
        self.dialog.addEventListener('mousedown', self.startMoving, false);
        window.document.documentElement.addEventListener('mousemove', self.mouseMove, true);
        window.document.documentElement.addEventListener('mouseup', self.stopMoving, true);
        window.addEventListener('resize', self.browserResize, true);
        self.closeButon.addEventListener('click', self.closeButtonEvent, true);
        self.maximizeButton.addEventListener('click', self.maxRestoreButtonEvent, true);
        self.minimizeButton.addEventListener('click', self.minButtonEvent, true);
        self.closeButon.addEventListener('mousedown', self.buttonStartEvent, true);
        self.maximizeButton.addEventListener('mousedown', self.buttonStartEvent, true);
        self.minimizeButton.addEventListener('mousedown', self.buttonStartEvent, true);
        self.dialog.addEventListener('mouseout', self.mouseoffButtons, false);
        self.closeButon.addEventListener('mouseover', function () { self.mouseoverButtons(0); }, true);
        self.maximizeButton.addEventListener('mouseover', function () { self.mouseoverButtons(1); }, true);
        self.minimizeButton.addEventListener('mouseover', function () { self.mouseoverButtons(2); }, true);
        // if a taskbar exists then add this dialog to it.
        if(Nina.UI.widgets.taskBar) {
            self.taskBarItem = Nina.UI.widgets.taskBar.add(self, function () {
                if(Nina.UI.activeDialog === self){
                    if (self.state === 0) {
                        self.minimize();
                    }else{
                        self.restore();
                        Nina.UI.activeDialog = self;
                        Nina.UI.stylizeDialogs();
                    }
                } else {
                    if (self.state === 1) {
                        self.restore();
                    }
                    Nina.UI.activeDialog = self;
                    Nina.UI.stylizeDialogs();
                }
            }, function () {
                return self.titleBarText.originalText;
            });
        }
        // create publicMembers
        self.createPublicMembers();
        return self;
    };
    self.mouseoffButtons = function () {
        var a = Nina.UI.activeDialog === self ? self.style.Active : self.style.Inactive;
        self.styleElement(self.closeButon, '', a.closeButtonBackground); // close
        self.styleElement(self.minimizeButton, '', a.minimizeButtonBackground); // min
        if (self.state === 2) {
            self.styleElement(self.maximizeButton, '', a.restoreButtonBackground); // restore
        } else {
            self.styleElement(self.maximizeButton, '', a.maximizeButtonBackground); // max
        }
    };
    self.mouseoverButtons = function (buttonId) {
        var a = Nina.UI.activeDialog === self ? self.style.Active : self.style.Inactive;
        // 0 = close, 1 = max, 2 = min
        if (buttonId === 0) {
            self.styleElement(self.closeButon, '', a.Hover.closeButtonBackground); // close
        }
        if (buttonId === 2) {
            self.styleElement(self.minimizeButton, '', a.Hover.minimizeButtonBackground); // min
        }
        if (buttonId === 1) {
            if (self.state === 2) {
                self.styleElement(self.maximizeButton, '', a.Hover.restoreButtonBackground); // restore
            } else {
                self.styleElement(self.maximizeButton, '', a.Hover.maximizeButtonBackground); // max
            }
        }
    };
    // when a control button is pressed this turns true
    // why not cheer it up?
    self.controlButtonDepressed = false;
    // move states 0: none, 1: titlebar move, 2: nw resize, 3: n  resize, 4: ne resize
    // 5: e  resize, 6: se resize, 7: s  resize, 8: sw resize, 9: w  resize
    // 10: min button, 11: max button, 12: close button
    self.moveState = 0;
    // states 0: Normal, 1: minimized, 2: maximized, 3: hidden
    self.state = 0;
    self.originalBodyOverflowStyle = '';
    // set the move state of the dialog
    self.getMoveState = function (e) {
        if (self.attached) { return self.moveState; };
        var pos = self.mouse(e, self.dialog);
        var s = self.style;
        if (pos.y <= s.neRect.h + s.neRect.y &&
        pos.x >= (self.rect.w - (s.eRect.x + s.neRect.w)) && self.publicMembers.resizable) {
            self.moveState = 4; //ne
            self.dialog.style.cursor = 'ne-resize';
        } else if (pos.y >= (self.rect.h - (s.seRect.y + s.seRect.h)) &&
        pos.x >= (self.rect.w - (s.seRect.x + s.seRect.w)) && self.publicMembers.resizable) {
            self.moveState = 6; //se
            self.dialog.style.cursor = 'se-resize';
        } else if (pos.y >= (self.rect.h - (s.swRect.y + s.swRect.h)) &&
        pos.x <= s.swRect.w && self.publicMembers.resizable) {
            self.moveState = 8; //sw
            self.dialog.style.cursor = 'sw-resize';
        } else if (pos.y <= s.nwRect.h + s.nwRect.y &&
        pos.x <= s.nwRect.w && self.publicMembers.resizable) {
            self.moveState = 2; //nw
            self.dialog.style.cursor = 'nw-resize';
        } else if (pos.y <= s.nRect.h + s.nRect.y && self.publicMembers.resizable) {
            self.moveState = 3; //n
            self.dialog.style.cursor = 'n-resize';
        } else if (pos.y >= (self.rect.h - (s.sRect.y + s.sRect.h)) && self.publicMembers.resizable) {
            self.moveState = 7; //s
            self.dialog.style.cursor = 's-resize';
        } else if (pos.x >= (self.rect.w - (s.eRect.x + s.eRect.w)) && self.publicMembers.resizable) {
            self.moveState = 5; //e
            self.dialog.style.cursor = 'e-resize';
        } else if (pos.x <= s.wRect.w && self.publicMembers.resizable) {
            self.moveState = 9; //w
            self.dialog.style.cursor = 'w-resize';
        } else if (pos.y <= (s.titleRect.h + s.titleRect.y) && self.publicMembers.moveable) {
            self.moveState = 1; //titlebar
            self.dialog.style.cursor = 'move';
        } else {
            self.moveState = 0; //none
            self.dialog.style.cursor = 'default';
        }
        return self;
    };
    self.isActive = function isActive() {
        return Nina.UI.activeDialog === self;
    };
    self.title = function title(obj) {
        if (self.raiseEvent('titleChanged', self.titleBarText, obj, undefined)) { return self; };
        if (obj === undefined) { return self.titleBarText.textContent || self.titleBarText.innerText; }
        self.titleBarText.originalText = undefined;
        self.appendObj(self.titleBarText, obj);
        if(Nina.UI.widgets.taskBar) {
            Nina.UI.widgets.taskBar.stylize();
        }
        return self.titleBarText.textContent || self.titleBarText.innerText;
    };
    self.attached = false;
    self.mouseOffset = { x: 0, y: 0 };
    self.showPosition = { x: 0, y: 0 };
    self.mouseMove = function (e) {
        if (!self.publicMembers.showContentWhileMoving && self.attached && self.moveState !== 0) {
            self.preview.style.visibility = 'visible';
        }
        self.getMoveState(e);
        var o = self.mouseLiteral(e);
        var newRect = { x: self.rect.x, y: self.rect.y, h: self.rect.h, w: self.rect.w };
        if (self.moveState === 1 && self.attached) {
            //move
            newRect.x = o.x - self.mouseOffset.x;
            newRect.y = o.y - self.mouseOffset.y;
        } else if (self.moveState === 3 && self.attached) {
            //n
            newRect.y = o.y - self.mouseOffset.y;
            newRect.h = self.resizeOffset.y - newRect.y + self.resizeOffset.h;
        } else if (self.moveState === 9 && self.attached) {
            //w
            newRect.x = o.x - self.mouseOffset.x;
            newRect.w = self.resizeOffset.x - newRect.x + self.resizeOffset.w;
        } else if (self.moveState === 5 && self.attached) {
            //e
            newRect.w = self.resizeOffset.w + (o.x - self.mouseOffset.x) - self.resizeOffset.x;
        } else if (self.moveState === 7 && self.attached) {
            //s
            newRect.h = self.resizeOffset.h + (o.y - self.mouseOffset.y) - self.resizeOffset.y;
        } else if (self.moveState === 4 && self.attached) {
            //ne
            newRect.y = o.y - self.mouseOffset.y;
            newRect.h = self.resizeOffset.y - newRect.y + self.resizeOffset.h;
            newRect.w = self.resizeOffset.w + (o.x - self.mouseOffset.x) - self.resizeOffset.x;
        } else if (self.moveState === 6 && self.attached) {
            //se
            newRect.w = self.resizeOffset.w + (o.x - self.mouseOffset.x) - self.resizeOffset.x;
            newRect.h = self.resizeOffset.h + (o.y - self.mouseOffset.y) - self.resizeOffset.y;
        } else if (self.moveState === 8 && self.attached) {
            //sw
            newRect.x = o.x - self.mouseOffset.x;
            newRect.w = self.resizeOffset.x - newRect.x + self.resizeOffset.w;
            newRect.h = self.resizeOffset.h + (o.y - self.mouseOffset.y) - self.resizeOffset.y;
        } else if (self.moveState === 2 && self.attached) {
            //nw
            newRect.x = o.x - self.mouseOffset.x;
            newRect.w = self.resizeOffset.x - newRect.x + self.resizeOffset.w;
            newRect.y = o.y - self.mouseOffset.y;
            newRect.h = self.resizeOffset.y - newRect.y + self.resizeOffset.h;
        }
        if (self.attached) {
            if (self.moveState === 1) {
                if (self.raiseEvent('move', undefined, undefined, undefined)) { return self; };
            } else if (self.moveState !== 0) {
                if (self.raiseEvent('resize', undefined, undefined, undefined)) { return self; };
            }
            self.setRect(newRect);
        }
        return self;
    };
    self.startMoving = function startMoving(e) {
        if (self.controlButtonDepressed) { return; };
        Nina.UI.activeDialog = self;
        Nina.UI.stylizeDialogs();
        self.publicMembers.centerHorizontally = false;
        self.publicMembers.centerVertically = false;
        self.attached = true;
        self.mouseOffset = self.mouse(e, self.titleBar);
        self.mouseOffset.x += self.style.wRect.x + self.style.wRect.w;
        self.mouseOffset.y += +self.style.nRect.y + self.style.nRect.h;
        self.resizeOffset = self.rect;
    };
    self.stopMoving = function stopMoving() {
        self.controlButtonDepressed = false;
        self.attached = false;
        if (!self.publicMembers.showContentWhileMoving) {
            self.preview.style.visibility = 'hidden';
            self.setRect(self.rect);
        }
    };
    self.moveToCenter = function moveToCenter() {
        if (self.publicMembers.centerHorizontally) {
            self.rect.x = parseInt(self.client().w * .5, 10) -
                parseInt(self.rect.w * .5, 10);
        }
        if (self.publicMembers.centerVertically) {
            self.rect.y = parseInt(self.client().h * .5, 10) -
                parseInt(self.rect.h * .5, 10);
        }
        return self.setRect(self.rect);
    };
    self.browserResize = function browserResize(e) {
        self.resizeMaximized();
        self.moveToCenter(e);
    };
    self.resizeMaximized = function () {
        if (self.state === 2) {
            // if there's a task bar then don't get so big
            var tbOffsetH = Nina.UI.widgets.taskBar ? Nina.UI.widgets.taskBar.rect.h + Nina.UI.widgets.taskBar.style.border.size : 0;
            self.rect.x = 0 + self.style.maximizeOffsetRect.x;
            self.rect.y = 0 + self.style.maximizeOffsetRect.y;
            self.rect.w = self.client().w + self.style.maximizeOffsetRect.w;
            self.rect.h = self.client().h + self.style.maximizeOffsetRect.h - tbOffsetH;
            self.setRect(self.rect).stylize();
            if (self.raiseEvent('resize', undefined, undefined, undefined)) { return self; };
        }
        return self;
    };
    self.minimize = function () {
        if (self.raiseEvent('minimize', undefined, undefined, undefined)) { return self; };
        self.originalBodyOverflowStyle = document.body.style.overflow;
        self.originalScroll = { top: window.document.documentElement.scrollTop, left: window.document.documentElement.scrollLeft };
        self.restoreRect = { x: self.rect.x, y: self.rect.y, h: self.rect.h, w: self.rect.w };
        self.state = 1;
        self.dialog.style.visibility = 'hidden';
        return self;
    };
    self.maximize = function () {
        if (self.raiseEvent('maximize', undefined, undefined, undefined)) { return self; };
        self.state = 2;
        self.publicMembers.resizable = false;
        self.publicMembers.moveable = false;
        self.restoreRect = { x: self.rect.x, y: self.rect.y, h: self.rect.h, w: self.rect.w };
        self.originalBodyOverflowStyle = document.body.style.overflow;
        self.originalScroll = { top: window.document.documentElement.scrollTop, left: window.document.documentElement.scrollLeft };
        window.document.documentElement.scrollTop = 0;
        window.document.documentElement.scrollLeft = 0;
        document.body.style.overflow = 'hidden';
        self.resizeMaximized();
        return self;
    };
    self.restore = function () {
        if (self.raiseEvent('restore', undefined, undefined, undefined)) { return self; };
        document.body.style.overflow = self.originalBodyOverflowStyle;
        window.document.documentElement.scrollTop = self.originalScroll.top;
        window.document.documentElement.scrollLeft = self.originalScroll.left;
        self.state = 0;
        self.publicMembers.resizable = true;
        self.publicMembers.moveable = true;
        self.rect = { x: self.restoreRect.x, y: self.restoreRect.y, h: self.restoreRect.h, w: self.restoreRect.w };
        self.dialog.style.visibility = 'visible';
        self.setRect(self.rect).stylize();
        return self;
    };
    self.minButtonEvent = function () {
        self.controlButtonDepressed = false;
        self.minimize();
    };
    self.maxRestoreButtonEvent = function () {
        self.controlButtonDepressed = false;
        if (self.state === 2) {//maximized
            self.restore();
        } else {
            self.maximize();
        }
    };
    // when a button is pressed, stop moving and resizing
    // and listen for when it gets clicked
    self.buttonStartEvent = function () {
        Nina.UI.activeDialog = self;
        Nina.UI.stylizeDialogs();
        self.controlButtonDepressed = true;
    };
    self.closeButtonEvent = function () {
        self.controlButtonDepressed = false;
        self.close();
    };
    self.close = function close() {
        if (self.raiseEvent('close', undefined, undefined, undefined)) { return self; }
        self.dispose();
        return self;
    };
    self.show = function () {
        if (!self.hidden) { return self; }
        if (self.raiseEvent('show', undefined, undefined, undefined)) { return self; };
        self.hidden = false;
        self.rect.x = self.showPosition.x;
        self.rect.y = self.showPosition.y;
        self.showPosition = undefined;
        return self.setRect(self.rect);
    };
    self.hide = function () {
        if (self.hidden) { return self; }
        if (self.raiseEvent('hide', undefined, undefined, undefined)) { return self; };
        self.hidden = true;
        self.showPosition = undefined;
        return self.setRect(self.rect);
    };
    self.setRect = function (rect) {
        var s = self.style;
        rect.x = rect.x <= s.minRect.x ? s.minRect.x : rect.x;
        rect.y = rect.y <= s.minRect.y ? s.minRect.y : rect.y;
        rect.w = rect.w <= s.minRect.w ? s.minRect.w : rect.w;
        rect.h = rect.h <= s.minRect.h ? s.minRect.h : rect.h;
        self.publicMembers.rect = self.rect = rect;
        if (self.hidden && self.showPosition === undefined) {
            self.showPosition = { x:self.rect.x,y:self.rect.y };
            rect.x = -10000;
            rect.y = -10000;
        }
        if (self.attached && !self.publicMembers.showContentWhileMoving) {
            // why do I need a -1 here?!
            self.updateElementRect(self.preview,
                (rect.w - s.maximizeOffsetRect.w) - s.previewOutline.size - 1,
                (rect.h - s.maximizeOffsetRect.h) - s.previewOutline.size - 1,
                (rect.x - s.maximizeOffsetRect.x) + s.previewOutline.size,
                (rect.y - s.maximizeOffsetRect.y) + s.previewOutline.size);
            return self;
        }
        // updateElementRect( w, h, x, y )
        // dialog
        self.updateElementRect(self.dialog, rect.w, rect.h, rect.x, rect.y);
        // title
        self.updateElementRect(self.titleBar,
        rect.w + s.titleRect.w - s.wRect.w - s.eRect.w - s.titlePadding.r,
        s.titleRect.h - s.titlePadding.t - s.titlePadding.b, s.titleRect.x + s.wRect.w + s.wRect.x, s.titleRect.y + s.nRect.h + s.nRect.y);
        // title text
        self.titleBarText.style.height = s.titleRect.h - s.titlePadding.t - s.titlePadding.b + 'px';
        //content
        self.updateElementRect(self.content,
        rect.w + s.contentRect.w - s.wRect.x - s.wRect.x - s.wRect.w - s.eRect.w, // w
        rect.h + s.contentRect.h - s.titleRect.h - s.titleRect.y - s.nRect.y - s.nRect.h + s.sRect.y - s.sRect.h, // h
        s.wRect.w + s.wRect.x + s.contentRect.x, // x
        s.contentRect.y + s.titleRect.h + s.nRect.h + s.nRect.y + s.titleRect.y); // y
        // n
        self.updateElementRect(self.n, rect.w - s.wRect.x - s.wRect.w - s.eRect.w,
        s.nRect.h, s.nRect.x + s.wRect.w + s.wRect.x, s.nRect.y);
        // ne
        self.updateElementRect(self.ne, s.neRect.w,
        s.neRect.h, rect.w + s.neRect.x - s.neRect.w,
        s.neRect.y);
        // e
        self.updateElementRect(self.e, s.eRect.w,
        rect.h + s.eRect.h - s.nRect.y - s.nRect.h - s.sRect.h,
        rect.w + s.eRect.x - s.eRect.w,
        s.eRect.y + s.nRect.y + s.nRect.h);
        // se
        self.updateElementRect(self.se, s.seRect.w,
        s.seRect.h, rect.w + s.seRect.x - s.seRect.w,
        rect.h + s.seRect.y - s.seRect.h);
        // s
        self.updateElementRect(self.s, rect.w - s.wRect.x - s.wRect.w - s.eRect.w,
        s.sRect.h, s.sRect.x + s.wRect.w + s.wRect.x, rect.h + s.sRect.y - s.sRect.h);
        // sw
        self.updateElementRect(self.sw, s.swRect.w,
        s.swRect.h, s.swRect.x, rect.h + s.swRect.y - s.swRect.h);
        // w
        self.updateElementRect(self.w, s.wRect.w,
        rect.h + s.wRect.h - s.nRect.y - s.nRect.h - s.sRect.h,
        s.wRect.x, s.wRect.y + s.nRect.y + s.nRect.h);
        // nw
        self.updateElementRect(self.nw, s.nwRect.w,
        s.nwRect.h, s.nwRect.x, s.nwRect.y);
        // min
        self.updateElementRect(self.minimizeButton, s.minimizeRect.w,
        s.minimizeRect.h, rect.w + s.closeRect.x + s.maximizeRect.x +
        s.minimizeRect.x - s.titlePadding.l - s.minimizeRect.w - s.maximizeRect.w -
        s.closeRect.w - (s.Active.buttonBorder.size * 5),
        s.minimizeRect.y - s.Active.buttonBorder.size);
        // max
        self.updateElementRect(self.maximizeButton, s.maximizeRect.w,
        s.maximizeRect.h, rect.w + s.closeRect.x + s.maximizeRect.x - s.titlePadding.l -
        s.maximizeRect.w - s.closeRect.w - (s.Active.buttonBorder.size * 3),
        s.maximizeRect.y - s.Active.buttonBorder.size);
        // close
        self.updateElementRect(self.closeButon, s.closeRect.w,
        s.closeRect.h, rect.w + s.closeRect.x - s.titlePadding.l -
        s.closeRect.w,
        s.closeRect.y - s.Active.buttonBorder.size);
        // clip text
        self.clipText(self.titleBarText,
            rect.w + s.titleRect.w - s.wRect.w - s.eRect.w - s.titlePadding.l - s.titlePadding.r -
            s.closeRect.w - s.maximizeRect.w - s.minimizeRect.w);
        return self;
    };
    self.styleElement = function styleElement(e, c, b) {
        e.style.color = c;
        e.style.background = b;
        return self;
    };
    self.stylize = function applyStyle() {// apply the style
        if (self.raiseEvent('stylize', undefined, undefined, undefined)) { return self; };
        var s = self.style;
        var a = Nina.UI.activeDialog === self ? self.style.Active : self.style.Inactive;
        if (Nina.UI.activeDialog === self) {
            if (self.modal || self.publicMembers.alwaysOnTop) {
                self.modalBackground.style.zIndex = ++Nina.UI.topModalZIndex;
                self.dialog.style.zIndex = ++Nina.UI.topModalZIndex;
            } else {
                self.dialog.style.zIndex = ++Nina.UI.topZIndex;
            }
        }
        self.titleBar.style.borderBottom = self.border(a.titleBorder);
        self.titleBarText.style.padding = self.pad(s.titlePadding);
        self.titleBarText.style.fontFamily = s.titleFont;
        self.styleElement(self.dialog, a.dialogColor, a.dialogBackground);// dialog
        self.styleElement(self.titleBar, a.titleColor, a.titleBackground);// title
        self.styleElement(self.content, a.contentColor, a.contentBackground);//content
        self.styleElement(self.n, '', a.nBackground);   // n
        self.styleElement(self.ne, '', a.neBackground); // ne
        self.styleElement(self.e, '', a.eBackground);   // e
        self.styleElement(self.se, '', a.seBackground); // se
        self.styleElement(self.s, '', a.sBackground);   // s
        self.styleElement(self.sw, '', a.swBackground); // sw
        self.styleElement(self.w, '', a.wBackground);   // w
        self.styleElement(self.nw, '', a.nwBackground); // nw
        self.styleElement(self.closeButon, '', a.closeButtonBackground); // close
        self.styleElement(self.minimizeButton, '', a.minimizeButtonBackground); // min
        if (self.state === 2) {
            self.styleElement(self.maximizeButton, '', a.restoreButtonBackground); // restore
        } else {
            self.styleElement(self.maximizeButton, '', a.maximizeButtonBackground); // max
        }
        var b = [self.closeButon, self.maximizeButton, self.minimizeButton];
        for (var x = 0; b.length > x; x++) {
            b[x].style.border = self.border(a.buttonBorder);
            b[x].style.padding = '0';
            b[x].style.margin = '0';
        }
        return self;
    };
    self.dispose = function dispose() {
        if (self.raiseEvent('dispose', undefined, undefined, undefined)) { return self; }
        // remove from taskbar
        if (Nina.UI.widgets.taskBar && self.taskBarItem){
            Nina.UI.widgets.taskBar.remove(self.taskBarItem);
        }
        // remove events
        self.titleBar.removeEventListener('dblclick', self.maxRestoreButtonEvent, true);
        self.dialog.removeEventListener('mousedown', self.startMoving, false);
        document.documentElement.removeEventListener('mouseup', self.stopMoving, true);
        document.documentElement.removeEventListener('mousemove', self.getMoveState, true);
        self.closeButon.removeEventListener('mousedown', self.buttonStartEvent, true);
        self.maximizeButton.removeEventListener('mousedown', self.buttonStartEvent, true);
        self.minimizeButton.removeEventListener('mousedown', self.buttonStartEvent, true);
        self.closeButon.removeEventListener('click', self.closeButtonEvent, true);
        self.maximizeButton.removeEventListener('click', self.maxRestoreButtonEvent, true);
        self.minimizeButton.removeEventListener('click', self.minButtonEvent, true);
        self.dialog.removeEventListener('mouseout', self.mouseoffButtons, false);
        self.closeButon.removeEventListener('mouseover', function () { self.mouseoverButtons(0); }, true);
        self.maximizeButton.removeEventListener('mouseover', function () { self.mouseoverButtons(1); }, true);
        self.minimizeButton.removeEventListener('mouseover', function () { self.mouseoverButtons(2); }, true);
        // remove global ref
        delete Nina.UI.widgets.dialogs[self.id];
        delete Nina.UI.widgets.widgets[self.id];
        // remove from DOM
        document.body.removeChild(self.dialog);
        if (self.modal) {
            document.body.removeChild(self.modalBackground);
        }
        return null;
    };
    if (!args.dontInit) {
        self.init();
    }
    // return publicMembers
    return self.publicMembers;
};/* END dialog.js */
/* START taskBar.js */
﻿/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING w
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Creates a DHTML based task bar for holding Nina.UI.Dialog widgets and Nina.UI.Notification widgets.
* @constructor
* @name taskBar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.Widget
* @requires Nina
* @requires Nina.UI
* @requires Nina.UI.Style.taskBar
* @memberOf Nina.UI
*/
Nina.UI.taskBar = function (args) {
    // there can be only one
    if (Nina.UI.widgets.taskBar !== undefined) {
        return;
    }
    args = args || { };
    var self = Nina.beget(Nina.UI.Widget);
    self.publicMembers = {};
    self.style = args.style || Nina.UI.Style.taskBar();
    self.type = 'taskBar';
    self.items = [];
    self.activeItem = undefined;
    self.hoverItem = undefined;
    self.events = {
        /**
        * Occurs after the Nina.UI.taskBar is initialized.
        * @event
        * @name init
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        init: self.addInitalEvents(args.init),
        /**
        * Occurs when the task bar is clicked.
        * @event
        * @name click
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        click: self.addInitalEvents(args.click),
        /**
        * Occurs when the mouse moves over the task bar.
        * @event
        * @name mouseover
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        mouseover: self.addInitalEvents(args.mouseover),
        /**
        * Occurs when the mouse leaves the task bar.
        * @event
        * @name mouseout
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        mouseout: self.addInitalEvents(args.mouseout),
        /**
        * Occurs when an item is clicked.
        * @event
        * @name itemClick
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        itemClick: self.addInitalEvents(args.itemClick),
        /**
        * Occurs when the mouse moves over an item.
        * @event
        * @name itemMouseover
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        itemMouseover: self.addInitalEvents(args.itemMouseover),
        /**
        * Occurs when the mouse moves off of an item.
        * @event
        * @name itemMouseout
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        itemMouseout: self.addInitalEvents(args.itemMouseout),
        /**
        * Occurs when an item is added to the collection.
        * @event
        * @name addItem
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        addItem: self.addInitalEvents(args.addItem),
        /**
        * Occurs when an item is removed from the collection.
        * @event
        * @name removeItem
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        removeItem: self.addInitalEvents(args.removeItem),
        /**
        * Occurs when the task bar's rect is updated.
        * @event
        * @name updateRect
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        updateRect: self.addInitalEvents(args.updateRect),
        /**
        * Occurs when the task bar's style is updated.
        * @event
        * @name updateStyle
        * @memberOf Nina.UI.taskBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.taskBar instance.
        */
        updateStyle: self.addInitalEvents(args.updateStyle)
    };
    self.createPublicMembers = function () {
        /**
        * The items belonging to the task bar.
        * @field
        * @name items
        * @memberOf Nina.UI.taskBar
        * @public
        * @returns {Native.Array} Array of Nina.UI.taskBarItem.
        */
        self.publicMembers.items = self.items;
        /**
        * The rect of the task bar.
        * @field
        * @name rect
        * @memberOf Nina.UI.taskBar
        * @public
        * @returns {Nina.UI.Rect} Nina.UI.taskBar instance.
        */
        self.publicMembers.rect = self.rect;
        /**
        * The type of widget. Returns taskBar.
        * @field
        * @name type
        * @type Native.String
        * @memberOf Nina.UI.taskBar
        */
        self.publicMembers.type = self.type;
        /**
        * The session unique id of the taskBar.
        * @field
        * @name id
        * @type Native.String
        * @memberOf Nina.UI.taskBar
        */
        self.publicMembers.id = self.id;
        /**
        * Applies the current Nina.UI.Style.taskBar to the Nina.UI.taskBar.
        * @function
        * @name redraw
        * @memberOf Nina.UI.taskBar
        * @public
        * @returns {Nina.UI.taskBar} Nina.UI.taskBar.
        */
        self.publicMembers.redraw = self.redraw;
        /**
        * Adds an item to the Nina.UI.taskBar.
        * @function
        * @name add
        * @memberOf Nina.UI.taskBar
        * @param {Native.HTMLElement} [obj] The object refrence to add to the item.
        * @param {Native.Function} [click] The function to execute when the item is clicked.
        * @param {Native.Function|Native.HTMLElement|Native.String|Native.Array} [text] The object to set as the title of the item.
        * @param {Native.Function} [over] The function to execute when the mouse moves over the item.
        * @param {Native.Function} [out] The function to execute when the mouse moves off the item.
        * @returns {Nina.UI.taskBarItem} Item added to the Nina.UI.taskBar.
        */
        self.publicMembers.add = self.add;
        /**
        * Adds an item to the Nina.UI.taskBar.
        * @function
        * @name remove
        * @memberOf Nina.UI.taskBar
        * @param {Nina.UI.taskBarItem} [obj] The item to remove from the Nina.UI.taskBar.
        * @returns {Nina.UI.taskBar} Item added to the Nina.UI.taskBar.
        */
        self.publicMembers.remove = self.remove;
        return self;
    };
    self.init = function () {
        // raise init event
        if (self.raiseEvent('init', undefined, undefined, undefined)) { return self; };
        // create an id for this widget
        self.id = Nina.UI.widgetIdCount++;
        Nina.UI.widgets.taskBar = self;
        // setup rect
        args.rect = args.rect || {};
        self.publicMembers.rect = self.rect = {
            x: args.rect.x || self.style.rect.x,
            y: args.rect.y || self.style.rect.y,
            w: args.rect.w || self.style.rect.w,
            h: args.rect.h || self.style.rect.h
        };
        // create bar
        self.taskBar = this.createElement('div');
        self.noSelect([self.taskBar]);
        self.taskBar.style.position = 'absolute';
        self.taskBar.style.overflow = 'hidden';
        self.taskBar.onclick = function (e) {
            if (self.raiseEvent('click', e, self.taskBar, [])) { return self; };
        };
        self.taskBar.onmouseover = function (e) {
            if (self.raiseEvent('mouseover', e, self.taskBar, [])) { return self; };
        };
        self.taskBar.onmouseout = function (e) {
            if (self.raiseEvent('mouseout', e, self.taskBar, [])) { return self; };
        };
        window.document.body.appendChild(self.taskBar);
        window.addEventListener('resize', self.browserResize, true);
        self.createPublicMembers();
        return self.setRect().stylize();
    };
    self.browserResize = function() {
        self.setRect();
        return;
    };
    self.setRect = function (rect) {
        if (self.raiseEvent('updateRect', undefined, undefined, undefined)) { return self; };
        rect = rect || self.rect;
        var s = self.style;
        self.updateElementRect(self.taskBar,
            self.client().w,
            rect.h,
            rect.x,
            rect.y + self.client().h - rect.h - s.border.size
        );
        var items = self.items;
        for (var x = 0; items.length > x; x++) {
            var l = items[x].element;
            l.firstChild.innerHTML = '';
            self.appendObj(l.firstChild, items[x].text);
            self.updateElementRect(items[x].element,
                s.item.rect.w,
                s.item.rect.h,
                s.item.rect.x,
                s.item.rect.y
            );
            self.clipText(l.firstChild, s.item.rect.w - s.item.padding.r - s.item.padding.l);
        }
        return self;
    };
    self.stylize = function () {
        if (self.raiseEvent('updateStyle', undefined, undefined, undefined)) { return self; };
        var s = self.style;
        self.taskBar.style.background = s.background;
        self.taskBar.style.borderTop = self.border(s.border);
        var items = self.items;
        for (var x = 0; items.length > x; x++) {
            var l = items[x].element;
            l.firstChild.style.padding = self.pad(s.item.padding);
            l.style.fontFamily = s.item.font;
            l.style.color = s.item.textColor;
            l.style.background = s.item.background;
            l.style.border = self.border(s.item.border);
            l.style.marginLeft = s.item.spacing + 'px';
        }
        return self;
    };
    self.redraw = function() {
        return self.stylize().setRect();
    };
    self.add = function (obj, click, text, over, out) {
        var item = {
            obj: obj,
            click: click,
            text: text,
            mouseover: over,
            mouseout: out,
            element: self.createElement('div')
        };
        if (self.raiseEvent('addItem', obj, item, [])) { return self; };
        var l = item.element;
        l.onclick = function(e) {
            if (self.raiseEvent('itemClick', e, l, [])) { return self; };
            self.activeItem = item;
            if (!item.click) { return self; }
            item.click.apply(self, [e, l]);
            return self;
        };
        l.onmouseover = function (e) {
            if (self.raiseEvent('itemMouseover', e, l, [])) { return self; };
            l.style.background = self.style.item.hover.background;
            l.style.color = self.style.item.hover.textColor;
            self.hoverItem = item;
            if (!item.mouseover) { return self; }
            item.mouseover.apply(self, [e, l]);
            return self;
        };
        l.onmouseout = function (e) {
            if (self.raiseEvent('itemMouseout', e, l, [])) { return self; };
            l.style.background = self.style.item.background;
            l.style.color = self.style.item.textColor;
            if (!item.mouseout) { return self; }
            item.mouseout.apply(self, [e, l]);
            return self;
        };
        l.appendChild(self.createElement('span'));
        self.noSelect([l]);
        self.noSelect([l.firstChild]);
        l.style.display = 'inline-block';
        l.style.cursor = 'pointer';
        l.firstChild.style.whiteSpace = 'nowrap';
        l.style.overflow = 'hidden';
        self.taskBar.appendChild(l);
        self.items.push(item);
        self.redraw();
        return item;
    };
    self.remove = function (item) {
        var items = self.items;
        for (var x = 0; items.length > x; x++) {
            if (items[x] === item) {
                if (self.raiseEvent('removeItem', items[x], item.element, [])) { return self; };
                self.taskBar.removeChild(item.element);
                self.items.splice(x, 1);
            }
        }
        return self.setRect().stylize();
    };
    self.init();
    // return publicMembers
    return self.publicMembers;
};/* END taskBar.js */
/* START ajax.js */
﻿/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Sends structured JSON requests to a HTTP server running Nina.Core.
* @constructor
* @name ajax
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @requires Nina
* @memberOf Nina
* @param {Native.Object} [args] Request object or an array of request objects.
* @param {Native.Object} [options=undefined] Options and events associated with the request collection.
* @param {Native.String} [args.method] The method to execute on the server.  Should be in the format <namespace>.<class>.<method>. E.g.: Nina.Authentication.Logon.  When in the Nina namespace the namespace can be omitted.
* @param {Native.Array} [args.parameters=undefined] The array of parameters to pass to the method.  Parameters can be of the type String, Number, Boolean, File Input, or an Array or Object of these types.  Files can contain multiple files as defined in the HTML 5 doctype.
* @param {Native.Function} [args.procedure] The procedure to run when the method responds.  The functions signature is (returnData, allReturnDataFromAllRequests).
* @param {Native.Object} [args.context=undefined] The scope that the callback procedure runs in.  This defines the keyword 'this' inside the callback procedure.
* @param {Native.Function} [options.loadstart=undefined] Event occurs once.  Occurs when the request begins.
* @param {Native.Function} [options.progress=undefined] Event occurs zero or more times.  Occurs while sending and loading data.  Signature is (progressEventObject).  The object contains the members loaded, total.
* @param {Native.Function} [options.error=undefined] Event occurs zero or once.  Occurs when progression has failed.
* @param {Native.Function} [options.abort=undefined] Event occurs zero or once.  Occurs when progression is terminated.
* @param {Native.Function} [options.load=undefined] Event occurs zero or once.  Occurs when progression is successful.
* @param {Native.Function} [options.loadend=undefined] Event occurs once.  Occurs when progression has stopped.
* @param {Native.Function} [options.readyStateChange=undefined]  Event occurs two or more times.  Occurs when request is about to be sent and when the request state has changed.
* @param {Native.String} [options.method=POST] The method the request will use.
* @param {Native.String} [options.responderUrl=/responder] The URL the request will use.
* @param {Native.String} [options.contentType='application/x-www-form-urlencoded; charset=utf-8'] The MIME type of the content and the content's encoding separated by ; .
* @param {Native.Boolean} [options.async=true] The asynchronous mode the request will use.  True = asynchronous, false = synchronous.
* @param {Native.Array} [options.headers=undefined] An array of arrays that represent headers. E.g.: [['X-Requested-With','XMLHttpRequest']].
* @param {Native.Boolean} [options.delayRequest=false] Delay the request until the instance method Nina.ajax.beginRequest() is called.
* @example <caption>Create a request for a single method.</caption>
* var foo = Nina.ajax({
*    method: 'Authentication.CreateAccount',
*    parameters: ['Test', '1234'],
*    procedure: function (e) {
*        alert(e.Message);
*    }
* });
* @example <caption>Create a request for two methods.</caption>
* var foo = Nina.ajax([
*    {
*        method: 'Authentication.CreateAccount',
*        parameters: ['Test', '1234'],
*        procedure: function (e) {
*            alert(e.Message);
*        }
*    },
*    {
*        method: 'Authentication.Logon',
*        parameters: ['Test', '1234'],
*        procedure: function (e) {
*            alert(e.Message);
*        }
*    }
* ]);
* @example <caption>Create a request that contains a file and show the progress of the upload.</caption>
* var foo = Nina.ajax({
*    method: 'FileManager.Upload',
*    parameters: ['~\\', document.getElementById('file1')],
*    procedure: function (e) {
*        document.body.innerHTML = e.Message;
*    }
* },
* {
*    progress:function (e) {
*        document.body.innerHTML = Math.round((e.loaded / e.total) * 100) + ' %';
*    }
* });
* @example <caption>Create a request that contains more than one file.</caption>
* var x = Nina.ajax({
*    method: 'FileManager.UploadFiles',
*    parameters: [['~\\','~\\'], [document.getElementById('file1'),document.getElementById('file2')]],
*    procedure: function (e) {
*        showMessage(b, e.Message, t);
*    }
* });
*/
Nina.ajax = function (args, options) {
    // using this as a reference http://www.w3.org/TR/XMLHttpRequest/
    Nina.assert(args !== undefined, 'Nina.ajax missing parameter.');
    var self = {};
    self.options = options || { };
    var createRequest = function() {
        try { return new XMLHttpRequest(); } catch(e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
        return null;
    };
    /**
    * Begins the request.
    * @function
    * @name beginRequest
    * @memberOf Nina.ajax
    * @public
    * @returns {Nina.ajax} Nina.ajax instance.
    */
    self.beginRequest = function () {
        self.map = [];
        self.methodInstances = { };
        if (!Nina.isArray(args)) {
            args = [args];
        }
        for (var x = 0; args.length > x; x++) {
            // assign this method an instance number in case it occurs more than once
            if (self.methodInstances[args[x].method] === undefined) {
                self.methodInstances[args[x].method] = 0;
            }else {
                self.methodInstances[args[x].method]++;
            }
            self.map.push([
                args[x].method,
                args[x].parameters
            ]);
            // assign the instance number back to the mapper object
            args[x].instanceNumber = self.methodInstances[args[x].method];
        }
        self.id = Nina.createUUID();
        self.request = createRequest();
        self.request.upload.addEventListener('loadstart',function (e) {
            if (typeof self.options.loadstart !== 'function') { return; }
            self.options.loadstart.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('progress', function (e) {
            if (typeof self.options.progress !== 'function') { return; }
            self.options.progress.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('abort', function (e) {
            if (typeof self.options.abort !== 'function') { return; }
            self.options.abort.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('error', function (e) {
            if (typeof self.options.error !== 'function') { return; }
            self.options.error.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('load', function (e) {
            if (typeof self.options.load !== 'function') { return; }
            self.options.load.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('timeout', function (e) {
            if (typeof self.options.timeout !== 'function') { return; }
            self.options.timeout.apply(this, [e]);
        }, false);
        self.request.upload.addEventListener('loadend', function (e) {
            if (typeof self.options.loadend !== 'function') { return; }
            self.options.loadend.apply(this, [e]);
        }, false);
        self.request.addEventListener('readystatechange', function () {
            if (typeof self.options.readyStateChange !== 'function') {
                readyStateChange();
                return;
            }
            // allow user to abort default readStateChange by returning false.
            if(self.options.readyStateChange.apply(this, [e])!==false) {
                readyStateChange();
            }
        }, false);
        self.request.open(self.options.method || 'POST', (self.options.responderUrl || '/responder') + '?' + self.id, self.options.async === false ? false : true);
        self.request.setRequestHeader('Content-Type', self.options.contentType || 'application/x-www-form-urlencoded; charset=utf-8');
        self.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if(self.options.headers!==undefined) {
            for(var x=0;self.options.headers.length>x;x++) {
                self.request.setRequestHeader(self.options.headers[x][0], self.options.headers[x][1]);
            }
        }
        var d = new FormData;
        d.append("id", self.id);
        // parse map looking for file inputs and replace them with IDs
        parseFiles(self.map);
        d.append("map", JSON.stringify(self.map));
        for (var x = 0; args.length > x; x++) {
            if (args[x].files) {
                for (var z = 0; args[x].files.length > z; z++) {
                    d.append(args[x].files[z].fileId, args[x].files[z]);
                }
            }
        }
        self.request.send(d);
        return self;
    };
    var pushFile = function(f, a) {
        if (Nina.isArray(a.files)) {
            a.files.push(f);
        } else {
            a.files = [f];
        }
    };
    var writeFileId = function(method, instance, z, y) {
        return "file:::" + method + '_' + instance + "_files_" + z + "_" + y;
    };
    var parseFiles = function(map) {
        for (var x = 0; args.length > x; x++) {
            var a = args[x];
            for (var t = 0; args[x].parameters.length > t; t++) {
                var p = args[x].parameters[t];
                if (Nina.isArray(p)) {
                    var fa = [];
                    for (var z = 0; p.length > z; z++) {
                        var f = p[z];
                        if (f.type == 'file') {
                            for (var y = 0; f.files.length > y; y++) {
                                pushFile(f.files[y], a);
                                f.files[y].fileId = writeFileId(a.method, a.instanceNumber, z, y);
                                fa.push(f.files[y].fileId);
                            }
                        }
                    }
                    if(fa.length>0) {
                        args[x].parameters[t] = fa.join("");
                    }
                } else {
                    if (p.type == 'file') {
                        var fa = [];
                        for (var y = 0; p.files.length > y; y++) {
                            pushFile(p.files[y], a);
                            p.files[y].fileId = writeFileId(a.method, a.instanceNumber, 0, y);
                            fa.push(p.files[y].fileId);
                        }
                        if(fa.length>0) {
                            args[x].parameters[t] = fa.join("");
                        }
                    }
                }
            }
        }
    };
    var readyStateChange = function() {
        if (self.request.readyState != 4 || self.request.status == 0) { return; }
        if (self.request.status != 200) {
            // an error occurred
            Nina.UI.Widget.log('Nina.ajax request returned a status of ' + self.request.status + ':\n' + self.request.responseText);
            return;
        }
        var allResults = JSON.parse(self.request.responseText);
        // separate responses into map collection and call callback functions
        for (var x = 0; args.length > x; x++) {
            var instanceNumber = self.methodInstances[args[x].method] > 0 ? '_' + args[x].instanceNumber : '';
            args[x].procedure.apply(args[x].context || this, [allResults[args[x].method + instanceNumber], allResults]);
        }    
    };
    if(self.options.delayRequest !== false){
        self.beginRequest();
    }
    return self;
}/* END ajax.js */
/* START dialog.js */
﻿/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Style for the Nina.UI.Dialog
* @constructor
* @name dialog
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.WidgetStyle
* @requires Nina
* @requires Nina.UI
* @memberOf Nina.UI.Style
* @param {Native.Object} [args] Parameters for the style.
* @param {Nina.UI.Rect} [args.rect] The Nina.UI.Rect used by the Nina.UI.Dialog during initialization.
* @param {Nina.UI.Rect} [args.minRect] The minimum size Nina.UI.Rect used by the Nina.UI.Dialog.
* @param {Nina.UI.Rect} [args.contentRect] The Nina.UI.Rect used for the content area.
* @param {Nina.UI.Rect} [args.titleRect] The Nina.UI.Rect used for the content area. Offset x, y, w and actual h.
* @param {Nina.UI.Rect} [args.nRect] The Nina.UI.Rect used north edge.
* @param {Nina.UI.Rect} [args.neRect] The Nina.UI.Rect used north east corner.
* @param {Nina.UI.Rect} [args.eRect] The Nina.UI.Rect used east edge.
* @param {Nina.UI.Rect} [args.seRect] The Nina.UI.Rect used south east corner.
* @param {Nina.UI.Rect} [args.sRect] The Nina.UI.Rect used south edge.
* @param {Nina.UI.Rect} [args.swRect] The Nina.UI.Rect used south west corner.
* @param {Nina.UI.Rect} [args.wRect] The Nina.UI.Rect used wRect edge.
* @param {Nina.UI.Rect} [args.nwRect] The Nina.UI.Rect used north west corner.
* @param {Nina.UI.Rect} [args.minimizeRect] The Nina.UI.Rect for the minimize button.
* @param {Nina.UI.Rect} [args.maximizeRect] The Nina.UI.Rect for the maximize button.
* @param {Nina.UI.Rect} [args.closeRect] The Nina.UI.Rect for the close button.
* @param {Nina.UI.Border} [args.Inactive.buttonBorder] The Nina.UI.Border used for the inactive button borders.
* @param {Nina.UI.Border} [args.Active.buttonBorder] The Nina.UI.Border used for the active button borders.
* @param {Nina.UI.Border} [args.Active.titleBorder] The Nina.UI.Border used for the active title borders.
* @param {Nina.UI.Border} [args.Inactive.titleBorder] The Nina.UI.Border used for the inactive title borders.
* @param {Nina.UI.Border} [args.previewOutline] The Nina.UI.Border used for the move/resize preview outline.
* @param {Nina.UI.Padding} [args.titlePadding] The Nina.UI.Padding used for the title padding.
* @param {Native.String} [args.Active.titleColor] The HTML color code used for the title text color.
* @param {Native.String} [args.Inactive.titleColor] The HTML color code used for the inactive title text color.
* @param {Native.String} [args.Inactive.dialogColor] The HTML color code used for the dialog text color.
* @param {Native.String} [args.Inactive.contentColor] The HTML color code used for the content text color.
* @param {Native.String} [args.Active.dialogColor] The HTML color code used for the dialog text color.
* @param {Native.String} [args.Active.contentColor] The HTML color code used for the content text color.
* @param {Native.String} [args.Active.Hover.maximizeButtonBackground] The background used for the active maximize button when it is hovered over.
* @param {Native.String} [args.Active.Hover.minimizeButtonBackground] The background used for the active minimize button when it is hovered over.
* @param {Native.String} [args.Active.Hover.closeButtonBackground] The background used for the active close button when it is hovered over.
* @param {Native.String} [args.Active.Hover.restoreButtonBackground] The background used for the active restore button when it is hovered over.
* @param {Native.String} [args.Inactive.Hover.maximizeButtonBackground] The background used for the inactive maximize button when it is hovered over.
* @param {Native.String} [args.Inactive.Hover.minimizeButtonBackground] The background used for the inactive minimize button when it is hovered over.
* @param {Native.String} [args.Inactive.Hover.closeButtonBackground] The background used for the inactive close button when it is hovered over.
* @param {Native.String} [args.Inactive.Hover.restoreButtonBackground] The background used for the inactive restore button when it is hovered over.
* @param {Native.String} [args.Inactive.maximizeButtonBackground] The background used for the inactive maximize button.
* @param {Native.String} [args.Inactive.minimizeButtonBackground] The background used for the inactive minimize button.
* @param {Native.String} [args.Inactive.closeButtonBackground] The background used for the inactive close button.
* @param {Native.String} [args.Inactive.restoreButtonBackground] The background used for the inactive restore button.
* @param {Native.String} [args.Active.maximizeButtonBackground] The background used for the active maximize button.
* @param {Native.String} [args.Active.minimizeButtonBackground] The background used for the active minimize button.
* @param {Native.String} [args.Active.closeButtonBackground] The background used for the active close button.
* @param {Native.String} [args.Active.restoreButtonBackground] The background used for the active restore button.
* @param {Native.String} [args.Active.contentBackground] The background used for the active content.
* @param {Native.String} [args.Active.dialogBackground] The background used for the active dialog.
* @param {Native.String} [args.Active.titleBackground] The background used for the active title.
* @param {Native.String} [args.Active.nBackground] The background used for the active north edge.
* @param {Native.String} [args.Active.neBackground] The background used for the active north east corner.
* @param {Native.String} [args.Active.eBackground] The background used for the active east edge.
* @param {Native.String} [args.Active.seBackground] The background used for the active south east corner.
* @param {Native.String} [args.Active.sBackground] The background used for the active south edge.
* @param {Native.String} [args.Active.swBackground] The background used for the active south west corner.
* @param {Native.String} [args.Active.wBackground] The background used for the active west edge.
* @param {Native.String} [args.Active.nwBackground] The background used for the active north west corner.
* @param {Native.String} [args.Inactive.contentBackground] The background used for the inactive content.
* @param {Native.String} [args.Inactive.dialogBackground] The background used for the inactive dialog.
* @param {Native.String} [args.Inactive.titleBackground] The background used for the inactive title.
* @param {Native.String} [args.Inactive.nBackground] The background used for the inactive north edge.
* @param {Native.String} [args.Inactive.neBackground] The background used for the inactive north east corner.
* @param {Native.String} [args.Inactive.eBackground] The background used for the inactive east edge.
* @param {Native.String} [args.Inactive.seBackground] The background used for the inactive south east corner.
* @param {Native.String} [args.Inactive.sBackground] The background used for the inactive south edge.
* @param {Native.String} [args.Inactive.swBackground] The background used for the inactive south west corner.
* @param {Native.String} [args.Inactive.wBackground] The background used for the inactive west edge.
* @param {Native.String} [args.Inactive.nwBackground] The background used for the inactive north west corner.
* @param {Native.String} [args.titleFont] The font used by the title bar.
* @param {Native.String} [args.modalBackground] The background for the modal overlay.
* @param {Native.String} [args.previewBackground] The background for the move/resize preview overlay.
*/
Nina.UI.Style.dialog = function (args) {
    var self = Nina.beget(Nina.UI.WidgetStyle);
    // make sure objects exist
    args = args || {};
    args.Active = args.Active || {};
    args.Inactive = args.Inactive || {};
    args.Active.Hover = args.Active.Hover || {};
    args.Inactive.Hover = args.Inactive.Hover || {};
    // create an id for this widget
    self.id = Nina.UI.widgetIdCount++;
    self.type = 'DialogStyle';
    /**
    * Collection of active element styles.
    * @Class
    * @name Active
    * @type Native.Object
    * @memberOf Nina.UI.Style.dialog
    */
    self.Active = {};
    /**
    * Collection of inactive element styles.
    * @Class
    * @name Inactive
    * @type Native.Object
    * @memberOf Nina.UI.Style.dialog
    */
    self.Inactive = {};
    /**
    * Collection of active hovered element styles.
    * @Class
    * @name Hover
    * @type Native.Object
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.Hover = {};
    /**
    * Collection of inactive hovered element styles.
    * @Class
    * @name Hover
    * @type Native.Object
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.Hover = {};
    /**
    * The offset rect used when maximizing the dialog.  
    * Sometimes the border is transparent on the edge, so maximizing must be over the normal size of the dialog.
    * @field
    * @name maximizeOffsetRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.maximizeOffsetRect = args.maximizeOffsetRect || { x: -5, y: -5, h: 10, w: 10 };
    /**
    * The Nina.UI.Rect used by the Nina.UI.Dialog during initialization.
    * @field
    * @name rect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.rect = args.rect || { x: parseInt(document.documentElement.clientWidth * .5, 10) - 250, y: 100, h: 350, w: 500 };
    /**
    * The minimum size Nina.UI.Rect used by the Nina.UI.Dialog.
    * @field
    * @name minRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.minRect = args.minRect || { x: -5000, y: -5000, w: 165, h: 100 };
    // content
    /**
    * The Nina.UI.Rect used for the content area.
    * @field
    * @name contentRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.contentRect = args.contentRect || { x: 0, y: 0, w: 0, h: 0 };
    // title bar offset x,y,w and actual h
    /**
    * The Nina.UI.Rect used for the content area. Offset x, y, w and actual h.
    * @field
    * @name titleRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.titleRect = args.titleRect || { x: 0, y: 0, w: 0, h: 25 };
    /**
    * The Nina.UI.Rect used north edge.
    * @field
    * @name nRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.nRect = args.nRect || { x: 0, y: 0, w: 0, h: 6 };
    /**
    * The Nina.UI.Rect used north east corner.
    * @field
    * @name neRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.neRect = args.neRect || { x: 0, y: 0, w: 6, h: 6 };
    /**
    * The Nina.UI.Rect used east edge.
    * @field
    * @name eRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.eRect = args.eRect || { x: 0, y: 0, w: 6, h: 0 };
    /**
    * The Nina.UI.Rect used south east corner.
    * @field
    * @name seRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.seRect = args.seRect || { x: 0, y: 0, w: 6, h: 6 };
    /**
    * The Nina.UI.Rect used south edge.
    * @field
    * @name sRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.sRect = args.sRect || { x: 0, y: 0, w: 0, h: 6 };
    /**
    * The Nina.UI.Rect used south west corner.
    * @field
    * @name swRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.swRect = args.swRect || { x: 0, y: 0, w: 6, h: 6 };
    /**
    * The Nina.UI.Rect used wRect edge.
    * @field
    * @name wRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.wRect = args.wRect || { x: 0, y: 0, w: 6, h: 0 };
    /**
    * The Nina.UI.Rect used north west corner.
    * @field
    * @name nwRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.nwRect = args.nwRect || { x: 0, y: 0, w: 6, h: 6 };
    // control buttons
    /**
    * The Nina.UI.Rect for the minimize button.
    * @field
    * @name minimizeRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.minimizeRect = args.minimizeRect || { x: 0, y: 0, w: 34, h: 26 };
    /**
    * The Nina.UI.Rect for the maximize button.
    * @field
    * @name maximizeRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.maximizeRect = args.maximizeRect || { x: 0, y: 0, w: 34, h: 26 };
    /**
    * The Nina.UI.Rect for the close button.
    * @field
    * @name closeRect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog
    */
    self.closeRect = args.closeRect || { x: 0, y: 0, w: 34, h: 26 };
    // inactive button borders
    /**
    * The Nina.UI.Border used for the inactive button borders.
    * @field
    * @name buttonBorder
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.buttonBorder = args.Inactive.buttonBorder || { size: 0, color: 'transparent', style: 'solid' };
    // active button borders
    /**
    * The Nina.UI.Border used for the active button borders.
    * @field
    * @name buttonBorder
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.buttonBorder = args.Active.buttonBorder || { size: 0, color: 'transparent', style: 'solid' };
    // active hover button backgrounds
    /**
    * The background used for the active maximize button when it is hovered over.
    * @field
    * @name maximizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active.Hover
    */
    self.Active.Hover.maximizeButtonBackground = args.Active.Hover.maximizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///z8/QSH5BAAAAAAALAAAAAAiABgAAAItjI+py+0Po5y02ouz3g34/3EBSIokaC5Aqqycm8CafNCYPZqnJ/b+DwwKh5oCADs=)';
    /**
    * The background used for the active minimize button when it is hovered over.
    * @field
    * @name minimizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active.Hover
    */
    self.Active.Hover.minimizeButtonBackground = args.Active.Hover.minimizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///z8/QSH5BAAAAAAALAAAAAAiABgAAAIhjI+py+0Po5y02ouz3rz7D4YYQJZlZ6ZoeoruC8fyTE8FADs=)';
    /**
    * The background used for the active close button when it is hovered over.
    * @field
    * @name closeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active.Hover
    */
    self.Active.Hover.closeButtonBackground = args.Active.Hover.closeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8T8/QSH5BAAAAAAALAAAAAAiABgAAAIpjI+py+0Po5y02ouz3vwC9XVBaJBiaIpjqgJsh6ol8mJsLef6zve+WAAAOw==)';
    /**
    * The background used for the active restore button when it is hovered over.
    * @field
    * @name restoreButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active.Hover
    */
    self.Active.Hover.restoreButtonBackground = args.Active.Hover.restoreButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8T8/QSH5BAAAAAAALAAAAAAiABgAAAIvjI+py+0Po5y02ouzBrwDnXgdiHwlKXKGuaUrGr4gu45zTMoHPbv5DwwKh8QiqQAAOw==)';
    // inactive hover button backgrounds
    /**
    * The background used for the inactive maximize button when it is hovered over.
    * @field
    * @name maximizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive.Hover
    */
    self.Inactive.Hover.maximizeButtonBackground = args.Inactive.Hover.maximizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///5qamiH5BAAAAAAALAAAAAAiABgAAAItjI+py+0Po5y02ouz3g34/3EBSIokaC5Aqqycm8CafNCYPZqnJ/b+DwwKh5oCADs=)';
    /**
    * The background used for the inactive minimize button when it is hovered over.
    * @field
    * @name minimizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive.Hover
    */
    self.Inactive.Hover.minimizeButtonBackground = args.Inactive.Hover.minimizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///5qamiH5BAAAAAAALAAAAAAiABgAAAIhjI+py+0Po5y02ouz3rz7D4YYQJZlZ6ZoeoruC8fyTE8FADs=)';
    /**
    * The background used for the inactive close button when it is hovered over.
    * @field
    * @name closeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive.Hover
    */
    self.Inactive.Hover.closeButtonBackground = args.Inactive.Hover.closeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8ZqamiH5BAAAAAAALAAAAAAiABgAAAIpjI+py+0Po5y02ouz3vwC9XVBaJBiaIpjqgJsh6ol8mJsLef6zve+WAAAOw==)';
    /**
    * The background used for the inactive restore button when it is hovered over.
    * @field
    * @name restoreButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive.Hover
    */
    self.Inactive.Hover.restoreButtonBackground = args.Inactive.Hover.restoreButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8ZqamiH5BAAAAAAALAAAAAAiABgAAAIvjI+py+0Po5y02ouzBrwDnXgdiHwlKXKGuaUrGr4gu45zTMoHPbv5DwwKh8QiqQAAOw==)';
    // active button backgrounds
    /**
    * The background used for the active maximize button.
    * @field
    * @name maximizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.maximizeButtonBackground = args.Active.maximizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///y0tMCH5BAAAAAAALAAAAAAiABgAAAItjI+py+0Po5y02ouz3g34/3EBSIokaC5Aqqycm8CafNCYPZqnJ/b+DwwKh5oCADs=)';
    /**
    * The background used for the active minimize button.
    * @field
    * @name minimizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.minimizeButtonBackground = args.Active.minimizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///y0tMCH5BAAAAAAALAAAAAAiABgAAAIhjI+py+0Po5y02ouz3rz7D4YYQJZlZ6ZoeoruC8fyTE8FADs=)';
    /**
    * The background used for the active close button.
    * @field
    * @name closeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.closeButtonBackground = args.Active.closeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8S0tMCH5BAAAAAAALAAAAAAiABgAAAIpjI+py+0Po5y02ouz3vwC9XVBaJBiaIpjqgJsh6ol8mJsLef6zve+WAAAOw==)';
    /**
    * The background used for the active restore button.
    * @field
    * @name restoreButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.restoreButtonBackground = args.Active.restoreButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8S0tMCH5BAAAAAAALAAAAAAiABgAAAIvjI+py+0Po5y02ouzBrwDnXgdiHwlKXKGuaUrGr4gu45zTMoHPbv5DwwKh8QiqQAAOw==)';
    // inactive button backgrounds
    /**
    * The background used for the inactive maximize button.
    * @field
    * @name maximizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.maximizeButtonBackground = args.Inactive.maximizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///3d3dyH5BAAAAAAALAAAAAAiABgAAAItjI+py+0Po5y02ouz3g34/3EBSIokaC5Aqqycm8CafNCYPZqnJ/b+DwwKh5oCADs=)';
    /**
    * The background used for the inactive minimize button.
    * @field
    * @name minimizeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.minimizeButtonBackground = args.Inactive.minimizeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///3d3dyH5BAAAAAAALAAAAAAiABgAAAIhjI+py+0Po5y02ouz3rz7D4YYQJZlZ6ZoeoruC8fyTE8FADs=)';
    /**
    * The background used for the inactive close button.
    * @field
    * @name closeButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.closeButtonBackground = args.Inactive.closeButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8Xd3dyH5BAAAAAAALAAAAAAiABgAAAIpjI+py+0Po5y02ouz3vwC9XVBaJBiaIpjqgJsh6ol8mJsLef6zve+WAAAOw==)';
    /**
    * The background used for the inactive restore button.
    * @field
    * @name restoreButtonBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.restoreButtonBackground = args.Inactive.restoreButtonBackground || 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAPHx8XZ2diH5BAAAAAAALAAAAAAiABgAAAIvjI+py+0Po5y02ouzBrwDnXgdiHwlKXKGuaUrGr4gu45zTMoHPbv5DwwKh8QiqQAAOw==)';
    // inactive backgrounds
    /**
    * The background used for the inactive content.
    * @field
    * @name contentBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.contentBackground = args.Inactive.contentBackground || '#EEE';
    /**
    * The background used for the inactive dialog.
    * @field
    * @name dialogBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.dialogBackground = args.Inactive.dialogBackground || 'transparent';
    /**
    * The background used for the inactive title.
    * @field
    * @name titleBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.titleBackground = args.Inactive.titleBackground || '#777';
    /**
    * The background used for the inactive north edge.
    * @field
    * @name nBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.nBackground = args.Inactive.nBackground || 'url(data:image/gif;base64,R0lGODlhAQAGAIABAI+PjwAAACH5BAEAAAEALAAAAAABAAYAAAIDjA0FADs=)';
    /**
    * The background used for the inactive north east corner.
    * @field
    * @name neBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.neBackground = args.Inactive.neBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAI+PjwAAACH5BAEAAAEALAAAAAAGAAYAAAIGjI+pa5AFADs=)';
    /**
    * The background used for the inactive east edge.
    * @field
    * @name eBackground
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.eBackground = args.Inactive.eBackground || 'url(data:image/gif;base64,R0lGODlhBgABAIABAI+PjwAAACH5BAEAAAEALAAAAAAGAAEAAAIDRH4FADs=)';
    /**
    * The background used for the inactive south east corner.
    * @field
    * @name seBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.seBackground = args.Inactive.seBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAI+PjwAAACH5BAEAAAEALAAAAAAGAAYAAAIFRI6py1wAOw==)';
    /**
    * The background used for the inactive south edge.
    * @field
    * @name sBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.sBackground = args.Inactive.sBackground || 'url(data:image/gif;base64,R0lGODlhAQAGAIABAI+PjwAAACH5BAEAAAEALAAAAAABAAYAAAIDRH4FADs=)';
    /**
    * The background used for the inactive south west corner.
    * @field
    * @name swBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.swBackground = args.Inactive.swBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAI+PjwAAACH5BAEAAAEALAAAAAAGAAYAAAIGjA2ny70FADs=)';
    /**
    * The background used for the inactive west edge.
    * @field
    * @name wBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.wBackground = args.Inactive.wBackground || 'url(data:image/gif;base64,R0lGODlhBgABAIABAI+PjwAAACH5BAEAAAEALAAAAAAGAAEAAAIDjA0FADs=)';
    /**
    * The background used for the inactive north west corner.
    * @field
    * @name nwBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.nwBackground = args.Inactive.nwBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAI+PjwAAACH5BAEAAAEALAAAAAAGAAYAAAIFjI+pu1AAOw==)';
    // active backgrounds
    /**
    * The background used for the active content.
    * @field
    * @name contentBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.contentBackground = args.Active.contentBackground || '#EEE';
    /**
    * The background used for the active dialog.
    * @field
    * @name dialogBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.dialogBackground = args.Active.dialogBackground || 'transparent';
    /**
    * The background used for the active title.
    * @field
    * @name titleBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.titleBackground = args.Active.titleBackground || '#2d2d30';
    /**
    * The background used for the active north edge.
    * @field
    * @name nBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.nBackground = args.Active.nBackground || 'url(data:image/gif;base64,R0lGODlhAQAGAIABAABWjwAAACH5BAEAAAEALAAAAAABAAYAAAIDjA0FADs=)';
    /**
    * The background used for the active north east corner.
    * @field
    * @name neBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.neBackground = args.Active.neBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAABWjwAAACH5BAEAAAEALAAAAAAGAAYAAAIGjI+pa5AFADs=)';
    /**
    * The background used for the active east edge.
    * @field
    * @name eBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.eBackground = args.Active.eBackground || 'url(data:image/gif;base64,R0lGODlhBgABAIABAABWjwAAACH5BAEAAAEALAAAAAAGAAEAAAIDRH4FADs=)';
    /**
    * The background used for the active south east corner.
    * @field
    * @name seBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.seBackground = args.Active.seBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAABWjwAAACH5BAEAAAEALAAAAAAGAAYAAAIFRI6py1wAOw==)';
    /**
    * The background used for the active south edge.
    * @field
    * @name sBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.sBackground = args.Active.sBackground || 'url(data:image/gif;base64,R0lGODlhAQAGAIABAABWjwAAACH5BAEAAAEALAAAAAABAAYAAAIDRH4FADs=)';
    /**
    * The background used for the active south west corner.
    * @field
    * @name swBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.swBackground = args.Active.swBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAABWjwAAACH5BAEAAAEALAAAAAAGAAYAAAIGjA2ny70FADs=)';
    /**
    * The background used for the active west edge.
    * @field
    * @name wBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.wBackground = args.Active.wBackground || 'url(data:image/gif;base64,R0lGODlhBgABAIABAABWjwAAACH5BAEAAAEALAAAAAAGAAEAAAIDjA0FADs=)';
    /**
    * The background used for the active north west corner.
    * @field
    * @name nwBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.nwBackground = args.Active.nwBackground || 'url(data:image/gif;base64,R0lGODlhBgAGAIABAABWjwAAACH5BAEAAAEALAAAAAAGAAYAAAIFjI+pu1AAOw==)';
    /**
    * The HTML color code used for the inactive title text color.
    * @field
    * @name titleColor
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.titleColor = args.Inactive.titleColor || '#DDD';
    /**
    * The HTML color code used for the active title text color.
    * @field
    * @name titleColor
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.titleColor = args.Active.titleColor || '#FFF';
    // neutral colors
    /**
    * The HTML color code used for the dialog text color.
    * @field
    * @name dialogColor
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.dialogColor = args.Active.dialogColor || '#000';
    /**
    * The HTML color code used for the content text color.
    * @field
    * @name contentColor
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.contentColor = args.Active.contentColor || '#000';
    // padding
    /**
    * The Nina.UI.Padding used for the title padding.
    * @field
    * @name titlePadding
    * @type Nina.UI.Padding
    * @memberOf Nina.UI.Style.dialog
    */
    self.titlePadding = args.titlePadding || { t: 1, r: 0, b: 0, l: 10 };
    // font 
    /**
    * The font used by the title bar.
    * @field
    * @name titleFont
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog
    */
    self.titleFont = args.titleFont || self.defaultFontFamily;
    // title border
    /**
    * The Nina.UI.Border used for the active title borders.
    * @field
    * @name titleBorder
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.dialog.Active
    */
    self.Active.titleBorder = args.Active.titleBorder || { size: 1, style: 'solid', color: '#00568f' };
    /**
    * The Nina.UI.Border used for the inactive title borders.
    * @field
    * @name titleBorder
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.dialog.Inactive
    */
    self.Inactive.titleBorder = args.Inactive.titleBorder || { size: 1, style: 'solid', color: '#777' };
    // modal background
    /**
    * The background for the modal overlay.
    * @field
    * @name modalBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog
    */
    self.modalBackground = args.modalBackground || 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpiYGBgaAAIMAAAhQCB69VMmQAAAABJRU5ErkJggg==)';
    // preview background
    /**
    * The background for the move/resize preview overlay.
    * @field
    * @name previewBackground
    * @type Native.String
    * @memberOf Nina.UI.Style.dialog
    */
    self.previewBackground = args.previewBackground || 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpiYGBgaAAIMAAAhQCB69VMmQAAAABJRU5ErkJggg==)';
    // preview outline
    /**
    * The Nina.UI.Border used for the move/resize preview outline.
    * @field
    * @name previewOutline
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.dialog
    */
    self.previewOutline = args.previewOutline || { size: 1, style: 'solid', color: '#00568f' };
    return self;
}/* END dialog.js */
/* START taskBar.js */
﻿/*
 * Copyright (c) 2013 Tony Germaneri
 * Permission is hereby granted,  free of charge, to any person 
 * obtaining a copy of this software and associated documentation files 
 * (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Style for the Nina.UI.taskBar
* @constructor
* @name taskBar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.WidgetStyle
* @requires Nina
* @requires Nina.UI
* @memberOf Nina.UI.Style
* @param {Native.String} [args.background] The background of the taskbar.
* @param {Native.String} [args.item.background] The background of an item.
* @param {Native.String} [args.item.hover.background] The background of an item when hovered over.
* @param {Native.String} [args.item.hover.textColor] The text color of an item when hovered over.
* @param {Native.String} [args.item.textColor] The text color of an item.
* @param {Nina.UI.Border} [args.item.border] The border of an item.
* @param {Nina.UI.String} [args.item.font] The font of an item.
* @param {Nina.UI.Rect} [args.rect] The rect of the task bar.
* @param {Nina.UI.Border} [args.border] The top border of the task bar.
* @param {Nina.UI.Rect} [args.item.rect] The spacing of the items.
* @param {Nina.UI.Rect} [args.item.spacing] The spacing of the items.
* @param {Nina.UI.Padding} [args.item.padding] The spacing of the items.
* @param {Native.Object} [args] Parameters for the style.
*/
Nina.UI.Style.taskBar = function(args){
    var self = Nina.beget(Nina.UI.WidgetStyle);
    // make sure objects exist
    args = args || { item: {} };
    args.item.hover = args.item.hover || { };
    // create an id for this widget
    /**
    * The background of the taskbar.
    * @field
    * @name id
    * @type Native.Integer
    * @memberOf Nina.UI.Style.taskBar
    */
    self.id = Nina.UI.widgetIdCount++;
    self.item = { hover: {} };
    /**
    * The background of the taskbar.
    * @field
    * @name type
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar
    */
    self.type = "TaskBarStyle";
    /**
    * The background of the taskbar.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar
    */
    self.background = args.background || '#DDD';
    /**
    * The background of an item.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.background = args.item.background || '#EFEFEF';
    /**
    * The background of an item when hovered over.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar.item.hover
    */
    self.item.hover.background = args.item.hover.background || '#dddddd';
    /**
    * The text color of an item when hovered over.
    * @field
    * @name textColor
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar.item.hover
    */
    self.item.hover.textColor = args.item.hover.textColor || '#ffffff';
    /**
    * The text color of an item.
    * @field
    * @name textColor
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.textColor = args.item.textColor || '#000';
    /**
    * The border of an item.
    * @field
    * @name border
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.border = args.item.border || { size: 1, style: 'solid', color: '#FFF' };
    /**
    * The font of an item.
    * @field
    * @name font
    * @type Native.String
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.font = args.item.font || self.defaultFontFamily;
    /**
    * The rect of the task bar.
    * @field
    * @name rect
    * @type Native.Rect
    * @memberOf Nina.UI.Style.taskBar
    */
    self.rect = args.rect || { h: 29, w: 0, x: 0, y: 0 };
    /**
    * The top border of the task bar.
    * @field
    * @name border
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.taskBar
    */
    self.border = args.border || { size: 1, style: 'solid', color: '#00568f' };
    /**
    * The spaceing of the items.
    * @field
    * @name spacing
    * @type Native.Integer
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.spacing = args.item.spacing || 2;
    /**
    * The spaceing of the items.
    * @field
    * @name rect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.rect = args.item.rect || { h: 27, w: 155, x: 0, y: 0 };
    /**
    * The spaceing of the items.
    * @field
    * @name padding
    * @type Nina.UI.Padding
    * @memberOf Nina.UI.Style.taskBar.item
    */
    self.item.padding = args.item.padding || { t: 2, r: 4, b: 2, l: 2 };
    return self;
};/* END taskBar.js */
