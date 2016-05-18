# kay

User-centered validation library.

* [Installation](#installation)
* [Example](#example)
* [Motivation](#motivation)
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

kay's api is a just a serie of chainable functions.

### kay.validate(value, [callback])

Run the value against the added constraint and return a map of errors or call callback with it.

**Example**

```javascript
var name = kay.required().minlength(3);
name.validate('Jo');
// {
//   $invalid: true,
//   minlength: true
// }

name.validate('Jo', function isInvalid (errors) {
  return errors.$invalid;
});
// true

name.validate('John');
// {}
```

### kay.required()

Add a constraint that checks if value is not empty (`null`, `undefined`, `[]`, `''`).

**Example**

```javascript
var name = kay.required();
name.validate(null);
// {
//   $invalid: true,
//   required: true
// }

name.validate('John');
// {}
```

### kay.string()

Add a constraint that checks if value is a string.
Note: empty values are valid "string".

**Example**

```javascript
var name = kay.required();
name.validate(123);
// {
//   $invalid: true,
//   string: true
// }

name.validate('John');
// {}
```

### kay.number()

Add a constraint that checks if value is a number.
Note: empty values are valid "number".

**Example**

```javascript
var age = kay.required();
age.validate('John');
// {
//   $invalid: true,
//   number: true
// }

age.validate(123);
// {}
```

### kay.func()

Add a constraint that checks if value is a function.
Note: empty values are valid "func".

**Example**

```javascript
var callback = kay.func();
callback.validate('John');
// {
//   $invalid: true,
//   func: true
// }

callback.validate(function () {});
// {}
```

### kay.object()

Add a constraint that checks if value is a object.
Note: empty values are valid "object".

**Example**

```javascript
var user = kay.object();
user.validate('John');
// {
//   $invalid: true,
//   object: true
// }

user.validate({});
// {}
```

### kay.array()

Add a constraint that checks if value is a array.
Note: empty values are valid "array".

**Example**

```javascript
var repos = kay.array();
repos.validate('John');
// {
//   $invalid: true,
//   array: true
// }

repos.validate(['kay']);
// {}
```

### kay.bool()

Add a constraint that checks if value is a boolean.
Note: empty values are valid "bool".

**Example**

```javascript
var isOnline = kay.bool();
isOnline.validate('John');
// {
//   $invalid: true,
//   bool: true
// }

isOnline.validate(true);
// {}
```

### kay.minlength(minimum)

Add a constraint that checks if value has a length equal or greater than minimum.
Note: empty values are valid "minlength".

**Example**

```javascript
var repos = kay.minlength(2);
repos.validate(['kay']);
// {
//   $invalid: true,
//   minlength: true
// }

repos.validate(['kay', 'react-kay']);
// {}
```

### kay.maxlength(maximum)

Add a constraint that checks if value has a length equal or lower than maximum.
Note: empty values are valid "maxlength".

**Example**

```javascript
var repos = kay.maxlength(1);
repos.validate(['kay', 'react-kay']);
// {
//   $invalid: true,
//   maxlength: true
// }

repos.validate(['kay']);
// {}
```

### kay.min(minimum)

Add a constraint that checks if value is a number equal or greater than minimum.
Note: empty values are valid "min".

**Example**

```javascript
var age = kay.min(24);
age.validate(12);
// {
//   $invalid: true,
//   min: true
// }

age.validate(32);
// {}
```

### kay.max(maximum)

Add a constraint that checks if value is a number equal or lower than maximum.
Note: empty values are valid "max".

**Example**

```javascript
var age = kay.max(24);
age.validate(32);
// {
//   $invalid: true,
//   max: true
// }

age.validate(12);
// {}
```

### kay.pattern(regexp)

Add a constraint that checks if value matches regexp.
Note: empty values are valid "regexp".

**Example**

```javascript
var email = kay.pattern(/[^@]+@[^@]+/);
email.validate('johngmail.com');
// {
//   $invalid: true,
//   pattern: true
// }

email.validate('john@gmail.com');
// {}
```

### kay.message(msg)

Define a message from the previously called constraint.
This msg will be used instead of "true" in the error map.
Note: there's no restriction to what msg can be, as long as it can be stored in an object.

**Example**

```javascript
var name =
  kay
    .required().message('Please fill in your name')
    .minlength(3).message('Sorry but that name is too short.');

kay.validate(null)
// {
//   $invalid: true,
//   required: 'Please fill in your name'
// }

kay.validate('Jo')
// {
//   $invalid: true,
//   minlength: 'Sorry but that name is too short.'
// }
```

### kay.defaultValue(value)

Define a default value that can be used in a schema.

**Example**

```javascript
var user = kay.schema({
  name: kay.defaultValue('John')
});

user.values({});
// {
//   name: 'John'
// }
```

### kay.schema(obj)

Create a schema that can be used to validate a structure.

**Example**

```javascript
var user = kay.schema({
  name: kay.required().string(),
  age: kay.number()
});
```

#### schema.validate(value)

Equivalent of kay.validate but for schemas.

**Example**

```javascript
var user = kay.schema({
  name: kay.required().string(),
  age: kay.number()
});

user.validate({
  age: 'John'
});

// {
//   $invalid: true,
//   name: {
//     $invalid: true,
//     required: true
//   },
//   age: {
//     $invalid: true,
//     number: true
//   }
// }
```

#### schema.values(value, [callback])

Return the valid and default values from the provided "value".
If callback is provided, return the result of calling it with two arguments: an error map (from schema.validate) and the data.

**Example**

```javascript
var user = kay.schema({
  firstname: kay.required().string(),
  lastname: kay.string().defaultValue('Doe')
});

user.values({
  lastname: 123
});
// {
//   lastname: 'Doe'
// }

user.values({
  firstname: 'John'
});
// {
//   firstname: 'John',
//   lastname: 'Doe'
// }
```
