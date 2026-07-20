import {
  enforceRateLimit,
  fetchWithTimeout,
  methodNotAllowed,
  readCoordinate,
  sendJson,
} from '../_lib/http.js';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const isDevelopment = process.env.NODE_ENV !== 'production';

function formatTime(unixSeconds, offsetSeconds) {
  if (!unixSeconds) return 'Unavailable';
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date((unixSeconds + (offsetSeconds ?? 0)) * 1_000));
}

function localDate(unixSeconds, offsetSeconds) {
  return new Date((unixSeconds + (offsetSeconds ?? 0)) * 1_000)
    .toISOString()
    .slice(0, 10);
}

function condition(weather) {
  const main = weather?.[0]?.main?.toLowerCase() ?? '';
  if (main.includes('thunder')) return 'storm';
  if (
    main.includes('rain') ||
    main.includes('drizzle') ||
    main.includes('snow')
  )
    return 'rain';
  if (main.includes('cloud') || main.includes('mist') || main.includes('fog'))
    return 'cloudy';
  return 'sunny';
}

function conditionPriority(value) {
  if (value === 'storm') return 4;
  if (value === 'rain') return 3;
  if (value === 'cloudy') return 2;
  return 1;
}

/** Aggregates OpenWeather's free three-hour intervals into five local days. */
function normalizeDailyForecast(list, offsetSeconds) {
  const byDate = new Map();
  for (const item of list) {
    if (!item || typeof item !== 'object' || !Number.isFinite(item.dt)) continue;
    const date = localDate(item.dt, offsetSeconds);
    const entry = byDate.get(date) ?? {
      date,
      high: -Infinity,
      low: Infinity,
      humidityTotal: 0,
      intervals: 0,
      rainChance: 0,
      condition: 'sunny',
    };
    const high = Number(item.main?.temp_max ?? item.main?.temp);
    const low = Number(item.main?.temp_min ?? item.main?.temp);
    const humidity = Number(item.main?.humidity);
    if (Number.isFinite(high)) entry.high = Math.max(entry.high, high);
    if (Number.isFinite(low)) entry.low = Math.min(entry.low, low);
    if (Number.isFinite(humidity)) entry.humidityTotal += humidity;
    entry.intervals += 1;
    entry.rainChance = Math.max(entry.rainChance, Number(item.pop ?? 0) * 100);
    const nextCondition = condition(item.weather);
    if (conditionPriority(nextCondition) > conditionPriority(entry.condition)) {
      entry.condition = nextCondition;
    }
    byDate.set(date, entry);
  }

  return [...byDate.values()].slice(0, 5).map((day) => ({
    date: day.date,
    condition: day.condition,
    high: Math.round(Number.isFinite(day.high) ? day.high : 0),
    low: Math.round(Number.isFinite(day.low) ? day.low : 0),
    rainChance: Math.round(day.rainChance),
    humidity: Math.round(day.humidityTotal / Math.max(day.intervals, 1)),
  }));
}

function normalize(currentPayload, forecastPayload) {
  if (!currentPayload || typeof currentPayload !== 'object' || !currentPayload.main) {
    throw new Error('Current Weather returned a response without current conditions.');
  }
  if (!forecastPayload || typeof forecastPayload !== 'object' || !Array.isArray(forecastPayload.list)) {
    throw new Error('5 Day Forecast returned a response without forecast intervals.');
  }

  const current = currentPayload;
  const offsetSeconds = Number(forecastPayload.city?.timezone ?? 0);
  const daily = normalizeDailyForecast(forecastPayload.list, offsetSeconds);
  if (!daily.length) {
    throw new Error('5 Day Forecast returned no usable forecast intervals.');
  }

  return {
    provider: 'openweather',
    fetchedAt: new Date().toISOString(),
    current: {
      condition: current.weather?.[0]?.description ?? 'Current conditions',
      temperature: Math.round(current.main.temp ?? 0),
      feelsLike: Math.round(current.main.feels_like ?? current.main.temp ?? 0),
      humidity: Math.round(current.main.humidity ?? 0),
      pressure: Math.round(current.main.pressure ?? 0),
      cloudCover: Math.round(current.clouds?.all ?? 0),
      rainfall: Number(current.rain?.['1h'] ?? current.rain?.['3h'] ?? 0),
      rainChance: Math.round(Number(forecastPayload.list[0]?.pop ?? 0) * 100),
      windSpeed: Math.round((current.wind?.speed ?? 0) * 3.6),
      // UV and government weather alerts are not exposed by these free endpoints.
      uvIndex: null,
      sunrise: formatTime(current.sys?.sunrise, offsetSeconds),
      sunset: formatTime(current.sys?.sunset, offsetSeconds),
      alerts: [],
    },
    daily,
  };
}

