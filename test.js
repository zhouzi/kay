/* global describe, it, context, beforeEach */

var assert = require('assert');
var sinon = require('sinon');
var kay = require('./index');
var notReturningApiProps = ['defaultValue', 'validators', 'validate', 'schema'];
var api = Object.keys(kay).filter(function (key) { return notReturningApiProps.indexOf(key) === -1; });

describe('kay', function () {
  it('has functions that return the api', function () {
    api
      .forEach(function (key) {
        assert.deepEqual(Object.keys(kay[key]()).sort(), api.concat(notReturningApiProps).sort());
      });
  });

  describe('has a string function that', function () {
    it('return no error if value is empty', function () {
      assert.deepEqual(kay.string().validate(null), {});
    });

    it('return an error if value is not a string', function () {
      assert.deepEqual(kay.string().validate(123), { $invalid: true, string: true });
    });
  });

  describe('has a number function that', function () {
    it('return no error if value is empty', function () {
      assert.deepEqual(kay.number().validate(null), {});
    });

    it('return an error if value is not a number', function () {
      assert.deepEqual(kay.number().validate('abc'), { $invalid: true, number: true });
    });
  });

  describe('has a func function that', function () {
    it('return no error if value is empty', function () {
      assert.deepEqual(kay.func().validate(null), {});
    });

    it('return an error if value is not a func', function () {
      assert.deepEqual(kay.func().validate('abc'), { $invalid: true, func: true });
    });
  });

  describe('has a object function that', function () {
    it('return no error if value is empty', function () {
      assert.deepEqual(kay.object().validate(null), {});
    });

    it('return an error if value is not a object', function () {
      assert.deepEqual(kay.object().validate(['foo']), { $invalid: true, object: true });
    });
  });

  describe('has a array function that', function () {
    it('return no error if value is empty', function () {
      assert.deepEqual(kay.array().validate(null), {});
    });

    it('return an error if value is not a array', function () {
      assert.deepEqual(kay.array().validate({}), { $invalid: true, array: true });
    });
  });

  describe('has a bool function that', function () {
    it('return no error if value is empty', function () {
      assert.deepEqual(kay.bool().validate(null), {});
    });

    it('return an error if value is not a bool', function () {
      assert.deepEqual(kay.bool().validate('abc'), { $invalid: true, bool: true });
    });
  });

  describe('has a required function that', function () {
    it('return no error if value is not empty', function () {
      assert.deepEqual(kay.required().validate('foo'), {});
      assert.deepEqual(kay.required().validate(['foo']), {});
    });

    it('return an error if value is empty', function () {
      assert.deepEqual(kay.required().validate(''), { $invalid: true, required: true });
      assert.deepEqual(kay.required().validate(null), { $invalid: true, required: true });
    });

    it('return an error if value has a length equal to 0', function () {
      assert.deepEqual(kay.required().validate([]), { $invalid: true, required: true });
    });
  });

  describe('has a minlength function that', function () {
    it('return no errors if value is of the given length', function () {
      assert.deepEqual(kay.minlength(3).validate('foo'), {});
      assert.deepEqual(kay.minlength(3).validate(['foo', 'bar', 'quz']), {});
    });

    it('return no errors if value\'s length is greater than the given length', function () {
      assert.deepEqual(kay.minlength(3).validate('fooo'), {});
      assert.deepEqual(kay.minlength(3).validate(['foo', 'bar', 'quz', 'baz']), {});
    });

    it('return no errors if value is empty', function () {
      assert.deepEqual(kay.minlength(3).validate(''), {});
    });

    it('return an error if value\'s length is lower than the given length', function () {
      assert.deepEqual(kay.minlength(3).validate('fo'), { $invalid: true, minlength: true });
      assert.deepEqual(kay.minlength(3).validate(['foo', 'bar']), { $invalid: true, minlength: true });
    });

    it('return an error if value has no length property', function () {
      assert.deepEqual(kay.minlength(3).validate({}), { $invalid: true, minlength: true });
    });
  });

  describe('has a maxlength function that', function () {
    it('return no errors if value is of the given length', function () {
      assert.deepEqual(kay.maxlength(3).validate('foo'), {});
      assert.deepEqual(kay.maxlength(3).validate(['foo', 'bar', 'quz']), {});
    });

    it('return no errors if value is lower than maxlength', function () {
      assert.deepEqual(kay.maxlength(3).validate('fo'), {});
      assert.deepEqual(kay.maxlength(3).validate(['foo', 'bar']), {});
    });

    it('return no errors if value is empty', function () {
      assert.deepEqual(kay.maxlength(3).validate(null), {});
    });

    it('return an error if value\'s length exceeds the maximum', function () {
      assert.deepEqual(kay.maxlength(3).validate('fooo'), { $invalid: true, maxlength: true });
      assert.deepEqual(kay.maxlength(3).validate(['foo', 'bar', 'quz', 'baz']), { $invalid: true, maxlength: true });
    });

    it('return an error if value has no length property', function () {
      assert.deepEqual(kay.maxlength(3).validate({}), { $invalid: true, maxlength: true });
    });
  });

  describe('has a min function that', function () {
    it('return no errors when value is equal to the minimum', function () {
      assert.deepEqual(kay.min(3).validate(3), {});
    });

    it('return no errors when value is greater than the minimum', function () {
      assert.deepEqual(kay.min(3).validate(6), {});
    });

    it('return no errors if value is empty', function () {
      assert.deepEqual(kay.min(3).validate(null), {});
    });

    it('return an error when value is greater than the minimum', function () {
      assert.deepEqual(kay.min(3).validate(2), { $invalid: true, min: true });
    });

    it('return an error when value is not a number', function () {
      assert.deepEqual(kay.min(3).validate({}), { $invalid: true, min: true });
    });
  });

  describe('has a max function that', function () {
    it('return no errors when value is equal to maximum', function () {
      assert.deepEqual(kay.max(3).validate(3), {});
    });

    it('return no errors when value is lower than maximum', function () {
      assert.deepEqual(kay.max(3).validate(2), {});
    });

    it('return no errors if value is empty', function () {
      assert.deepEqual(kay.max(3).validate(null), {});
    });

    it('return an error when value is greater than maximum', function () {
      assert.deepEqual(kay.max(3).validate(4), { $invalid: true, max: true });
    });

    it('return an error when value is not a number', function () {
      assert.deepEqual(kay.max(3).validate({}), { $invalid: true, max: true });
    });
  });

  describe('has a pattern function that', function () {
    it('return no errors if value matches pattern', function () {
      assert.deepEqual(kay.pattern(/123/).validate('123'), {});
    });

    it('return no errors if value is empty', function () {
      assert.deepEqual(kay.pattern(/123/).validate(null), {});
    });

    it('return an error if value matches pattern', function () {
      assert.deepEqual(kay.pattern(/123/).validate('abc'), { $invalid: true, pattern: true });
    });
  });

  describe('has a validate function that', function () {
    it('calls it with the list of errors when given a callback', function () {
      var returnValue = 'hey there!';
      var stub = sinon.stub().returns(returnValue);

      assert.equal(kay.string().required().minlength(4).validate(1, stub), returnValue);
      assert.equal(stub.callCount, 1);
      assert.deepEqual(stub.lastCall.args, [{ $invalid: true, string: true, minlength: true }]);
    });

    it('returns a map with an $invalid prop set to true when the validation fails', function () {
      assert.deepEqual(kay.required().validate(null), { $invalid: true, required: true });
    });

    it('returns a list of errors when not given a callback', function () {
      assert.deepEqual(kay.string().required().minlength(4).validate(1), {
        $invalid: true,
        string: true,
        minlength: true
      });
    });
  });

  describe('has a schema function that', function () {
    it('should return the schema api', function () {
      assert.deepEqual(Object.keys(kay.schema()), ['validate', 'values']);
    });

    describe('return a validate function that', function () {
      it('should return an object with a top level $invalid prop if the validation fails', function () {
        var schema = kay.schema({
          name: kay.required()
        });

        assert.deepEqual(schema.validate({}), {
          $invalid: true,
          name: {
            $invalid: true,
            required: true
          }
        });
      });

      it('should return an object containing the errors', function () {
        var schema = kay.schema({
          name: kay.string().required(),
          age: kay.number()
        });

        assert.deepEqual(schema.validate({ age: 'abc' }), {
          $invalid: true,
          name: {
            $invalid: true,
            required: true
          },
          age: {
            $invalid: true,
            number: true
          }
        });
      });

      it('should ignore non-described properties', function () {
        var schema = kay.schema({
          name: kay.string().required(),
          age: kay.number()
        });

        assert.deepEqual(schema.validate({ name: 'John', age: 25, phone: '01234' }), { name: {}, age: {} });
      });
    });

    describe('return a values function that', function () {
      var schema;

      beforeEach(function () {
        schema = kay.schema({ firstname: kay.string().defaultValue('John'), age: kay.number().defaultValue(22) });
      });

      it('should return the default values', function () {
        assert.deepEqual(schema.values(), { firstname: 'John', age: 22 });
      });

      it('should return the provided values when available', function () {
        assert.deepEqual(schema.values({ firstname: 'Jane' }), { firstname: 'Jane', age: 22 });
      });

      it('should not return the key that have no default value', function () {
        schema = kay.schema({ firstname: kay.string().defaultValue('John'), age: kay.number() });
        assert.deepEqual(schema.values(), { firstname: 'John' });
      });

      it('should ignore non-described properties', function () {
        assert.deepEqual(schema.values({ firstname: 'Jane', phone: '01234' }), { firstname: 'Jane', age: 22 });
      });

      it('should return default value for invalid props', function () {
        assert.deepEqual(schema.values({ firstname: ['Jane'] }), { firstname: 'John', age: 22 });
      });

      it('should not return value for invalid props that have no default value', function () {
        schema = kay.schema({ firstname: kay.string().defaultValue('John'), age: kay.number() });
        assert.deepEqual(schema.values({ age: 'abc' }), { firstname: 'John' });
      });

      it('should call a callback with the errors and result', function () {
        var stub = sinon.stub();
        schema = kay.schema({ firstname: kay.string().defaultValue('John'), age: kay.number().required() });
        schema.values({}, stub);

        assert.equal(stub.callCount, 1);
        assert.deepEqual(stub.lastCall.args, [
          {
            $invalid: true,
            firstname: {},
            age: {
              $invalid: true,
              required: true
            }
          },
          {
            firstname: 'John'
          }
        ]);
      });
    });
  });
});
