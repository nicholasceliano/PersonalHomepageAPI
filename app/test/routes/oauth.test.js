var app = require("../../../build/app");
var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = require("chai").expect;
var config = require("../../../build/config");
chai.use(chaiHttp);
chai.should();

describe("OAuth API", function() {
    describe("google", function() {
        it("returns an oauth2 Url for user", function(done) {
            chai.request(app).get("/oauth/google/getUserOAuth2Url")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.an("object");
                expect(res.body.url).to.be.a("string").to.have.lengthOf.above(1);
                done();
            });
        });
        it("redirects to error page because missing code", function(done) {
            chai.request(app).get("/oauth/google/getTokenFromCode").redirects(0).end((err, res) => {
                res.should.redirectTo("http://localhost:4200/error?err=%22Code%22%20query%20param%20is%20required");
                done();
            });
        });
        it("redirects to error page because bad code", function(done) {
            chai.request(app).get("/oauth/google/getTokenFromCode?code=asdqwe").redirects(0).end((err, res) => {
                res.should.redirectTo("http://localhost:4200/error?err=Error%20retrieving%20access%20token%20" +
                                    "Error:%20invalid_grant");
                done();
            });
        });
    });
    describe("twitch", function() {
        it("returns an oauth2 Url for user", function(done) {
            chai.request(app).get("/oauth/twitch/getUserOAuth2Url")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.an("object");
                expect(res.body.url).to.be.a("string").to.have.lengthOf.above(1);
                done();
            });
        });
        it("redirects to error page because missing code", function(done) {
            chai.request(app).get("/oauth/twitch/getTokenFromCode").redirects(0).end((err, res) => {
                res.should.redirectTo("http://localhost:4200/error?err=%22Code%22%20query%20param%20is%20required");
                done();
            });
        });
        it("redirects to error page because bad code", function(done) {
            chai.request(app).get("/oauth/twitch/getTokenFromCode?code=asdqwe").redirects(0).end((err, res) => {
                res.should.redirectTo("http://localhost:4200/error?err=Token%20is%20invalid,%20no%20" +
                                        "access_token%20property.");
                done();
            });
        });
    });
});
