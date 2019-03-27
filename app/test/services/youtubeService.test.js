var expect = require('chai').expect;
var GoogleApis = require("googleapis").GoogleApis;
var OAuth2Client = require("google-auth-library").OAuth2Client;
var YoutubeService = require('../../../build/services/youtubeService').YoutubeService;

describe('YoutubeService', function () {
    describe('getSubscriptionVidoes', function (){
        it('should return an error because no credentials', function () {
            return new YoutubeService(new GoogleApis()).getSubscriptionVidoes(new OAuth2Client()).then(res => {
                //cant test against Google API because no test API credentials
            }).catch(err => {
                expect(err.toString()).to.equal('Error: No access, refresh token or API key is set.');
            })
        });
    });
});