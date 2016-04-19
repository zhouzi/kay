var assign = require('object-assign');

function chain (obj, validator) {
  var validators = obj.validators || [];
  return assign({}, obj, { validators: validators.concat(validator) });
}

function type (obj) {
  return Object.prototype.toString.call(obj);
}

function Err (name) {
  return {
    err: name
  };
}

function string () {
  return chain(this, function string(value) {
    return type(value) === '[object String]';
  });
}

function number () {
  return chain(this, function number(value) {
    return type(value) === '[object Number]';
  });
}

function func () {
  return chain(this, function func(value) {
    return type(value) === '[object Function]';
  });
}

function object () {
  return chain(this, function object(value) {
    return type(value) === '[object Object]';
  });
}

function array () {
  return chain(this, function array(value) {
    return type(value) === '[object Array]';
  });
}

function bool () {
  return chain(this, function bool(value) {
    return type(value) === '[object Bool]';
  });
}

function required () {
  return chain(this, function required(value) {
    return Boolean(value) && (value.length == null || value.length > 0);
  });
}

function minlength (minimum) {
  return chain(this, function minlength(value) {
    if (value == null || value.length == null) {
      return false;
    }

    return value.length >= minimum;
  });
}

function maxlength (maximum) {
  return chain(this, function maxlength(value) {
    if (value == null || value.length == null) {
      return false;
    }

    return value.length <= maximum;
  });
}

function min (minimum) {
  return chain(this, function min(value) {
    if (typeof value != 'number') {
      return false;
    }

    return value >= minimum;
  });
}

function max (maximum) {
  return chain(this, function max(value) {
    if (typeof value != 'number') {
      return false;
    }

    return value <= maximum;
  });
}

function pattern (regex) {
  return chain(this, function pattern(value) {
    if (value == null) {
      return false;
    }

    return regex.test(value);
  });
}

function validate (value, callback) {
  var validators = this.validators || [];

  var errors =
    validators
      .map(function (validator) { return validator(value) ? null : Err(validator.name)})
      .filter(function (err) { return err; });

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

module.exports = {
  messages: messages,
  string: string,
  number: number,
  func: func,
  object: object,
  bool: bool,
  array: array,
  required: required,
  minlength: minlength,
  maxlength: maxlength,
  min: min,
  max: max,
  pattern: pattern,
  validate: validate
};
