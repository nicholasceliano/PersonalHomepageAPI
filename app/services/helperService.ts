export class HelperService {
    public getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }
}