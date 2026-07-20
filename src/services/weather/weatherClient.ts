import { apiClient } from '@/services/api';
import { requestCache } from '@/services/utils';
import type { GardeningWeatherAdvice, WeatherSnapshot } from './types';

const WEATHER_TTL_MS = 10 * 60 * 1_000;

/** Calls the GreenMind server proxy; the OpenWeather key never reaches the browser. */
export const weatherClient = {
  getForecast(latitude: number, longitude: number, signal?: AbortSignal) {
    const key = `weather:${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
    return requestCache.getOrLoad(key, WEATHER_TTL_MS, () =>
      apiClient.request<WeatherSnapshot>(
        `/api/weather/forecast?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
        { timeoutMs: 12_000, retryCount: 2, signal },
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