async function providerMessage(upstream) {
  try {
    const payload = await upstream.json();
    const message =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : '';
    return message.replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, 400);
  } catch {
    return '';
  }
}

function sendProviderError(res, endpoint, upstreamStatus, detail) {
  const publicMessage =
    upstreamStatus === 401
      ? 'OpenWeather rejected the configured server key for its free Current Weather or 5 Day Forecast API.'
      : upstreamStatus === 429
        ? 'OpenWeather is rate-limiting weather requests. Please wait a moment and retry.'
        : 'OpenWeather could not provide weather data. Please try again shortly.';
  console.error('[weather/forecast] OpenWeather rejected request', {
    endpoint,
    upstreamStatus,
    detail: detail || 'No provider error message was returned.',
  });
  return sendJson(res, upstreamStatus === 401 ? 502 : upstreamStatus, {
    error: {
      message:
        isDevelopment && detail
          ? `${publicMessage} Provider response: ${detail}`
          : publicMessage,
      provider: 'openweather',
      endpoint,
      upstreamStatus,
    },
  });
}

function logRouteFailure(error) {
  // Vercel captures console.error in function logs. Keep the full stack there,
  // while the API response remains safe for the browser.
  if (error instanceof Error) {
    console.error('[weather/forecast] route failure', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return;
  }
  console.error('[weather/forecast] route failure', error);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!enforceRateLimit(req, res, 'weather', 90, 60_000)) return;
  if (!process.env.OPENWEATHER_API_KEY) {
    console.error('[weather/forecast] OPENWEATHER_API_KEY is not configured.');
    return sendJson(res, 503, {
      error: {
        message:
          'Weather is not connected. Add OPENWEATHER_API_KEY to your server environment.',
      },
    });
  }

  let latitude;
  let longitude;
  try {
    latitude = readCoordinate(req.query.lat, 'lat', -90, 90);
    longitude = readCoordinate(req.query.lon, 'lon', -180, 180);
  } catch (error) {
    return sendJson(res, 400, {
      error: {
        message:
          error instanceof Error ? error.message : 'Weather coordinates are invalid.',
      },
    });
  }

  try {
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      units: 'metric',
      appid: process.env.OPENWEATHER_API_KEY,
    });
    const [currentResponse, forecastResponse] = await Promise.all([
      fetchWithTimeout(`${OPENWEATHER_BASE_URL}/weather?${params}`, {}, 12_000),
      fetchWithTimeout(`${OPENWEATHER_BASE_URL}/forecast?${params}`, {}, 12_000),
    ]);
    if (!currentResponse.ok) {
      return sendProviderError(
        res,
        'current-weather',
        currentResponse.status,
        await providerMessage(currentResponse),
      );
    }
    if (!forecastResponse.ok) {
      return sendProviderError(
        res,
        'five-day-forecast',
        forecastResponse.status,
        await providerMessage(forecastResponse),
      );
    }

    const [currentPayload, forecastPayload] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);
    return sendJson(res, 200, normalize(currentPayload, forecastPayload));
  } catch (error) {
    logRouteFailure(error);
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return sendJson(res, isTimeout ? 504 : 502, {
      error: {
        message: isTimeout
          ? 'OpenWeather took too long to respond. Please try again.'
          : 'Weather data could not be processed. Please try again.',
      },
    });
  }
}
