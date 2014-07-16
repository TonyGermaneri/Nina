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
* @name contextMenu
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.Widget
* @requires Nina
* @requires Nina.UI
* @requires Nina.UI.Style.contextMenu
* @memberOf Nina.UI
*/
Nina.UI.contextMenu = function (args) {
    "use strict";
    args = args || { };
    var self = Nina.beget(Nina.UI.Widget);
    self.items = [];
    self.publicMembers = {};
    self.style = args.style || Nina.UI.Style.contextMenu();
    self.type = 'contextMenu';
    self.events = {
        /**
        * Occurs after the Nina.UI.contextMenu is initialized.
        * @event
        * @name init
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        init: self.addInitalEvents(args.init),
        /**
        * Occurs when the task bar is clicked.
        * @event
        * @name click
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        click: self.addInitalEvents(args.click),
        /**
        * Occurs when the mouse moves over the task bar.
        * @event
        * @name mouseover
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        mouseover: self.addInitalEvents(args.mouseover),
        /**
        * Occurs when the mouse leaves the task bar.
        * @event
        * @name mouseout
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        mouseout: self.addInitalEvents(args.mouseout),
        /**
        * Occurs when an item is clicked.
        * @event
        * @name itemClick
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        itemClick: self.addInitalEvents(args.itemClick),
        /**
        * Occurs when the mouse moves over an item.
        * @event
        * @name itemMouseover
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        itemMouseover: self.addInitalEvents(args.itemMouseover),
        /**
        * Occurs when the mouse moves off of an item.
        * @event
        * @name itemMouseout
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        itemMouseout: self.addInitalEvents(args.itemMouseout),
        /**
        * Occurs when an item is added to the collection.
        * @event
        * @name addItem
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        addItem: self.addInitalEvents(args.addItem),
        /**
        * Occurs when an item is removed from the collection.
        * @event
        * @name removeItem
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        removeItem: self.addInitalEvents(args.removeItem),
        /**
        * Occurs when the task bar's rect is updated.
        * @event
        * @name updateRect
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        updateRect: self.addInitalEvents(args.updateRect),
        /**
        * Occurs when the task bar's style is updated.
        * @event
        * @name updateStyle
        * @memberOf Nina.UI.contextMenu
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} Nina.UI.contextMenu instance.
        */
        updateStyle: self.addInitalEvents(args.updateStyle)
    };
    self.createPublicMembers = function () {
        /**
        * The items belonging to the task bar.
        * @field
        * @name items
        * @memberOf Nina.UI.contextMenu
        * @public
        * @returns {Native.Array} Array of Nina.UI.contextMenuItem.
        */
        self.publicMembers.items = self.items;
        /**
        * The rect of the task bar.
        * @field
        * @name rect
        * @memberOf Nina.UI.contextMenu
        * @public
        * @returns {Nina.UI.Rect} Nina.UI.contextMenu instance.
        */
        self.publicMembers.rect = self.rect;
        /**
        * The type of widget. Returns contextMenu.
        * @field
        * @name type
        * @type Native.String
        * @memberOf Nina.UI.contextMenu
        */
        self.publicMembers.type = self.type;
        /**
        * The session unique id of the contextMenu.
        * @field
        * @name id
        * @type Native.String
        * @memberOf Nina.UI.contextMenu
        */
        self.publicMembers.id = self.id;
        /**
        * Applies the current Nina.UI.Style.contextMenu to the Nina.UI.contextMenu.
        * @function
        * @name redraw
        * @memberOf Nina.UI.contextMenu
        * @public
        * @returns {Nina.UI.contextMenu} Nina.UI.contextMenu.
        */
        self.publicMembers.redraw = self.redraw;
        /**
        * Adds an item to the Nina.UI.contextMenu.
        * @function
        * @name add
        * @memberOf Nina.UI.contextMenu
        * @param {Native.HTMLElement} [obj] The object refrence to add to the item.
        * @param {Native.Function} [click] The function to execute when the item is clicked.
        * @param {Native.Function|Native.HTMLElement|Native.String|Native.Array} [text] The object to set as the title of the item.
        * @param {Native.Function} [over] The function to execute when the mouse moves over the item.
        * @param {Native.Function} [out] The function to execute when the mouse moves off the item.
        * @returns {Nina.UI.contextMenuItem} Item added to the Nina.UI.contextMenu.
        */
        self.publicMembers.add = self.add;
        /**
        * Adds an item to the Nina.UI.contextMenu.
        * @function
        * @name remove
        * @memberOf Nina.UI.contextMenu
        * @param {Nina.UI.contextMenuItem} [obj] The item to remove from the Nina.UI.contextMenu.
        * @returns {Nina.UI.contextMenu} Item added to the Nina.UI.contextMenu.
        */
        self.publicMembers.remove = self.remove;
        return self;
    };
    self.closeNonAncestorContextMenus = function () {
        // close all context menus except this one and
        // ancestor  of this one
        var ids = Object.keys(Nina.UI.widgets.contextMenus),
            aids = [self.id.toString()],
            x,
            c = self.parent,
            close;
        while(c){
            aids.push(c.contextMenuId);
            c = c.parent;
        }
        for(x = 0; x < ids.length; x++){
            if(aids.indexOf(ids[x]) === -1){
                Nina.UI.widgets.contextMenus[ids[x]].close();
            }
        }
    };
    self.init = function () {
        var x;
        // raise init event
        if (self.raiseEvent('init', undefined, undefined, undefined)) { return self; }
        // create an id for this widget
        self.id = Nina.UI.widgetIdCount++;
        Nina.UI.widgets.contextMenus[self.id] = self;
        Nina.UI.widgets.contextMenu = self;
        // setup rect
        args.rect = args.rect || {};
        self.publicMembers.rect = self.rect = {
            x: args.rect.x || self.style.rect.x,
            y: args.rect.y || self.style.rect.y,
            w: args.rect.w || self.style.rect.w,
            h: args.rect.h || self.style.rect.h
        };
        // create bar
        self.contextMenu = this.createElement('div');
        self.contextMenu.style.zIndex = ++Nina.UI.topModalZIndex;
        self.noSelect([self.contextMenu]);
        self.contextMenu.style.position = 'absolute';
        self.contextMenu.style.overflow = 'hidden';
        self.contextMenu.onclick = function (e) {
            if (self.raiseEvent('click', e, self.contextMenu, [])) { return self; }
        };
        self.contextMenu.onmouseover = function (e) {
            if (self.raiseEvent('mouseover', e, self.contextMenu, [])) { return self; }
        };
        self.contextMenu.onmouseout = function (e) {
            if (self.raiseEvent('mouseout', e, self.contextMenu, [])) { return self; }
        };
        window.document.body.appendChild(self.contextMenu);
        setTimeout(document.body.addEventListener, 0, 'click', self.close);
        self.createPublicMembers();
        if(args.parent.type === 'contextMenuItem' || args.parent.type === 'menuBarItem'){
            self.parent = args.parent;
        }
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
        self.closeNonAncestorContextMenus(self.id);
        return self.setRect().stylize();
    };
    self.browserResize = function () {
        self.setRect();
        return;
    };
    self.setRect = function (rect) {
        if (self.raiseEvent('updateRect', undefined, undefined, undefined)) { return self; }
        rect = rect || self.rect;
        var s = self.style,
            items,
            x,
            l,
            y,
            p,
            pn,
            h,
            w,
            c;
        if(args.parent.type === 'click'){
            x = args.parent.clientX + s.contextMenuOffset.x;
            y = args.parent.clientY + s.contextMenuOffset.y;
        }else if(args.parent.type === 'menuBarItem'){
            p = self.position(args.parent);
            x = p.x + s.contextMenuOffset.x;
            y = p.y + args.parent.offsetHeight + s.contextMenuOffset.y;
        }else if(args.parent.type === 'contextMenuItem'){
            p = self.position(args.parent.parentNode);
            pn = self.position(args.parent);
            x = p.x + args.parent.offsetWidth + s.subMenuOffset.x;
            y = pn.y + s.subMenuOffset.y;
        }else if(args.parent.tagName !== undefined && args.parent.nodeType === 1){
            p = self.position(args.parent);
            x = p.x + s.menuItemOffset.x;
            y = p.y + args.parent.offsetHeight + s.menuItemOffset.y;
        }
        items = self.items;
        h = items.length * (s.item.rect.h);
        w = rect.w + s.item.rect.w;
        x = rect.x + x;
        y = rect.y + y;
        c = self.client();
        // check position, don't run off sides of screen
        // top
        if(y < 0){
            y = 0;
        }
        // left
        if(x < 0){
            x = 0;
        }
        // bottom
        if(y + h > c.h){
            y = c.h - h - h;
        }
        // right
        if(x + w > c.w){
            x = c.w - w - w;
        }
        self.updateElementRect(self.contextMenu, w, h, x, y);
        for (x = 0; items.length > x; x++) {
            l = items[x].element;
            l.firstChild.innerHTML = '';
            self.appendObj(l.firstChild, items[x].text);
            self.updateElementRect(items[x].element,
                s.item.rect.w,
                s.item.rect.h,
                s.item.rect.x,
                s.item.rect.y);
            self.clipText(l.firstChild, s.item.rect.w - s.item.padding.r - s.item.padding.l);
        }
        return self;
    };
    self.stylize = function () {
        if (self.raiseEvent('updateStyle', undefined, undefined, undefined)) { return self; }
        var s = self.style,
            items,
            x,
            l;
        self.contextMenu.style.background = s.background;
        self.contextMenu.style.border = self.border(s.border);
        self.contextMenu.style.boxShadow = s.boxShadow;
        items = self.items;
        for (x = 0; items.length > x; x++) {
            l = items[x].element;
            l.firstChild.style.padding = self.pad(s.item.padding);
            l.style.fontFamily = s.item.font;
            l.style.color = s.item.textColor;
            l.style.background = s.item.background;
            l.style.border = self.border(s.item.border);
            l.style.marginLeft = s.item.spacing + 'px';
        }
        return self;
    };
    self.redraw = function () {
        return self.stylize().setRect();
    };
    self.add = function (menuItem) {
        var l,
            item = {
                click: menuItem.click,
                text: menuItem.text,
                mouseover: menuItem.over,
                mouseout: menuItem.out,
                items: menuItem.items,
                element: self.createElement('div')
            },
            i,
            expandArrow;
        item.element.type = 'contextMenuItem';
        item.element.contextMenuId = self.id.toString();
        item.element.parent = args.parent;
        if (self.raiseEvent('addItem', undefined, item, [])) { return self; }
        l = item.element;
        l.onclick = function (e) {
            if (self.raiseEvent('itemClick', e, l, [])) { return self; }
            self.activeItem = item;
            if (!item.click) { return self; }
            item.click.apply(self, [e, l]);
            return self;
        };
        l.onmouseover = function (e) {
            if (self.raiseEvent('itemMouseover', e, l, [])) { return self; }
            l.style.background = self.style.item.hover.background;
            l.style.color = self.style.item.hover.textColor;
            self.hoverItem = item;
            if(item.items){
                if(typeof item.items === 'function'){
                    expandArrow.src = self.style.expandArrowWaitImage;
                    item.items(function(data){
                        expandArrow.src = self.style.expandArrowImage;
                        self.subContextMenu = Nina.UI.contextMenu({ parent: item.element, items: data });
                    });
                }else{
                    self.subContextMenu = Nina.UI.contextMenu({ parent: item.element, items: item.items });
                }
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
        l.style.display = 'block';
        l.style.cursor = 'pointer';
        l.firstChild.style.whiteSpace = 'nowrap';
        l.style.overflow = 'hidden';
        if(item.items){
            expandArrow = self.createElement('img');
            self.noSelect([expandArrow]);
            l.appendChild(expandArrow);
            expandArrow.src = self.style.expandArrowImage;
            expandArrow.style.cssFloat = 'right';
            expandArrow.style.margin = self.pad(self.style.expandArrowMargins);
        }
        self.contextMenu.appendChild(l);
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
                self.contextMenu.removeChild(item.element);
                self.items.splice(x, 1);
            }
        }
        return self.setRect().stylize();
    };
    self.close = function () {
        if(self.contextMenu.parentNode){
            self.contextMenu.parentNode.removeChild(self.contextMenu);
            if(self.child){
                child.close();
            }
            delete Nina.UI.widgets.contextMenus[self.id];
        }
    };
    self.init();
    // return publicMembers
    return self.publicMembers;
};