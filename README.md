# Autotyper

A simple JavaScript (currently jQuery) plugin to automatically type out text.

## Instructions

`bower install --save autotyper`

```javascript
$('.js-element').autotyper();
```

## Options

### Text

### Interval

### Loop

## Methods

Entire API is exposed and methods can be called by passing their name to the plugin function like so:-

```javascript
var $element = $('.js-element').autotyper({ autoStart: false });

// somewhere later in your code...

$element.autotyper('start');
```

## Events

### Init
### Start
### Type
### Stop
### Loop
### Destroy
