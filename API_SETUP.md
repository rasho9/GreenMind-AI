# GreenMind AI API setup

This guide is written for a first API integration. GreenMind starts in safe demo mode, so the existing UI keeps working without any account or key. Real services only turn on after you add keys to the **server environment**.

> Important: anything beginning with `VITE_` is visible in the browser after build. Never put OpenAI, OpenWeather, Perenual, Plant.id, or PlantNet secrets in a `VITE_` variable.

## 1. How the architecture works

```text
Browser UI → /api/* GreenMind server route → Provider API
                       ↑
            server-only environment variables
```

The browser sends typed, validated requests to routes in `api/`. Those routes add the secret key, rate-limit requests, apply a timeout, and return a smaller GreenMind response. This means provider keys cannot be inspected in DevTools or your built JavaScript.

For local browser work, leave `VITE_ENABLE_LIVE_SERVICES=false`. To use real endpoints locally, run `npx vercel dev` from this project so the Vite app and `api/` server routes are available together; sign in if Vercel asks. In Vercel production, add the server variables in **Project → Settings → Environment Variables**, then set `VITE_ENABLE_LIVE_SERVICES=true` for the relevant environment and redeploy.

<!-- Screenshot placeholder: Vercel environment-variable screen -->

## 2. Environment variables

1. Copy `.env.example` to `.env.local` for browser-safe values only.
2. Add non-`VITE_` values to Vercel or your server host, not to `.env.local` that Vite builds into the client.
3. Keep `.env*` out of Git. This repository already ignores it.

| Variable                               | Where it belongs            | Used by                                                                  |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `VITE_ENABLE_LIVE_SERVICES`            | browser build configuration | switches real server calls on (`true`) or keeps demo fallbacks (`false`) |
| `VITE_MAPTILER_API_KEY`                | browser build configuration | interactive MapTiler map only; restrict it to your app domains           |
| `OPENAI_API_KEY`                       | server only                 | `api/ai/respond.js`                                                      |
| `OPENAI_MODEL`                         | server only                 | selected Responses API model; default is `gpt-5.4`                       |
| `OPENWEATHER_API_KEY`                  | server only                 | `api/weather/forecast.js`                                                |
| `PERENUAL_API_KEY`                     | server only                 | `api/plants/search.js`                                                   |
| `MAPTILER_API_KEY`                     | server only, optional       | reserved for future server-only MapTiler operations                      |
| `PLANT_ID_API_KEY`, `PLANTNET_API_KEY` | server only, future         | Plant Doctor provider adapters                                           |

There is deliberately **no** `VITE_OPENAI_API_KEY` or `VITE_OPENWEATHER_API_KEY`. Creating either would leak a secret.

## 3. OpenAI Responses API

