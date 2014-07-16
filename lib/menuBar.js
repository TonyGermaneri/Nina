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
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARSING w
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 * OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* Creates an HTML based context menu.
* @constructor
* @name menuBar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.Widget
* @requires Nina
* @requires Nina.UI
* @requires Nina.UI.Style.menuBar
* @memberOf Nina.UI
*/
Nina.UI.menuBar = function (args) {
    "use strict";
    args = args || { };
    var self = Nina.beget(Nina.UI.Widget);
    self.active = false;
    self.publicMembers = {};
    self.items = [];
    self.style = args.style || Nina.UI.Style.menuBar();
    self.type = 'menuBar';
    self.events = {
        /**
        * Occurs after the Nina.UI.menuBar is initialized.
        * @event
        * @name init
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        init: self.addInitalEvents(args.init),
        /**
        * Occurs when the task bar is clicked.
        * @event
        * @name click
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        click: self.addInitalEvents(args.click),
        /**
        * Occurs when the mouse moves over the task bar.
        * @event
        * @name mouseover
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        mouseover: self.addInitalEvents(args.mouseover),
        /**
        * Occurs when the mouse leaves the task bar.
        * @event
        * @name mouseout
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        mouseout: self.addInitalEvents(args.mouseout),
        /**
        * Occurs when an item is clicked.
        * @event
        * @name itemClick
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        itemClick: self.addInitalEvents(args.itemClick),
        /**
        * Occurs when the mouse moves over an item.
        * @event
        * @name itemMouseover
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        itemMouseover: self.addInitalEvents(args.itemMouseover),
        /**
        * Occurs when the mouse moves off of an item.
        * @event
        * @name itemMouseout
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        itemMouseout: self.addInitalEvents(args.itemMouseout),
        /**
        * Occurs when an item is added to the collection.
        * @event
        * @name addItem
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        addItem: self.addInitalEvents(args.addItem),
        /**
        * Occurs when an item is removed from the collection.
        * @event
        * @name removeItem
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        removeItem: self.addInitalEvents(args.removeItem),
        /**
        * Occurs when the task bar's rect is updated.
        * @event
        * @name updateRect
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        updateRect: self.addInitalEvents(args.updateRect),
        /**
        * Occurs when the task bar's style is updated.
        * @event
        * @name updateStyle
        * @memberOf Nina.UI.menuBar
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.menuBar instance.
        */
        updateStyle: self.addInitalEvents(args.updateStyle)
    };
    self.createPublicMembers = function () {
        /**
        * The items belonging to the task bar.
        * @field
        * @name items
        * @memberOf Nina.UI.menuBar
        * @public
        * @returns {Native.Array} Array of Nina.UI.menuBarItem.
        */
        self.publicMembers.items = self.items;
        /**
        * The rect of the task bar.
        * @field
        * @name rect
        * @memberOf Nina.UI.menuBar
        * @public
        * @returns {Nina.UI.Rect} Nina.UI.menuBar instance.
        */
        self.publicMembers.rect = self.rect;
        /**
        * The type of widget. Returns menuBar.
        * @field
        * @name type
        * @type Native.String
        * @memberOf Nina.UI.menuBar
        */
        self.publicMembers.type = self.type;
        /**
        * The session unique id of the menuBar.
        * @field
        * @name id
        * @type Native.String
        * @memberOf Nina.UI.menuBar
        */
        self.publicMembers.id = self.id;
        /**
        * Applies the current Nina.UI.Style.menuBar to the Nina.UI.menuBar.
        * @function
        * @name redraw
        * @memberOf Nina.UI.menuBar
        * @public
        * @returns {Nina.UI.menuBar} Nina.UI.menuBar.
        */
        self.publicMembers.redraw = self.redraw;
        /**
        * Adds an item to the Nina.UI.menuBar.
        * @function
        * @name add
        * @memberOf Nina.UI.menuBar
        * @param {Native.HTMLElement} [obj] The object reference to add to the item.
        * @param {Native.Function} [click] The function to execute when the item is clicked.
        * @param {Native.Function|Native.HTMLElement|Native.String|Native.Array} [text] The object to set as the title of the item.
        * @param {Native.Function} [over] The function to execute when the mouse moves over the item.
        * @param {Native.Function} [out] The function to execute when the mouse moves off the item.
        * @returns {Nina.UI.menuBarItem} Item added to the Nina.UI.menuBar.
        */
        self.publicMembers.add = self.add;
        /**
        * Adds an item to the Nina.UI.menuBar.
        * @function
        * @name remove
        * @memberOf Nina.UI.menuBar
        * @param {Nina.UI.menuBarItem} [obj] The item to remove from the Nina.UI.menuBar.
        * @returns {Nina.UI.menuBar} Item added to the Nina.UI.menuBar.
        */
        self.publicMembers.remove = self.remove;
        self.publicMembers.resize = function(){
            self.redraw();
            return self.publicMembers;
        };
        self.publicMembers.setRect = self.setRect;
        self.publicMembers.style = self.style;
        self.publicMembers.appendTo = self.appendTo;
        return self;
    };
    self.init = function () {
        var x;
        // raise init event
        if (self.raiseEvent('init', undefined, undefined, undefined)) { return self; }
        // create an id for this widget
        self.id = Nina.UI.widgetIdCount++;
        Nina.UI.widgets.menuBar = self;
        // setup rect
        args.rect = args.rect || {};
        self.publicMembers.rect = self.rect = {
            x: args.rect.x || self.style.rect.x,
            y: args.rect.y || self.style.rect.y,
            w: args.rect.w || self.style.rect.w,
            h: args.rect.h || self.style.rect.h
        };
        // create bar
        self.menuBar = this.createElement('div');
        self.noSelect([self.menuBar]);
        self.menuBar.style.position = 'absolute';
        self.menuBar.style.overflow = 'hidden';
        self.menuBar.onclick = function (e) {
            if (self.raiseEvent('click', e, self.menuBar, [])) { return self; }
        };
        self.menuBar.onmouseover = function (e) {
            if (self.raiseEvent('mouseover', e, self.menuBar, [])) { return self; }
        };
        self.menuBar.onmouseout = function (e) {
            if (self.raiseEvent('mouseout', e, self.menuBar, [])) { return self; }
        };
        function addItems(items){
            for(x = 0; x < items.length; x++){
                self.add(items[x]);
            }
        }
        if(args.items){
            if(typeof args.items === 'function'){
                args.items(function(data){
                    addItems(data);
                });
            }else{
                addItems(args.items);
            }
        }
        if(args.parent){
            self.appendTo(args.parent);
        }
        self.createPublicMembers();
        return self.setRect().stylize();
    };
    self.browserResize = function () {
        self.setRect();
        return;
    };
    self.setRect = function (rect) {
        if (self.raiseEvent('updateRect', undefined, undefined, undefined)) { return self; }
        rect = rect || self.rect;
        self.rect.x = rect.x;
        self.rect.y = rect.y;
        self.rect.h = rect.h;
        self.rect.w = rect.w;
        var s = self.style,
            items,
            x,
            l;
        self.updateElementRect(self.menuBar,
            rect.w,
            rect.h,
            rect.x,
            rect.y);
        items = self.items;
        for (x = 0; items.length > x; x++) {
            l = items[x].element;
            self.updateElementRect(items[x].element,
                undefined,
                s.item.rect.h,
                undefined,
                s.item.rect.y);
        }
        return self;
    };
    self.stylize = function () {
        if (self.raiseEvent('updateStyle', undefined, undefined, undefined)) { return self; }
        var s = self.style,
            items,
            x,
            l;
        self.menuBar.style.background = s.background;
        self.menuBar.style.borderBottom = self.border(s.border);
        self.menuBar.style.boxShadow = s.boxShadow;
        items = self.items;
        for (x = 0; items.length > x; x++) {
            l = items[x].element;
            l.style.fontFamily = s.item.font;
            l.style.color = s.item.textColor;
            l.style.background = s.item.background;
            l.style.border = self.border(s.item.border);
            l.style.marginLeft = s.item.spacing + 'px';
        }
        return self;
    };
    self.appendTo = function(parentNode, parentWidget){
        self.parentNode = parent;
        self.parent = parentWidget;
        parentNode.appendChild(self.menuBar);
        if(parentNode.tagName === 'BODY'){
            var resizeWithWindow = function(){
                self.setRect({
                    w: self.client().w,
                    h: self.rect.h,
                    x: 0,
                    y: 0
                });
            };
            window.addEventListener('resize', resizeWithWindow);
            resizeWithWindow();
            Nina.UI.widgets.menuBar = self;
        }
    };
    self.redraw = function () {
        return self.stylize().setRect();
    };
    self.add = function (menuItem) {
        // menuItem obj, click, text, over, out
        var l,
            item = {
                obj: menuItem,
                click: menuItem.click,
                text: menuItem.text,
                mouseover: menuItem.over,
                mouseout: menuItem.out,
                items: menuItem.items,
                element: self.createElement('div')
            };
            item.element.type = 'menuBarItem';
            item.element.menuBar = self;
        if (self.raiseEvent('addItem', undefined, item, [])) { return self; }
        l = item.element;
        function openSubMenu(){
            if(item.items){
                if(typeof item.items === 'function'){
                    item.items(function(data){
                        self.contextMenu = Nina.UI.contextMenu({ parent: item.element, items: item.items });
                    });
                }else{
                    self.contextMenu = Nina.UI.contextMenu({ parent: item.element, items: item.items });
                }
            }
        }
        l.onclick = function (e) {
            if (self.raiseEvent('itemClick', e, l, [])) { return self; }
            self.activeItem = item;
            openSubMenu();
            if (!item.click) { return self; }
            item.click.apply(self, [e, l]);
            return self;
        };
        l.onmouseover = function (e) {
            if (self.raiseEvent('itemMouseover', e, l, [])) { return self; }
            l.style.background = self.style.item.hover.background;
            l.style.color = self.style.item.hover.textColor;
            self.hoverItem = item;
            if(Nina.UI.widgets.contextMenus.filter(function(f){ return f !== undefined; }).length > 0){
                openSubMenu();
            }
            if (!item.mouseover) { return self; }
            item.mouseover.apply(self, [e, l]);
            return self;
        };
        l.onmouseout = function (e) {
            if (self.raiseEvent('itemMouseout', e, l, [])) { return self; }
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
        l.firstChild.innerHTML = item.text;
        self.menuBar.appendChild(l);
        self.items.push(item);
        self.redraw();
        return item;
    };
    self.remove = function (item) {
        var items = self.items,
            x;
        for (x = 0; items.length > x; x++) {
            if (items[x] === item) {
                if (self.raiseEvent('removeItem', items[x], item.element, [])) { return self; }
                self.menuBar.removeChild(item.element);
                self.items.splice(x, 1);
            }
        }
        return self.setRect().stylize();
    };
    self.init();
    // return publicMembers
    return self.publicMembers;
};