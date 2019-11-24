---
title: "{this} mechanics (part 1): resolution model"
date: "2019-11-24"
featuredImage: "./coin-telescope.jpg"
featuredImageAlt: "Closeup photography of coin operated telescope by socialcut @ https://unsplash.com/"
template: "BlogPost"
tags:
    - javascript
    - this keyword
    - this resolution
    - this mechanics
    - ecmascript
---

In this first article of the two-part series on `this` mechanics in JavaScript,
I will outline a mental model that helps me quickly resolve `this` keyword in my day to day coding.

For making that work though we will have to omit or even **diverge** from details of how it's
described in ECMAScript specification.

But for a complete picture, there will be part 2 where we deep dive into ECMAScript text
and follow `this` resolution with high precision.

So without further ado, let's get to our first example.

### Interview 101 case

This one you might have seen during interviews:

**Example 1**

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

Here we have two calls. They differ only in signature.

We call former with dot

```ts
obj.method(); // 1
```

The latter is dot-free.

```ts
method(); // undefined
```

And they yield different results because of the very call signature.

`this` value is going to be resolved to whatever is to the left of the dot in the function call name.

Let's refer to that "whatever" as `<baseValue>`.

So in `obj.method()` we can imagine:

```ts
<obj as baseValue>.method()
// hence in method body
console.log(this.x);
// becomes
console.log(obj.x);
```

Same way if we evaluate `obj1.obj2.obj3.method()` we get

```ts
<obj1.obj2.obj3 as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(obj1.obj2.obj3.x)
```

In dot-free `method()` call, `<baseValue>` is respectively `undefined`

```ts
<undefined as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(undefined.x)
// in non-strict mode additionally it is converted into global object
console.log(window.x)
```

That's it.

For convenience, let's refer to the rule as the "dot" rule.

### Strict mode

Since we touched the topic of strict mode, it's to set the definitions straight.

