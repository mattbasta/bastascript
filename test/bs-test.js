
var bs = require('../dist/bs');
var mozBuilder = require('../dist/bs').mozBuilder;

var print = console.log;

(function main(args, disscript) {
"use strict";
function runUnitTests() {
    // These programs avoid using constructs that trigger constant folding or
    // other optimizations in the JS engine. They are spaced and parenthesized
    // just so. Thus bs.stringify mirrors bs.parse for these strings.
    var tests = [
        // expressions
        ["x.=y;", 'x = x.y;\n'],
        ["x.y=->(1,2,3)", 'x.y = (function(___base){return function(){return ___base.y.apply(arguments[0],[1,2,3].concat(Array.prototype.slice.call(arguments)));};})(x);\n'],

        ["x->(1,2,3)", '(function(){return x.apply(this,[1,2,3].concat(Array.prototype.slice.call(arguments)));});\n'],
        ["x.y->(1,2,3)", '(function(___base){return function(){return ___base.y.apply(arguments[0],[1,2,3].concat(Array.prototype.slice.call(arguments)));};})(x);\n'],
        ["x['y']->(1,2,3)", '(function(___base,___member){return function(){return ___base[___member].apply(___base,[1,2,3].concat(Array.prototype.slice.call(arguments)));};})(x,"y");\n'],
        ["x=->(1,2,3)", 'x = function(){return x.apply(this,[1,2,3].concat(Array.prototype.slice.call(arguments)));};\n'],
        ["x->()", "x;\n"],
        ["x.y->()", "x.y.bind(x);\n"],

        // yada yada
        ["...;", "throw new Error('Not Implemented');\n"],

        // for-in-if
        ["for(var x in y if z(x)) {a += x;}", "for (var x in y)\n    if (z(x)) {\n        a += x;\n    }\n"],

        // method assignment
        ["function x.y (a,b){}", "x.y = function y(a, b) {};\n"],

        // decorators
        ["@dec:\nfunction foo(a, b) {}", "var foo = dec(function foo(a, b) {});\n"],
        ["@dec.foo(1,2):\nfunction bar() {}", "var bar = dec.foo(1, 2)(function bar() {});\n"],
        ["@dec:\nfunction abc.def() {}", "abc.def = dec(function def() {});\n"],
        ["@dec:\n@dec2:\nfunction abc.def() {}", "abc.def = dec(dec2(function def() {}));\n"],
        ["@foo.bar:\n@call():\nfunction bar() {}", "var bar = foo.bar(call()(function bar() {}));\n"],

        // later
        ["function foo(){later alert(this);}",
         "function foo(){\n" +
         "    var ___later = [];\n" +
         "    var ___output = (function() {\n" +
         "        ___later.push(function() {\n" +
         "            alert(this);\n" +
         "        }.bind(this));\n" +
         "    }).call(this);\n" +
         "    while (___later.length) ___later.shift()();\n" +
         "    return ___output;\n" +
         "}\n"],
        ["function foo(){later alert('done');x+=1;}",
         "function foo(){\n" +
         "    var ___later = [];\n" +
         "    var ___output = (function() {\n" +
         "        ___later.push(function() {\n" +
         "            alert(\"done\");\n" +
         "        });\n" +
         "        x += 1;\n" +
         "    }).call(this);\n" +
         "    while (___later.length) ___later.shift()();\n" +
         "    return ___output;\n" +
         "}\n"],

         // return-unless
         ["return unless y;", "if (!y)\n    return;\n"],
         ["return x unless y;", "if (!y)\n    return x;\n"],

         // return-if
         ["return if y;", "if (y)\n    return;\n"],
         ["return x if y;", "if (y)\n    return x;\n"],

         // function shorthand
         ["ƒ x() {return 123;}", "function x() {\n    return 123;\n}\n"],
         ["ƒ* x() {yield 123;}", "function* x() {\n    yield 123;\n}\n"],

         // Arrow functions
         ["()=>'test'", "(function() {return \"test\";});\n"],
         ["x = ()=>'test'", "x = function() {return \"test\";};\n"],
         ["x=>x", "(function(x) {return x;});\n"],
         ["x=>x * x", "(function(x) {return x * x;});\n"],
         ["val=>({key: val})", "(function(val) {return {key: val};});\n"],
         ["foo.map(v => v + 1)", "foo.map(function(v) {return v + 1;});\n"],
         ["x = y=>z=>y+z", "x = function(y) {return function(z) {return y + z;};};\n"],
         ["() => {}", "(function() {});\n"],
         ["x = y => {return y;}", "x = function(y) {\n    return y;\n};\n"],
         ["x = () => {return this;}", "x = function() {\n    return this;\n}.bind(this);\n"],
    ];

    for (var i = 0; i < tests.length; i++) {
        var b = tests[i], a;
        try {
            a = bs.parse(b[0], {loc: false, builder: mozBuilder});
        } catch (exc) {
            print("FAIL - Exception thrown in parse.");
            print(exc);
            print(exc.name + ": " + exc.message);
            print(exc.stack);
            print("Test was: " + b[0]);
            print();
            continue;
        }
        try {
            a = bs.stringify(a, undefined, true);
            if (typeof a !== "string") {
                throw new TypeError("Reflect.stringify returned " +
                                    (a !== null && typeof a === "object"
                                     ? Object.prototype.toString.call(a)
                                     : String(a)) +
                                    "; expected string");
            }
        } catch (exc) {
            print("FAIL - Exception thrown in strigify.");
            print(exc.name + ": " + exc.message);
            print(exc.stack);
            print("Test was: " + b[0]);
            print();
            continue;
        }
        if (a !== b[1]) {
            print("FAIL - Mismatch.");
            print("got:      >" + String(a) + "<");
            print("expected: >" + String(b[1]) + "<");
            print();
        }
    }
}

return runUnitTests();
})(process.args,
function /*disscript*/() {
   // Note: Some tests fail if you use dis(Function(s)) instead.
   try {
       eval("throw dis('-r', '-S');\n" + arguments[0]);
       throw "FAIL";
   } catch (exc) {
       if (exc !== void 0)
           throw exc;
   }
});


