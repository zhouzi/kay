/* global describe, it, context */

var assert = require('assert');
var sinon = require('sinon');
var kay = require('./index');
var api = Object.keys(kay).filter(function (key) { return key !== 'validate'; });

describe('kay', function () {
  it('has functions that return the api', function () {
    api
      .forEach(function (key) {
        assert.deepEqual(Object.keys(kay[key]()).sort(), api.concat('validate', 'validators').sort());
      });
  });

  describe('has a required function that', function () {
    it('return no error if value is truthy', function () {
      assert.deepEqual(kay.required().validate('foo'), []);
      assert.deepEqual(kay.required().validate(['foo']), []);
    });

    it('return an error if value is falsy', function () {
      assert.deepEqual(kay.required().validate(''), [{ err: 'required' }]);
      assert.deepEqual(kay.required().validate(null), [{ err: 'required' }]);
    });

    it('return an error if value has a length equal to 0', function () {
      assert.deepEqual(kay.required().validate([]), [{ err: 'required' }]);
    });
  });

  describe('has a minlength function that', function () {
    it('return no errors if value is of the given length', function () {
      assert.deepEqual(kay.minlength(3).validate('foo'), []);
      assert.deepEqual(kay.minlength(3).validate(['foo', 'bar', 'quz']), []);
    });

    it('return no errors if value\'s length is greater than the given length', function () {
      assert.deepEqual(kay.minlength(3).validate('fooo'), []);
      assert.deepEqual(kay.minlength(3).validate(['foo', 'bar', 'quz', 'baz']), []);
    });

    it('return an error if value\'s length is lower than the given length', function () {
      assert.deepEqual(kay.minlength(3).validate('fo'), [{ err: 'minlength' }]);
      assert.deepEqual(kay.minlength(3).validate(['foo', 'bar']), [{ err: 'minlength' }]);
    });

    it('return an error if value has no length property', function () {
      assert.deepEqual(kay.minlength(3).validate(null), [{ err: 'minlength' }]);
    });
  });

  describe('has a maxlength function that', function () {
    it('return no errors if value is of the given length', function () {
      assert.deepEqual(kay.maxlength(3).validate('foo'), []);
      assert.deepEqual(kay.maxlength(3).validate(['foo', 'bar', 'quz']), []);
    });

    it('return no errors if value is lower than maxlength', function () {
      assert.deepEqual(kay.maxlength(3).validate('fo'), []);
      assert.deepEqual(kay.maxlength(3).validate(['foo', 'bar']), []);
    });

    it('return an error if value\'s length exceeds the maximum', function () {
      assert.deepEqual(kay.maxlength(3).validate('fooo'), [{ err: 'maxlength' }]);
      assert.deepEqual(kay.maxlength(3).validate(['foo', 'bar', 'quz', 'baz']), [{ err: 'maxlength' }]);
    });

    it('return an error if value has no length property', function () {
      assert.deepEqual(kay.maxlength(3).validate(null), [{ err: 'maxlength' }]);
    });
  });

  describe('has a min function that', function () {
    it('return no errors when value is equal to the minimum', function () {
      assert.deepEqual(kay.min(3).validate(3), []);
    });

    it('return no errors when value is greater than the minimum', function () {
      assert.deepEqual(kay.min(3).validate(6), []);
    });

    it('return an error when value is greater than the minimum', function () {
      assert.deepEqual(kay.min(3).validate(2), [{ err: 'min' }]);
    });

    it('return an error when value is not a number', function () {
      assert.deepEqual(kay.min(3).validate(null), [{ err: 'min' }]);
    });
  });

  describe('has a max function that', function () {
    it('return no errors when value is equal to maximum', function () {
      assert.deepEqual(kay.max(3).validate(3), []);
    });

    it('return no errors when value is lower than maximum', function () {
      assert.deepEqual(kay.max(3).validate(2), []);
    });

    it('return an error when value is greater than maximum', function () {
      assert.deepEqual(kay.max(3).validate(4), [{ err: 'max' }]);
    });

    it('return an error when value is not a number', function () {
      assert.deepEqual(kay.max(3).validate(null), [{ err: 'max' }]);
    });
  });

  describe('has a pattern function that', function () {
    it('return no errors if value matches pattern', function () {
      assert.deepEqual(kay.pattern(/123/).validate('123'), []);
    });

    it('return an error if value matches pattern', function () {
      assert.deepEqual(kay.pattern(/123/).validate('abc'), [{ err: 'pattern' }]);
    });
  });

  describe('has a validate function that', function () {
    var errors = [{ err: 'string' }, { err: 'minlength' }];

    it('calls it with the list of errors when given a callback', function () {
      var returnValue = 'hey there!';
      var stub = sinon.stub().returns(returnValue);

      assert.equal(kay.string().required().minlength(4).validate(1, stub), returnValue);
      assert.equal(stub.callCount, 1);
      assert.deepEqual(stub.lastCall.args, [errors]);
    });

    it('returns a list of errors when not given a callback', function () {
      assert.deepEqual(kay.string().required().minlength(4).validate(1), errors);
    });
  });
});
