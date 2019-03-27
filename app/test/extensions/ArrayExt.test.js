var assert = require('chai').assert;
require('../../../build/extensions/ArrayExt');

describe('ArrayExt', function () {
    describe('sortByFieldAsc', function (){
        it('should sort with lowest string as first element', function () {
            var testArray = [
                { "name":"test2", "last": 2 },
                { "name":"test1", "last": 1 },
                { "name":"test3", "last": 3 }
            ];
            testArray.sortByFieldAsc("name")
            assert.equal(testArray[0].name, "test1");
        });
        it('should sort with lowest number as first element', function () {
            var testArray = [
                { "name":"test2", "last": 2 },
                { "name":"test1", "last": 1 },
                { "name":"test3", "last": 3 }
            ];
            testArray.sortByFieldAsc("last")
            assert.equal(testArray[0].last, 1);
        });
        it('should sort with lowest date as first element', function () {
            var testArray = [
                { "name":"test2", "last": 2, "date": new Date("1/2/2019 12:00 PM") },
                { "name":"test1", "last": 1, "date": new Date("1/1/2019 11:00 AM") },
                { "name":"test3", "last": 3, "date": new Date("1/3/2019 1:00 PM") }
            ];
            testArray.sortByFieldAsc("date")
            assert.equal(testArray[0].date.toString(), "Tue Jan 01 2019 11:00:00 GMT-0500 (Eastern Standard Time)");
        });
    });
    describe('sortByFieldDesc', function (){
        it('should sort with highest string as first element', function () {
            var testArray = [
                { "name":"test2", "last": 2 },
                { "name":"test1", "last": 1 },
                { "name":"test3", "last": 3 }
            ];
            testArray.sortByFieldDesc("name")
            assert.equal(testArray[0].name, "test3");
        });
        it('should sort with highest number as first element', function () {
            var testArray = [
                { "name":"test2", "last": 2 },
                { "name":"test1", "last": 1 },
                { "name":"test3", "last": 3 }
            ];
            testArray.sortByFieldDesc("last")
            assert.equal(testArray[0].last, 3);
        });
        it('should sort with highest date as first element', function () {
            var testArray = [
                { "name":"test2", "last": 2, "date": new Date("1/2/2019 12:00 PM") },
                { "name":"test1", "last": 1, "date": new Date("1/1/2019 11:00 AM") },
                { "name":"test3", "last": 3, "date": new Date("1/3/2019 1:00 PM") }
            ];
            testArray.sortByFieldDesc("date")
            assert.equal(testArray[0].date.toString(), "Thu Jan 03 2019 13:00:00 GMT-0500 (Eastern Standard Time)");
        });
    });
});