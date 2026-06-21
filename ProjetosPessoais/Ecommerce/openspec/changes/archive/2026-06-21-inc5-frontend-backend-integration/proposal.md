## Why

The CRYS backend is feature-complete through Inc 4 — a Spring Boot microservice stack behind a single API gateway (`:8080`) with a real product catalog, async order saga, CQRS read side, notifications, JWT auth, and distributed tracing. The frontend is still a **static React 18 prototype** (CDN React + in-browser Babel, no build tooling) that renders entirely from a hardcoded mock catalog (`data.js → window.CRYS_PRODUCTS`): no HTTP client, no routing, no auth, no checkout, no order tracking. This increment closes the loop — wiring the storefront to the live gateway so a user can browse → cart → login → checkout → track an order to CONFIRMED/CANCELLED.

## What Changes

- **BREAKING (frontend build)**: Migrate the storefront from the CDN/Babel prototype to **Vite + React + TypeScript** with real npm dependencies, `.env`-driven config (`VITE_API_BASE_URL`), and a build/dev toolchain. Reuse existing CSS tokens (`frontend/styles.css`, `frontend/tokens/`) and component visual design.
- Add a thin `apiClient` (axios) with an auth interceptor (`Authorization: Bearer`) and normalized error handling (401/404/422/429/network).
- Replace the hardcoded mock catalog with live gateway calls: list (`GET /api/catalog/products` with `strainType` filter + pagination) and detail (`GET /api/catalog/products/{slug}`).
- Add **demo authentication**: an explicit login page that mints a demo JWT via `POST /api/auth/token {subject}`, a `localStorage` token store, and route guards. Clearly labelled as demo-only auth.
- Add a **checkout** flow that drives the order saga: `POST /api/orders {productSlug, quantity}` → handle `202 {id,status:PENDING}`.
- Add an **order-tracking** page that polls `GET /api/order-views/{id}` (CQRS read model) for status + reason + step timeline, stopping on a terminal state (CONFIRMED/CANCELLED).
- Add client-side routing (`/`, `/product/:slug`, `/checkout`, `/orders/:id`, `/login`) and a cart persisted in `localStorage`.
- Remove the CDN prototype (`frontend/ui_kits/...`) once parity is confirmed.

## Capabilities

### New Capabilities
- `storefront-catalog`: Browse the live product catalog from the gateway — list with strain-type filter + pagination, product detail by slug, loading/empty/error states.
- `storefront-auth`: Demo JWT auth — login page, token mint via `POST /api/auth/token`, `localStorage` token store, `Authorization` interceptor, route guards, 401 handling.
- `storefront-checkout`: Cart and authenticated checkout — add to cart, place order via `POST /api/orders`, handle `202 PENDING` and validation/stock errors.
- `storefront-order-tracking`: Live order-status tracking via the CQRS read model — poll `GET /api/order-views/{id}`, render status + reason + timeline, stop on terminal state.

### Modified Capabilities
<!-- None. The backend is a fixed contract for this increment; no backend specs change. The storefront is a new (additive) frontend capability set; the existing CDN prototype is replaced, not a spec. -->

## Impact

- **Code**: Frontend only — full rewrite under `frontend/` (Vite/React/TS app). No backend or infra change; the storefront is a backward-compatible consumer of the existing gateway API.
- **Build/Deps**: New `package.json` toolchain (Vite, React, TypeScript, react-router, axios, a data-fetch/polling layer — React Query candidate, decided in design). Removes the CDN/Babel prototype after parity.
- **Config**: New `.env` with `VITE_API_BASE_URL=http://localhost:8080/api`.
- **APIs consumed** (no change to them): `GET /api/catalog/products`, `GET /api/catalog/products/{slug}`, `POST /api/auth/token`, `POST /api/orders`, `GET /api/orders/{id}`, `GET /api/order-views/{id}`, `GET /api/notifications?orderId=`.
- **Non-goals (this increment)**: real identity provider (keep demo token mint), SSR, payment UI, mobile app, i18n beyond existing BRL formatting, backend changes of any kind.
