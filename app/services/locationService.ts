import request = require('request');

export class LocationService {

  constructor(private config: APIConfig) {}

  public getAddressFromCoords(lat: string, lon: string): Promise<Address> {
      return new Promise((resolve, reject) => {
        request.get({
            url:`${this.config.APIUri}reverse?format=json&lat=${lat}&lon=${lon}`,
            headers: { 'User-Agent': 'PersonalHomepage' }
        }, 
        (err, res, body) => {
          if (err) reject('The API returned an error: ' + err);
          
          var json = JSON.parse(body);
          var addressData: Address = {
            city: json.address.city ? json.address.city : json.address.town,
            country: json.address.country,
            county: json.address.county,
            state: json.address.state,
            postcode: json.address.postcode
          }

          resolve(addressData);
        });
      });
  }
}