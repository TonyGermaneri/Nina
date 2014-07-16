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
* Style for the Nina.UI.contextMenu
* @constructor
* @name contextMenu
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.WidgetStyle
* @requires Nina
* @requires Nina.UI
* @memberOf Nina.UI.Style
* @param {Native.String} [args.background] The background of the contextMenu.
* @param {Native.String} [args.item.background] The background of an item.
* @param {Native.String} [args.item.hover.background] The background of an item when hovered over.
* @param {Native.String} [args.item.hover.textColor] The text color of an item when hovered over.
* @param {Native.String} [args.item.textColor] The text color of an item.
* @param {Nina.UI.Border} [args.item.border] The border of an item.
* @param {Nina.UI.String} [args.item.font] The font of an item.
* @param {Nina.UI.Rect} [args.rect] The rect of the context menu.
* @param {Nina.UI.Border} [args.border] The top border of the context menu.
* @param {Nina.UI.Rect} [args.item.rect] The spacing of the items.
* @param {Nina.UI.Rect} [args.item.spacing] The spacing of the items.
* @param {Nina.UI.Padding} [args.item.padding] The spacing of the items.
* @param {Native.Object} [args] Parameters for the style.
*/
Nina.UI.Style.contextMenu = function (args) {
    "use strict";
    var self = Nina.beget(Nina.UI.WidgetStyle);
    // make sure objects exist
    args = args || { item: {} };
    args.item.hover = args.item.hover || { };
    // create an id for this widget
    /**
    * The background of the contextMenu.
    * @field
    * @name id
    * @type Native.Integer
    * @memberOf Nina.UI.Style.contextMenu
    */
    self.id = Nina.UI.widgetIdCount++;
    self.item = { hover: {} };
    /**
    * The background of the contextMenu.
    * @field
    * @name type
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu
    */
    self.type = "ContextMenuStyle";
    /**
    * The background of the contextMenu.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu
    */
    self.background = args.background || '#DDD';
    /**
    * The background of an item.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.background = args.item.background || 'transparent';
    /**
    * The background of an item when hovered over.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu.item.hover
    */
    self.item.hover.background = args.item.hover.background || '#dddddd';
    /**
    * The text color of an item when hovered over.
    * @field
    * @name textColor
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu.item.hover
    */
    self.item.hover.textColor = args.item.hover.textColor || '#ffffff';
    /**
    * The text color of an item.
    * @field
    * @name textColor
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.textColor = args.item.textColor || '#000';
    /**
    * The border of an item.
    * @field
    * @name border
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.border = args.item.border || { size: 0, style: 'none', color: 'transparent' };
    /**
    * The font of an item.
    * @field
    * @name font
    * @type Native.String
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.font = args.item.font || self.defaultFontFamily;
    /**
    * The rect of the context menu.
    * @field
    * @name rect
    * @type Native.Rect
    * @memberOf Nina.UI.Style.contextMenu
    */
    self.rect = args.rect || { h: 29, w: 0, x: 0, y: 0 };
    self.subMenuOffset = args.item.subMenuOffset || { x: 0, y: 0 };
    self.contextMenuOffset = args.item.contextMenuOffset || { x: 0, y: -2 };
    self.menuItemOffset = args.item.menuItemOffset || { x: 0, y: 0 };
    /**
    * The top border of the context menu.
    * @field
    * @name border
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.contextMenu
    */
    self.border = args.border || { size: 1, style: 'solid', color: '#777' };
    /**
    * The the box shadow of the context menu.
    * @field
    * @name boxShadow
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.contextMenu
    */
    self.boxShadow = args.boxShadow || '2px 2px 2px #ccc';
    /**
    * The spacing of the items.
    * @field
    * @name spacing
    * @type Native.Integer
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.spacing = args.item.spacing || 15;
    /**
    * The spacing of the items.
    * @field
    * @name rect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.rect = args.item.rect || { h: 27, w: 200, x: 0, y: 0 };
    /**
    * The spacing of the items.
    * @field
    * @name padding
    * @type Nina.UI.Padding
    * @memberOf Nina.UI.Style.contextMenu.item
    */
    self.item.padding = args.item.padding || { t: 4, r: 4, b: 2, l: 2 };
    self.expandArrowMargins = args.expandArrowMargins || { t: 7, r: 20, b: 0, l: 0 };
    self.expandArrowImage = args.expandArrowImage || 'data:image/gif;base64,R0lGODlhBAAHAIABAICAgP///yH5BAEAAAEALAAAAAAEAAcAAAIIRA4WaeyrVCgAOw==';
    self.expandArrowWaitImage = args.expandArrowWaitImage || 'data:image/gif;base64,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';
    return self;
};