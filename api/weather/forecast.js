import {
  enforceRateLimit,
  fetchWithTimeout,
  methodNotAllowed,
  readCoordinate,
  sendJson,
} from '../_lib/http.js';

function formatTime(unixSeconds, offsetSeconds) {
  if (!unixSeconds) return 'Unavailable';
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date((unixSeconds + (offsetSeconds ?? 0)) * 1_000));
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

function normalize(payload) {
  const current = payload.current ?? {};
  return {
    provider: 'openweather',
    fetchedAt: new Date().toISOString(),
    current: {
      condition: current.weather?.[0]?.description ?? 'Current conditions',
      temperature: Math.round(current.temp ?? 0),
      feelsLike: Math.round(current.feels_like ?? current.temp ?? 0),
      humidity: Math.round(current.humidity ?? 0),
      rainfall: Number(current.rain?.['1h'] ?? 0),
      windSpeed: Math.round((current.wind_speed ?? 0) * 3.6),
      uvIndex: Number.isFinite(current.uvi) ? Number(current.uvi) : null,
      sunrise: formatTime(current.sunrise, payload.timezone_offset),
      sunset: formatTime(current.sunset, payload.timezone_offset),
      alerts: (payload.alerts ?? []).slice(0, 3).map((alert) => ({
        title: String(alert.event ?? 'Weather alert'),
        description: String(alert.description ?? '').slice(0, 500),
      })),
    },
    daily: (payload.daily ?? []).slice(0, 7).map((day) => ({
      date: new Date((day.dt + (payload.timezone_offset ?? 0)) * 1_000)
        .toISOString()
        .slice(0, 10),
      condition: condition(day.weather),
      high: Math.round(day.temp?.max ?? 0),
      low: Math.round(day.temp?.min ?? 0),
      rainChance: Math.round((day.pop ?? 0) * 100),
      humidity: Math.round(day.humidity ?? 0),
    })),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!enforceRateLimit(req, res, 'weather', 90, 60_000)) return;
  if (!process.env.OPENWEATHER_API_KEY) {
    return sendJson(res, 503, {
      error: {
        message:
          'Weather is not connected. Add OPENWEATHER_API_KEY to your server environment.',
      },
    });
  }
  try {
    const latitude = readCoordinate(req.query.lat, 'lat', -90, 90);
    const longitude = readCoordinate(req.query.lon, 'lon', -180, 180);
    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      units: 'metric',
      exclude: 'minutely,hourly',
      appid: process.env.OPENWEATHER_API_KEY,
    });
    const upstream = await fetchWithTimeout(
      `https://api.openweathermap.org/data/3.0/onecall?${params}`,
      {},
      12_000,
    );
    if (!upstream.ok) {
      return sendJson(res, upstream.status === 401 ? 502 : upstream.status, {
        error: {
          message:
            'OpenWeather could not provide a forecast. Check the server key and One Call subscription.',
        },
      });
    }
    return sendJson(res, 200, normalize(await upstream.json()));
  } catch (error) {
    return sendJson(res, 400, {
      error: {
        message:
          error instanceof Error ? error.message : 'Weather request failed.',
      },
    });
  }
}
