# Autotyper

A simple JavaScript plugin that automatically types out text.

## Instructions

`npm install --save autotyper`
`yarn add --save autotyper`

```javascript
const example = Object.create(autotyper).init(document.querySelector('.js-element'));
```

## Options

### Text

### Interval

### Loop

## Api

```javascript
const example = Object.create(autotyper);

example.init(document.querySelector('.js-element'), { autoStart: false });

// somewhere later in your code...

example.start();
```

### Start

## Events

### Init
### Start
### Type
### Stop
### Loop
### Destroy
