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
* @global
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
            * @abstract
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
            * @abstract
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
                * @borrows addEventListener as on
                */
                on: function (eventName, procedure) {
                    return this.addEventListener(eventName, procedure);
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
}());