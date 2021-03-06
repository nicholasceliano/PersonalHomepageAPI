var expect = require("chai").expect;
var MySqlService = require("../../../build/services/mySqlService").MySqlService;
var config = require("../../../build/config");
var logger = require("winston");

describe("MySqlService", function() {
    describe("storedProcedure", function() {
        it("should return results for gnucash Config", function() {
            return new MySqlService(config.credentialsConfig.gnuCash, logger).storedProcedure("getAllStockValues()")
            .then((dbRes) => {
                expect(dbRes).to.be.an("array");
                expect(dbRes).to.have.lengthOf.above(0);
            });
        });
    });
});
