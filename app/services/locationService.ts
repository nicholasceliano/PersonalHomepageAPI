import fs = require('fs');
import path = require('path');
import request = require('request');
import { errorConfig, webConfig } from '../config';
import { HelperService } from './helperService';

export class LocationService {

  constructor(private config: APIConfig, private helper: HelperService) {}

  public getAddressFromCoords(lat: number, lon: number): Promise<Address> {
      return new Promise((resolve, reject) => {
        if (!lat.isValidLatitude() || !lon.isValidLongitude()) return reject (errorConfig.latLngMustBeValid);

        request.get({
          headers: { 'User-Agent': webConfig().projectName },
          url: `${this.config.APIUri}reverse?format=json&lat=${lat}&lon=${lon}`,
        },
        (err, res, body) => {
          if (err) return reject(err);

          const json = JSON.parse(body);
          if (json.error) return reject(json.error);

          const stateHashJSON: any = fs.readFileSync(path.join(__dirname, '..', 'data', 'states_hash.json'));
          const statesHash = JSON.parse(stateHashJSON);

          const addressData: Address = {
            city: json.address.city ? json.address.city : (json.address.town ? json.address.town : ''),
            country: json.address.country,
            county: json.address.county,
            postcode: json.address.postcode ? json.address.postcode : '',
            state: json.address.state,
            state_abbr: this.helper.getKeyByValue(statesHash, json.address.state),
          };

          resolve(addressData);
        });
      });
  }
}
