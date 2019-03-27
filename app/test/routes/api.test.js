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
        it('returns no err and a list of ...', function(done) {
            done();
        });
    });
    describe('Location', function (){
        it('returns no err and a list of ...', function(done) {
            done();
        });
    });
    describe('Weather', function (){
        it('returns no err and a list of ...', function(done) {
            done();
        });
    });
    describe('Youtube', function (){
        it('returns no err and a list of ...', function(done) {
            done();
        });
    });
});