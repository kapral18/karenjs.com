---
title: "Understanding this, one example at a time"
date: "2020-03-16"
draft: false
featuredImage: "./coin-telescope.jpg"
featuredImageAlt: "Closeup photography of coin operated telescope by socialcut @ https://unsplash.com/"
template: "BlogPost"
tags:
    - ecmascript
    - javascript
    - javascript-this-keyword
    - javascript-this-keyword-mechanics
    - javascript-this-keyword-examples
---

I've been struggling with understanding javascript `this` keyword
resolution mechanics for a long time.

I read tons of material on the topic, but
never really had the complete picture.

This write-up is an attempt to build up a mental model,
that covers the full range of `this` keyword resolution mechanics
in javascript.

We are going to check different cases highlighting `this`
keyword resolution mechanics from different angles
and will combine it all together in the final
example at the end of the article.

So let's dive right in.

### Interview case

Let's look at an interview example, that I've personally seen many times:

```ts
const obj = {
    x: 1,
    method() {
        console.log(this.x);
    }
};

obj.method(); // 1
const { method } = obj;

method(); // undefined
```

Here we make 2 calls. The first one contains a dot in the signature:

```ts
obj.method(); // 1
```

The second - doesn't:

```ts
method(); // undefined
```

We see they yield different results, hence our first guess is
that the call signature somehow affects `this` keyword resolution.

In short, `this` keyword resolves to the "left of the last dot"
part of a call signature.

Let's refer to that part as `<baseValue>`.

```ts
obj.method()
// can be represented as
<baseValue>.method()

// hence in "obj.method" body
console.log(this.x);
// becomes
console.log(<baseValue>.x);
// i.e.
console.log(obj.x); // 1
```

Same thing would apply, for example, to a nested object
method call like `obj1.obj2.obj3.method()`:

```ts
const obj1 = {
    obj2: {
        obj3: {
            x: 1,
            method() {
                console.log(this.x);
            }
        }
    }
}

obj1.obj2.obj3.method()
// can be represented as
<baseValue>.method();
// hence in "obj1.obj2.obj3.method" body
console.log(this.x)
// becomes
console.log(<baseValue>.x)
// i.e.
console.log(obj1.obj2.obj3.x); // 1
```

In the dot-free `method()` call there is no "dot" signature
so we can literally prepend `<undefined>` as its `<baseValue>`:

```ts{12,13}
method()
// or
<undefined>.method()
// can be represented as
<baseValue>.method()
// hence in "method" body
console.log(this.x)
// becomes
console.log(<baseValue>.x)
// i.e.
console.log(undefined.x)
// in non-strict mode becomes
console.log(window.x) // undefined
```

As you can see there is an additional [conversion step](https://tc39.es/ecma262/#sec-strict-mode-of-ecmascript)
from primitive to non-primitive `<baseValue>`, which is skipped in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode).

> If `this` is evaluated within strict mode code, then the `this` value is not coerced
> to an object. A `this` value of `undefined` or `null` is not converted to the global object
> and primitive values are not converted to wrapper objects. The `this` value passed via a
> function call (including calls made using `Function.prototype.apply` and
> `Function.prototype.call`) do not coerce the passed `this` value to an
> object (9.2.1.2, 19.2.3.1, 19.2.3.3).

And since our code example above **is** in non-strict mode already it
continues with that additional step, i.e. converting
primitive `undefined` to global `window` object.

