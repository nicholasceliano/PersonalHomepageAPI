// var app = require('../../../build/app');
// var chai = require('chai');
// var chaiHttp = require('chai-http');
// var expect = require('chai').expect;
// chai.use(chaiHttp);

// describe('OAuth', function (){
//     it('returns an error because no oAuth Token', function(done) {
//         chai.request(app).get('/api/youtube/subscription')
//         .then(res => {
//             expect(res).to.have.status(200);
//             expect(res).to.be.json
//             expect(res.body.err).to.equal(true);
//             expect(res.body.msg).to.equal('The API returned an error: googleAuthUID HttpHeader variable missing or malformed.');
//             expect(res.body.data).to.be.an('array').that.is.empty;
//             done();
//         });
//     });
//     it('returns an error because no oAuth Token', function(done) {
//         chai.request(app).get('/api/youtube/subscription')
//         .set('Cookie', 'googleAuthUID=11111111-1111-1111-1111-111111111111')
//         .then(res => {

//             //need to mock the auth Id  in the header
//             expect(res).to.have.status(200);
//             expect(res).to.be.json
//             expect(res.body.err).to.equal(true);
//             expect(res.body.msg).to.equal('The API returned an error: No Token file: Login Required.');
//             expect(res.body.data).to.be.an('array').that.is.empty;
//             done();
//         });
//     });
// });