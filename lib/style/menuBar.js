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
* Style for the Nina.UI.menuBar
* @constructor
* @name menuBar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.WidgetStyle
* @requires Nina
* @requires Nina.UI
* @memberOf Nina.UI.Style
* @param {Native.String} [args.background] The background of the menuBar.
* @param {Native.String} [args.item.background] The background of an item.
* @param {Native.String} [args.item.hover.background] The background of an item when hovered over.
* @param {Native.String} [args.item.hover.textColor] The text color of an item when hovered over.
* @param {Native.String} [args.item.textColor] The text color of an item.
* @param {Nina.UI.Border} [args.item.border] The border of an item.
* @param {Nina.UI.String} [args.item.font] The font of an item.
* @param {Nina.UI.Rect} [args.rect] The rect of the menu bar.
* @param {Nina.UI.Border} [args.border] The top border of the menu bar.
* @param {Nina.UI.Rect} [args.item.rect] The spacing of the items.
* @param {Nina.UI.Rect} [args.item.spacing] The spacing of the items.
* @param {Nina.UI.Padding} [args.item.padding] The spacing of the items.
* @param {Native.Object} [args] Parameters for the style.
*/
Nina.UI.Style.menuBar = function (args) {
    "use strict";
    var self = Nina.beget(Nina.UI.WidgetStyle);
    // make sure objects exist
    args = args || { item: {} };
    args.item.hover = args.item.hover || { };
    // create an id for this widget
    /**
    * The background of the menuBar.
    * @field
    * @name id
    * @type Native.Integer
    * @memberOf Nina.UI.Style.menuBar
    */
    self.id = Nina.UI.widgetIdCount++;
    self.item = { hover: {} };
    /**
    * The background of the menuBar.
    * @field
    * @name type
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar
    */
    self.type = "MenuBarStyle";
    /**
    * The background of the menuBar.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar
    */
    self.background = args.background || '#DDD';
    /**
    * The background of an item.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.background = args.item.background || 'transparent';
    /**
    * The background of an item when hovered over.
    * @field
    * @name background
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar.item.hover
    */
    self.item.hover.background = args.item.hover.background || '#dddddd';
    /**
    * The text color of an item when hovered over.
    * @field
    * @name textColor
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar.item.hover
    */
    self.item.hover.textColor = args.item.hover.textColor || '#ffffff';
    /**
    * The text color of an item.
    * @field
    * @name textColor
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.textColor = args.item.textColor || '#000';
    /**
    * The border of an item.
    * @field
    * @name border
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.border = args.item.border || { size: 0, style: 'none', color: 'transparent' };
    /**
    * The font of an item.
    * @field
    * @name font
    * @type Native.String
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.font = args.item.font || self.defaultFontFamily;
    /**
    * The rect of the menu bar.
    * @field
    * @name rect
    * @type Native.Rect
    * @memberOf Nina.UI.Style.menuBar
    */
    self.rect = args.rect || { h: 25, w: 0, x: 0, y: 0 };
    /**
    * The top border of the menu bar.
    * @field
    * @name border
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.menuBar
    */
    self.border = args.border || { size: 1, style: 'solid', color: '#00568f' };
    /**
    * The spacing of the items.
    * @field
    * @name spacing
    * @type Native.Integer
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.spacing = args.item.spacing || 15;
    /**
    * The spacing of the items.
    * @field
    * @name rect
    * @type Nina.UI.Rect
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.rect = args.item.rect || { h: 27, w: 155, x: 0, y: 0 };
    /**
    * The spacing of the items.
    * @field
    * @name padding
    * @type Nina.UI.Padding
    * @memberOf Nina.UI.Style.menuBar.item
    */
    self.item.padding = args.item.padding || { t: 4, r: 4, b: 2, l: 2 };
    /**
    * The the box shadow of the menu bar.
    * @field
    * @name boxShadow
    * @type Nina.UI.Border
    * @memberOf Nina.UI.Style.menuBar
    */
    self.boxShadow = args.boxShadow || '0 2px 5px #ccc';
    return self;
};