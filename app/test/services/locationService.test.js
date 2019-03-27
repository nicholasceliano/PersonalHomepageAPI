var expect = require('chai').expect;
var LocationService = require('../../../build/services/locationService').LocationService;
var HelperService = require('../../../build/services/helperService').HelperService;
var config = require('../../../build/config')

describe('LocationService', function () {
    describe('getAddressFromCoords', function (){
        it('should have the correct address info', function () {
            return new LocationService(config.credentialsConfig.openStreetMap, 
                new HelperService()).getAddressFromCoords(37.227029, -80.421044).then((res) => {
                     expect(res.city).to.equal('Blacksburg');
                     expect(res.country).to.equal('USA');
                     expect(res.county).to.equal('Montgomery County');
                     expect(res.state).to.equal('Virginia');
                     expect(res.state_abbr).to.equal('VA');
                     expect(res.postcode).to.equal('24061-9517');
                     expect(res).be.an('object');
                }).catch((err) => {
                    expect(err).to.contain('The API returned an error: ');
                });
        });
    });
});