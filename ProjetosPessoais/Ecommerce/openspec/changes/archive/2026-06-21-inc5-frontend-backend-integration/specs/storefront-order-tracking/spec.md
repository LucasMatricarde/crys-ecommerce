## ADDED Requirements

### Requirement: Order tracking polls the CQRS read model

The storefront SHALL render an order-tracking view at `/orders/{id}` that polls `GET /api/order-views/{id}` on a bounded interval (~1.5s) and renders the order `status`, the `reason` (when present), and the `timeline` of `{ step, at }` entries. Polling SHALL stop once the order reaches a terminal state (`CONFIRMED` or `CANCELLED`).

#### Scenario: Timeline advances while pending

- **WHEN** a tracked order is still PENDING/processing
- **THEN** the view polls `GET /api/order-views/{id}` on the interval and re-renders the latest status and timeline steps

#### Scenario: Polling stops on terminal state

- **WHEN** the order reaches `CONFIRMED` or `CANCELLED`
- **THEN** the view renders the terminal status and stops polling

#### Scenario: Cancellation reason shown

- **WHEN** a tracked order resolves to `CANCELLED` with a `reason`
- **THEN** the view displays the reason text alongside the cancelled status

### Requirement: Eventual-consistency tolerance

Because the order-view projection lags the `202` from the order service, the tracking view SHALL treat an initial `404` from `GET /api/order-views/{id}` as "not yet projected" and keep polling rather than showing a hard error.

#### Scenario: Projection not yet available

- **WHEN** `GET /api/order-views/{id}` returns `404` shortly after order placement
- **THEN** the view keeps polling (showing a pending/processing state) instead of surfacing a not-found error

#### Scenario: Bounded polling

- **WHEN** the order remains non-terminal for an extended period
- **THEN** polling continues on the fixed interval without unbounded acceleration, and the user can leave the page to stop it

### Requirement: Demo end-to-end outcomes observable

The tracking view SHALL correctly reflect the backend's known demo flows: `rosin-premium` qty 1 → `CONFIRMED`; `shatter-cristal` → `CANCELLED` (no stock); `rosin-premium` qty 60 → `CANCELLED` (payment decline + compensation).

#### Scenario: Confirmed flow

- **WHEN** an order for `rosin-premium` quantity 1 is tracked
- **THEN** the view ultimately shows `CONFIRMED`

#### Scenario: Cancelled (no stock) flow

- **WHEN** an order for `shatter-cristal` is tracked
- **THEN** the view ultimately shows `CANCELLED` with a no-stock reason

#### Scenario: Cancelled (payment decline) flow

- **WHEN** an order for `rosin-premium` quantity 60 is tracked
- **THEN** the view ultimately shows `CANCELLED` with a payment-decline/compensation reason
