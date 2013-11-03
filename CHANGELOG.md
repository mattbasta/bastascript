# Changelog

## v0.2.0

- Added ES6-style fat arrow functions
- Header now written to the top of generated JS files
- Function shorthand (florin; U+0192; option+f)
- return-if and return-unless statements

Fixes:

- `.bind(this)` is only applied to generated code where a `ThisExpression` is
  present.

## v0.1.0

- Initial release

