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
* @name calendar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.WidgetStyle
* @requires Nina
* @requires Nina.UI
* @memberOf Nina.UI.Style
*/
Nina.UI.Style.calendar = function (args) {
    "use strict";
    var self = Nina.beget(Nina.UI.WidgetStyle);
    // make sure objects exist
    args = args || { item: {} };
    args.item.hover = args.item.hover || { };
    /**
    * The background of the calendar.
    * @field
    * @name id
    * @type Native.Integer
    * @memberOf Nina.UI.Style.calendar
    */
    self.id = Nina.UI.widgetIdCount++;
    self.fontFamily = self.defaultFontFamily;
    self.background = args.background || '#575757';
    self.dragMargin = 20;

    args.year = args.year || {};
    args.month = args.month || {};
    args.day = args.day || {};
    args.hour = args.hour || {};
    args.minute = args.minute || {};
    args.second = args.second || {};
    args.millisecond = args.millisecond || {};

    self.year = args.year;
    self.month = args.month;
    self.day = args.day;
    self.hour = args.hour;
    self.minute = args.minute;
    self.second = args.second;
    self.millisecond = args.millisecond;

    self.year.rect = args.year.rect || {h: 30, w: 50, x: 0, y: 0};
    self.month.rect = args.month.rect || {h: 25, w: 50, x: 0, y: 0};
    self.day.rect = args.day.rect || {h: 20, w: 60, x: 0, y: 0};
    self.hour.rect = args.hour.rect || {h: 17, w: 60, x: 0, y: 0};
    self.minute.rect = args.minute.rect || {h: 17, w: 17, x: 0, y: 0};
    self.second.rect = args.second.rect || {h: 17, w: 17, x: 0, y: 0};
    self.millisecond.rect = args.millisecond.rect || {h: 17, w: 25, x: 0, y: 0};

    self.year.fontSize = args.year.fontSize || '20px';
    self.month.fontSize = args.month.fontSize || '17px';
    self.day.fontSize = args.day.fontSize || '15px';
    self.hour.fontSize = args.hour.fontSize || '13px';
    self.minute.fontSize = args.minute.fontSize || '13px';
    self.second.fontSize = args.second.fontSize || '13px';
    self.millisecond.fontSize = args.millisecond.fontSize || '13px';

    self.year.background = args.year.background || 'gray';
    self.month.background = args.month.background || 'gray';
    self.day.background = args.day.background || 'gray';
    self.hour.background = args.hour.background || 'gray';
    self.minute.background = args.minute.background || 'gray';
    self.second.background = args.second.background || 'gray';
    self.millisecond.background = args.millisecond.background || 'gray';

    self.year.color = args.year.color || 'white';
    self.month.color = args.month.color ||'white';
    self.day.color = args.day.color || 'white';
    self.hour.color = args.hour.color || 'white';
    self.minute.color = args.minute.color || 'white';
    self.second.color = args.second.color || 'white';
    self.millisecond.color = args.millisecond.color || 'white';

    self.year.hoverBackground = args.year.hoverBackground || 'lightgray';
    self.month.hoverBackground = args.month.hoverBackground || 'lightgray';
    self.day.hoverBackground = args.day.hoverBackground || 'lightgray';
    self.hour.hoverBackground = args.hour.hoverBackground || 'lightgray';
    self.minute.hoverBackground = args.minute.hoverBackground || 'lightgray';
    self.second.hoverBackground = args.second.hoverBackground || 'lightgray';
    self.millisecond.hoverBackground = args.millisecond.hoverBackground || 'lightgray';

    self.year.hoverColor = args.year.hoverColor || 'white';
    self.month.hoverColor = args.month.hoverColor ||'white';
    self.day.hoverColor = args.day.hoverColor || 'white';
    self.hour.hoverColor = args.hour.hoverColor || 'white';
    self.minute.hoverColor = args.minute.hoverColor || 'white';
    self.second.hoverColor = args.second.hoverColor || 'white';
    self.millisecond.hoverColor = args.millisecond.hoverColor || 'white';

    self.year.selectedBackground = args.year.selectedBackground || 'orange';
    self.month.selectedBackground = args.month.selectedBackground || 'orange';
    self.day.selectedBackground = args.day.selectedBackground || 'orange';
    self.hour.selectedBackground = args.hour.selectedBackground || 'orange';
    self.minute.selectedBackground = args.minute.selectedBackground || 'orange';
    self.second.selectedBackground = args.second.selectedBackground || 'orange';
    self.millisecond.selectedBackground = args.millisecond.selectedBackground || 'orange';

    self.year.selectedColor = args.year.selectedColor || 'black';
    self.month.selectedColor = args.month.selectedColor ||'black';
    self.day.selectedColor = args.day.selectedColor || 'black';
    self.hour.selectedColor = args.hour.selectedColor || 'black';
    self.minute.selectedColor = args.minute.selectedColor || 'black';
    self.second.selectedColor = args.second.selectedColor || 'black';
    self.millisecond.selectedColor = args.millisecond.selectedColor || 'black';

    self.year.textShadow = args.year.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';
    self.month.textShadow = args.month.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';
    self.day.textShadow = args.day.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';
    self.hour.textShadow = args.hour.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';
    self.minute.textShadow = args.minute.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';
    self.second.textShadow = args.second.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';
    self.millisecond.textShadow = args.millisecond.textShadow || '6px 3px 6px rgba(150, 150, 150, 1)';

    self.year.outline = args.year.outline || { size: 1, style: 'solid', color: 'black' };
    self.month.outline = args.month.outline || { size: 1, style: 'solid', color: 'black' };
    self.day.outline = args.day.outline || { size: 1, style: 'solid', color: 'black' };
    self.hour.outline = args.hour.outline || { size: 1, style: 'solid', color: 'black' };
    self.minute.outline = args.minute.outline || { size: 1, style: 'solid', color: 'black' };
    self.second.outline = args.second.outline || { size: 1, style: 'solid', color: 'black' };
    self.millisecond.outline = args.millisecond.outline || { size: 1, style: 'solid', color: 'black' };

    return self;
};