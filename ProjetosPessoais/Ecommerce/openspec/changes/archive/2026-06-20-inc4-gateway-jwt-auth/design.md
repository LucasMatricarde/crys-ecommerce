## Context

The CRYS backend is a Kafka-saga microservice system (Spring Boot 3.3.5, Spring Cloud 2023.0.3) fronted by a single reactive Spring Cloud Gateway (`services/api-gateway`, `com.crys.gateway`). The gateway today does CORS (`globalcors`) and Redis rate limiting but no authentication — all routes are open and no caller identity exists. Downstream services (order, inventory, payment, notification, read-model) are not exposed directly; they trust the gateway. Inc 4 hardening makes the gateway the single authentication enforcement point. This part covers JWT-at-the-gateway only; tracing assertions and K8s/Helm manifests are separate later increments.

## Goals / Non-Goals

**Goals:**
- Validate HS256 JWTs at the gateway and reject unauthenticated calls to protected routes with 401.
- Keep catalog, actuator, the demo mint endpoint, and CORS preflights public.
- Forward caller identity (`sub`) downstream as `X-User-Id`, stripping client-supplied values.
- Provide a demo mint endpoint so the flow is end-to-end testable without an IdP.
- Self-contained: no external dependencies beyond the Spring starters already in the BOM.

**Non-Goals:**
- No downstream/service-to-service auth (gateway remains the trust boundary).
- No user store, login, refresh tokens, or roles/scopes (single `sub` claim).
- No order↔user ownership scoping (services stay user-agnostic).
- No JWKS/external IdP, no asymmetric keys.
- No tracing assertions, no K8s/Helm.

## Decisions

**HS256 symmetric secret over RS256/JWKS.** Keeps the system self-contained with no key infrastructure or external IdP. Secret is injected via `JWT_SECRET` env (≥32 chars), with a dev-only default in `application.yml`. Trade-off: symmetric key must be shared if more issuers appear later — acceptable since the gateway is the only issuer and validator here.

**Nimbus for both decode and encode.** `spring-boot-starter-oauth2-resource-server` pulls in Nimbus, which does decode (`NimbusReactiveJwtDecoder.withSecretKey(key).macAlgorithm(HS256)`) and encode (`NimbusJwtEncoder(new ImmutableSecret<>(key))`). No extra JWT library (jjwt) needed. Alternative considered: jjwt — rejected, redundant dependency.

**Security filter chain runs before gateway routing.** `@EnableWebFluxSecurity` with `csrf().disable()`, public matchers + all `OPTIONS` permitted, `anyExchange().authenticated()`, `oauth2ResourceServer(jwt)`. Invalid tokens 401 before the route filters run, so they never consume rate-limiter budget. Existing CORS and rate limiter are untouched; only `OPTIONS` must be explicitly permitted in the security chain.

**Identity forwarding via a low-order GlobalFilter.** `ClaimForwardingFilter` runs after security. It always strips any inbound `X-User-Id` (anti-spoof), then if the exchange principal is a `JwtAuthenticationToken`, sets `X-User-Id` to the token `sub` on the mutated request. No-op for public/unauthenticated routes. Mirrors the existing `RateLimiterConfig` bean style.

**Config binding via `@ConfigurationProperties("crys.auth")` record.** Holds `secret`, `issuer` (`crys-gateway`), `token-ttl` (`1h`). Issuer validator added to the decoder.

## Risks / Trade-offs

- **Dev-default secret leaking to prod** → `application.yml` default is clearly dev-only and ≥32 chars; `infra/docker-compose.yml` sets a fixed dev `JWT_SECRET`, documented that prod must override.
- **Demo mint endpoint mistaken for production auth** → Javadoc and proposal clearly mark `POST /api/auth/token` as a demo stand-in for a real IdP; it is public by design only because no IdP exists in this increment.
- **Downstream trusting `X-User-Id` blindly** → acceptable in this trust model (gateway is the only ingress; services not exposed). Anti-spoof stripping ensures the header is gateway-authored, never client-authored.
- **Test asserting downstream 202** → in unit/IT the downstream is unreachable, so tests assert status ≠ 401 to prove the security decision rather than full proxy success; full 202 verified in the live curl matrix.

## Migration Plan

1. Add starters to `build.gradle.kts`; build.
2. Add `crys.auth` config + `JWT_SECRET` in compose.
3. Deploy gateway (`docker compose up -d --build api-gateway`). No downstream redeploy.
4. Rollback: revert the gateway image / remove the security starters — routes return to fully-open. No data migration, no downstream coupling, so rollback is a single-service revert.
