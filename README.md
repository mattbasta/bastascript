# bastascript (v0.1)

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
foo.method = function() {};
```

can be written as

```
function foo.method() {
    ...;
}
```


### Decorators

```js
var myFunc = decorator(function() {
    // ...
});

obj.method = decorator(function() {});
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

## Differences from JavaScript

- There is no `with` statement.
- All statements must be followed by a semicolon. There is no automatic
  semicolon insertion.
- Only generated identifiers may start with three underscores.
- Numeric literals may only be written as integers or floats. Octal values are
  not allowed.

