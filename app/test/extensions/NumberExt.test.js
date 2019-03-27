var assert = require('chai').assert;
require('../../../build/extensions/NumberExt');

describe('NumberExt', function () {
    describe('isValidLatitude', function (){
        it('90 should return valid latitude', function () {
            var number = 90;
            assert.equal(number.isValidLatitude(), true);
        });
        it('0 should return valid latitude', function () {
            var number = 0;
            assert.equal(number.isValidLatitude(), true);
        });
        it('91 should return invalid latitude', function () {
            var number = 91;
            assert.equal(number.isValidLatitude(), false);
        });
        it('-91 should return invalid latitude', function () {
            var number = -91;
            assert.equal(number.isValidLatitude(), false);
        });
    });
    describe('isValidLongitude', function (){
        it('180 should return valid longitude', function () {
            var number = 180;
            assert.equal(number.isValidLongitude(), true);
        });
        it('0 should return valid longitude', function () {
            var number = 0;
            assert.equal(number.isValidLongitude(), true);
        });
        it('181 should return invalid longitude', function () {
            var number = 181;
            assert.equal(number.isValidLongitude(), false);
        });
        it('-181 should return invalid longitude', function () {
            var number = -181;
            assert.equal(number.isValidLongitude(), false);
        });
    });
});