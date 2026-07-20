export type WeatherCondition = 'sunny' | 'cloudy' | 'rain' | 'storm';

export type WeatherDay = {
  date: string;
  condition: WeatherCondition;
  high: number;
  low: number;
  rainChance: number;
  humidity: number;
};

/** Normalized weather model returned by the GreenMind server, not OpenWeather's raw payload. */
export type WeatherSnapshot = {
  provider: 'openweather';
  fetchedAt: string;
  current: {
    condition: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    cloudCover: number;
    rainfall: number;
    rainChance: number;
    windSpeed: number;
    uvIndex: number | null;
    sunrise: string;
    sunset: string;
    alerts: Array<{ title: string; description: string }>;
  };
  daily: WeatherDay[];
};

export type GardeningWeatherAdvice = {
  title: string;
  detail: string;
  level: 'info' | 'warning' | 'success';
};
