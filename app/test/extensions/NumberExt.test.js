var assert = require("chai").assert;
require("../../../build/extensions/NumberExt");

describe("numExt", function() {
    describe("isValidLatitude", function() {
        it("90 should return valid latitude", function() {
            var num = 90;
            assert.equal(num.isValidLatitude(), true);
        });
        it("0 should return valid latitude", function() {
            var num = 0;
            assert.equal(num.isValidLatitude(), true);
        });
        it("91 should return invalid latitude", function() {
            var num = 91;
            assert.equal(num.isValidLatitude(), false);
        });
        it("-91 should return invalid latitude", function() {
            var num = -91;
            assert.equal(num.isValidLatitude(), false);
        });
    });
    describe("isValidLongitude", function() {
        it("180 should return valid longitude", function() {
            var num = 180;
            assert.equal(num.isValidLongitude(), true);
        });
        it("0 should return valid longitude", function() {
            var num = 0;
            assert.equal(num.isValidLongitude(), true);
        });
        it("181 should return invalid longitude", function() {
            var num = 181;
            assert.equal(num.isValidLongitude(), false);
        });
        it("-181 should return invalid longitude", function() {
            var num = -181;
            assert.equal(num.isValidLongitude(), false);
        });
    });
});
