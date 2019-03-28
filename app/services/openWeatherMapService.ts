import request = require('request');
import { errorConfig } from '../config';

export class OpenWeatherMapService {

  constructor(private config: APIConfig) {}

  public getCurrentWeatherByLocation(lat: number, lon: number): Promise<WeatherData> {
      return new Promise((resolve, reject) => {
        if (!lat.isValidLatitude() || !lon.isValidLongitude()) return reject(errorConfig.latLngMustBeValid);

        request.get(`${this.config.APIUri}/weather?lat=${lat}&lon=${lon}&APPID=${this.config.APIKey}`,
        (err, res, body) => {
          if (err) return reject(err);

          const json = JSON.parse(body);
          const weatherData: WeatherData = this.BuildWeatherData(json);

          this.GetForecastWeatherData(lat, lon).then((forecastResp: WeatherData[]) => {
            weatherData.forecast = forecastResp;
            resolve(weatherData);
          }).catch((forecastErr) => {
            reject(forecastErr);
          });
        });
      });
  }

  private GetForecastWeatherData(lat: number, lon: number): Promise<WeatherData[]> {
    return new Promise((resolve, reject) => {
      request.get(`${this.config.APIUri}/forecast?lat=${lat}&lon=${lon}&APPID=${this.config.APIKey}`,
      (err, res, body) => {
        if (err) return reject(err);

        const json = JSON.parse(body);
        const weatherData: WeatherData[] = [];

        json.list.forEach((e) => {
          weatherData.push(this.BuildWeatherData(e));
        });
        resolve(weatherData);
      });
    });
  }

  private BuildWeatherData(e: any): WeatherData {
    return {
      date: new Date(0).setUTCSeconds(e.dt),
      desc: e.weather[0].description,
      forecast: undefined,
      humidity: e.main.humidity,
      icon: e.weather[0].icon,
      main: e.weather[0].main,
      rain3h: e.rain !== undefined && e.rain['3h'] ? parseFloat(e.rain['3h'].toFixed(2)) : 0,
      snow3h: e.snow !== undefined && e.snow['3h'] ? parseFloat(e.snow['3h'].toFixed(2)) : 0,
      tempCurr: this.ConvertKelvinToFahrenheit(e.main.temp),
      tempMax: this.ConvertKelvinToFahrenheit(e.main.temp_max),
      tempMin: this.ConvertKelvinToFahrenheit(e.main.temp_min),
      windDir: this.ConvertDegreeToCompass(e.wind.deg),
      windSpeed: this.ConvertMeterPerSecondToMPH(e.wind.speed),
    };
  }

  private ConvertKelvinToFahrenheit(K: number): number {
    return Math.round((K - 273.15) * 9 / 5 + 32);
  }

  private ConvertDegreeToCompass(D: number): string {
    if (D < 0) return errorConfig.degreeMustBePositive;
    const val = ((D / 22.5) + .5);
    const array = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return array[Math.floor(val % 16)];
  }

  private ConvertMeterPerSecondToMPH(mps: number): number {
    return Math.round(mps * 2.237);
  }
}
