# AnyControl

AnyControl is a small JavaScript SpeechRecognition library that lets your users control your site with voice commands. It is build on top of Webkit Speech API.

AnyControl has no dependencies, just 3 KB small, and is free to use and modify under the MIT license.

[![NPM](https://nodei.co/npm/anycontrol.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/anycontrol/)

[![Issues](https://img.shields.io/github/issues/KaiWedekind/anycontrol.svg)](https://github.com/KaiWedekind/anycontrol/issues)
[![Forks](https://img.shields.io/github/forks/KaiWedekind/anycontrol.svg)](https://github.com/KaiWedekind/anycontrol/network)
[![Stars](https://img.shields.io/github/stars/KaiWedekind/anycontrol.svg)](https://github.com/KaiWedekind/anycontrol/stargazers)
[![License](https://img.shields.io/github/license/KaiWedekind/anycontrol.svg)](https://raw.githubusercontent.com/KaiWedekind/anycontrol/master/LICENSE)
[![Package](https://img.shields.io/badge/npm-5.0.3-blue.svg)](package)
[![CodeOfConduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg)]()

## Browser support

Google Chrome 31+

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