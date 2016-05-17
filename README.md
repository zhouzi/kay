# kay

User-centered validation library.

* [Example](#example)
* [Motivation](#motivation)
* [Installation](#installation)
* [Documentation](#documentation)

## Installation

* *Coming soon*

## Example

```javascript
var kay = require('kay');
var schema = kay.schema({
  firstname: kay.required().minlength(3),
  lastname: kay.minlength(3)
});

var user = {
  lastname: 'Do'
};

schema.validate(user);
// {
//   $invalid: true,
//   firstname: {
//     $invalid: true,
//     required: true,
//     minlength: true
//   },
//
//   lastname: {
//     $invalid: true,
//     minlength: true
//   }
// }
```

## Motivation

I believe that the purpose of client-side validation should be to provide guidance to users but in no way to strictly validate data.
Having this in mind completely changed the way I conceived kay.
What is invalid from a code perspective is not necessarily wrong from the user side.
For example, with kay `null` does not make a `minlength` constraint to be invalid unless it is required.
Instead, `null`, `''` and `[]` are considered to be "empty" values.

## Documentation

*Coming soon*
