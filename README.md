#Nina#

JavaScript User Interface Library

##Welcome##

Nina is a free open source JavaScript UI library.  Currently, Nina is a work in progress.

##Goals##

Nina aims to reproduce all common widgets used in application construction.  Dialogs, Tabs, Grids, Tree Views,
Forms and much more.

##What can it do right now?##

Not much.  Nina is in its early stages.  For an updated list of what's happening
check the [Wiki](https://github.com/CorbinDallas/Nina/wiki).

##Documentation##

[Naturally!](http://corbindallas.github.io/Nina/docs/index.html)

##Demos?##

[But of course!](http://corbindallas.github.io/Nina/demos/index.html)

##Download##

[Latest and nightly builds](http://corbindallas.github.io/Nina/nina.html)

##Examples##

Create a dialog.
```
Nina.UI.dialog();
```

Create a dialog and set the title during creation.
```
Nina.UI.dialog({title: 'Blah'});
```

Create a dialog, then set the title and content using a reference.
```
var x = Nina.UI.dialog()
x.title('Blah');
x.content('<htmlstuff>");
```

Create a dialog, then set the title, content and reference using chaining.
```
var x = Nina.UI.dialog()
        .title('Blah')
        .content('<htmlstuff>');
```
All widgit methods return a reference to themselves.  Chain all night long and into the next day.

Standard DOM style event handlers!  Wow!
```
var x = Nina.UI.dialog();
x.addEventListener('maximize', function(e){
  this.title(this.rect.w); // get the dialog's width
  e.preventDefault();
});
```

And their new age brethren.
```
var x = Nina.UI.dialog();
x.on('maximize', function(e){
  this.title(this.rect.w); // get the dialog's width
  e.preventDefault();
});
```

Or do it when you create it.
```
var x = Nina.UI.dialog({
  maximize: function(e){
    this.title(this.rect.w); // get the dialog's width
    e.preventDefault();
  }
});
```

Change styles.
```
Nina.UI.dialog({
  style: {
    Active: {
      titleBackground: 'red'
    }
  }
});
```

Change styles with the widgits style constructor.
```
var x = Nina.UI.dialogStyle({
  active: {
    titleBackground: 'red'
  }
});
Nina.UI.dialog({style:x});
```

There are a lot of styles.
```
var x = Nina.UI.dialogStyle({
  titleRect: { x: 0, y: 0, w: 0, h: 15 },
  titlePadding: { t: 1, r: 0, b: 0, l: 5 },
  Inactive:{
    minimizeButtonBackground: 'url(data:image/gif;base64,R0lGODlhIgAYAIAAAP///3d3dyH5BAAAAAAALAAAAAAiABgAAAIhjI+py+0Po5y02ouz3rz7D4YYQJZlZ6ZoeoruC8fyTE8FADs=)';
  }
});
Nina.UI.dialog({style:x});
```

Widgets work together.
```
Nina.UI.taskBar();
Nina.UI.dialog({title:'Blah', content:'<htmlstuff>'});
```

###Code like it was fun again###
All widget methods that accept HTML also accept other fun stuff.  Like DOM references, arrays of DOM references, 
functions, arrays of functions, mixed arrays of HTML string, DOM elements and functions that return other
functions that return arrays of DOM elements.  I'm joking.  Actually, I'm not.
```
function meh(){
  return function(){
    var x = [],
        y,
        z;
    for(y=0;y<10;y++){
      z = document.createElement('span');
      x.push(z);
    }
    return x;
  }
}
Nina.UI.dialog({content: ['<htmlstuff>', document.createElement('div'), meh] });
```
Not actually sure where that specific example would be useful, but I just love recursion.


##Why Build Another JavaScript UI Library?##

Existing UI Libraries use one or more of these undesirable properties. 

* Implements non-standard event handling systems.
* Reliance upon HTML that already exists in the DOM.
* Not styleable or customizable.
* Not free and/or open source.
* Doesn't implement enough events.
* Doesn't have enough widgets.
* Doesn't integrate well with server side data systems.
* Lacks consistency in widget implementation.
* Difficult to use and/or unintuitive syntax.

One of the main goals of Nina is to overcome these undesirable properties.  Nina is a pure
JavaScript UI, no writing HTML tags.  Nina is well documented and easy to use.
Nina is powerful, and will integrate with REST APIs seamlessly.  Nina is all you
need to create powerful client side user interface for any web application.


##Contribute##

Nina is free open source software.  
If you are interested in contributing please contact [CorbinDalls](https://github.com/CorbinDallas).

[Nina's MIT License](https://github.com/CorbinDallas/Nina/blob/master/LICENSE)
