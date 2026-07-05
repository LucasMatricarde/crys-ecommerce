## 1. Dependencies & Config

- [x] 1.1 Add `spring-boot-starter-security` and `spring-boot-starter-oauth2-resource-server` to `services/api-gateway/build.gradle.kts` (reactive variants resolve via WebFlux); keep existing Testcontainers Redis test setup.
- [x] 1.2 Add `crys.auth` block to `services/api-gateway/src/main/resources/application.yml`: `secret: ${JWT_SECRET:<dev-only ≥32-char default>}`, `issuer: crys-gateway`, `token-ttl: 1h`. No route-table changes.
- [x] 1.3 Set fixed dev `JWT_SECRET` env on the `api-gateway` service in `infra/docker-compose.yml`; document that prod must override.

## 2. Security Configuration

- [x] 2.1 Create `config/AuthProperties.java` — `@ConfigurationProperties("crys.auth")` record binding `secret`, `issuer`, `token-ttl`.
- [x] 2.2 Create `config/SecurityConfig.java` — `@Configuration @EnableWebFluxSecurity`; `SecurityWebFilterChain` with `csrf().disable()`, permit public matchers (`/actuator/health/**`, `/actuator/info`, `/actuator/prometheus`, `/api/catalog/**`, `/api/auth/token`) + all `OPTIONS`, `anyExchange().authenticated()`, `oauth2ResourceServer(jwt)`.
- [x] 2.3 In `SecurityConfig`, add `ReactiveJwtDecoder` bean: `NimbusReactiveJwtDecoder.withSecretKey(SecretKeySpec from crys.auth.secret).macAlgorithm(HS256).build()` + issuer validator (`crys-gateway`).
- [x] 2.4 In `SecurityConfig`, add `JwtEncoder` bean: `NimbusJwtEncoder(new ImmutableSecret<>(key))` for the mint endpoint.

## 3. Identity Forwarding

- [x] 3.1 Create `security/ClaimForwardingFilter.java` — low-order `GlobalFilter` (after security): always strip inbound `X-User-Id`; if exchange principal is `JwtAuthenticationToken`, set `X-User-Id` to token `sub` on the mutated request; no-op otherwise.

## 4. Demo Mint Endpoint

- [x] 4.1 Create `web/AuthController.java` — `@RestController`, `POST /api/auth/token` taking `{ "subject": "..." }`; mint HS256 JWT (`sub`, `iss=crys-gateway`, `iat`, `exp=now+token-ttl`) via `JwtEncoder`; return `{ "token": "...", "expiresInSeconds": N }`. Javadoc marks it a demo/dev mint standing in for a real IdP.

## 5. Tests

- [x] 5.1 Create `AuthTokenRoundTripTest.java` — mint via `JwtEncoder`, decode via `ReactiveJwtDecoder`, assert `sub` + issuer; assert an expired token is rejected.
- [x] 5.2 Create `GatewayAuthIT.java` (`@SpringBootTest(RANDOM_PORT)` + Testcontainers Redis + `WebTestClient`, reusing `RouteConfigTest` pattern): `GET /actuator/health` → 200; `POST /api/orders` no token → 401; malformed/expired token → 401; valid minted token → not 401; `POST /api/auth/token {subject:"u1"}` → 200 with non-empty `token`.

## 6. Verification (live)

- [x] 6.1 `cd backend && JAVA_HOME=<jdk21> ./gradlew :services:api-gateway:test` green; then full `./gradlew build`.
- [x] 6.2 `docker compose up -d --build api-gateway`; run curl matrix on `http://localhost:8080`: catalog 200 no token; `POST /api/orders` no token → 401; mint token; `POST /api/orders` with bearer → 202 and poll order-view to CONFIRMED; notifications with/without token → 200/401; tampered token → 401.
- [x] 6.3 Confirm `X-User-Id` reaches downstream (order-service logs or read model).
