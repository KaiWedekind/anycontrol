# AnyControl

AnyControl is a small JavaScript SpeechRecognition library that lets your users control your site with voice commands. It is build on top of Webkit Speech API.

AnyControl has no dependencies, just 5 KB small, and is free to use and modify under the MIT license.

[![NPM](https://nodei.co/npm/anycontrol.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/anycontrol/)

[![Issues](https://img.shields.io/github/issues/KaiWedekind/anycontrol.svg)](https://github.com/KaiWedekind/anycontrol/issues)
[![Forks](https://img.shields.io/github/forks/KaiWedekind/anycontrol.svg)](https://github.com/KaiWedekind/anycontrol/network)
[![Stars](https://img.shields.io/github/stars/KaiWedekind/anycontrol.svg)](https://github.com/KaiWedekind/anycontrol/stargazers)
[![License](https://img.shields.io/github/license/KaiWedekind/anycontrol.svg)](https://raw.githubusercontent.com/KaiWedekind/anycontrol/master/LICENSE)
[![Package](https://img.shields.io/badge/npm-5.0.3-blue.svg)](https://github.com/KaiWedekind/anycontrol/blob/master/package.json)
[![CodeOfConduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg)](https://github.com/KaiWedekind/anycontrol/blob/master/CodeOfConduct.md)

## Browser support

Google Chrome 31+

## Live Demo + Documentation

[Link](https://kaiwedekind.github.io/anycontrol)

## Getting started

```html
<script src="https://unpkg.com/anycontrol/dist/index.umd.min.js"></script>
<script>
  var ctrl = new anycontrol()

  ctrl.addCommand("previous page", function() {
    console.log('Go to previous page')
  });

  ctrl.addCommand("next page", function () {
    console.log('Go to next page')
  });

  ctrl.start();
</script>
```

## API

**Add command**
```javascript
ctrl.addCommand("home", function() {
  // Navigate to home
});

ctrl.addCommand("search", function(param) {
  console.log("Search for:", param);
});
```

**Add command with keyword support**

```javascript
ctrl.addCommand("send a message to ${USER} saying ${THIS_TEXT} and send it at ${SPECIFIED_TIME}", function (ctx) {
  console.log('Result', ctx)
  /* 
    { 
      USER: "michael",
      transcript: "hello siri send a message to michael saying hi there and send it at 2 p.m.",
      THIS_TEXT: "hi there",
      SPECIFIED_TIME: "2 p.m."
    }
  */
});

ctrl.addCommand("${MY_ASSISTANT} what ${OBJECT} is it", function (ctx) {
  console.log('Result', ctx)
  /*
    {
      MY_ASSISTANT: "alexa",
      OBJECT: "day",
      transcript: "alexa what day is it"
    }
  */
});

/* Variations */

function calculateSum (ctx) {
    alert(`The result of ${ctx.VALUE_1} times ${ctx.VALUE_2} equals ${ctx.VALUE_1 * ctx.VALUE_2}`)
}

ctrl.addCommand("${MY_ASSISTANT} what is ${VALUE_1} x ${VALUE_2}", calculateSum);
ctrl.addCommand("${MY_ASSISTANT} what's ${VALUE_1} x ${VALUE_2}", calculateSum);

function presidentLookup (country) {
    switch (country) {
        case 'argentina': {
            return 'Alberto Fernández'
        }
        case 'angola': {
            return 'João Lourenço'
        }
        case 'brazil': {
            return 'Jair Bolsonaro'
        }
        case 'china': {
            return 'Xi Jinping'
        }
        case 'america': {
            return 'Donald Trump'
        }
    }
}

function checkPresidentOfCountry(ctx) {
    const president = presidentLookup(ctx.COUNTRY);
    alert(`The president of ${ctx.COUNTRY} is ${president}.`);
}

ctrl.addCommand("Who's the president of ${COUNTRY}", checkPresidentOfCountry);
ctrl.addCommand("Who is the president of ${COUNTRY}", checkPresidentOfCountry);
```

**Remove command**
```javascript
ctrl.removeCommand("search");
```

**Start listening (continuously)**
```javascript
ctrl.start();
```

**Stop listening**
```javascript
ctrl.stop();
```

**Get single command**
```javascript
ctrl.getCommand();
```

**Turn debug mode on/off**
```javascript
ctrl.debug(true|false);
```

## LICENSE

MIT