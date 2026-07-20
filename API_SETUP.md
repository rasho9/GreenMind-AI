# GreenMind AI API setup

This guide explains how to connect GreenMind AI to live providers without placing secrets in the browser.

> Anything beginning with `VITE_` is bundled into the browser. Never put Gemini, OpenWeather, Perenual, Plant.id, or PlantNet secrets in a `VITE_` variable.

## 1. Architecture

```text
Browser UI -> /api/* GreenMind server route -> Provider API
                        ^
             server-only environment variables
```

The browser calls typed GreenMind routes. Each route owns its provider key, input validation, rate limit, timeout, and error mapping. Provider secrets are never present in the built frontend bundle.

GreenMind starts in professional Demo Mode with `VITE_ENABLE_LIVE_SERVICES=false`. For local live API testing, run `npx vercel dev` so Vercel serves both Vite and the `api/` server routes. In production, add server variables under **Vercel Project Settings > Environment Variables**, set `VITE_ENABLE_LIVE_SERVICES=true`, and redeploy. If a live provider is missing, rate-limited, or unavailable, the feature returns its structured local demo data without exposing provider errors to users.

<!-- Screenshot placeholder: Vercel environment-variable screen -->

## 2. Environment variables

1. Copy `.env.example` to `.env.local` for browser-safe values only.
2. Add non-`VITE_` values to Vercel or your server host; do not put them in a Vite build file.
3. Keep `.env*` files out of Git.

| Variable                               | Where it belongs            | Used by                                           |
| -------------------------------------- | --------------------------- | ------------------------------------------------- |
| `VITE_ENABLE_LIVE_SERVICES`            | Browser build configuration | Enables secure live calls; `false` uses Demo Mode |
| `VITE_MAPTILER_API_KEY`                | Browser build configuration | Domain-restricted MapTiler map token              |
| `GEMINI_API_KEY`                       | Server only                 | `api/ai/respond.js`                               |
| `GEMINI_MODEL`                         | Server only                 | Gemini model; defaults to `gemini-2.5-flash`      |
| `OPENWEATHER_API_KEY`                  | Server only                 | `api/weather/forecast.js`                         |
| `PERENUAL_API_KEY`                     | Server only                 | `api/plants/search.js`                            |
| `MAPTILER_API_KEY`                     | Server only, optional       | Future server-side map operations                 |
| `PLANT_ID_API_KEY`, `PLANTNET_API_KEY` | Server only, optional       | Future specialist diagnosis adapters              |

There is deliberately no `VITE_GEMINI_API_KEY` or `VITE_OPENWEATHER_API_KEY`.

## 3. Gemini API

- **Official website:** [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- **Purpose:** GreenMind AI chat, plant-care explanations, garden planning, structured recommendations, diary observations, and Plant Doctor vision analysis.
- **Cost:** Gemini models have distinct free and paid quotas. Review [Gemini API pricing and limits](https://ai.google.dev/gemini-api/docs/pricing) before production use.

### Create a Gemini key

1. Sign in to [Google AI Studio](https://aistudio.google.com/apikey).
2. Create an API key for the Gemini Developer API.
3. In Vercel, create `GEMINI_API_KEY` with that value for the environments you deploy.
4. Optionally create `GEMINI_MODEL=gemini-2.5-flash`. This is also the route default.
5. Set `VITE_ENABLE_LIVE_SERVICES=true` for the frontend environment and redeploy.

GreenMind uses the official `@google/genai` SDK only in `api/ai/respond.js`. The route invokes `generateContentStream`, keeps the 12 requests/minute server rate limit, validates text/image input, forwards system instructions and conversation history, and translates Gemini chunks to the existing SSE contract. The frontend continues calling `/api/ai/respond` and receives no provider key.

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

**Test:** ask GreenMind AI how to water balcony tomatoes. Text should stream into the existing conversation. When the live route cannot be used, the assistant deliberately continues with structured local demo guidance; no provider credential details are exposed.

**Common errors:** `503` means `GEMINI_API_KEY` is missing, `502` means the key/model/account needs checking, and `429` means wait for the rate-limit window. The route never returns the provider key.

<!-- Screenshot placeholder: Google AI Studio API-key page -->

## 4. OpenWeather Free Weather APIs

- **Official website:** [Current Weather](https://openweathermap.org/current) and [5 Day / 3 Hour Forecast](https://openweathermap.org/forecast5)
- **Purpose:** current temperature, humidity, pressure, wind, cloud cover, rainfall, sunrise/sunset, rain probability, and five-day gardening forecasts.
- **Cost:** both endpoints work with the standard OpenWeather free plan.

1. Create an account at [OpenWeather](https://home.openweathermap.org/users/sign_up).
2. Copy an API key from the API-key page.
3. Add it to Vercel as `OPENWEATHER_API_KEY`.
4. Enable live services and redeploy.

GreenMind calls:

```http
GET /api/weather/forecast?lat=31.5204&lon=74.3587
```

**Test:** open Intelligence Hub, select a location, and refresh. A live configuration populates the current weather card and five-day forecast. Invalid, inactive, rate-limited, or unavailable providers return the normalized local demo forecast instead.

## 5. Location and maps

Browser geolocation is free and requires the user’s permission. If denied, GreenMind keeps manual city/country inputs available. Reverse lookup uses Nominatim with the existing browser-safe base URL.

For interactive maps, create a MapTiler key at [MapTiler Cloud](https://www.maptiler.com/cloud/), restrict it to localhost and your deployed domains, then set `VITE_MAPTILER_API_KEY`. It is browser-visible by design, so domain restriction is required.

## 6. Perenual Plant Database

- **Official website:** [Perenual API documentation](https://www.perenual.com/docs/api)
- **Purpose:** common/scientific names, images, sunlight, watering, hardiness, and care-guide enrichment.

Create a key in Perenual, add it as `PERENUAL_API_KEY` in the server environment, then test:

```http
GET /api/plants/search?q=tomato&sunlight=full_sun
```

The route returns a provider-neutral `PlantProfile`, so components remain independent of Perenual.

## 7. Plant Doctor providers

Plant Doctor sends validated images to the secure Gemini route for live structured vision analysis. `src/services/disease/` also exposes provider-neutral contracts for Gemini Vision, Plant.id, PlantNet, and Google Vision, allowing a specialist provider to be added later without exposing keys or provider objects to React.

## 8. Testing checklist

1. Run `npm install`, then `npm run lint` and `npm run build`.
2. Run `npx vercel dev` with server variables available to Vercel Dev.
3. Send a short garden question and confirm streamed text from `/api/ai/respond`.
4. Check a known coordinate in Intelligence Hub and confirm live weather data.
5. Search a known plant and verify common/scientific names.
6. Turn off network and confirm the AI, weather, plant, and recommendation experiences continue with their structured local demo data.

## 9. Provider errors and replacements

| Error           | Meaning                                              | First fix                                             |
| --------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| 401 / 502       | Key rejected or provider configuration is incomplete | Verify the server variable, model, and account access |
| 403             | Key, model, or service is forbidden                  | Review project permissions and model availability     |
| 404             | Wrong route or provider resource                     | Check the endpoint and query                          |
| 429             | GreenMind or provider rate limit                     | Wait, cache reads, or use a suitable paid tier        |
| Timeout/offline | Network or provider delay                            | Retry after connectivity returns                      |

To replace a provider in future, preserve React components and the GreenMind route contract, then change only the server-side adapter and parser.

<!-- Screenshot placeholder: GreenMind AI streaming response -->
<!-- Screenshot placeholder: live Weather Panel -->
<!-- Screenshot placeholder: MapTiler map with garden marker -->
