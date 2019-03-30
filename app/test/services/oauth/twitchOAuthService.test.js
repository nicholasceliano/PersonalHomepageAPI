var config = require("../../../../build/config");
var expect = require("chai").expect;
var TwitchOAuthService = require("../../../../build/services/oauth/twitchOAuthService").TwitchOAuthService;
var logger = require("winston");

describe("TwitchOAuthService", function() {
    describe("checkForUsersToken", function() {
        it("expect error because no token is associted with AuthUID", function(done) {
            //checkForUsersToken -- expect error No Token file: Login Required.
            new TwitchOAuthService(config.credentialsConfig.twitch, logger).checkForUsersToken("asd123")
            .then()
            .catch(err => {
                expect(err).to.be.a("string");
                expect(err).to.equal("No Token: Login Required.");
                done();
            });
        });
    });
    describe("getUserAuth2Url", function() {
        it("expect url to twitch oauth login page", function(done) {
            var url = new TwitchOAuthService(config.credentialsConfig.twitch, logger).getUserAuth2Url();
            expect(url).to.be.a("string").to.include("https://id.twitch.tv/oauth2");
            done();
        });
    });
    describe("getTokenFromCode", function() {
        it("expect error because code is not valid", function(done) {
            new TwitchOAuthService(config.credentialsConfig.twitch, logger).getTokenFromCode("asdb1234")
            .then()
            .catch(err => {
                expect(err).to.be.a("string");
                expect(err).to.equal("Token is invalid, no access_token property.");
                done();
            });
        });
    });
});
