var app = require('../../../build/app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
chai.use(chaiHttp);

describe('API', function () {
    describe('Currency', function (){
        it('returns no err and a list of stockQuoteData', function(done) {
            chai.request(app).get('/api/currency/stockQuoteData')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(false);
                expect(res.body.msg).to.equal('');
                expect(res.body.data).to.be.an('array');
                done();
            });
        });
    });
    describe('Gmail', function (){
        it('returns an error because no oAuth Token', function(done) {
            chai.request(app).get('/api/gmail/unreadEmails')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal('The API returned an error: googleAuthUID HttpHeader variable missing or malformed.');
                expect(res.body.data).to.be.an('array').that.is.empty;
                done();
            });
        });
        it('returns an error because no oAuth Token', function(done) {
            chai.request(app).get('/api/gmail/unreadEmails')
            .set('Cookie', 'googleAuthUID=11111111-1111-1111-1111-111111111111')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal('The API returned an error: No Token file: Login Required.');
                expect(res.body.data).to.be.an('array').that.is.empty;
                done();
            });
        });
    });
    describe('Location', function (){
        it('returns an err if no lat & lon query parameters', function(done) {
            chai.request(app).get('/api/location/addressFromCoords')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal("The API returned an error: 'lat' and 'lng' query parameters required.");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns an err if lat & lon query parameters are not floats', function(done) {
            chai.request(app).get('/api/location/addressFromCoords?lat=test&lon=test')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal("The API returned an error: 'lat' and 'lng' query parameters must be floating-point numbers.");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns an err if lat or lon query parameters are out of number range', function(done) {
            chai.request(app).get('/api/location/addressFromCoords?lat=190&lon=180')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal("The API returned an error: 'lat' must be between -90 and 90 and 'lng' must be between -180 and 180.");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns an err if lat or lon query parameters are out of and unknown location', function(done) {
            chai.request(app).get('/api/location/addressFromCoords?lat=90&lon=180')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.contains("The API returned an error:");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns data if lat or lon query parameters are valid numbers', function(done) {
            chai.request(app).get('/api/location/addressFromCoords?lat=55.143274&lon=-114.720632')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(false);
                expect(res.body.msg).to.equal('');
                expect(res.body.data).to.an('object');
                expect(res.body.data.city).to.equal('');
                expect(res.body.data.country).to.equal('Canada');
                expect(res.body.data.county).to.equal('Municipal District of Lesser Slave River');
                expect(res.body.data.state).to.equal('Alberta');
                expect(res.body.data.state_abbr).to.equal(undefined);
                expect(res.body.data.postcode).to.equal('');
                done();
            });
        });
    });
    describe('Weather', function (){
        it('returns an err if no lat & lon query parameters', function(done) {
            chai.request(app).get('/api/weather/currentWeather')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal("The API returned an error: 'lat' and 'lng' query parameters required.");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns an err if lat & lon query parameters are not floats', function(done) {
            chai.request(app).get('/api/weather/currentWeather?lat=test&lon=test')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal("The API returned an error: 'lat' and 'lng' query parameters must be floating-point numbers.");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns an err if lat or lon query parameters are out of number range', function(done) {
            chai.request(app).get('/api/weather/currentWeather?lat=190&lon=180')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal("The API returned an error: 'lat' must be between -90 and 90 and 'lng' must be between -180 and 180.");
                expect(res.body.data).to.an('array').that.is.empty;
                done();
            });
        });
        it('returns data if lat or lon query parameters are valid numbers', function(done) {
            chai.request(app).get('/api/weather/currentWeather?lat=90&lon=180')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(false);
                expect(res.body.msg).to.equal('');
                expect(res.body.data).to.an('object');
                expect(res.body.data.date).to.a('number');//epoch time
                expect(res.body.data.humidity).to.a('number');
                expect(res.body.data.tempCurr).to.a('number');
                expect(res.body.data.tempMin).to.a('number');
                expect(res.body.data.tempMax).to.a('number');
                expect(res.body.data.main).to.a('string');
                expect(res.body.data.desc).to.a('string');
                expect(res.body.data.icon).to.a('string');
                expect(res.body.data.rain3h).to.a('number');
                expect(res.body.data.snow3h).to.a('number');
                expect(res.body.data.windSpeed).to.a('number');
                expect(res.body.data.windDir).to.a('string');
                expect(res.body.data.forecast).to.an('Array').that.is.not.empty;
                done();
            });
        });
    });
    describe('Youtube', function (){
        it('returns an error because no oAuth Token', function(done) {
            chai.request(app).get('/api/youtube/subscription')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal('The API returned an error: googleAuthUID HttpHeader variable missing or malformed.');
                expect(res.body.data).to.be.an('array').that.is.empty;
                done();
            });
        });
        it('returns an error because no oAuth Token', function(done) {
            chai.request(app).get('/api/youtube/subscription')
            .set('Cookie', 'googleAuthUID=11111111-1111-1111-1111-111111111111')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json
                expect(res.body.err).to.equal(true);
                expect(res.body.msg).to.equal('The API returned an error: No Token file: Login Required.');
                expect(res.body.data).to.be.an('array').that.is.empty;
                done();
            });
        });
    });
});