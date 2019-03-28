var expect = require("chai").expect;
var GoogleApis = require("googleapis").GoogleApis;
var OAuth2Client = require("google-auth-library").OAuth2Client;
var GmailService = require("../../../build/services/gmailService").GmailService;

describe("GmailService", function() {
    describe("getUnreadEmails", function() {
        it("should return an error because no credentials", function() {
            return new GmailService(new GoogleApis()).getUnreadEmails(new OAuth2Client()).then(res => {
                //cant test against Google API because no test API credentials
            }).catch(err => {
                expect(err.toString()).to.equal("Error: No access, refresh token or API key is set.");
            });
        });
    });
});
