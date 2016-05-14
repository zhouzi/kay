var assign = require('object-assign');

function type (obj) {
  return Object.prototype.toString.call(obj);
}

function string (value) {
  if (required(value) == false) {
    return true;
  }

  return type(value) === '[object String]';
}

function number (value) {
  if (required(value) == false) {
    return true;
  }

  return type(value) === '[object Number]';
}

function func (value) {
  if (required(value) == false) {
    return true;
  }

  return type(value) === '[object Function]';
}

function object (value) {
  if (required(value) == false) {
    return true;
  }

  return type(value) === '[object Object]';
}

function array (value) {
  if (required(value) == false) {
    return true;
  }

  return type(value) === '[object Array]';
}

function bool (value) {
  if (required(value) == false) {
    return true;
  }

  return type(value) === '[object Bool]';
}

function required (value) {
  if (value == null) {
    return false;
  }

  if (typeof value.length == 'number' && value.length == 0) {
    return false;
  }

  return true;
}

function minlength (value, minimum) {
  if (required(value) == false) {
    return true;
  }

  if (number(value.length) == false) {
    return false;
  }

  return value.length >= minimum;
}

function maxlength (value, maximum) {
  if (required(value) == false) {
    return true;
  }

  if (number(value.length) == false) {
    return false;
  }

  return value.length <= maximum;
}

function min (value, minimum) {
  if (required(value) == false) {
    return true;
  }

  if (number(value) == false) {
    return false;
  }

  return value >= minimum;
}

function max (value, maximum) {
  if (required(value) == false) {
    return true;
  }

  if (number(value) == false) {
    return false;
  }

  return value <= maximum;
}

function pattern (value, regex) {
  if (required(value) == false) {
    return true;
  }

  return regex.test(value);
}

function validate (value, callback) {
  var validators = this.validators || [];

  var errors =
    validators
      .reduce(function (result, validator) {
        var args = [value].concat(validator.args);
        var isValid = validator.fn.apply(null, args);

        if (isValid) {
          return result;
        }

        result.$invalid = true;
        result[validator.name] = true;
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
  function validate (value) {
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

    return result
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
      var isValid = Object.keys(errors).length == 0;
      var isEmpty = required(value[prop]) == false;

      if (isValid && !isEmpty) {
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
  validate: validate,
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
  pattern: chain(pattern)
};
