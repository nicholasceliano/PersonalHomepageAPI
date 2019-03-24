type WeatherData = {
    date: number;
    humidity: number;
    tempCurr: number;
    tempMin: number;
    tempMax: number;
    main: string;
    desc: string;
    icon: string;
    windSpeed: number;
    windDir: string;
    forecast: WeatherData[] | undefined;
  }