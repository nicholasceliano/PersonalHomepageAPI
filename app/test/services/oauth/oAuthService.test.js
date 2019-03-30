var config = require("../../../../build/config");
var expect = require("chai").expect;
var OAuthService = require("../../../../build/services/oauth/oAuthService").OAuthService;
var logger = require("winston");

describe("OAuthService", function() {
    describe("checkForUsersToken", function() {
        it("expect error because no token is associted with AuthUID", function(done) {
            //checkForUsersToken -- expect error No Token file: Login Required.
            new OAuthService(config.credentialsConfig.twitch, logger).checkForUsersToken("asd123")
            .then()
            .catch(err => {
                expect(err).to.be.a("string");
                expect(err).to.equal("No Token: Login Required.");
                done();
            });
        });
    });
    describe("createToken", function() {
        it("expect UUID because token was created", function(done) {
            new Promise((resolve, reject) => {
                new OAuthService(config.credentialsConfig.twitch, logger).createToken("{ \"test\": \"test123\" }"
                                    , undefined, resolve, reject);
            }).then()
            .catch(err => {
                expect(err).to.be.a("string");
                expect(err).to.equal("Token is invalid, no access_token property.");
                done();
            });
        });
    });
});
