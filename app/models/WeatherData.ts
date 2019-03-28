type WeatherData = {
  date: number;
  humidity: number;
  tempCurr: number;
  tempMin: number;
  tempMax: number;
  main: string;
  desc: string;
  icon: string;
  rain3h: number;
  snow3h: number;
  windSpeed: number;
  windDir: string;
  forecast: WeatherData[] | undefined;
};
