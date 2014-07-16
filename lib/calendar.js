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
* Creates an HTML based calendar.
* @constructor
* @name calendar
* @version 0.1.0 beta release
* @author Tony Germaneri (TonyGermaneri@gmail.com)
* @augments Nina.UI.Widget
* @requires Nina
* @requires Nina.UI
* @requires Nina.UI.Style.calendar
* @memberOf Nina.UI
*/
Nina.UI.calendar = function (args) {
    "use strict";
    args = args || {};
    var self = Nina.beget(Nina.UI.Widget);
    self.publicMembers = {};
    self.style = args.style || Nina.UI.Style.calendar();
    self.type = 'calendar';
    self.selectedElements = {};
    self.elements = {
        years: [],
        months: [],
        days: [],
        hours: [],
        minutes: [],
        seconds: [],
        milliseconds: []
    };
    self.hoverElement = null;
    self.setToFirstDayOnMonthChange = args.setToFirstDayOnMonthChange;
    self.events = {
        init: self.addInitalEvents(args.init),
        dispose: self.addInitalEvents(args.dispose),
        change: self.addInitalEvents(args.change),
        submit: self.addInitalEvents(args.submit),
        cancel: self.addInitalEvents(args.cancel)
    };
    self.monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    self.dayNames = [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
    ];
    self.createPublicMembers = function(){
        /**
        * Adds a function to an event for this widget.   When the event occurs the function will execute in the context of this widget. 
        * Calling calendar.preventDefault() will cancel the default event.
        * @function
        * @name addEventListener
        * @param {Nina.UI.String} [eventName] The name of the event to subscribe to.
        * @param {Nina.UI.Function} [procedure] The function to execute when the event is raised.
        * @memberOf Nina.UI.calendar
        * @public
        * @returns {Nina.UI.calendar} Nina.UI.calendar instance.
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
        * @memberOf Nina.UI.calendar
        * @public
        * @returns {Nina.UI.calendar} Nina.UI.calendar instance.
        */
        self.publicMembers.removeEventListener = function (eventName, procedure, capturePhase) {
            self.removeEventListener(eventName, procedure, capturePhase);
            return self.publicMembers;
        };
        /**
        * The Nina.UI.Style.calendar of this Nina.UI.calendar.
        * @field
        * @name style
        * @type Nina.UI.Style.calendar
        * @memberOf Nina.UI.calendar
        */
        self.publicMembers.style = self.style;
        /**
        * The session unique id of the calendar.
        * @field
        * @name id
        * @type Native.String
        * @memberOf Nina.UI.calendar
        */
        self.publicMembers.id = self.id;
        /**
        * The type of widget. Returns Dialog.
        * @field
        * @name type
        * @type Native.String
        * @memberOf Nina.UI.calendar
        */
        self.publicMembers.type = self.type;
        return self.publicMembers;
    };
    self.unSelect = function(d, type){
        if(!d){ return; }
        d.style.color = self.style[type].color;
        d.style.background = self.style[type].background;
    };
    self.select = function(d, type){
        d.style.color = self.style[type].selectedColor;
        d.style.background = self.style[type].selectedBackground;
    };
    self.addDateItem = function(value, type){
        var d = self.createElement('div'),
            s = self.style[type];
        self.elements[type + 's'].push(d);
        d.style.width = s.rect.w + 'px';
        d.style.height = s.rect.h + 'px';
        d.style.fontSize = s.fontSize;
        d.style.fontFamily = self.style.fontFamily;
        d.style.textShadow = s.textShadow;
        d.style.color = s.color;
        d.style.background = s.background;
        d.style.display = 'inline-block';
        d.style.cursor = 'col-resize';
        d.style.outline = self.border(s.outline);
        if(type === 'month'){
            d.innerHTML = self.monthNames[value];
        }else if(type === 'day'){
            var a = new Date(self.selectedValues.year, self.selectedValues.month, value);
            d.innerHTML = self.dayNames[a.getDay()] + ' ' + (value + 1);
            // offset day and hour by 1
            value++;
        }else if(type === 'hour'){
            d.innerHTML = (value % 12) + 1 + '' + (value > 11 ? 'PM' : 'AM');
            value++;
        }else{
            d.innerHTML = value;
        }
        d.value = value;
        d.onmouseover = function(){
            d.style.color = s.hoverdColor;
            d.style.background = s.hoverBackground;
        };
        d.onmouseout = function(){
            if(self.selectedValues[type] === value){
                self.select(d, type);
            }else{
                d.style.color = s.color;
                d.style.background = s.background;
            }
        };
        d.onclick = function(e){
            if (self.raiseEvent('change', undefined, undefined, [type, value])) { return self; }
            if(self.didDrag){
                self.didDrag = false;
            }else{
                self.selectedValues[type] = value;
                if(type === 'month'){
                    if(self.setToFirstDayOnMonthChange){
                        self.selectedValues.day = 0;
                    }
                    self.refreshDays();
                }else if(type === 'year'){
                    self.refreshDays();
                }
                self.setActive();
            }
        };
        return d;
    };
    self.setActive = function(){
        var x,
            dateItems = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
        self.date = new Date(self.selectedValues.year,
            self.selectedValues.month,
            self.selectedValues.day,
            self.selectedValues.hour,
            self.selectedValues.minute,
            self.selectedValues.second,
            self.selectedValues.millisecond);
        for(x = 0; x < dateItems.length; x++){
            if(self.selectedElements[dateItems[x]]){
                self.unSelect(self.selectedElements[dateItems[x]], dateItems[x]);
            }
        }
        self.dialog.title(self.date.format('D M d Y g:i:s A'));
        self.selectedElements.year = self.elements.years[self.selectedValues.year - self.minYear];
        self.selectedElements.month = self.elements.months[self.selectedValues.month];
        self.selectedElements.day = self.elements.days[self.selectedValues.day-1];
        self.selectedElements.hour = self.elements.hours[self.selectedValues.hour-1];
        self.selectedElements.minute = self.elements.minutes[self.selectedValues.minute];
        self.selectedElements.second = self.elements.seconds[self.selectedValues.second];
        self.selectedElements.millisecond = self.elements.milliseconds[self.selectedValues.millisecond];
        for(x = 0; x < dateItems.length; x++){
            if(self.selectedElements[dateItems[x]]){
                self.select(self.selectedElements[dateItems[x]], dateItems[x]);
            }
        }
        self.scrollToActive();
    };
    self.daysInMonth = function(month,year) {
        return new Date(year, month, 0).getDate();
    };
    self.fillSelectedValues = function(){
        self.selectedValues = {
            year: args.date.getFullYear(),
            month: args.date.getMonth(),
            day: args.date.getDate(),
            hour: args.date.getHours(),
            minute: args.date.getMinutes(),
            second: args.date.getSeconds(),
            millisecond: args.date.getMilliseconds()
        };
    };
    self.scrollToActive = function(){
        self.years.style.marginLeft = (self.style.year.rect.w * ((self.selectedValues.year - self.minYear)*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.year.rect.w * 0.5) + 'px';
        self.months.style.marginLeft = (self.style.month.rect.w * (self.selectedValues.month*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.month.rect.w * 0.5) + 'px';
        self.days.style.marginLeft = (self.style.day.rect.w * (self.selectedValues.day*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.day.rect.w * 0.5) + self.style.day.rect.w + 'px';
        self.hours.style.marginLeft = (self.style.hour.rect.w * (self.selectedValues.hour*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.hour.rect.w * 0.5) + self.style.hour.rect.w + 'px';
        self.minutes.style.marginLeft = (self.style.minute.rect.w * (self.selectedValues.minute*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.minute.rect.w * 0.5) + 'px';
        self.seconds.style.marginLeft = (self.style.second.rect.w * (self.selectedValues.second*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.second.rect.w * 0.5) + 'px';
        self.milliseconds.style.marginLeft = (self.style.millisecond.rect.w * (self.selectedValues.millisecond*-1)) +
            (self.dialog.contentRect.w * 0.5) - (self.style.millisecond.rect.w * 0.5) + 'px';
    };
    self.enableScrollDrag = function(ele){
        var mouseStartPosition = {x: 0, y: 0},
            currentMousePosition,
            left = 0,
            startingLeftOffset = 0;
        function startMoving(e){
            startingLeftOffset = parseInt(ele.style.marginLeft.replace('px',''), 10);
            mouseStartPosition = self.mouseLiteral(e);
            document.addEventListener('mouseup', stopMoving, false);
            document.addEventListener('mousemove', move, false);
        }
        function move(e){
            self.didDrag = true;
            currentMousePosition = self.mouseLiteral(e);
            left = (currentMousePosition.x - mouseStartPosition.x) + startingLeftOffset;
            ele.style.marginLeft = left + 'px';
        }
        function stopMoving(){
            document.removeEventListener('mouseup', stopMoving, false);
            document.removeEventListener('mousemove', move, false);
        }
        ele.addEventListener('mousedown', startMoving, false);
    };
    self.applyStyle = function(){
        self.container.style.background = self.style.background;
        self.years.style.width = self.style.year.rect.w * (self.maxYear - self.minYear) + 'px';
        self.months.style.width = self.style.month.rect.w * 12 + 'px';
        self.days.style.width = self.style.day.rect.w * self.daysInSelectedMonth + 'px';
        self.hours.style.width = self.style.hour.rect.w * 24 + 'px';
        self.minutes.style.width = self.style.minute.rect.w * 60 + 'px';
        self.seconds.style.width = self.style.second.rect.w * 60 + 'px';
        self.milliseconds.style.width = self.style.millisecond.rect.w * 1000 + 'px';
        self.years.style.height = self.style.year.rect.h + 1 + 'px';
        self.months.style.height = self.style.month.rect.h + 1 + 'px';
        self.days.style.height = self.style.day.rect.h + 1 + 'px';
        self.hours.style.height = self.style.hour.rect.h + 1 + 'px';
        self.minutes.style.height = self.style.minute.rect.h + 1 + 'px';
        self.seconds.style.height = self.style.second.rect.h + 1 + 'px';
        self.milliseconds.style.height = self.style.millisecond.rect.h + 1 + 'px';
    };
    self.refreshDays = function(){
        var x,
            day;
        self.days.innerHTML = '';
        self.days.style.marginLeft = 0;
        self.elements.days = [];
        self.daysInSelectedMonth = self.daysInMonth(self.selectedValues.month, self.selectedValues.year);
        for(x = 0; x < self.daysInSelectedMonth; x++){
            day = self.addDateItem(x, 'day');
            self.days.appendChild(day);
        }
        self.applyStyle();
    };
    self.init = function(){
        if (self.raiseEvent('init', undefined, undefined, undefined)) { return self; }
        var year,
            month,
            day,
            hour,
            minute,
            second,
            millisecond,
            x,
            menuBar = new Nina.UI.menuBar({
                items: [
                    {
                        text: 'Select',
                        click: function(){
                            if (self.raiseEvent('submit', undefined, undefined, [self.date])) { return self; }
                            self.dialog.close();
                        }
                    },
                    {
                        text: 'Cancel',
                        click: function(){
                            if (self.raiseEvent('cancel', undefined, undefined, [self.date])) { return self; }
                            self.dialog.close();
                        }
                    },
                    {
                        text: 'Today',
                        click: function(){
                            args.date = new Date();
                            self.fillSelectedValues();
                            self.scrollToActive();
                            self.setActive();
                        }
                    }
                ]
            });
        self.container = self.createElement('div');
        self.years = self.createElement('div');
        self.months = self.createElement('div');
        self.days = self.createElement('div');
        self.hours = self.createElement('div');
        self.minutes = self.createElement('div');
        self.seconds = self.createElement('div');
        self.milliseconds = self.createElement('div');
        self.minYear = args.minYear || 1900;
        self.maxYear = args.maxYear || new Date().getFullYear() + 20;
        args.date = args.date || new Date();
        self.fillSelectedValues();
        self.applyStyle();
        self.container.style.overflow = 'hidden';
        for(x = self.minYear; x < self.maxYear; x++){
            year = self.addDateItem(x, 'year');
            self.years.appendChild(year);
        }
        for(x = 0; x < 12; x++){
            month = self.addDateItem(x, 'month');
            self.months.appendChild(month);
        }
        self.refreshDays();
        for(x = 0; x < 24; x++){
            hour = self.addDateItem(x, 'hour');
            self.hours.appendChild(hour);
        }
        for(x = 0; x < 60; x++){
            minute = self.addDateItem(x, 'minute');
            self.minutes.appendChild(minute);
        }
        for(x = 0; x < 60; x++){
            second = self.addDateItem(x, 'second');
            self.seconds.appendChild(second);
        }
        for(x = 0; x < 1000; x++){
            millisecond = self.addDateItem(x, 'millisecond');
            self.milliseconds.appendChild(millisecond);
        }
        var dateItems = [],
            dialogHeight = 0;
        args.show = args.show || 'days';
        if(['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'Y';
            dialogHeight += self.style.year.rect.h;
            dateItems.push(self.years);
        }
        if(['months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'M Y';
            dialogHeight += self.style.month.rect.h;
            dateItems.push(self.months);
        }
        if(['days', 'hours', 'minutes', 'seconds', 'milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'D M d Y';
            dialogHeight += self.style.day.rect.h;
            dateItems.push(self.days);
        }
        if(['hours', 'minutes', 'seconds', 'milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'D M d Y g A';
            dialogHeight += self.style.hour.rect.h;
            dateItems.push(self.hours);
        }
        if(['minutes', 'seconds', 'milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'D M d Y g:i A';
            dialogHeight += self.style.minute.rect.h;
            dateItems.push(self.minutes);
        }
        if(['seconds', 'milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'D M d Y g:i:s A';
            dialogHeight += self.style.second.rect.h;
            dateItems.push(self.seconds);
        }
        if(['milliseconds'].indexOf(args.show) !== -1){
            self.dateFormat = 'D M d Y g:i:s.u A';
            dialogHeight += self.style.millisecond.rect.h;
            dateItems.push(self.milliseconds);
        }
        self.noSelect(dateItems);
        self.appendObj(self.container, dateItems);
        
        self.dialog = Nina.UI.dialog({
            menuBar: menuBar,
            modal: args.modal,
            modalCanClose: args.modalCanClose
        });
        dialogHeight += self.dialog.style.titleRect.h + (dateItems.length * 4) - 3;
        self.dialog.content(self.container);
        self.scrollToActive();
        self.dialog.setRect(Nina.extend(self.dialog.rect, {
            h: dialogHeight + menuBar.style.rect.h
        }));
        dateItems.forEach(function(dateItem){
            self.enableScrollDrag(dateItem);
        });
        self.setActive();
        if(args.beAClock){
            setInterval(function(){
                args.date = new Date();
                self.fillSelectedValues();
                self.setActive();
                self.scrollToActive();
            }, 10);
        }
    };
    self.init();
};