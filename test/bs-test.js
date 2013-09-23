
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
        ["x->(1,2,3)", 'function() {return x.apply(this,[1,2,3].concat(Array.prototype.slice.call(arguments)));};\n'],
        ["x.y->(1,2,3)", 'function() {return x.y.apply(x,[1,2,3].concat(Array.prototype.slice.call(arguments)));};\n'],
        ["x['y']->(1,2,3)", 'function() {return x["y"].apply(x,[1,2,3].concat(Array.prototype.slice.call(arguments)));};\n'],

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

