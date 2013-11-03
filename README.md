# bastascript (v0.2)

Bastascript is a language designed to improve JavaScript's ability to serve as a
functional programming language with terse, obvious syntax. Bastascript is a
subset of JavaScript extended with additional syntax that compiles to
JavaScript.


## Running Bastascript code

You can compile a BS file with the following command:

```bash
bs file_to_compile.bs
```

The generated code will be piped to stdout.

Adding the `--run` flag will execute the code after compiling.


## Features

### Partial Functions/Currying (skinny arrow)

Bastascript makes heavy use of partial functions, which are applied in a manner
more similar to currying. This is accomplished via the skinny arrow operator
(`->`).

Some examples:

```js
promise.then(function() {
    foo.bar(x);
}, function(err) {
    console.error(err);
});
```

could be written as

```
promise.then(foo.bar->(x), console.error->());
```

A skinny arrow augmented assignment operator is provided:

```
x = x->(1, 2, 3);
// equivalent to
x =->(1, 2, 3);
```

Currying can be simulated like this:

```
function myfunc(x, y, z) {...;}

var curr = myfunc->();
curr =->(1);
curr = curr->(2);
console.log(curr(3));
```

Creating a partial function preserves the context of members. For instance:

```
var x = foo.bar.bind(foo);
// equivalent to
var x = foo.bar->();
```


### Member Augmented Assignment

`x = x.y` can be written as `x .= y`.


### Yada Yada Operator

`...;` will throw a new error named "Not Implemented".

```
if (someCondition) {
   ...;
}
```


### For-In-If Loops

```js
for (var i in foo) {
    if (foo.hasOwnProperty(i)) {
        console.log(i);
    }
}
```

can be written as

```
for (var i in foo if foo.hasOwnProperty(i)) {
    console.log(i);
}
```

### Method Declarations

```js
foo.method = function method() {};
```

can be written as

```
function foo.method() {
    ...;
}
```

Note that the method name is preserved.


### Decorators

```js
var myFunc = decorator(function() {
    // ...
});

obj.method = decorator(function method() {});
```

can be written as

```
@decorator:
function myFunc() {
    ...;
}

@decorator:
function obj.method() {
    ...;
}
```

Decorators can be members or call expressions:

```
@ident:
@dec.method:
@call(foo, bar):
@dec.call(foo, bar):
```

Decorators can be chained, and will be applied such that the outermost
decorator will be applied last.


### `later` Statement

The `later` statement allows you to defer a statement's execution until after
the completion of the remainder of the function.

```
function test(shouldMock) {
    if (shouldMock) {
        mock();
        later cleanup();
    }
    ...;
}
```

`later` statements retain lexical scope and their access to the `this`
identifier. `later` statements will not presently work with generators.

If an exception is thrown in a function with `later` statements, none of the
deferred statements will be executed. You should catch exceptions with `try`
blocks instead.


### return-unless and return-if statements

Return statements support a ruby-like `unless` clause that expands out to an
`if (!expr)` construct. They may also use `if`, which expands out to
`if (expr)`.

```
return foo unless bar;
return foo if bar;
```

vs.

```js
if (!bar) {
    return foo;
}
if (bar) {
    return foo;
}
```


### Function shorthand

The `function` keyword can be replaced with the unicode character `ƒ`. This
also works with generators: `ƒ*`.

```
ƒ foo() {
    ...;
}
```

```js
function foo() {
    // ...;
}
```


### ES6-style Fat Arrow Functions

Fat arrow functions should work as they're documented in [the Harmony wiki](
http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax).

```
x = () => foo;
y = elements.map(e => e.getAttribute('name'));
```

vs.

```js
x = function() {return foo;};
y = elements.map(function(e) {return e.getAttribute('name')});
```

Arrow functions will bind `this` lexically (as in ES6) when `this` is used.

Note that `later` statements are not bound to arrow functions and instead are
bound to the lexical parent. If the arrow function executes after the lexical
parent has completed, the later statement will not be run.


## Differences from JavaScript

- There is no `with` statement.
- All statements must be followed by a semicolon. There is no automatic
  semicolon insertion.
- Only generated identifiers may start with three underscores.
- Numeric literals may only be written as integers or floats. Octal values are
  not allowed.

