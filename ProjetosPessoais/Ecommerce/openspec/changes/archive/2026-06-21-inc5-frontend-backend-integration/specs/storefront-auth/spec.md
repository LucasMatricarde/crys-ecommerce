## ADDED Requirements

### Requirement: Demo login mints a JWT

The storefront SHALL provide a login page that accepts a subject identifier and mints a demo JWT via `POST /api/auth/token { "subject": "<id>" }`. The login page SHALL be clearly labelled as demo-only authentication (no password, no real identity provider).

#### Scenario: Successful login

- **WHEN** a user submits a subject on the login page
- **THEN** the storefront calls `POST /api/auth/token`, receives a token, and stores it

#### Scenario: Login labelled as demo

- **WHEN** the login page renders
- **THEN** it visibly indicates the authentication is a demo stand-in, not a real credential check

### Requirement: Token store and authorization interceptor

The storefront SHALL persist the minted token in `localStorage` and attach it as `Authorization: Bearer <token>` to every request to a protected endpoint via a shared HTTP-client interceptor. Public endpoints (catalog, token mint) SHALL work without a token.

#### Scenario: Token attached to protected request

- **WHEN** an authenticated user triggers a request to a protected endpoint (e.g. `POST /api/orders`)
- **THEN** the request carries an `Authorization: Bearer <token>` header

#### Scenario: Token persisted across reload

- **WHEN** an authenticated user reloads the app
- **THEN** the token is read back from `localStorage` and the session remains authenticated

#### Scenario: Public request needs no token

- **WHEN** an unauthenticated user browses the catalog
- **THEN** catalog requests succeed without an `Authorization` header

### Requirement: Route guards and 401 handling

The storefront SHALL guard authenticated routes (checkout, order tracking): an unauthenticated user attempting to reach a guarded route SHALL be redirected to the login page. A `401` response on any request SHALL clear the stored token and redirect to login.

#### Scenario: Guarded route without session

- **WHEN** an unauthenticated user navigates to `/checkout`
- **THEN** the storefront redirects to `/login`

#### Scenario: 401 clears session

- **WHEN** any request returns `401` (e.g. expired token)
- **THEN** the storefront clears the stored token and redirects the user to `/login`

#### Scenario: Logout

- **WHEN** an authenticated user logs out
- **THEN** the stored token is removed and guarded routes are no longer accessible
