var config = require("../../../../build/config");
var expect = require("chai").expect;
var GoogleOAuthService = require("../../../../build/services/oauth/googleOAuthService").GoogleOAuthService;
var logger = require("winston");

describe("GoogleOAuthService", function() {
    describe("checkForUsersToken", function() {
        it("expect error because no token is associted with AuthUID", function(done) {
            //checkForUsersToken -- expect error No Token file: Login Required.
            new GoogleOAuthService(config.credentialsConfig.google, logger).checkForUsersToken("asd123")
            .then()
            .catch(err => {
                expect(err).to.be.a("string");
                expect(err).to.equal("No Token: Login Required.");
                done();
            });
        });
    });
    describe("getUserAuth2Url", function() {
        it("expect url to googles oauth login page", function(done) {
            var url = new GoogleOAuthService(config.credentialsConfig.google, logger).getUserAuth2Url();
            expect(url).to.be.a("string").to.include("https://accounts.google.com/o/oauth2/v2/auth?");
            done();
        });
    });
    describe("getTokenFromCode", function() {
        it("expect error because code is not valid", function(done) {
            //getTokenFromCode -- expect error that codeis bad
            new GoogleOAuthService(config.credentialsConfig.google, logger).getTokenFromCode("asdb1234")
            .then()
            .catch(err => {
                expect(err).to.be.a("string");
                expect(err).to.equal("Error retrieving access token Error: invalid_grant");
                done();
            });
        });
    });
});
