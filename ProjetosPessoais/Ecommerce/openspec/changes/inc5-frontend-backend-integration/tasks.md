## 1. Scaffold & Config

- [x] 1.1 Scaffold a Vite + React + TypeScript app under `frontend/` (alongside the existing `ui_kits/` prototype, which stays until parity); commit `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`.
- [x] 1.2 Import the existing CSS tokens (`frontend/styles.css`, `frontend/tokens/`) into the app's global styles so the visual design is reused.
- [x] 1.3 Add `.env` (+ `.env.example`) with `VITE_API_BASE_URL=http://localhost:8080/api`; read via `import.meta.env`. Never hardcode the gateway origin elsewhere.
- [x] 1.4 Add TypeScript types for the backend DTOs: `Product` (`id,slug,name,strainType,thcPercent,cbdPercent,weightGrams,priceCents,priceFormatted,imageSlot,available,description`), `Order` (`id,status,amountCents`), `OrderView` (`orderId,status,reason,createdAt,timeline[{step,at}]`), and the auth token response.

## 2. HTTP Client & Data Layer

- [x] 2.1 Create `apiClient` — a single axios instance with `baseURL = VITE_API_BASE_URL`.
- [x] 2.2 Add a request interceptor that attaches `Authorization: Bearer <token>` when a token is in the store.
- [x] 2.3 Add a response interceptor that normalizes errors into a typed shape (401/404/422/429/network) and, on 401, clears the token and redirects to `/login`.
- [x] 2.4 Set up the React Query (TanStack Query) client/provider for catalog reads and order-view polling.

## 3. Routing & Layout

- [x] 3.1 Add react-router with routes `/`, `/product/:slug`, `/checkout`, `/orders/:id`, `/login`.
- [x] 3.2 Port the NavBar/layout shell to TSX from the existing components, reusing the CSS tokens; include a cart indicator and a login/logout affordance.
- [x] 3.3 Add a route-guard component wrapping `/checkout` and `/orders/:id` that redirects to `/login` when no token is present.

## 4. Catalog (storefront-catalog)

- [x] 4.1 Catalog list page: query `GET /api/catalog/products?strainType=&page=&size=` via React Query; render one card per product using live DTO fields and `priceFormatted`; reflect `available`.
- [x] 4.2 Add strain-type filter and pagination controls that re-query the gateway.
- [x] 4.3 Product detail page: query `GET /api/catalog/products/{slug}`; render full description + "add to cart"; show a not-found state on 404.
- [x] 4.4 Loading / empty / error states for both views (error state has a retry action).
- [x] 4.5 Delete reliance on `data.js` / `window.CRYS_PRODUCTS` from the new app (no mock catalog).

## 5. Cart (storefront-checkout)

- [x] 5.1 Cart state persisted in `localStorage`: add, update quantity, remove; restore on reload.
- [x] 5.2 Port the CartDrawer/summary component to TSX reusing the CSS tokens.

## 6. Auth (storefront-auth)

- [x] 6.1 Login page: subject input → `POST /api/auth/token { subject }`; clearly labelled demo-only auth (no password).
- [x] 6.2 Token store backed by `localStorage`; read back on app start; expose login/logout.
- [x] 6.3 Wire the token store into the request interceptor (2.2) and the 401 handler (2.3); verify guarded routes redirect when unauthenticated.

## 7. Checkout (storefront-checkout)

- [x] 7.1 Checkout page: `POST /api/orders { productSlug, quantity }`; on `202`, read `{ id, status: PENDING, amountCents }` and navigate to `/orders/{id}`.
- [x] 7.2 Handle 422 (validation), 404 (product), 429 (rate limit, retry with backoff), and network/5xx — each a user-visible message without losing the cart.

## 8. Order Tracking (storefront-order-tracking)

- [x] 8.1 Tracking page at `/orders/:id`: poll `GET /api/order-views/{id}` every ~1.5s via React Query `refetchInterval`.
- [x] 8.2 Render `status`, `reason` (when present), and the `timeline` of `{ step, at }` steps.
- [x] 8.3 Stop polling on terminal state (`CONFIRMED`/`CANCELLED`); leaving the page unmounts/stops the query.
- [x] 8.4 Treat an early `404` (projection lag) as "not yet projected" and keep polling in a pending state.
- [x] 8.5 (Optional) Notifications panel from `GET /api/notifications?orderId=`.

## 9. Tests & Docs

- [x] 9.1 Component tests for catalog card, cart, login, and tracking-status rendering.
- [x] 9.2 A mocked-API integration test covering browse → login → checkout → tracking (mock the gateway responses).
- [x] 9.3 Update `frontend/README` with run steps (`npm i`, `npm run dev`, `.env`) and the demo-auth note.

## 10. Parity & Cleanup

- [x] 10.1 Side-by-side parity check of the new app against the `ui_kits/` prototype visuals and the full happy path. (New app reuses the same CSS token system and ports the prototype components to TSX; live happy path verified 6/6 — it is a superset of the prototype: live data + auth + tracking.)
- [x] 10.2 Remove the CDN/Babel prototype (`frontend/ui_kits/...`) after parity is confirmed.

## 11. Verification (end-to-end, live)

- [x] 11.1 Backend up: `cd backend/infra && docker compose up -d --build`; confirm `curl http://localhost:8080/actuator/health`.
- [x] 11.2 `cd frontend && npm i && npm run dev`; browse the live catalog and open a product detail by slug. (Verified live via Playwright against the running gateway.)
- [x] 11.3 Add to cart → login (demo subject) → checkout → observe `202` → land on tracking → poll advances → `rosin-premium` qty 1 = `CONFIRMED`. (Verified live.)
- [x] 11.4 Negative flows: `shatter-cristal` → `CANCELLED` (no stock); `rosin-premium` qty 60 → `CANCELLED` (payment decline). Verify the reason is shown. (Verified live: reasons "inventory rejected" / "payment declined" rendered.)
- [x] 11.5 Auth: hit `/checkout` without a token → redirected to `/login`; force a `401` (bad/expired token) → session cleared and redirected. (Verified live. NOTE: live verification uncovered a CORS bug on `POST /api/auth/token` — preflight 403 because the local mint controller wasn't covered by the gateway's `globalcors`; fixed in `SecurityConfig` by moving CORS into the Spring Security chain. See proposal/design notes.)
