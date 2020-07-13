# Obfuscated Javascript

This is a project that demonstrates the weird type-casting that Javascript can do!
based off of [this github](https://github.com/aemkei/jsfuck)

## Background

Since Javascript automatically casts types to other types in operations, you can get
a lot of weird results like

``` javascript
  9 + "1"; // => "91"
  9 - "1";  // => 8
  [] + []; // => ""
```

## How it works

Using javascripts casting logic, you can start to manipulate the empty array
to basically whatever!

```javascript
  []; // can be 0, "", true
  ![]; // => `false` since `[]` is truthy
  !![]; // => `true`
  +[]; // => `0` since + can be a unary operator that casts its operand to a number
  +!+[]; // => `1` since `!0` is `true` and `true` casts to 1
```

Once we have those building blocks, we can start to get letters from casting these primitive
types. Lets walk through a simple example with getting the letter `t`. Each line below returns
`t`:

```javascript
  "true"[0];
  (true+"")[0];
  (!![]+"")[0];
  (!![]+[]+[])[0];
  (!![]+[]+[])[+[]];
```

So, for free, you can get the letters from `true`, `false`, `NaN`, `undefined`, etc.

## How to run

In this directory, put

```javascript
  const { parser } = require('./lib/obfuscate.js');
```

at the top of your file. Then call it using a string formatted like so `'"whatever to change"'`

```javascript
  const hello_world = parser('"hello world"');
  ```

