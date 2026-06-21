## Why

The CRYS backend (Inc 0–3) is a Kafka-saga microservice system fronted by a single Spring Cloud Gateway, but every route is currently open — there is no authentication anywhere in the system and no notion of caller identity. Inc 4 hardening begins by turning the gateway into the single enforcement point for authentication so that unauthenticated calls to write/user-facing routes are rejected before they reach downstream services.

## What Changes

- Add Spring Security WebFlux + OAuth2 Resource Server to the `api-gateway` service.
- Validate HS256 JWTs (shared symmetric secret, no external IdP/JWKS) on protected routes; reject missing/invalid/expired tokens with **401**.
- Keep catalog, actuator health/info/prometheus, the demo mint endpoint, and all CORS `OPTIONS` preflights **public**; require authentication on `/api/orders/**`, `/api/order-views/**`, `/api/notifications/**`.
- Forward the authenticated caller's identity (`sub` claim) downstream as an `X-User-Id` header, stripping any client-supplied value first (anti-spoof). Downstream services stay user-agnostic.
- Add a clearly-labelled **demo token-mint endpoint** (`POST /api/auth/token`) on the gateway so the flow is testable end-to-end without an identity provider.
- Set a fixed dev `JWT_SECRET` on the gateway in `infra/docker-compose.yml` (prod overrides).

## Capabilities

### New Capabilities
- `gateway-auth`: Gateway-level JWT authentication — token validation, route protection matrix, identity forwarding to downstream, and a demo token-mint endpoint.

### Modified Capabilities
<!-- None. Existing capabilities (order-lifecycle-events, order-notifications, order-read-model) are unchanged; downstream services remain user-agnostic. -->

## Impact

- **Code**: `services/api-gateway` only (`com.crys.gateway`). New `SecurityConfig`, `ClaimForwardingFilter`, `AuthController`. No downstream service changes.
- **Build**: `services/api-gateway/build.gradle.kts` gains `spring-boot-starter-security` + `spring-boot-starter-oauth2-resource-server` (reactive variants).
- **Config**: `application.yml` gains a `crys.auth` block (secret, issuer, token-ttl); `infra/docker-compose.yml` sets `JWT_SECRET`.
- **APIs**: Protected routes now require `Authorization: Bearer <jwt>`; new public `POST /api/auth/token`. CORS and Redis rate limiting unchanged.
- **Non-goals (this increment)**: no downstream/service-to-service auth, no user store/login/refresh/roles, no order↔user ownership scoping, no tracing assertions, no K8s/Helm (deferred to later Inc 4 parts).
