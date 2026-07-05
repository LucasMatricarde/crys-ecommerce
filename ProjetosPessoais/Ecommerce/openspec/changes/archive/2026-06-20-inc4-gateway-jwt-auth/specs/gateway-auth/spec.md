## ADDED Requirements

### Requirement: Public routes accessible without authentication

The gateway SHALL allow access without any `Authorization` header to: actuator health/info/prometheus endpoints, all `/api/catalog/**` routes, the demo mint endpoint `POST /api/auth/token`, and every CORS `OPTIONS` preflight request on any path.

#### Scenario: Catalog browse without token

- **WHEN** a client sends `GET /api/catalog/products` with no `Authorization` header
- **THEN** the gateway permits the request and does not return 401

#### Scenario: Health check without token

- **WHEN** a client sends `GET /actuator/health` with no `Authorization` header
- **THEN** the gateway returns 200

#### Scenario: CORS preflight without token

- **WHEN** a client sends an `OPTIONS` request to a protected path (e.g. `/api/orders`) with no `Authorization` header
- **THEN** the gateway permits the preflight and does not return 401

### Requirement: Protected routes require a valid JWT

The gateway SHALL require a valid HS256-signed JWT bearer token on `/api/orders/**`, `/api/order-views/**`, and `/api/notifications/**`. The token MUST be validated for signature (shared secret) and issuer (`crys-gateway`) and MUST NOT be expired. Requests that fail validation SHALL be rejected with 401 before gateway routing and before consuming rate-limiter budget.

#### Scenario: Protected route without token

- **WHEN** a client sends `POST /api/orders` with no `Authorization` header
- **THEN** the gateway returns 401

#### Scenario: Protected route with malformed token

- **WHEN** a client sends `POST /api/orders` with `Authorization: Bearer <malformed-or-tampered>`
- **THEN** the gateway returns 401

#### Scenario: Protected route with expired token

- **WHEN** a client sends `POST /api/orders` with an otherwise-valid token whose `exp` is in the past
- **THEN** the gateway returns 401

#### Scenario: Protected route with valid token

- **WHEN** a client sends `POST /api/orders` with a valid, unexpired, correctly-signed bearer token
- **THEN** the gateway passes the authentication decision and does not return 401

### Requirement: Authenticated identity forwarded downstream

For authenticated requests, the gateway SHALL set the `X-User-Id` request header to the JWT `sub` claim before forwarding downstream. The gateway SHALL strip any client-supplied `X-User-Id` header on all requests to prevent identity spoofing.

#### Scenario: Identity forwarded for authenticated request

- **WHEN** an authenticated request with `sub=demo` is forwarded downstream
- **THEN** the downstream request carries `X-User-Id: demo`

#### Scenario: Client-supplied X-User-Id stripped

- **WHEN** a client sends any request carrying its own `X-User-Id` header
- **THEN** the gateway removes that header before forwarding, replacing it only from a validated token

### Requirement: Demo token-mint endpoint

The gateway SHALL expose `POST /api/auth/token` that accepts a JSON body `{ "subject": "<id>" }` and returns a JSON body `{ "token": "<jwt>", "expiresInSeconds": <n> }`. The minted token MUST be HS256-signed with the shared secret and contain claims `sub`, `iss=crys-gateway`, `iat`, and `exp = iat + token-ttl`. This endpoint is a clearly-labelled demo stand-in for a real identity provider.

#### Scenario: Mint a token

- **WHEN** a client sends `POST /api/auth/token` with body `{ "subject": "u1" }`
- **THEN** the gateway returns 200 with a non-empty `token` and a positive `expiresInSeconds`

#### Scenario: Minted token is accepted on protected routes

- **WHEN** a token minted via `POST /api/auth/token` is presented as a bearer token on a protected route
- **THEN** the gateway accepts the authentication (does not return 401)
