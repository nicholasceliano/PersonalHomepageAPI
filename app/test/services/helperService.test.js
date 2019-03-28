var assert = require("chai").assert;
var HelperService = require("../../../build/services/helperService").HelperService;

describe("HelperService", function() {
    describe("getKeyByValue", function() {
        it("should return string key from value of hash", function() {
            var hash = {
                "testkey1": "testval1",
                "testkey2": "testval2",
                "testkey3": "testval3",
            };
            assert.equal(new HelperService().getKeyByValue(hash, "testval2"), "testkey2");
        });
        it("should return int key from value of hash", function() {
            var hash = {
                1: "testval1",
                2: "testval2",
                3: "testval3",
            };
            assert.equal(new HelperService().getKeyByValue(hash, "testval2"), 2);
        });
    });
    describe("calculatePercentChange", function() {
        it("should return 0 if same inputs", function() {
            assert.equal(new HelperService().calculatePercentChange(50, 50), 0);
        });
        it("should return 100 if double the input", function() {
            assert.equal(new HelperService().calculatePercentChange(50, 100), 100);
        });
        it("should return 2 decimals if uneven percent", function() {
            assert.equal(new HelperService().calculatePercentChange(34, 66), 94.12);
        });
        it("should return -100 if removed all input", function() {
            assert.equal(new HelperService().calculatePercentChange(50, 0), -100);
        });
        it("should return negative 2 decimals if uneven percent", function() {
            assert.equal(new HelperService().calculatePercentChange(66, 34), -48.48);
        });
    });
    describe("daysBetweenDates", function() {
        it("should return 0s for same dates", function() {
            var sameDate = new Date();
            assert.equal(new HelperService().daysBetweenDates(sameDate, sameDate), "0d 0h 0m");
        });
        it("should return 1d 1h 1m for added times", function() {
            var currDate = new Date("1/1/2019 10:10 AM");
            var newDate = new Date("1/2/2019 11:11 AM");
            assert.equal(new HelperService().daysBetweenDates(currDate, newDate), "1d 1h 1m");
        });
        it("should return 1d 1h 1m for subtracted times", function() {
            var currDate = new Date("1/1/2019 10:10 AM");
            var newDate = new Date("1/2/2019 11:11 AM");
            assert.equal(new HelperService().daysBetweenDates(newDate, currDate), "1d 1h 1m");
        });
        it("should return 1m for 60000ms", function() {
            assert.equal(new HelperService().daysBetweenDates(0, 60000), "0d 0h 1m");
        });
        it("should return 0m for 59999ms", function() {
            assert.equal(new HelperService().daysBetweenDates(0, 59999), "0d 0h 0m");
        });
    });
});
