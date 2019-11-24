---
title: "{this} mechanics (part 2): autopsy of a function call"
date: "2019-11-11"
draft: true
featuredImage: "./this-keyword.png"
featuredImageAlt: "Screenshot of a portion of ECMAScript specification with this keyword section, highlighted with 2 red pointed arrows"
template: "BlogPost"
tags:
    - this keyword
    - function call under the hood
    - javascript
    - this mechanics
    - ecmascript
---

This is the second article of the two-part series on `this` mechanics in JavaScript.

Today we will walk through current [ECMAScript Specification text](https://tc39.es/ecma262)
trying to resolve the following scenario:

```ts
const obj = {
    x: 1,
    method() {
        console.log(this.x);
    }
};

const { method } = obj;

method();
```

We will look at all the points in the ECMAScript text that affect `this` keyword resolution, from function definition, function call
all the way to the very `this` expression in the function body.
