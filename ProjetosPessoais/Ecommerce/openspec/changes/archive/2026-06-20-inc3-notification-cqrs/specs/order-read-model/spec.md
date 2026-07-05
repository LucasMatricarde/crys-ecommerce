## ADDED Requirements

### Requirement: Maintain order_view read model

order-query-service SHALL consume `order.events`, `inventory.events`, and `payment.events` (consumer group `order-query-service`) and maintain a Mongo `order_view` document per order, denormalized and query-optimized.

The `order_view` SHALL hold: `orderId`, `productSlug`, `quantity`, `amountCents`, `status` (PENDING|RESERVED|CONFIRMED|CANCELLED), `reason`, `createdAt`, `updatedAt`, and a `timeline[]` of `{step, at}` entries.

#### Scenario: Order created

- **WHEN** an `OrderCreated` event is consumed
- **THEN** an `order_view` is created with status PENDING and a `created` timeline entry

#### Scenario: Inventory reserved

- **WHEN** an `InventoryReserved` event is consumed for an existing order
- **THEN** the view status becomes RESERVED and a `reserved` timeline entry is appended

#### Scenario: Inventory rejected

- **WHEN** an `InventoryRejected` event is consumed
- **THEN** the view `reason` is set (awaiting the terminal cancel event)

#### Scenario: Payment outcome recorded

- **WHEN** a `PaymentApproved` or `PaymentDeclined` event is consumed
- **THEN** a `payment` timeline entry is appended to the view

#### Scenario: Terminal confirm

- **WHEN** an `OrderConfirmed` event is consumed
- **THEN** the view status becomes CONFIRMED with a terminal timeline entry

#### Scenario: Terminal cancel

- **WHEN** an `OrderCancelled` event is consumed
- **THEN** the view status becomes CANCELLED, `reason` is set, and a terminal timeline entry is appended

### Requirement: Idempotent event consumption

order-query-service SHALL process each event envelope at most once, using a Mongo-backed idempotency check keyed by envelope id.

#### Scenario: Redelivery is a no-op

- **WHEN** an envelope whose id was already processed is redelivered
- **THEN** the `order_view` is not mutated a second time

### Requirement: Order query API

order-query-service SHALL expose read endpoints for the order views.

#### Scenario: Get single view

- **WHEN** a client calls `GET /order-views/{orderId}` for an existing order
- **THEN** the service returns the `order_view` with its timeline

#### Scenario: Missing view

- **WHEN** a client calls `GET /order-views/{orderId}` for an unknown order
- **THEN** the service returns 404

#### Scenario: List by status

- **WHEN** a client calls `GET /order-views?status=CONFIRMED`
- **THEN** the service returns a paged list of matching views
