import { apiClient } from '@/services/api';
import { isDemoMode, withDemoFallback } from '@/services/demo';
import { requestCache } from '@/services/utils';
import type {
  GardeningWeatherAdvice,
  WeatherCondition,
  WeatherSnapshot,
} from './types';

const WEATHER_TTL_MS = 10 * 60 * 1_000;

function demoDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

/** Deterministic local weather used when live services are disabled or unavailable. */
export function createDemoWeatherSnapshot(
  latitude: number,
  longitude: number,
): WeatherSnapshot {
  const isWarm = Math.abs(latitude) < 36;
  const isCoastalOrHumid =
    Math.abs(longitude) > 65 && Math.abs(longitude) < 145;
  const temperature = isWarm ? 31 : 21;
  const humidity = isCoastalOrHumid ? 68 : 54;
  const conditions: WeatherCondition[] = [
    'cloudy',
    'sunny',
    'storm',
    'rain',
    'cloudy',
    'sunny',
    'sunny',
  ];
  return {
    provider: 'demo',
    fetchedAt: new Date().toISOString(),
    current: {
      condition: humidity >= 65 ? 'Clouds building' : 'Partly cloudy',
      temperature,
      feelsLike: temperature + 2,
      humidity,
      pressure: 1008,
      cloudCover: humidity >= 65 ? 58 : 28,
      rainfall: humidity >= 65 ? 1.4 : 0,
      rainChance: humidity >= 65 ? 28 : 12,
      windSpeed: 14,
      uvIndex: isWarm ? 8 : 5,
      sunrise: '05:12',
      sunset: '19:19',
      alerts: [],
    },
    daily: conditions.map((condition, index) => ({
      date: demoDate(index),
      condition,
      high: temperature + [0, 3, 1, -2, -1, 2, 3][index],
      low: temperature - [7, 6, 5, 8, 8, 6, 5][index],
      rainChance: [24, 12, 68, 56, 30, 14, 10][index],
      humidity: Math.max(
        43,
        Math.min(86, humidity + [0, -5, 10, 6, 2, -4, -7][index]),
      ),
    })),
  };
}

/** Calls the server proxy when available and otherwise returns the demo snapshot. */
export const weatherClient = {
  getForecast(latitude: number, longitude: number, signal?: AbortSignal) {
    const demoSnapshot = () => createDemoWeatherSnapshot(latitude, longitude);
    if (isDemoMode()) return Promise.resolve(demoSnapshot());
    const key = `weather:${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
    return requestCache.getOrLoad(key, WEATHER_TTL_MS, () =>
      withDemoFallback(
        () =>
          apiClient.request<WeatherSnapshot>(
            `/api/weather/forecast?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
            { timeoutMs: 12_000, retryCount: 2, signal },
          ),
        demoSnapshot,
      ),
    );
  },
};

/** Deterministic, inspectable advice used by the Hub and assistant context. */
export function getGardeningWeatherAdvice(
  snapshot: WeatherSnapshot,
): GardeningWeatherAdvice[] {
  const advice: GardeningWeatherAdvice[] = [];
  const { current, daily } = snapshot;
  if (
    current.rainfall > 0 ||
    daily.slice(0, 2).some((day) => day.rainChance >= 60)
  ) {
    advice.push({
      title: 'Rain adjustment recommended',
      detail:
        'Check soil before watering; forecast rain may replace one planned watering cycle.',
      level: 'info',
    });
  }
  if (
    current.temperature >= 32 ||
    daily.slice(0, 2).some((day) => day.high >= 34)
  ) {
    advice.push({
      title: 'High heat care window',
      detail:
        'Water containers early and protect recently planted foliage from afternoon heat.',
      level: 'warning',
    });
  }
  if (current.humidity >= 75) {
    advice.push({
      title: 'Keep leaves dry',
      detail:
        'Humidity is elevated, so improve airflow and avoid overhead watering where possible.',
      level: 'warning',
    });
  }
  return advice;
}
