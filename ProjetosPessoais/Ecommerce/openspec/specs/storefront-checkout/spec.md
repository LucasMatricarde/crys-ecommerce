# storefront-checkout Specification

## Purpose

Defines the storefront cart and checkout flow: a locally persisted cart, authenticated order placement via the gateway with navigation to order tracking, and resilient handling of validation, not-found, rate-limit, and network/5xx errors.

## Requirements

### Requirement: Cart persisted locally

The storefront SHALL maintain a cart of products (with quantities) persisted in `localStorage`, surfaced via a cart drawer/summary. Adding, updating quantity, and removing items SHALL update the persisted cart.

#### Scenario: Add to cart

- **WHEN** a user adds an available product to the cart
- **THEN** the cart reflects the product and quantity and the state is written to `localStorage`

#### Scenario: Cart survives reload

- **WHEN** a user reloads the app with items in the cart
- **THEN** the cart is restored from `localStorage`

### Requirement: Authenticated checkout places an order

The storefront SHALL place an order from the checkout flow via `POST /api/orders { "productSlug": "<slug>", "quantity": <n> }` while authenticated. On a `202` response it SHALL read the returned `{ id, status: PENDING, amountCents }` and navigate the user to the tracking view for that order id.

#### Scenario: Successful order placement

- **WHEN** an authenticated user confirms checkout for a product and quantity
- **THEN** the storefront issues `POST /api/orders` and, on `202`, navigates to `/orders/{id}` with the returned PENDING order

#### Scenario: Checkout requires authentication

- **WHEN** an unauthenticated user attempts to check out
- **THEN** the storefront redirects to login before any `POST /api/orders` call is made

### Requirement: Checkout error handling

The checkout flow SHALL surface backend errors without crashing: validation errors (`422`), not-found product (`404`), rate limiting (`429`), and network/5xx failures SHALL each produce a user-visible message; `429` SHALL be retryable with backoff.

#### Scenario: Validation error

- **WHEN** `POST /api/orders` returns `422`
- **THEN** the checkout view shows the validation message and does not navigate away

#### Scenario: Rate limited

- **WHEN** `POST /api/orders` returns `429`
- **THEN** the checkout view shows a rate-limit message and allows a retry after a backoff

#### Scenario: Network failure

- **WHEN** `POST /api/orders` fails with a network or 5xx error
- **THEN** the checkout view shows an error and allows retry without losing the cart
