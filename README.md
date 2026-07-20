# GreenMind AI

GreenMind AI is a premium, connected gardening workspace built for AI Build Week. It brings plant recommendations, garden records, visual plant-health screening, care tasks, proactive intelligence, and a specialist AI assistant into one calm, responsive experience.

> The app starts in a safe structured-demo mode. Set up the server routes described in [API_SETUP.md](API_SETUP.md) to enable live provider data without embedding credentials in the browser.

## What it includes

- Connected recommendation-to-garden flow: add a recommendation, create its garden record and starter care tasks, then surface that context in the Diary, Assistant, Analytics, notifications, and Intelligence Hub.
- AI-first product areas: Smart Plant Recommendations, AI Plant Doctor, GreenMind AI Assistant, and the Intelligence Hub.
- Garden workspace: plant profiles, growth diary, care reminders, health history, exports, and responsive analytics.
- Product quality: accessible focus states, keyboard-first global search (`Ctrl` / `Cmd` + `K`), routed navigation, responsive layouts, loading states, offline recovery, toast feedback, light/dark themes, and route-level lazy loading.
- Security foundation: memory-only access tokens, server-ready HttpOnly refresh sessions, protected role-aware routes, inactivity timeout, request retries, client-side rate limits, encrypted session-scoped preferences, strong passwords, and verified image intake.
- Production boundaries for Gemini streaming, OpenWeather, browser geolocation, MapTiler SDK, Perenual plant data, and future plant-vision providers.

## Tech stack

- React 19, TypeScript, Vite, React Router
- Tailwind CSS, Framer Motion, Lucide icons
- React Hook Form, Zustand, Recharts
- ESLint and Prettier

## Getting started

### Prerequisites

Node.js 20+ and npm 10+ are recommended.

```bash
npm install
copy .env.example .env
npm run dev
```

Open the local address displayed by Vite. Run quality checks before shipping:

```bash
npm run lint
npm run build
```

## Environment configuration

Copy [`.env.example`](.env.example) to `.env.local` and configure only public browser values there. Add server-only keys in your deployment host, not Vite.

| Variable                         | Purpose                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`              | Optional API base URL for a future GreenMind backend.                           |
| `VITE_ENABLE_LIVE_SERVICES`      | Enables the production server routes after they are configured.                 |
| `VITE_MAPTILER_API_KEY`          | Domain-restricted public MapTiler browser token.                                |
| `VITE_NOMINATIM_BASE_URL`        | Nominatim geocoding base URL.                                                   |
| `VITE_SESSION_IDLE_TIMEOUT_MS`   | Browser inactivity timeout; the server must independently enforce token expiry. |
| `VITE_MAX_PLANT_IMAGE_UPLOAD_MB` | Maximum browser-side Plant Doctor image intake size (1–20 MB).                  |

`GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, and `PERENUAL_API_KEY` belong only in a server environment (for example, Vercel Environment Variables). Do not expose any of them as `VITE_*` variables. See the beginner-friendly [API setup guide](API_SETUP.md) for exact steps, provider limits, tests, and troubleshooting.

## API integration guide

External integrations live under [`src/services`](src/services), with secure server routes in [`api`](api):

- `weather/` normalizes cached OpenWeather forecasts for UI cards.
- `location/` wraps browser GPS, permission state, reverse lookup, and manual city search.
- `maps/` configures the MapTiler SDK and domain-restricted browser token.
- `ai/` streams provider-neutral events only through `/api/ai/respond`.
- `plants/`, `disease/`, and `marketplace/` define provider-neutral contracts.
- `apiClient.ts` centralizes timeouts, cancellation, offline handling, HTTP errors, and JSON parsing.

## Security architecture

- `src/services/auth` defines the typed login, logout, refresh, and password-change boundary. Access tokens are held only in module memory; a real backend must issue refresh tokens using `Secure`, `HttpOnly`, `SameSite` cookies.
- `src/services/api` provides request and response interceptors, bearer-token attachment, a single refresh retry after `401`, timeouts, offline checks, and idempotent retry behavior.
- `src/services/security` provides input/password validation, client-side rate limiting, image MIME/signature checks plus preview compression, and encrypted session-scoped storage for non-credential preferences.
- `src/features/security` contains the Security Center. Route guards currently support `visitor`, `user`, `premium_user`, `admin`, and `developer` roles.

Client safeguards improve safety and UX, but they do not replace backend controls. Enforce authorization, schema validation, rate limiting, upload scanning, and audit logging again on every API endpoint.

The included `/api/ai/respond`, `/api/weather/forecast`, and `/api/plants/search` routes validate requests, apply basic serverless rate limits, time out upstream calls, and keep provider keys server-only. Before a multi-instance commercial launch, replace the in-memory rate limiter with Redis/Upstash and add your real authenticated user identity to each route.

## Architecture

```text
src/
├── app/                    # Route composition and route-level code splitting
├── components/             # Reusable layout and UI primitives
├── features/               # Feature-owned UI, types, stores, and services
│   ├── recommendations/    # AI recommendation flow
│   ├── garden-diary/       # Garden records, diary, reminders, profiles
│   ├── plant-doctor/       # Image workflow and diagnosis reports
│   ├── assistant/          # Conversational workspace and context contracts
│   └── intelligence-hub/   # Proactive cross-module intelligence
├── hooks/                  # Shared behavior such as connectivity state
├── services/               # Cross-feature search, workflow, platform adapters
├── store/                  # Application-level UI and notification state
└── styles/                 # Global tokens, typography, and focus utilities
```

Feature data flows through small Zustand stores and typed service boundaries. The `workspaceIntegrationService` coordinates recommendation and diagnosis actions with the Garden Diary, reminders, and notifications, so individual pages do not need to know each other’s implementation details.

## Deployment on Vercel

1. Push this repository to GitHub or import it in Vercel.
2. Select the Vite framework preset. The build command is `npm run build`; the output directory is `dist`.
3. Add the environment variables from `.env.example` in Vercel’s project settings. Keep `GEMINI_API_KEY` available only to server-side functions.
4. Deploy. [`vercel.json`](vercel.json) provides an SPA rewrite so direct links such as `/plant-doctor` and `/garden-diary/:id` resolve correctly.

## Screenshots

Add final judging screenshots here before submission:

| Dashboard                        | Plant Doctor                        | Intelligence Hub                        |
| -------------------------------- | ----------------------------------- | --------------------------------------- |
| `docs/screenshots/dashboard.png` | `docs/screenshots/plant-doctor.png` | `docs/screenshots/intelligence-hub.png` |

## License

This project is provided for AI Build Week. Add your preferred open-source or proprietary license before public distribution.

## Contributors

Built by the GreenMind AI team. Contributions should keep the application accessible, modular, and safe with user garden data.
