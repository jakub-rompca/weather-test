export type WeatherApiData = {
  temperature: number;
  windSpeed: number;
  cloudCover: number;
};

export type PreciseLocation = {
  latitude: number;
  longitude: number;
};

export type PreciseTime = {
  date: string;
  hour: number;
};

export type WeatherApiHourResponse = {
  time: string;
  temp_c: number;
  wind_kph: number;
  cloud: number;
};

export type WeatherApiDayResponse = {
  date: string;
  hour: WeatherApiHourResponse[];
};

export type WeatherApiResponse = {
  forecast: {
    forecastday: WeatherApiDayResponse[];
  };
};
