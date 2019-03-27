import request = require('request');
import fs = require('fs');
import { HelperService } from './helperService';
import path = require('path');

export class LocationService {

  constructor(private config: APIConfig,
    private helper: HelperService) {}

  public getAddressFromCoords(lat: number, lon: number): Promise<Address> {
      return new Promise((resolve, reject) => {
        request.get({
            url:`${this.config.APIUri}reverse?format=json&lat=${lat}&lon=${lon}`,
            headers: { 'User-Agent': 'PersonalHomepage' }
        }, 
        (err, res, body) => {
          if (err) return reject(err);
          
          var json = JSON.parse(body);
          if (json.error) return reject(json.error);
          
          var stateHashJSON: any = fs.readFileSync(path.join(__dirname, '..', 'data', 'states_hash.json'));
          var statesHash = JSON.parse(stateHashJSON);

          var addressData: Address = {
            city: json.address.city ? json.address.city : (json.address.town ? json.address.town : ''),
            country: json.address.country,
            county: json.address.county,
            state: json.address.state,
            state_abbr: this.helper.getKeyByValue(statesHash, json.address.state),
            postcode: json.address.postcode ? json.address.postcode : '' 
          }

          resolve(addressData);
        });
      });
  }
}