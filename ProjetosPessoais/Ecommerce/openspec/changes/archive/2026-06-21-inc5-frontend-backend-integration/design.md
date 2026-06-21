## Context

The CRYS backend is feature-complete through Inc 4: a Spring Boot microservice stack (order saga, inventory, payment, notifications, CQRS read model) behind a single Spring Cloud Gateway at `http://localhost:8080/api` with CORS `*`, Redis rate limiting (10/s per IP), HS256 JWT auth, and distributed tracing. The backend is a **fixed contract for this increment — no backend changes**.

The frontend is a static React 18 prototype at `frontend/ui_kits/storefront/`: CDN React + in-browser Babel, no build tooling, rendering from a hardcoded mock catalog (`data.js → window.CRYS_PRODUCTS`). It has no HTTP client, routing, auth, checkout, or order tracking. This increment rebuilds the storefront as a real SPA and wires it to the live gateway, reusing the existing visual design (CSS tokens in `frontend/styles.css`, `frontend/tokens/`).

## Goals / Non-Goals

**Goals:**
- Replace the CDN/Babel prototype with a Vite + React + TypeScript SPA with real npm tooling and `.env` config.
- Render the live catalog (list + detail) from the gateway, with filter, pagination, and loading/empty/error states.
- Demo authentication: login page → `POST /api/auth/token`, token store, `Authorization` interceptor, route guards, 401 handling.
- Authenticated checkout that drives the order saga (`POST /api/orders` → `202 PENDING`).
- Live order tracking via the CQRS read model (`GET /api/order-views/{id}` polling) with timeline + terminal-state stop.
- Reuse existing CSS tokens and component visual design; preserve BRL price formatting.

**Non-Goals:**
- No backend or infra changes (the gateway API is a consumed contract).
- No real identity provider — keep the demo token mint (no password, no refresh, no roles).
- No SSR / Next.js, no payment UI, no mobile app.
- No i18n beyond the existing BRL formatting.
- No ownership scoping of orders to users (backend stays user-agnostic).

## Decisions

**Vite + React + TypeScript over keeping the CDN prototype.** The prototype cannot do env config, routing, a real HTTP client, or a build step. Vite gives fast dev/HMR, `import.meta.env` for `VITE_API_BASE_URL`, and TS for typing the DTOs. Alternatives rejected: keep CDN/Babel (no tooling/env/routing); Next.js (SSR + server runtime is overkill for a client-only portfolio SPA that talks to a separate gateway).

**axios + a thin `apiClient` wrapper over raw fetch.** A single axios instance carries `baseURL = VITE_API_BASE_URL`, a request interceptor that attaches `Authorization: Bearer <token>` when present, and a response interceptor that normalizes errors (401/404/422/429/network) into a typed shape and triggers logout+redirect on 401. Raw fetch rejected: would re-implement interceptors and error normalization by hand.

**React Query (TanStack Query) for catalog reads and order-view polling over plain hooks.** Catalog gets caching + request dedup; order tracking uses `refetchInterval` with a function that returns `false` on terminal state to stop polling, and `retry` tolerance so an early `404` (projection lag) keeps polling instead of erroring. Plain `useEffect` hooks rejected: hand-rolling cache, dedup, and interval-stop logic is more error-prone than the library's built-ins.

**react-router for client routing.** Routes: `/` (catalog), `/product/:slug` (detail), `/checkout`, `/orders/:id` (tracking), `/login`. `/checkout` and `/orders/:id` sit behind a guard component that redirects to `/login` when no token is present.

**Token in `localStorage` (demo) over httpOnly cookie.** The backend demo mint (`POST /api/auth/token`) returns a JWT in a JSON body with no `Set-Cookie` path, and the SPA + gateway are cross-origin with CORS `*`. `localStorage` is the pragmatic demo fit. httpOnly cookie rejected: backend has no cookie/session endpoint and it would require backend changes (out of scope). The XSS exposure is documented and accepted as demo-only.

**Polling cadence ~1.5s, stop on terminal.** `GET /api/order-views/{id}` is polled every ~1.5s; the interval callback returns `false` once `status ∈ {CONFIRMED, CANCELLED}`. Leaving the tracking page unmounts the query and stops polling. This bounds gateway load against the 10/s rate limit.

**Migrate in place under `frontend/`, scaffold alongside first.** Build the Vite app next to the existing `ui_kits/` prototype, port components to TSX reusing the CSS tokens, wire APIs incrementally (catalog → auth → checkout → tracking), and delete the prototype only after parity is confirmed.

## Risks / Trade-offs

- **`localStorage` token → XSS token theft** → Documented as demo-only; no real credentials or PII involved; a production build would move to httpOnly cookies + a real IdP (explicit non-goal here).
- **Polling load vs the 10/s per-IP rate limit** → Fixed ~1.5s interval, single in-flight request per order (React Query dedup), and hard stop on terminal state keep well under budget; a `429` is surfaced with backoff rather than hammering.
- **Eventual-consistency lag: order service `202` precedes the order-view projection** → Tracking treats an initial `404` from `GET /api/order-views/{id}` as "not yet projected" and keeps polling in a pending state instead of showing not-found.
- **CORS / base-URL drift between dev and any future host** → Base URL is the single `VITE_API_BASE_URL` env var; nothing hardcodes the gateway origin.
- **Rewrite regresses existing visual design** → Reuse the existing CSS tokens and port component visuals; keep `ui_kits/` until a side-by-side parity check passes (rollback = keep the old prototype).

## Migration Plan

1. Scaffold the Vite + React + TS app under `frontend/` alongside the existing `ui_kits/` prototype; import the existing CSS tokens; add `.env` with `VITE_API_BASE_URL=http://localhost:8080/api`.
2. Build the `apiClient` (axios instance + auth + error interceptors) and the data layer (React Query client).
3. Wire capabilities incrementally and verify each against the live gateway: catalog list/detail → auth/login → cart/checkout → order tracking.
4. Run the end-to-end verification (browse → login → checkout → track to CONFIRMED, plus the two CANCELLED demo flows).
5. Once parity with the prototype's visuals + the full happy path is confirmed, delete the `frontend/ui_kits/...` CDN prototype.
6. **Rollback**: the prototype is untouched until step 5, so rollback is reverting to the static `ui_kits/` app — no backend or data migration is involved.

## Open Questions

- Final app directory layout (`frontend/` root vs `frontend/app/`) — resolve at scaffold time; does not affect the API contract.
- Whether to surface a notifications panel (`GET /api/notifications?orderId=`) on the tracking page in this increment or defer it — treat as optional/nice-to-have within order tracking.
