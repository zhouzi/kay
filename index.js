var assign = require('object-assign');

function type (obj) {
  return Object.prototype.toString.call(obj);
}

function Err (name) {
  return {
    err: name
  };
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
      .map(function (validator) {
        var args = [value].concat(validator.args);
        if (validator.fn.apply(null, args)) {
          return null;
        }

        return Err(validator.name);
      })
      .filter(function (err) {
        return err;
      });

  if (callback == null) {
    return errors;
  }

  return callback(errors);
}

function messages (msgs) {
  return function (errs) {
    return errs
      .filter(function (err) { return msgs.hasOwnProperty(err.err); })
      .map(function (err) { return typeof msgs[err.err] == 'function' ? msgs[err.err](err) : msgs[err.err]; });
  };
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

module.exports = {
  validate: validate,
  messages: messages,

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
