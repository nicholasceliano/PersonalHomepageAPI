import request = require('request');

export class OpenWeatherMapService {

  constructor(private config: APIConfig) {}

  public getCurrentWeatherByLocation(lat: number, lon: number): Promise<WeatherData> {
      return new Promise((resolve, reject) => {
        request.get(`${this.config.APIUri}/weather?lat=${lat}&lon=${lon}&APPID=${this.config.APIKey}`, 
        (err, res, body) => {
          if (err) return reject(err);
          
          var json = JSON.parse(body);
          var weatherData: WeatherData = this.BuildWeatherData(json);

          this.GetForecastWeatherData(lat, lon).then((forecastResp:WeatherData[]) => {
            weatherData.forecast = forecastResp
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
  
        var json = JSON.parse(body);
        var weatherData: WeatherData[] = [];

        json.list.forEach(e => {
          weatherData.push(this.BuildWeatherData(e))
        });
        resolve(weatherData);
      })
    });
  }

  private BuildWeatherData(e:any): WeatherData {
    return {
      date: new Date(0).setUTCSeconds(e.dt),
      humidity: e.main.humidity,
      tempCurr: this.ConvertKelvinToFahrenheit(e.main.temp),
      tempMin: this.ConvertKelvinToFahrenheit(e.main.temp_min),
      tempMax: this.ConvertKelvinToFahrenheit(e.main.temp_max),
      main: e.weather[0].main,
      desc: e.weather[0].description,
      icon: e.weather[0].icon,
      rain3h: e.rain != undefined && e.rain['3h'] ? parseFloat(e.rain['3h'].toFixed(2)) : 0,
      snow3h: e.snow != undefined && e.snow['3h'] ? parseFloat(e.snow['3h'].toFixed(2)) : 0,
      windSpeed: this.ConvertMeterPerSecondToMPH(e.wind.speed), 
      windDir: this.ConvertDegreeToCompass(e.wind.deg),
      forecast: undefined
    };
  }

  private ConvertKelvinToFahrenheit(K: number): number {
    return Math.round((K - 273.15) * 9/5 + 32);
  }

  private ConvertDegreeToCompass(D: number): string {
    if (D < 0) return "Error: Degree must be positive." 
    var val= ((D/22.5)+.5);
    var array =["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return array[Math.floor(val % 16)];
  }

  private ConvertMeterPerSecondToMPH(mps: number): number {
    return Math.round(mps * 2.237);
  }
}