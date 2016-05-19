var assign = require('object-assign');

function type (obj) {
  return Object.prototype.toString.call(obj);
}

function string (value) {
  if (isEmpty(value)) {
    return true;
  }

  return type(value) == '[object String]';
}

function number (value) {
  if (isEmpty(value)) {
    return true;
  }

  return type(value) == '[object Number]';
}

function func (value) {
  if (isEmpty(value)) {
    return true;
  }

  return type(value) == '[object Function]';
}

function object (value) {
  if (isEmpty(value)) {
    return true;
  }

  return type(value) == '[object Object]';
}

function array (value) {
  if (isEmpty(value)) {
    return true;
  }

  return type(value) == '[object Array]';
}

function bool (value) {
  if (isEmpty(value)) {
    return true;
  }

  return type(value) == '[object Bool]';
}

function isEmpty (value) {
  if (value == null) {
    return true;
  }

  if (type(value.length) == '[object Number]' && value.length == 0) {
    return true;
  }

  return false;
}

function required (value) {
  return isEmpty(value) == false;
}

function minlength (value, minimum) {
  if (isEmpty(value)) {
    return true;
  }

  if (type(value.length) == '[object Number]') {
    return value.length >= minimum;
  }

  return false;
}

function maxlength (value, maximum) {
  if (isEmpty(value)) {
    return true;
  }

  if (type(value.length) == '[object Number]') {
    return value.length <= maximum;
  }

  return false;
}

function min (value, minimum) {
  if (isEmpty(value)) {
    return true;
  }

  if (type(value) == '[object Number]') {
    return value >= minimum;
  }

  return false;
}

function max (value, maximum) {
  if (isEmpty(value)) {
    return true;
  }

  if (type(value) == '[object Number]') {
    return value <= maximum;
  }

  return false;
}

function pattern (value, regex) {
  if (isEmpty(value)) {
    return true;
  }

  return regex.test(value);
}

function validate (value, callback) {
  if (this.validators == null) {
    throw new Error('validate must be chained');
  }

  var errors =
    this.validators
      .reduce(function (result, validator) {
        var args = [value].concat(validator.args);
        var isValid = validator.fn.apply(null, args);

        if (isValid) {
          return result;
        }

        result.$invalid = true;
        result[validator.name] = validator.$message || true;
        return result;
      }, {});

  if (callback == null) {
    return errors;
  }

  return callback(errors);
}

function defaultValue (value) {
  return assign({}, this, { $default: value });
}

function message (msg) {
  if (this.validators == null) {
    throw new Error('message must be chained');
  }

  this.validators[this.validators.length - 1].$message = msg;
  return this;
}

function chain (validator) {
  return function () {
    var validators =
      (this.validators || [])
        .concat({
          name: validator.name,
          fn: validator,
          args: Array.prototype.slice.call(arguments)
        });

    return assign({}, this, { validators: validators });
  };
}

function schema (obj) {
  function validate (value, callback) {
    var result = {};

    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) {
        continue;
      }

      result[prop] = obj[prop].validate(value[prop]);

      if (result[prop].$invalid) {
        result.$invalid = true;
      }
    }

    if (type(callback) == '[object Function]') {
      return callback(result);
    }

    return result;
  }

  function values (value, callback) {
    if (type(value) == '[object Function]') {
      callback = value;
      value = null;
    }

    if (value == null) {
      value = {};
    }

    var result = {};
    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) {
        continue;
      }

      var errors = obj[prop].validate(value[prop]);

      if (!errors.$invalid && !isEmpty(value[prop])) {
        result[prop] = value[prop];
      } else if (obj[prop].hasOwnProperty('$default')) {
        result[prop] = obj[prop].$default;
      }
    }

    if (callback == null) {
      return result;
    }

    return callback(validate(value), result);
  }

  return {
    validate: validate,
    values: values
  };
}

module.exports = {
  schema: schema,
  defaultValue: defaultValue,

  string: chain(string),
  number: chain(number),
  func: chain(func),
  object: chain(object),
  bool: chain(bool),
  array: chain(array),
  required: chain(required),
  minlength: chain(minlength),
  maxlength: chain(maxlength),
  min: chain(min),
  max: chain(max),
  pattern: chain(pattern),

  // those functions are exported to be chainable
  // but must not be called first
  validate: validate,
  message: message
};
