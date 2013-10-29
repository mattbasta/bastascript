
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

        ["x->(1,2,3)", 'function(){return x.apply(this,[1,2,3].concat(Array.prototype.slice.call(arguments)));};\n'],
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
        ["function x.y (a,b){}", "x.y = function (a, b) {\n};\n"],

        // decorators
        ["@dec:\nfunction foo(a, b) {}", "var foo = dec(function (a, b) {\n});\n"],
        ["@dec.foo(1,2):\nfunction bar() {}", "var bar = dec.foo(1, 2)(function () {\n});\n"],
        ["@dec:\nfunction abc.def() {}", "abc.def = dec(function () {\n});\n"],
        ["@dec:\n@dec2:\nfunction abc.def() {}", "abc.def = dec(dec2(function () {\n}));\n"],
        ["@foo.bar:\n@call():\nfunction bar() {}", "var bar = foo.bar(call()(function () {\n}));\n"],

        // later
        ["function foo(){later alert('done');x+=1;}",
         "function foo(){\n" +
         "    var ___later = [];\n" +
         "    var ___output = (function() {\n" +
         "        ___later.push(function() {\n" +
         "            alert(\"done\");\n" +
         "        }.bind(this));\n" +
         "        x += 1;\n" +
         "    }).call(this);\n" +
         "    while (___later.length) ___later.shift()();\n" +
         "    return ___output;\n" +
         "}\n"],
    ];

    for (var i = 0; i < tests.length; i++) {
        var b = tests[i], a;
        try {
            a = bs.stringify(bs.parse(b[0], {loc: false, builder: mozBuilder}));
            if (typeof a !== "string") {
                throw new TypeError("Reflect.stringify returned " +
                                    (a !== null && typeof a === "object"
                                     ? Object.prototype.toString.call(a)
                                     : String(a)) +
                                    "; expected string");
            }
        } catch (exc) {
            print("FAIL - Exception thrown.");
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