> We will return to the topic of strict mode [later](#strict-mode).

For convenience, let's refer to the "left of the last dot" rule as just the "dot" rule.

### Hidden method

Let's try to use the "dot" rule to explain this next case.

```ts{12}
const _hiddenMethod = function() {
    console.log(this.x);
};

const obj = {
    x: 1,
    method() {
        _hiddenMethod();
    }
};

obj.method(); // undefined !!!
const { method } = obj;

method(); // undefined
```

Different results this time.

So when we call `obj.method()` it then calls `hiddenMethod()`,
thus we can build a chain of calls:

```ts
GlobalScriptCall() -> obj.method() -> hiddenMethod()
```

> GlobalScriptCall() is our pseudocode way of saying global level invocation, i.e.
> main program run.

And here is a dilemma:

which call do we need to apply the "dot" rule to,
to resolve `this` keyword?

`GlobalScriptCall`?
`obj.method`?
`hiddenMethod`?

Or maybe all three?

**The answer is:**

The call that directly contains the `this` expression in its body.

**But why?**

For each call in the call chain you have your own version of `<baseValue>`
which would resolve `this` keyword of that specific invocation.

So, here it is unsurprisingly the `hiddenMethod()` call and
when we apply the "dot" rule, we get:

```ts
hiddenMethod()
// is same as
<baseValue>.hiddenMethod()
// becomes
<undefined>.hiddenMethod()
// non-strict mode converts it into
<window>.hiddenMethod()
// hence in hiddenMethod body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

### "Brace noise"

Now onto our next example

```ts
const obj = {
    x: 1,
    method() {
        // iife1
        (function() {
            // iife2
            (function() {
                // iife3
                (function() {
                    // iife4
                    (function() {
                        // iife5
                        (function() {
                            console.log(this.x);
                        })();
                    });
                });
            });
        })();
    }
};

obj.method(); // undefined
const { method } = obj;

method(); // undefined
```

The rules are still the same, but visually the braces might add some confusing noise.

Here we are dealing with a lot of nested [iife's](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

But let's dissect the `obj.method()` call.

Here is the chain of calls all the way down to the call
containing `console.log(this.x)` that we want to resolve:

```ts
GlobalScriptCall() -> obj.method() -> iife1() -> iife2() -> iife3() -> iife4() -> iife5()
```

Again we need to focus on the call containing `this` expression directly in its function body.

Here it's `iife5`.

Let's apply the same "dot" rule here:

```ts
// iife5
(function() {
    console.log(this.x);
})();
// i.e.
<baseValue>.(function() {
                console.log(this.x);
            })();
// becomes
<undefined>.(function() {
                console.log(this.x);
            })();
// in non-strict mode gets converted into
<window>.(function() {
                console.log(this.x);
         })();
// hence in function body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

So it might seem confusing, but the function object literal `(function() {...})`
here is working exactly like any other function name like `method` in a call signature.

We evaluate it, applying the "dot" rule directly to the function literal signature.

The resolution mechanics is the same.

### Arrow function

You might have noticed that arrow functions are not present in previous examples.

This is a deliberate choice because arrow function is evaluated differently.

Arrow function call gets `<baseValue>` of the call
that **created** it.

So arrow function call disregards its own `<baseValue>` and takes
its creator call `<baseValue>` after applying the "dot" rule to it.

Let's look at an example:

```ts
const obj = {
    x: 1,
    method: () => {
        console.log(this.x);
    }
};

obj.method(); // undefined
```

So even though we expect `<baseValue>` of the `obj.method()` call
to be `obj`

`console.log(this.x)` still yields `undefined`.

Why?

Because if we look at the chain of calls,

```ts
GlobalScriptCall() -> obj.method()
```

and we look at where `obj.method` is created,
we see that it was created during `GlobalScriptCall()` call.

How so?

If you look close you will see that

```ts{3-5}
const obj = {
    x: 1,
    method: () => {
        console.log(this.x);
    }
};
```

this highlighted portion is defined in the global level,
even before the `obj` is finalized as a literal.

So we get the `<baseValue>` of `GlobalScriptCall()`
to be used as our new `this` value.

And [later](#global-code) we will learn that `<baseValue>` of `GlobalScriptCall()`
is always hardcoded to global object, i.e. `window` in browser

and `window.x` is `undefined`, hence the final result.

### Nested arrow functions

To consolidate what we just learned about arrow function
`this` keyword resolution, let's try to apply that to
this next case with nested arrow functions:

> iiafe - immediately invoked arrow function expression

```ts
const obj = {
    x: 1,
    method() {
        // iiafe1
        (() => {
            // iiafe2
            (() => {
                // iiafe3
                (() => {
                    console.log(this.x);
                })();
            })();
        })();
    }
};

obj.method(); // 1
const { method } = obj;

method(); // undefined
```

Starting with `obj.method()` call analysis:

Let's find the call in call chain,
containing `this` expression in its body:

```ts
GlobalScriptCall() -> obj.method() -> iiafe1() -> iiafe2() -> iiafe3()
```

It's `iiafe3()` in our case

Now resolution algorithm can go like this:

1. Is `iife3` an arrow function ? yes
2. Where was `iife3` defined ? `iife2`
3. Is `iiafe2` an arrow function ? yes
4. Where was `iife2` defined ? `iife1`
5. Is `iife1` an arrow function ? yes
6. Where was `iife1` defined ? `obj.method`
7. Is `obj.method` an arrow function ? no
8. Apply the "dot" rule to `obj.method`:

```ts
obj.method();
// i.e
<obj as baseValue>.method()
// hence in method body and all nested arrow functions
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

Let's look at remaining `method()` call:

Our slightly different call chain:

```ts
GlobalScriptCall() -> method() -> iiafe1() -> iiafe2() -> iiafe3()
```

Offending call is still `iiafe3`

1. Is `iife3` an arrow function ? yes
2. Where was `iife3` defined ? `iife2`
3. Is `iiafe2` an arrow function ? yes
4. Where was `iife2` defined ? `iife1`
5. Is `iife1` an arrow function ? yes
6. Where was `iife1` defined ? `method`
7. Is `method` an arrow function ? no
8. Apply the "dot" rule to `method`:

```ts
method();
// i.e
<undefined as baseValue>.method();
// in non-strict mode becomes window
<window as baseValue>.method()
// hence in method body and all nested arrow functions
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

### Indirection

This next example describes a pretty confusing form of function invocation, -
an indirect function invocation.

```ts
const obj = {
    x: 1,
    method() {
        console.log(this.x);
    }
};

obj.method(); // 1
(obj.method, obj.method)(); // undefined
(z = obj.method)(); // undefined
// prettier-ignore
(obj.method)(); // 1
```

Results may be surprising, because a completely separate evaluation
is happening before function call evaluation.

[Grouping operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Grouping)
is changing the precedence of expressions, making function call secondary to other
expression evaluations, that would otherwise happen after call evaluation.

Let's analyze

```ts
 call expr
|-------------------------|
(obj.method, obj.method)();
|----------------------|
 comma sequence expr

```

Here we see a [comma sequence expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator)
and call expression.

Comma sequence expression evaluates its operands from left to right
and returns the evaluation of last operand.

In our case both operands are the same

`obj.method, obj.method`

After evaluation last operand returns a value - the underlying `method` function object,
that `obj.method` signature points to.

So we apply the "dot" rule to it.

```ts
(function method() {console.log(this.x)})();
// which is the same as
<undefined as baseValue>.(function method() {console.log(this.x)})();
// which gets converted to window in non-strict mode
<window>.(function method() {console.log(this.x)})(); // in non-strict mode
// hence
console.log(this.x);
// becomes
console.log(window.x) // undefined
```

The same logic applies to `(z = obj.method)()` [assignment expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators#Assignment) case.

We evaluate assignment expression, which returns the value of last operand evaluation, i.e.
`obj.method`, the rest is the same.

The last one might also be confusing `(obj.method)()` because it yields the same output as without parentheses.

But we should take into account that grouping only changes expression priority
and doesn't trigger extra expression value return as in the previous two expressions.

That's why we can consider both `obj.method()` and `(obj.method)()` to be identical,
hence the respective results.

### Call / Apply

`call`/`apply` is a way to provide `<baseValue>` explicitly.

```ts
const obj = {
    method() {
        console.log(this.x);
    }
    x: 1
};

const obj2 = {
    x: 2
}

obj.method.call(obj2)
obj.method.call(undefined)
```

For `obj.method.call(obj2)`:

```ts
obj.method.call(obj2)
// is same as
<obj2 as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(obj2.x) // 2
```

and for `obj.method.call(undefined)`:

```ts
obj.method.call(undefined)
// is same as
<undefined as baseValue>.method()
// or in non-strict mode
<window>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

As you might have noticed, we can pass whatever value as `<baseValue>` into `call(<baseValue>)`/`apply(<baseValue>)`.

And of course there is a respective conversion mechanism in place:

`undefined` or `null` in non-strict mode is converted to the global `window` object,
other values are converted into their object wrapper alternatives.

```ts
obj.method.call(null); // window
obj.method.call(1); // wrapper object: Number {1}
obj.method.call("string"); // wrapper object: String {"string"}
obj.method.call(true); // wrapper object: Boolean {true}
// ... etc
```

Here is the full [conversion table](https://tc39.es/ecma262/#table-13)

> ! Important note:

In the case of arrow function, `call` or `apply` is skipped.

Instead, the arrow function `this` keyword is resolved as
previously described by evaluating `<baseValue>` of a call
where arrow function was defined in the chain of calls:

So here we ignore the `.call` part

```ts{5}
const obj = {
    x: 1,
    method() {
        // iiafe
        (() => console.log(this.x)).call({ x: 2 });
    }
};

obj.method(); // 1
```

and the example gets simplified to just

```ts{5}
const obj = {
    x: 1,
    method() {
        // iiafe
        () => console.log(this.x);
    }
};

obj.method(); // 1
```

And then we proceed with applying the "dot" rule
to the call where the arrow function was defined.

So in the chain of calls

```ts
GlobalScriptCall() -> obj.method() -> iiafe.call({ x: 2 })
```

We start with `iiafe.call({ x: 2 })`, because
`iiafe` contains `this` expression directly in its body:

1. Is `iiafe` an arrow function ? yes, skip `.call({ x: 2 })` part
2. Where was `iiafe` defined ? `obj.method`
3. Is `obj.method` an arrow function ? no
4. Apply the "dot" rule to `obj.method`:

```ts
obj.method();
// i.e.
<baseValue>.method()
// hence inside and in nested calls
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

### Bind

`bind` is just a wrapper function with a hardcoded, fixed `this` value.

```ts
const obj = {
    method() {
        console.log(this.x);
    }
    x: 1
};

const obj2 = {
    x: 2
}

const boundToObj2 = obj.method.bind(obj2);
boundToObj2() // 2
```

`boundToObj2` can essentially be represented as:

```ts
function boundToObj2() {
    return obj.method.call(obj2);
}
```

`boundToObj2`, when called, is just invoking `obj.method`
with predefined `<baseValue>`, which is always `obj2`.

So whatever you do, however you try, you won't be able to change that.

Be it `call`, `apply` or another `bind` on top, that tries to change the `this`.

Nothing will affect this inner `.call(obj2)` with explicitly passed `obj2`.

Or in other words:

```ts
boundToObj2(); // 2
boundToObj2.call(obj); // still 2, call(obj) affects nothing
const reboundBack = boundToObj2.bind(obj); // bind(obj) affects nothing
reboundBack(); // nope, still 2
reboundBack.apply(obj); // nopes, still 2 and apply(obj) is having no affect at all
```

> ! Important note:

In the case of arrow function, `bind` call is completely ignored.

Instead, the arrow function `this` keyword is resolved as previously described
by evaluating `<baseValue>` of a call where arrow function was defined in the chain of calls:

So we ignore the `.bind` part

```ts
const obj = {
    x: 1,
    method() {
        const boundFn = (() => console.log(this.x)).bind({ x: 2 });
        boundFn();
    }
};

obj.method(); // 1
```

and our example gets simplified to

```ts
const obj = {
    x: 1,
    method() {
        const boundFn = () => console.log(this.x);
        boundFn();
    }
};

obj.method(); // 1
```

And then we proceed with applying the "dot" rule
to the call where the arrow function was defined.

So in the chain of calls

```ts
GlobalScriptCall() -> obj.method() -> boundFn()
```

We start with `boundFn`, because
`boundFn` contains `this` expression directly in its body:

1. Is `boundFn` an arrow function ? yes, skip `.bind({ x: 2 })` part
2. Where was `boundFn` defined ? `obj.method`
3. Is `obj.method` an arrow function ? no
4. Apply the "dot" rule to `obj.method`:

```ts
obj.method();
// i.e.
<baseValue>.method()
// hence inside and in nested calls
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

Great. Now let's move to our next case. Callbacks.

### Callback

What are callbacks exactly?

And why do we talk about `this` keyword resolution in callbacks separately?

Because one thing that makes callback a callback
is the [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)

In other words we hand function invocation control over to some other abstraction,
3rd party or whatever.

That 3rd party can invoke it whenever and however it deems necessary.

And as we already know, one of the keys to correctly
resolving the `this` keyword is knowing how exactly the call is made, i.e.
what is the call signature.

Is it a regular invocation? `Call/Apply`? Or maybe it's assigned to an object property
and called with that object `<baseValue>`?

The answer is we don't know, and we have to know or guess how our callback is invoked,
so we can move on with our analysis.

For example let's check how `this` is resolved in case of `setTimeout` as a case example.

```ts
const obj = {
    x: 1
    method() {
        setTimeout(
            // iife callback
            function() {
                console.log(this.x)
            },
            100
        );
    }
}

obj.method(); // undefined

const {method} = obj;
method(); // undefined
```

Here we can assume that `setTimeout` internally might
be calling passed function after a delay like this:

```ts
// pseudo code
function setTimeout(callback, delay, ...args) {
    wait(delay);

    callback(...args);
}
```

So `setTimeout` call by itself doesn't matter for us
we can completely disregard it as long
as we know how `callback` is eventually invoked.

So if we build a chain of calls for `obj.method()` call,
we would get this

```ts
GlobalScriptCall() -> obj.method() -> setTimeout(iife) -> iife()
```

And at this point it doesn't matter if we tweak the
`setTimeout()` call trying to affect `iife()` `this` keyword resolution,
because as we now know `iife()` is just called directly as is,
with its own independent `<baseValue>` as in `<baseValue>.iife()`

```ts
GlobalScriptCall() -> obj.method() -> setTimeout.call(null, iife) -> iife()
GlobalScriptCall() -> obj.method() -> setTimeout.apply([], iife) -> iife()
GlobalScriptCall() -> obj.method() -> setTimeout.bind({})(iife) -> iife()
```

All of the above `setTimeout` call variations don't have any affect and `iife()` will
be resolved by applying standard "dot" rule to `iife()` call

1. is `iife()` an arrow function? no
2. apply "dot" rule to `iife()` call rightaway

```ts
iife()
// is same as
<undefined as baseValue>.iife(...args)
// in non-strict mode becomes
<window>.iife(...args)
// so in iife body
console.log(this.x)
// becomes
console.log(window.x); // undefined
```

Same procedure for `method()` invocation.

```ts
GlobalScriptCall() -> method() -> setTimeout(iife) -> iife()
```

The rest of the resolution logic is same...

### Arrow function callback

But what if we have an arrow function as a callback?

How does that work out?

Let's bring back our example, a little tweaked this times:

> iiafe - immediately invoked arrow function expression

```ts{4}
const obj = {
    x: 1
    method() {
        setTimeout(
            // iiafe callback
            () => {
                console.log(this.x)
            },
            100
        );
    }
}

obj.method(); // undefined

const {method} = obj;
method(); // undefined
```

We build the chain of calls

```ts
GlobalScriptCall() -> obj.method() -> setTimeout(iiafe) -> iiafe()
```

1. is `iiafe` an arrow function? yes
2. What call did create it? `obj.method`
3. apply "dot" rule to `obj.method()` call

You see what just happened?

Up to this point you might have thought that for arrow functions,
the resolution call is just the previous call in the call chain but that's why
I brought up this example, to showcase the difference.

Indeed `setTimeout()` call is the previous call, and you could apply "dot" rule
to it, but the truth is we need to resolve `iiafe` and it was created/declared inside of
`obj.method()` body, even though visually being passed to `setTimeout(iiafe)` as argument might
seem confusing.

```ts
obj.method()
// is same as
<obj as baseValue>.method()
// so in obj.method and iiafe body
console.log(this.x)
// becomes
console.log(obj.x); // 1
```

For `method()` call:

```ts
method()
// is same as
<undefined as baseValue>.method()
// in non-strict mode becomes
<window>.method();
// so in method and iiafe body
console.log(this.x)
// becomes
console.log(window.x); // undefined
```

So please take this distinction into account.

We will have another example over arrow function's creation place importance
later on when discussing [classes](#class).

And now let's revisit strict mode and `this` keyword resolution edge cases.

### Strict mode

[Earlier](#interview-case) we touched upon the topic of strict mode.

But what is "strict" code exactly?

Based on [ECMAScript specification text](https://tc39.es/ecma262/#sec-strict-mode-code),
code is strict when it is:

-   a Global code starting with `"use strict"` directive
-   a [module](https://javascript.info/modules-intro) code
-   class declaration or expression code
-   a direct `eval` call argument that starts with `"use strict"` directive
-   a direct `eval` call argument, given `eval` was itself called from strict code
-   an indirect `eval` call argument that starts with `"use strict"` directive
-   function declaration, expression, etc... that starts with `"use strict"` directive or is already in one
-   a global `Function` constructor's second argument, starting with `"use strict"`

Everything else is considered non-strict code, or code in non-strict mode.

As we already know, in non-strict mode there is an additional [conversion step](https://tc39.es/ecma262/#sec-strict-mode-of-ecmascript).

But there are still some deviations from that rule, which we check next for broader perspective.

### Global code

Let's start with global level `this` keyword.

You might ask, why didn't we start the article with outlining this one?

Seems pretty basic from the first site.

But if you evaluate `this` keyword directly in global code, you will be surprised that even
after `"use strict"` directive `this` keyword will still resolve to global `window` object.

```ts
// global code
"use strict";
console.log(this);
```

To understand the mechanics we need to go up one abstraction level,
and look from the perspective of the running program itself.

So in pseudo-code the above example can be expressed as:

```ts{5-7}
const window = {...};

// main browser program call
function GlobalScriptCall() {
    // global code
    "use strict";
    console.log(this);
}

GlobalScriptCall.call(window);
```

So in other words we end up evaluating a global level call
with explicitly set `<baseValue>`

```ts
GlobalScriptCall.call(window);
// is same as
<window as baseValue>.GlobalScriptCall();
// hence in GlobalScriptCall() body
console.log(this)
// becomes
console.log(window)
```

Strict mode doesn't have anything to affect,
`<baseValue>` is already provided and it's an object,
so there is nothing to convert or not convert to.

### Eval

Now let's look at a different, but not less interesting `this`
keyword resolution scenario.

`this` resolution in eval code.

There are 3 forms of eval calls:

-   direct `eval` call
-   indirect `eval` call (global)
-   builtin `Function` call (global)

Direct eval works without surprises and evaluates the string argument
in the code level within which it was called, respecting inherited strict mode rules:

```ts
"use strict";
const obj = {
    x: 1,
    method() {
        eval("console.log(this.x)");
    }
};

obj.method(); // logs: 1

const { method } = obj;
method(); // logs: TypeError: Cannot read property 'x' of undefined
```

As expected,

```ts
obj.method()
// is the same as
<baseValue>.method()
// hence
console.log(this.x)
// becomes
console.log(obj.x)
```

and for `method()`

```ts
method()
// is the same as
<baseValue>.method()
// hence
console.log(this.x)
// in strict mode
console.log(undefined.x) // TypeError: Cannot read property 'x' of undefined
```

A bit different story with other eval forms, though.

I deliberately marked aforementioned indirect `eval` and `Function` eval calls
as "global", because they evaluate the string argument as global level code.

What's interesting about global eval invocation is that
it's unaffected by surrounding code mode.

To change its code mode one has
to explicitly declare it inside the string
argument for each global eval invocation.

For example, in the following setup

```ts
"use strict"; // (1)

const obj = {
    x: 1,
    method() {
        // non-strict indirect eval
        (1, eval)(`
            // this block of code is unaffected by external "use strict" (1)
            console.log(this); // window, because indirect eval is global code

            (function() {
                console.log(this) // window, because non-strict code
            })();
        `);

        // non-strict Function eval
        Function(
            "",
            `
            // this block of code is unaffected by external "use strict" (1)
             console.log(this) // window

             (function() {
                 console.log(this) // window
             })();
             `
        )();
    }
};

obj.method();

const { method } = obj;
method();
```

Global eval code is not affected by surrounding `"use strict"`, so it's in non-strict mode,
unless explicitly stated inside the string argument like here:

```ts
"use strict";

const obj = {
    x: 1,
    method() {
        (1, eval)(`
            // this block of code is now a strict code
            "use strict";
            console.log(this); // window, because global level is always hardcoded

            (function() {
                console.log(this) // undefined, as expected in strict mode
            })();
        `);
        Function(
            "",
            `
            "use strict";
            console.log(this); // window, because global level is always hardcoded

            (function() {
                console.log(this) // undefined, as expected in strict mode
            })();
            `
        )();
    }
};
obj.method();

const { method } = obj;
method();
```

One last thing that is not specific to `eval` but applies generally and still can
be a little bit more confusing with eval + strict mode:

```ts
function logThis() {
    console.log(this);
}

const obj = {
    x: 1,
    method() {
        eval(`
            "use strict";

            logThis();
        `);
    }
};

obj.method(); // window
```

You might think that since `"use strict"` is declared within string argument,
`logThis` should abide by strict mode rules, but it's not, because we evaluate by
the place of creation and not the place of invocation,

i.e. `logThis` was created in non-strict mode, hence non-strict mode rules apply
even if called from strict mode, and vice versa:

```ts
function containedLogThis() {
    "use strict";

    return function logThis() {
        console.log(this);
    };
}

const obj = {
    x: 1,
    method() {
        // logThis is created in strict mode even when called from non-strict
        const logThis = containedLogThis();

        eval(`
            logThis();
        `);
    }
};

obj.method(); // undefined
```

That's the gist of it for eval `this` keyword resolution mechanics.

Now let's shift our attention to classes and
their mechanics of `this` keyword resolution.

### Class

[class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
is a syntactic sugar for pre-es6 class constructor function.

The main difference is that es6 `class` is by [definition](#strict-mode) a strict code.

So this

```ts
class Obj {
    constructor() {
        this.x = 1;
    }
    arrowProp = () => {
        console.log(this.x);
    };
    method() {
        console.log(this.x);
    }
}
```

is basically same as this

```ts{2,10}
function Obj() {
    "use strict";
    this.x = 1;
    this.arrowProp = () => {
        console.log(this.x);
    };
}

Obj.prototype.method = function() {
    "use strict";
    console.log(this.x);
};
```

When we instantiate the class with `new` operator,
`<baseValue>` of constructor call is set to a new empty object `{}`

```ts
new Obj()
// is internally calling
<{} as baseValue>.Obj()
// hence inside constructor
this // equals {}
```

Later when we want to call the methods,
that's where wee see the differences.

Let's unpack those one by one and start with an example for
pre-es6 class constructor function `this` keyword resolution
in non-strict mode:

```ts
function Obj () {
    this.x = 1;
    this.arrowProp = () => {
        console.log(this.x);
    };
}

Obj.prototype.method() {
    console.log(this.x);
}

const obj = new Obj()
obj.method(); // 1
obj.arrowProp(); // 1

const {method, arrowProp} = obj;

method(); // undefined
arrowProp(); // 1
```

let's analyze `obj.method()`:

1. Is `obj.method()` call an arrow function call? No
2. Apply the "dot" rule to `obj.method()` call

```ts
obj.method()
// is the same as
<baseValue>.method()
// hence
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

No surprises here.

Now it's time to consider an example that
I promised to look at in [arrow function callback section](#arrow-function-callback)
relating to arrow function creation place.

So let's analyze `obj.arrowProp()` call:

1. Is `obj.arrowProp()` an arrow function call? Yes
2. Where was `obj.arrowProp()` function created? During `new Obj()` call
3. Apply the "dot" rule to `new Obj()`

```ts
new Obj()
// is same as
<{} as baseValue>.Obj()
// {} is the obj object, hence within constructor body
console.log(this.x)
// becomes
console.log(obj.x)
```

This might be confusing because if you look
at the chain of calls for `obj.arrowProp()` call

```ts
GlobalScriptCall() -> obj.arrowProp()
```

you don't see the `new Obj()` call, because it happened in one of previous call chains,
during `obj` instantiation.

But we still use its `<baseValue>`,
because `new Obj()` call is the place
where `arrowProp` arrow function is created.

So again pay attention to where arrow function is created,
to correctly infer the `<baseValue>`.

Now you have all the knowledge to correctly infer `this` keyword
in remaining dot-free `method()` and `arrowProp` invocations.

For `method()`:

1. Is `method()` call an arrow function call? No
2. Apply the "dot" rule to `method` call

```ts
method()
// is same as
<undefined as baseValue>.method()
// in non-strict mode becomes
<window>.method()
// hence
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

For `arrowProp()`:

1. Is `arrowProp()` an arrow function call? Yes
2. Where was `arrowProp()` function created? During `new Obj()` call
3. Apply the "dot" rule to `new Obj()`

```ts
new Obj()
// is same as
<{} as baseValue>.Obj()
// {} is the obj object, hence within constructor body
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

---

Now let's look at a class example

```ts
class Obj {
    constructor() {
        this.x = 1;
    }
    arrowProp = () => {
        console.log(this.x);
    };
    method() {
        console.log(this.x);
    }
}

const obj = new Obj();
obj.method(); // 1
obj.arrowProp(); // 1

const { method, arrowProp } = obj;
method(); // TypeError: Cannot read property 'x' of undefined
arrowProp(); // 1
```

Essentially all the steps and resolution logic is the
same as in previous pre-es6 class constructor function from above,
except `method()`, and that's because `class` definition code is a strict mode code,
so no conversions happen from `undefined` to global `window` object.

1. Is `method()` call an arrow function call? No
2. Apply the "dot" rule to `method()` call

```ts
method();
// is same as
<undefined as baseValue>.method();
// hence
console.log(this.x);
// becomes
console.log(undefined.x) // TypeError: Cannot read property 'x' of undefined
```

That's it.
Congrats on making it this far.

Now as promised, let's put all the pieces together into one final example.

### Putting it all together

Behold the ultimate boss.

```ts
const x = 1;

const obj1 = {
    x: 2
};

class Obj2 {
    constructor() {
        this.x = 3;
    }
    anotherMethod() {
        const func = function() {
            new Promise(
                // iiafe2
                (resolve, reject) => {
                    const testFunc = (() => {
                        console.log(this.x);
                    }).bind(obj2);

                    const innerObj = {
                        x: 2,
                        testFunc
                    };

                    innerObj.testFunc();
                }
            );
        };

        func.call(obj1);
    }
    method() {
        // iiafe1
        (() => {
            eval("this.anotherMethod()");
        })();
    }
}

const obj2 = new Obj2();
obj2.method(); //?
const { method } = obj2;

method(); //?
```

What are you going to do? You got 5... 4... 3... 2... 💣 kaboom!!!

Kidding :)

For `obj2.method()` call:

As always we start with finding the call in the call chain that
contains `this` expression directly inside.

Here we have two candidates

-   `iiafe1()`
-   `innerObj.testFunc()`

Let's also visualize the chain of calls for convenience:

```ts
GlobalScriptCall() -> obj2.method() -> iiafe1() -> eval('this.anotherMethod()') -> func.call(obj1) -> iiafe2() -> testFunc()
```

Since we have 2 `this` expressions to resolve, we can resolve them one by one,
in call order.

Let's start with resolving the `this` keyword in `eval('this.anotherMethod()')` call within `iiafe1()`.

Analyzing:

1. Is `iiafe1` an arrow function ? yes.
2. Where was `iiafe1` defined? in `obj2.method()` call.
3. Is `obj2.method` an arrow function ? no
4. Apply "dot" rule to `obj2.method()` call.

```ts
obj2.method();
// is the same as
<obj2 as baseValue>.method();
// hence
this.anotherMethod();
// becomes
obj2.anotherMethod();
```

Now onto the remaining `this` expression:

1. Is `innerObj.testFunc` an arrow function ? yes, ignore `.bind(obj2)` call
2. Where was `innerObj.testFunc` defined? in `iiafe2`.
3. Is `iiafe2` an arrow function ? yes
4. Where was `iiafe2` defined? In `func.call(obj1)` call.
5. Is `func` an arrow function ? no
6. Apply the "dot" rule to `func.call(obj1)` call.

```ts
func.call(obj1);
// is same as
<obj1 as baseValue>.func();
// hence in nested code
console.log(this.x);
// becomes
console.log(obj1.x); // 2
```

Great!

And what about dot-free `method()` invocation?

Well let's see.

The chain is a little different

```ts
GlobalScriptCall() -> method() -> iiafe1() -> eval('this.anotherMethod()') -> func.call(obj1) -> iiafe2() -> testFunc()
```

We still have 2 expressions to tackle

-   `iiafe1()`
-   `innerObj.testFunc()`

Let's start with `iiafe1` again:

Analyzing:

1. Is `iiafe1` an arrow function ? yes.
2. Where was `iiafe1` defined? in `method()` call.
3. Is `method` an arrow function ? no
4. Apply "dot" rule to `method()` call.

```ts
method();
// is the same as
<undefined as baseValue>.method();
// hence
this.anotherMethod();
// becomes in strict mode
<undefined>.anotherMethod(); // TypeError: Cannot read property 'anotherMethod()' of undefined
```

And program halts, because we are in a class method, and class level code is
always a strict code.

### Summing up

So if you want to correctly infer `this` keyword:

1. You build the call chain all the way to the call/calls that contain
   `this` expression directly inside.
2. If there are multiple calls with `this` keyword expressions directly inside,
   you evaluate them from left to right, i.e. in order of invocation.
3. When evaluating the call containing `this` keyword,
   you check if it's an arrow function.
4. If it is, you apply the "dot" rule to the call where this arrow function was defined.
5. Otherwise you apply the "dot" rule to the call.
6. Given `call(<baseValue>/apply<baseValue>)` in signature, use that `<baseValue>` as `this`.
7. Unless if it's an arrow function call, then ignore `call/apply` altogether.
8. Given call that was previously bound like `bind(<baseValue>)`, use that `<baseValue>` as `this`.
9. Unless `bind` was called on an arrow function, then ignore `bind` altogether.
10. When in strict mode don't convert primitive `<baseValue>` to object counterparts.
11. Beware of edge cases with global evaluation, eval and indirection.

### Bonus: NodeJS

In the bonus section I'd like to explore the resolution of `this` keyword in NodeJS.

When executing global code like this in NodeJS:

```ts
console.log(this);
```

internally it gets [wrapped](https://github.com/nodejs/node/blob/v12.13.0/lib/internal/modules/cjs/loader.js#L167)
into something like this

```ts
const module = { exports: {} };
(function(exports, require, module, __filename, __dirname) {
    console.log(this); // {}
}.call(
    module.exports,
    module.exports,
    require,
    module,
    __filename,
    __dirname
));
```

And since it's a `.call()` that [sets](https://github.com/nodejs/node/blob/v12.13.0/lib/internal/modules/cjs/loader.js#L956)
`<baseValue>` explicitly to [module.exports](https://nodejs.org/docs/latest-v12.x/api/globals.html#globals_exports) similarly to [how](#global-code) in `GlobalScriptCall()`
we set `window` as global object, it's unaffected by strict mode.

```ts
"use strict";
console.log(this); // {}, i.e. module.exports
```

> ! Important note:

Beware when trying above example in [NodeJS CLI REPL](https://nodejs.org/dist/latest-v12.x/docs/api/repl.html)
because REPL [operates]([NodeJS CLI REPL](https://nodejs.org/dist/latest-v12.x/docs/api/repl.html#repl_repl_start_options))
with `global` as the default global level object

> useGlobal <boolean> If true, specifies that the default evaluation function will
> use the JavaScript global as the context as opposed to creating a new separate context for the REPL instance.
> The NodeJS CLI REPL sets this value to true. Default: false.

```sh
$ user
Welcome to Node.js v12.13.0.
Type ".help" for more information.
> console.log(this)
Object [global] {
  global: [Circular],
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },
  queueMicrotask: [Function: queueMicrotask],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(util.promisify.custom)]: [Function]
  }
}
```

So that can be confusing but if you just

```sh
$ echo "console.log(this)" > index.js
$ node index.js
{}
$ echo "console.log(this === module.exports)" >> index.js
$ node index.js
true
```

You see that it correctly yields `module.exports` object as it should.

And finally non-global non-strict code `this` keyword gets
resolved to NodeJS global object
which is literally called [global](https://nodejs.org/docs/latest-v12.x/api/globals.html#globals_global).

So to sum it up:

```ts
console.log(this); // {}, i.e. module.exports

(function() {
    console.log(this); // Object [global] {
    //   global: [Circular],
    //   clearInterval: [Function: clearInterval],
    //   clearTimeout: [Function: clearTimeout],
    //   setInterval: [Function: setInterval],
    //   setTimeout: [Function: setTimeout] { [Symbol(util.promisify.custom)]: [Function] },
    //   queueMicrotask: [Function: queueMicrotask],
    //   clearImmediate: [Function: clearImmediate],
    //   setImmediate: [Function: setImmediate] {
    //     [Symbol(util.promisify.custom)]: [Function]
    //   }
    // }
})(); // <baseValue> is undefined, gets converted to global object

(function() {
    "use strict";
    console.log(this); // undefined
})(); // <baseValue> is undefined, doesn't get converted
// to global object, because of strict mode
```

### Good reads

-   [Know thy reference](http://perfectionkills.com/know-thy-reference/)
-   [Javascript: the core](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
-   [Object methods: this](http://javascript.info/object-methods)
-   [YDKJS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/README.md)