- **Official website:** [OpenAI API quickstart](https://platform.openai.com/docs/quickstart/make-your-first-api-request)
- **Purpose:** live GreenMind AI chat, plant-care explanations, planning, weather-aware advice, and future structured recommendation/disease explanations.
- **Cost:** API usage is paid separately from a ChatGPT subscription; see [OpenAI API pricing](https://openai.com/api/pricing/). Limits depend on account tier and model, so check your [Limits page](https://platform.openai.com/settings/organization/limits).

### Create a key

1. Sign in to [OpenAI Platform](https://platform.openai.com/).
2. Create a project and add billing if your selected model requires it.
3. Create a secret key in the project API-key screen.
4. In Vercel, add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` as server environment variables. Never paste the key into the frontend.
5. Set `VITE_ENABLE_LIVE_SERVICES=true`, redeploy, and open **GreenMind AI**.

GreenMind posts to its own `/api/ai/respond` endpoint. The endpoint uses the current Responses API with `stream: true`, 35-second timeout, 12 requests/minute per server instance, input limits, and `store: false`. The browser receives only SSE text events.

Example browser-to-GreenMind request:

```http
POST /api/ai/respond
Content-Type: application/json

{"input":"How should I water balcony tomatoes?","context":[]}
```

Example stream event:

```text
data: {"type":"response.output_text.delta","delta":"Water at the soil line..."}
```

**Test:** ask “How should I water balcony tomatoes?” in GreenMind AI. Text should stream into the existing conversation. With no key or demo mode, the reviewed structured demo answer remains available instead.

Common errors: `503` means `OPENAI_API_KEY` is missing; `502` means the upstream key, model, account, or limit needs checking; `429` means wait for the rate-limit window. The route intentionally never returns the provider key.

<!-- Screenshot placeholder: OpenAI project API-key page -->

## 4. OpenWeather Free Weather APIs

- **Official website:** [Current Weather](https://openweathermap.org/current) and [5 Day / 3 Hour Forecast](https://openweathermap.org/forecast5)
- **Purpose:** current temperature, humidity, pressure, wind, cloud cover, rainfall, sunrise/sunset, rain probability, and a five-day gardening forecast.
- **Cost and quota:** both endpoints work with the standard OpenWeather free plan. They do not require a separate paid subscription.

### Create a key

1. Create an account at [OpenWeather](https://home.openweathermap.org/users/sign_up).
2. In the API-key tab, create or copy a key. No separate paid subscription is needed.
3. Add it to Vercel as `OPENWEATHER_API_KEY`.
4. Turn on `VITE_ENABLE_LIVE_SERVICES=true` and redeploy.

GreenMind calls:

```http
GET /api/weather/forecast?lat=31.5204&lon=74.3587
```

Example normalized response:

```json
{
  "provider": "openweather",
  "current": {
    "temperature": 31,
    "humidity": 68,
    "pressure": 1008,
    "cloudCover": 42,
    "rainfall": 0,
    "rainChance": 8,
    "uvIndex": null
  },
  "daily": [
    {
      "date": "2026-07-20",
      "condition": "sunny",
      "high": 34,
      "low": 27,
      "rainChance": 8,
      "humidity": 55
    }
  ]
}
```

**Test:** open Intelligence Hub, select a location, and refresh. The weather card and five-day forecast use live data when configured; demo data remains when live services are off.

Troubleshooting: `401/502` usually means the key is invalid, newly created, or not active yet; `429` is a provider or GreenMind limit; a timeout is safe to retry. OpenWeather needs coordinates, so use browser GPS or city search first.

<!-- Screenshot placeholder: OpenWeather API-key tab -->

## 5. Location and manual search

- **Official website:** [Browser Geolocation API](https://developer.mozilla.org/docs/Web/API/Geolocation_API)
- **Purpose:** precise coordinates for maps, weather, and recommendations.
- **Cost/limit:** free browser capability; user permission is required.

Click **Detect My Location**. If the browser refuses permission, GreenMind keeps manual city/country inputs available. The browser provides latitude/longitude; reverse lookup uses the existing Nominatim adapter. Location never requires a secret key.

**Test:** use the button on AI Recommendations, allow permission, and confirm country, city, latitude, and longitude appear. Deny permission once to confirm the manual fallback message is clear.

## 6. MapTiler interactive maps

- **Official website:** [MapTiler Cloud pricing](https://www.maptiler.com/cloud/pricing/) and [SDK documentation](https://docs.maptiler.com/sdk-js/)
- **Purpose:** an interactive map with garden marker, pan, zoom, and location context.
- **Cost/quota:** the current Free Cloud plan is for non-commercial/R&D use and includes 5,000 sessions/month or 100,000 API requests/month. It pauses at the free limit. Verify commercial-use terms before launching.

### Create a browser token

1. Create a MapTiler account and make a Cloud API key.
2. Restrict the key to `localhost` for development and your deployed domain for production.
3. Add the restricted key as `VITE_MAPTILER_API_KEY`.
4. Set `VITE_ENABLE_LIVE_SERVICES=true`, restart/redeploy, then generate a recommendation with GPS coordinates.

The key is intentionally browser-visible because MapTiler maps run in the browser; origin restriction is what prevents reuse. Never put an unrestricted secret token in a public app.

**Test:** the recommendation Environment map becomes a real MapTiler map only when the key and coordinates are present. Zoom buttons and the marker remain functional. Without a key, the polished location-preview map remains as the intentional fallback.

## 7. Perenual Plant Database

- **Official website:** [Perenual plant API docs](https://www.perenual.com/docs/api)
- **Purpose:** common/scientific names, images, sunlight, watering, hardiness, and future care-guide enrichment.
- **Cost/quota:** current Personal plan is free with 100 requests/day and access to regular API data. Commercial use and larger catalog access require a paid plan; check [Perenual pricing](https://www.perenual.com/subscription-api-pricing).

### Create a key

1. Create a Perenual account and generate an API key.
2. Add it only as `PERENUAL_API_KEY` in the server environment.
3. Use the typed `plantClient.search` service or call the route below while testing.

```http
GET /api/plants/search?q=tomato&sunlight=full_sun
```

Example response:

```json
[
  {
    "id": "123",
    "commonName": "Tomato",
    "scientificName": "Solanum lycopersicum",
    "sunlight": "full sun",
    "diseases": []
  }
]
```

The server parser returns a provider-neutral `PlantProfile`; provider-specific fields never leak into components. This makes Plant.id, Trefle, or a private catalogue replaceable later.

## 8. Plant Doctor providers

Plant Doctor has no active diagnosis vendor by default. `src/services/disease/` supplies a `PlantDiseaseProvider` interface and registry for OpenAI Vision, Plant.id, PlantNet, or Google Vision. This is deliberate: disease reports should not silently switch from reviewed demo data to a paid medical/agricultural provider.

When you choose a provider, create a server route that accepts validated images, calls the provider with the server key, and maps its response to `PlantDoctorAnalysis`. Keep the existing file checks, size limit, compression, disclaimer, and expert-verification message.

## 9. Testing checklist

1. **Demo mode:** leave `VITE_ENABLE_LIVE_SERVICES=false`; all existing flows should work without any network keys.
2. **Server routes:** run `vercel dev`, set server keys in its environment, then use the route examples above in the browser or an API client.
3. **Weather:** check a known coordinate and verify current temperature + seven days.
4. **OpenAI:** send a short garden question; confirm streamed output and verify the browser source contains no secret.
5. **Map:** confirm domain restriction, marker, zoom, and city coordinate behavior.
6. **Plant data:** search a known plant, verify common/scientific names, and verify provider errors display safely.
7. **Offline:** turn off network; UI must show its existing offline/retry state and no request should hang.

## 10. Provider errors and replacements

| Error           | Meaning                                       | First fix                                  |
| --------------- | --------------------------------------------- | ------------------------------------------ |
| 401 / 502       | key rejected or provider config is incomplete | verify the server variable and plan access |
| 403             | key is restricted or service is forbidden     | review allowed domain/IP/project settings  |
| 404             | wrong route or provider resource              | check the endpoint and query               |
| 429             | GreenMind or provider rate limit              | wait, cache reads, or use a paid tier      |
| timeout/offline | network/provider delay                        | retry after connection returns             |

To replace a provider, keep React components unchanged and replace its client/parser/adapter behind `src/services/<provider>/`. The response contracts are designed so UI code only sees GreenMind types.

<!-- Screenshot placeholder: GreenMind AI streaming response -->
<!-- Screenshot placeholder: live Weather Panel -->
<!-- Screenshot placeholder: MapTiler map with garden marker -->
