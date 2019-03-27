var expect = require('chai').expect;


var config = require('../../../../build/config')
var GoogleAuth = require('google-auth-library').GoogleAuth;
var GoogleOAuthService = require('../../../../build/services/oauth/googleOAuthService').GoogleOAuthService;

describe('GoogleOAuthService', function (){
    describe('checkGapiAuth', function (){
        it('returns an error because no oAuth Token', function(done) {
            //TODO: cant test checkGapiAuth from GoogleOAuthService because no req/res mock library https://stackoverflow.com/questions/14487809/how-to-mock-request-and-response-in-nodejs-to-test-middleware-controllers 
            //checkGapiAuth -- check to make sure user is getting denied
            done();
        });
    });
    describe('checkForUsersToken', function (){
        it('expect error because no token is associted with AuthUID', function(done) {
            //checkForUsersToken -- expect error No Token file: Login Required.
            new GoogleOAuthService(new GoogleAuth(), config.credentialsConfig.google).checkForUsersToken('asd123')
            .then()
            .catch(err => {
                expect(err).to.be.a('string');
                expect(err).to.equal('No Token file: Login Required.');
                done();
            });
        });
    });
    describe('getUserAuth2Url', function (){
        it('expect url to googles oauth login page', function(done) {
            var url = new GoogleOAuthService(new GoogleAuth(), config.credentialsConfig.google).getUserAuth2Url()
            expect(url).to.be.a('string').to.include('https://accounts.google.com/o/oauth2/v2/auth?');
            done();
        });
    });
    describe('getTokenFromCode', function (){
        it('expect error because code is not valid', function(done) {
            //getTokenFromCode -- expect error that codeis bad
            new GoogleOAuthService(new GoogleAuth(), config.credentialsConfig.google).getTokenFromCode("asdb1234")
            .then()
            .catch(err => {
                expect(err).to.be.a('string');
                expect(err).to.equal('Error retrieving access token Error: invalid_grant');
                done();
            });
        });
    });
});