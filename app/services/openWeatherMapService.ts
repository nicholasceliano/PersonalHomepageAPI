import request = require('request');

export class OpenWeatherMapService {

  constructor(private config: APIConfig) {}

  public getCurrentWeatherByLocation(lat: string, lon: string): Promise<WeatherData> {
      return new Promise((resolve, reject) => {
        request.get(`${this.config.APIUri}/weather?lat=${lat}&lon=${lon}&APPID=${this.config.APIKey}`, 
        (err, res, body) => {
          if (err) reject('The API returned an error: ' + err);
          
          var json = JSON.parse(body);
          var weatherData: WeatherData = this.BuildWeatherData(json);

          this.GetForecastWeatherData(lat, lon).then((forecastResp:WeatherData[]) => {
            weatherData.forecast = forecastResp
            resolve(weatherData);
          }).catch((forecastErr) => {
            reject('The API returned an error: ' + forecastErr);
          });
        });
      });
  }

  private GetForecastWeatherData(lat, lon): Promise<WeatherData[]> {
    return new Promise((resolve, reject) => {
      request.get(`${this.config.APIUri}/forecast?lat=${lat}&lon=${lon}&APPID=${this.config.APIKey}`, 
      (err, res, body) => {
        if (err) reject('The API returned an error: ' + err);
  
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
      rain3h: e.rain != undefined &&  e.rain['3h'] ? parseFloat(e.rain['3h'].toFixed(2)) : 0,
      snow3h: e.snow != undefined &&  e.snow['3h'] ? parseFloat(e.snow['3h'].toFixed(2)) : 0,
      windSpeed: this.ConvertMeterPerSecondToMPH(e.wind.speed), 
      windDir: this.ConvertDregeeToCompass(e.wind.deg),
      forecast: undefined
    };
  }

  private ConvertKelvinToFahrenheit(K: number) {
    return Math.round((K - 273.15) * 9/5 + 32);
  }

  private ConvertDregeeToCompass(D: number) {
    var val= (( 244.501/22.5)+.5);
    var array =["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return array[Math.floor(val)];
  }

  private ConvertMeterPerSecondToMPH(mps: number) {
    return Math.round(mps * 2.237);
  }
}