Based on ECMAScript [strict mode definition](https://tc39.es/ecma262/#sec-strict-mode-code),
code is considered strict when in:

-   a global code, starting with 'use strict'
-   a [module](https://javascript.info/modules-intro) code (that is technically a child of global code)
-   a class declaration or class expression
-   direct eval (`eval('"use strict"; console.log(this)')` starting with 'use strict' or called from strict code
-   indirect eval `(1,eval)('"use strict"; console.log(this)')`) starting with 'use strict'
-   function declaration, expression, method defnition, arrow function, etc... that starts with 'use strict'
-   function declaration, expression, method defnition, arrow function, etc... already declared in strict code
-   global Function constructor's function body param, starting with `use strict` as in `new Function('', '"use strict"; console.log(this)')`

Everything else is considered non-strict code, or code in non-strict mode.

We will return to some of these definitions a bit later.

There is one thing to keep in mind about global code, though:

`this` evaluation in global scope level will always result
in a global object, and 'use strict' will only affect `this` evaluation
within descendant module and functional scopes

```ts
// Global Scope
const obj = {
    method() {
        // functional scope
        console.log(this); // window
    };
}

(function() {
    // functional scope
    (function() {
        // functional scope
        console.log(this); // window
    })
})

console.log(this); // window
```

but with 'use strict'

```ts
'use strict';
// Global Scope
const obj = {
    method() {
        // functional scope
        console.log(this); // undefined
    };
}

(function() {
    // functional scope
    (function() {
        // functional scope
        console.log(this); // undefined
    })
})

console.log(this); // window !!!
```

For completeness sake, here is module scope case:

```ts
// Module Scope (child of global scope, strict mode by definition)
import someModule from 'someModule';

const obj = {
    method() {
        // functional scope
        console.log(this); // undefined
    };
}

(function() {
    // functional scope
    (function() {
        // functional scope
        console.log(this); // undefined
    })
})

console.log(this); // undefined !!!

export default obj;
```

Having clarified that, let's return to our examples.

### Hidden method

Let's try to use the 'dot' rule above to explain this next case.

**Example 2**

```ts
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

Interesting... Different results this time.

So when we call `obj.method()` it calls `hiddenMethod()`,
thus we can imagine a chain of calls:

```ts
GlobalScriptCall() -> obj.method() -> hiddenMethod()
```

And to resolve the `this` value, we need to focus on the function call
that contains the `this` keyword in its direct function body.

Here it is unsurprisingly the `hiddenMethod()`.

And when we apply the "dot" rule like above, we get

```ts
<undefined as baseValue>.hiddenMethod()
// in non-strict mode becomes
<window>.hiddenMethod()
// hence in hiddenMethod body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

### "Brace noise"

**Example 3**

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

Here we are dealing with a log of nested [iife's](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

But let's analyze the `obj.method()` call.

Here is the chain of calls all the way down to the `this.x` that we want to resolve:

```ts
GlobalScriptCall() -> obj.method() -> iife1() -> iife2() -> iife3() -> iife4() -> iife5()
```

Again we need to focus on the last call signature
as it contains the `this` expression directly inside its functions body.

We apply the same "dot" rule again and for `iife5` we can imagine as if it's called as:

```ts
<undefined as baseValue>.(function(){ console.log(this.x) })()
// in non-strict mode becomes
<window>.(function(){ console.log(this.x) })()
// hence in function body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

So it might seem confusing, but the function object literal `(function() {...})` here is working exactly
like any other function name like `method` from above.

The resolution mechanics is the same.

Great.

Let's move to the next one.

### Arrow function

You might have noticed that all examples above have signatures of either a function declaration

```ts
function x() {}
```

function expression

```ts
function(){}
```

or object method

```ts
{ objMethod() {} }
```

This is a deliberate choice because arrow functions are evaluated differently with different results.

Arrow function's `<baseValue>` upon call is the `<baseValue>` of enclosing call inside which they were created.

Let's look at an example:

**Example 4**

```ts
const obj = {
    x: 1,
    method: () => {
        console.log(this.x);
    }
};

obj.method(); // undefined
const { method } = obj;

method(); // undefined
```

So even though we expect `<baseValue>` of the invocation to be `obj`, - `this` is outputting `undefined`.

Why?

Because if we look at the chain of calls,

```ts
GlobalScriptCall() -> obj.method()
```

and we look at when `method` arrow function of `obj` was defined, we understand that it was defined `GlobalScriptCall()`
which happens to be the previous call in the call chain, and the `<baseValue>` of `GlobalScriptCall()` aka "global scope"
is always global object, i.e. `window`

```ts
// as pointed out previously in global scope global call <baseValue>
// is always global object regardless it's in strict or non-strict mode
<window as baseValue>.GlobalScriptCall()
// hence in obj.method body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

Same happens for dot-free `method()` invocation.

### Nested arrow function

To consolidate what we just learned, let's try to apply that to this next case with nested arrow functions:

**Example 5**

```ts
// here iiafe denotes an immediately invoked arrow function expression
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

Again we should look at lexing place or place of arrow function definition and the chain of calls:

```ts
GlobalScriptCall() -> obj.method() -> iiafe1() -> iiafe2() -> iiafe3()
```

and consider the following:

1. Is `iife3` an arrow function ? yes
2. Where was `iife3` defined ? `iife2`
3. Skip to evaluating `iife2`
4. Is `iiafe2` an arrow function ? yes
5. Where was `iife2` defined ? `iife1`
6. Skip to evaluating `iife1`
7. Is `iife1` an arrow function ? yes
8. Where was `iife2` defined ? `obj.method`
9. Skip to evaluating `obj.method` function
10. Is `obj.method` an arrow function ? no
11. Apply the `dot` rule:

```ts
<obj as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

Clear. Next.

### Indirection

**Example 6**

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

The 'dot' rule is still applied here.

The results are unexpected, though, because,
a completely separate evaluation is happening on top of actual function call evaluation.

[Grouping operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Grouping)
is changing the precedence of expressions, making function call secondary to other
expression evaluations, that would otherwise happen after call.

Let's analyze

```ts
(obj.method, obj.method)();
```

Here the grouping operator, switches the program flow from evaluating the function call `obj.method()`,
to evaluating `(obj.method, obj.method)` [comma sequence expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator)
that returns a value - the actual `method` function expression literal and as a result on next step we evaluate
the underlying:

```ts
(function method() {console.log(this.x)})();
// which is the same as
<undefined as baseValue>.(function method() {console.log(this.x)})();
// or
<window as baseValue>.(function method() {console.log(this.x)})(); // in non-strict mode
// hence
console.log(this.x);
// becomes
console.log(window.x) // undefined
```

The same is for `(z = obj.method)()` [assignment expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators#Assignment)

The last one might also be confusing `(obj.method)()` because it yields the same output with the initial call.

But we should take into account that grouping only changes expression priority
and doesn't trigger extra expression value return as in the previous two expressions.

That's why we can consider both `obj.method()` and `(obj.method)()` to be identical, hence the results.

### Call / Apply

`call`/`apply` is a way to provide `<baseValue>` explicitly.

**Example 7**

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

obj.method.call(obj2) // obj.x -> 2
obj.method.call(undefined) // window.x -> undefined
```

So it's essentially the equivalent of:

```ts
obj.method.call(obj2)
// same as
<obj2 as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(obj2.x) // 2
```

or

```ts
obj.method.call(undefined)
// same as
<undefined as baseValue>.method()
// or in non-strict mode
<window as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(window.x) // undefined
```

As you might have noticed, `call`/`apply` allows passing whatever value as a `<baseValue>`.

And of course there exists a respective conversion mechanism:

`undefined` or `null` in non-strict mode is converted to the global window object,
other values are converted into their object wrapper alternatives.

```ts
obj.method.call(null); // window
obj.method.call(1); // Number object wrapper with value: 1
obj.method.call("string"); // String object wrapper with value: 'string'
obj.method.call(true); // Boolean object wrapper with value: true
// ... etc
```

Here is the full [conversion table](https://tc39.es/ecma262/#table-13)

> ! Small but important note:

In the case of arrow function, `call` or `apply` call is completely ignored.
Instead, the arrow functions `this` is resolved as expected by evaluating `this` value
inside the call where the arrow function was defined in the chain of calls:

```ts
const obj = {
    x: 1,
    method() {
        // iiafe
        (() => console.log(this.x)).call({ x: 2 });
    }
};

obj.method(); // 1
```

chain of calls:

```ts
GlobalScriptCall() -> obj.method() -> iiafe.call({ x: 2 })
```

As usual, we take the last but one from chain of calls, `obj.method`:

```ts
<obj as baseValue>.method()
// hence in method body
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

### Bind

`bind` is just a wrapper function with a hardcoded, fixed `this` value.

**Example 8**

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

`boundToObj2` here is essentially the same as:

```ts
function boundToObj2() {
    return obj.method.call(obj2);
}
```

`obj.method.call(obj2)` call is fixed now regardless of how `boundToObj2` function is called.

Be it `call`, `apply` or another `bind` on top, that tries to change the `this`.
Nothing will ever change in this inner call with explicitly passed `obj2`.

Or in other words:

```ts
boundToObj2(); // 2
boundToObj2.call(obj); // still 2
const reboundBack = boundToObj2.bind(obj);
reboundBack(); // nope, still 2
reboundBack.apply(obj); // nopes, it's hardcoded as 2
```

> ! Small but important exception:

In the case of arrow function, `call` or `apply` call is completely ignored.
Instead, the arrow functions `this` is resolved as expected by evaluating `this` value
inside the call where the arrow function was defined in the chain of calls:

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

chain of calls:

```ts
GlobalScriptCall() -> obj.method() -> boundFn()
```

We take the last but one from chain of calls, i.e. `obj.method`:

```ts
<obj as baseValue>.method()
// hence
console.log(this.x)
// becomes
console.log(obj.x) // 1
```

### Constructor

There are two versions of constructors:

-   function constructors
-   class constructors

The main difference is that class constructors are executed within the class,
which is inherently a strict mode code, i.e.:

**Example 9**

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

// is same as

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

When we instantiate constructor with `new` operator, `<baseValue>` of constructor call is a new empty object `{}`

```ts
new Obj()
// is internally calling
<{} as baseValue>.Obj()
// hence inside constructor
this // equals {}
```

Later on when we instantiate the constructor and want to call the methods,
that's where the differences pull up to the surface, but let's go one by one
and start with constructor function in non-strict mode:

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

// call chain: GlobalCallScript() -> new Obj()
const obj = new Obj()
// call chain: GlobalCallScript() -> obj.method()
obj.method(); // 1
// call chain: GlobalCallScript() -> arrowProp()
obj.arrowProp(); // 1

const {method, arrowProp} = obj;
method(); // undefined
arrowProp(); // 1
```

let's analyze `obj.method()`:

1. Is `obj.method()` call an arrow function call? No
2. Apply dot rule
3. `<baseValue>` is `obj`
4. `console.log(this.x)` is `console.log(obj.x)`, i.e. `1`

pretty straightforward

let's analyze `obj.arrowProp()`:

1. Is `obj.arrowProp()` an arrow function call? Yes
2. What's the current chain of calls? `GlobalScriptCall() -> obj.arrowProp()`
3. Is `obj.arrowProp` defined in one of the preceding calls in current call chain? No
4. Was it defined somewhere in past call chains? Yes during `new Obj()` call, in the very first call chain
5. Get already resolve `<baseValue>` of past `new Obj()` call and use it as `<baseValue>` of current `obj.arrowProp()` call.
6. `<baseValue>` is `obj`,
7. `console.log(this.x)` is `console.log(obj.x)`, i.e. `1`

not that straightforward, but at least makes sense

let's analyze the next dot-free `method()`:

1. Is `method()` call an arrow function call? No
2. Apply dot rule
3. `<baseValue>` is `undefined`
4. `undefined` is converted to `window` in non-strict mode
5. `console.log(this.x)` is `console.log(window.x)`, i.e. `undefined`

let's analyze dot-free `arrowProp()`:

1. Is `arrowProp()` an arrow function call? Yes
2. What's the current chain of calls? `GlobalScriptCall() -> arrowProp()`
3. Is `arrowProp` defined in one of the preceding calls in current call chain? No
4. Was it defined somewhere in past call chains? Yes during `new Obj()` call, in the very first call chain
5. Get already resolve `<baseValue>` of past `new Obj()` call and use it as `<baseValue>` of current `obj.arrowProp()` call.
6. `<baseValue>` is `obj`,
7. `console.log(this.x)` is `console.log(obj.x)`, i.e. `1`

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

// call chain: GlobalCallScript() -> new Obj()
const obj = new Obj();
// call chain: GlobalCallScript() -> obj.method()
obj.method(); // 1
// call chain: GlobalCallScript() -> arrowProp()
obj.arrowProp(); // 1

const { method, arrowProp } = obj;
method(); // TypeError: Cannot read property 'x' of undefined
arrowProp(); // 1
```

Essentially all the steps and resolution logic is the same as above,
except `method()`, and that's because `class` definition code is a strict mode code

1. Is `method()` call an arrow function call? No
2. Apply dot rule
3. `<baseValue>` is `undefined`
4. `undefined` stays `undefined` in strict mode code
5. `console.log(this.x)` is `console.log(undefined.x)`, i.e. `TypeError`

Great.
Let's look at more exotic use cases.

### Eval

There are 2 forms of eval:

-   builtin `Function` call
-   actual `eval` call

One can treat `Function('', '')()` call or indirect `(1,eval)()` call as
controllable versions of `GlobalScriptCall()`, and direct `eval()` behaves
like any other code outside of eval with regards to `this` resolution.

But let's see examples.

**Example 10**

```ts
const obj = {
    x: 1,
    method() {
        new Function("", 'console.log("new Function", this.x)')();
        Function("", 'console.log("Function", this.x)')();
        eval.call(null, 'console.log("Indirect eval", this.x)');

        eval('console.log("Direct eval", this.x)');
    }
};

obj.method();
```

after calling `obj.method()` these calls

```ts
new Function("", 'console.log("new Function", this.x)')();
Function("", 'console.log("Function", this.x)')();
eval.call(null, 'console.log("Indirect eval", this.x)');
```

are hoisted into global scope hence

```ts
new Function("", 'console.log("new Function", this.x)')();
Function("", '"console.log("Function", this.x)')();
eval.call(null, 'console.log("Indirect eval", this.x)');

const obj = {
    x: 1,
    method() {
        eval('console.log("Direct eval", this.x)');
    }
};
```

leaving only direct `eval()` call,
which behaves exactly as expected with regards to
`this` resolution.

So for `Function` constructor

```ts
new Function("", 'console.log("new Function", this.x)')();
or
Function("", 'console.log("new Function", this.x)')();
// becomes our regular
<undefined as baseValue>(function() {
    console.log("new Function", this.x);
})();
// hence in console.log
this.x
// becomes
undefined.x
// in non-strict mode is converted to
window.x
```

For indirect eval

```ts
eval.call(null, 'console.log("Indirect eval", this.x)');
// or
(1, eval)('console.log("Indirect eval", this.x)');
// or
var _eval = eval;
_eval('console.log("Indirect eval", this.x)');
// or any other form of indirect call
// becomes our regular global level
console.log("Indirect eval", this.x);
// and in global scope, aka GlobalScriptCall(), <baseValue> is always global object, so
this.x;
// in non-strict mode is converted to
window.x;
```

And finally for direct eval call

```ts
eval('console.log("Direct eval", this.x)');
// becomes
console.log("Direct eval", this.x);
// where
this.x;
// becomes
obj.x;
```

### Callback

To correctly resolve callbacks we need to know how they are eventually called
inside, i.e., whether they are called with `call/apply` or `bind` with a subsequent call,
because that affects the `this` resolution outcome.

But in most cases, callbacks are called as is, without messing with `<baseValue>` explicitly.

But let's check how `this` is resolved in case of `setTimeout` as a case example.

**Example 11**

```ts
const obj = {
    x: 1
    method() {
        setTimeout(function () { // iife
            console.log(this.x)
        }, 100);
    }
}

obj.method(); // undefined

const {method} = obj;
method(); // undefined
```

Here we know that `setTimeout` is calling the passed function as is after some delay,
that is passed as the second argument

```ts
// pseudo code
function setTimeout(cb, delay, ...args) {
    wait(delay);
    cb(...args);
}
```

So for our chain of calls, we need to concentrate on the `cb(...args)` part
when building our chain of calls that affects the `<baseValue>` resolution,
and in our case above it is `iife(...args)`

so for `obj.method()` we will have

```ts
GlobalScriptCall() -> obj.method() -> iife(...args)
// hence we analyze the last call containing `this` keyword
// is it arrow function? no
// then we just apply dot rule for iife(...args) call rightaway
iife(...args)
// is same as
<undefined as baseValue>.iife(...args)
// in non-strict mode becomes
<window as baseValue>.iife(...args)
// so in cb body
console.log(this.x)
// becomes
console.log(window.x); // undefined
```

Phew... That's it.
Congrats on making it so far.

And as a reward. Kind of...

Let's put all the pieces together.

### Putting it all together

Behold the ultimate boss.

**Example 12**

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
            // new Promise(iiafe2)
            new Promise((resolve, reject) => {
                const testFunc = (() => {
                    console.log(this.x);
                }).bind(obj2);

                const innerObj = {
                    x: 2,
                    testFunc
                };

                testFunc();
            });
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

As always you start with looking at the chain of calls.

So for `obj2.method()` you have

```ts
//call chain 1
GlobalScriptCall() -> new Obj();
//call chain 2
GlobalScriptCall() -> obj2.method() -> iiafe1() -> eval('this.anotherMethod()') -> func.call(obj1) -> iiafe2() -> testFunc()
```

We start from the end of the chain of calls:

1. Is `testFunc` an arrow function ? yes.
2. Where was `testFunc` defined? in `iiafe2()` call, that was called by new Promise().
3. Ignore `bind()` call and move to evaluating `iiafe2()`
4. Is `iiafe2()` an arrow function call ? yes
5. Where was `testFunc` defined ? `func.call(obj1)` call
6. is `func.call(obj1)` an arrow function call ? no
7. Explicitly set `<baseValue>` as `obj1` in `func` call evaluation

```ts
func.call(obj1)
// is same as
<obj1 as baseValue>.func();
// hence in func body
console.log(this.x)
// becomes
console.log(obj1.x) // 2
```

Great!

And what about dot-free `method()` invocation?

Well since the chain of calls is identical to the example above,
we might conclude that the result is also the same.

Well... almost!

The `this.x` is exactly as expected - `2`.

But the problem is, program will crash during

```ts
eval("this.anotherMethod()");
```

and that's because of strict mode that is enforced by being inside of a [class](#strict-mode)

```ts
<undefined as baseValue>.anotherMethod()
```

`undefined` as `undefined` hence the error.

```ts
Uncaught TypeError: Cannot read property 'anotherMethod' of undefined
```

So it's important to keep strict mode in mind.

But other than that, that's it.

I hope you found this article helpful and "example-full".

And hope to see you in the next chapter of `this` resolution mechanics.

### Good reads

-   [Know thy reference](http://perfectionkills.com/know-thy-reference/)
-   [Javascript: the core](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
-   [Object methods: this](http://javascript.info/object-methods)
-   [YDKJS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/README.md)
