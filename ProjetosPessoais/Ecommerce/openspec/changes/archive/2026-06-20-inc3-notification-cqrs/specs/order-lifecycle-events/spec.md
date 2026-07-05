## ADDED Requirements

### Requirement: Emit OrderConfirmed on saga success

When the order saga reaches a successful terminal state (inventory reserved AND payment approved), order-service SHALL append an `OrderConfirmed` event to the outbox in the same transaction that confirms the order, targeting the `order.events` topic.

#### Scenario: Order confirmed end-to-end

- **WHEN** the saga receives `InventoryReserved` and `PaymentApproved` for an order and calls `order.confirm()`
- **THEN** an `OrderConfirmed(orderId)` envelope (type `ORDER_CONFIRMED`) is appended to the outbox in the same DB transaction
- **AND** the existing outbox relay publishes it to `order.events`

#### Scenario: Atomic with state write

- **WHEN** the confirm transaction is committed
- **THEN** the order's CONFIRMED state and the `OrderConfirmed` outbox row are persisted atomically (both or neither)

### Requirement: Emit OrderCancelled on saga failure

When the order saga reaches a failed terminal state (inventory rejected OR payment declined), order-service SHALL append an `OrderCancelled` event carrying a reason to the outbox in the same transaction that cancels the order, targeting the `order.events` topic.

#### Scenario: Cancelled due to inventory

- **WHEN** the saga receives `InventoryRejected` and calls `order.cancel()`
- **THEN** an `OrderCancelled(orderId, "inventory rejected")` envelope (type `ORDER_CANCELLED`) is appended to the outbox and published to `order.events`

#### Scenario: Cancelled due to payment

- **WHEN** the saga receives `PaymentDeclined` and calls `order.cancel()`
- **THEN** an `OrderCancelled(orderId, "payment declined")` envelope is appended to the outbox and published to `order.events`

### Requirement: Lifecycle event contract

`libs/common-events` SHALL define the lifecycle event records and type constants so producers and consumers share one contract.

#### Scenario: Records and constants exist

- **WHEN** a service serializes a lifecycle event
- **THEN** `OrderConfirmed(UUID orderId)` and `OrderCancelled(UUID orderId, String reason)` records are available
- **AND** `EventTypes.ORDER_CONFIRMED` and `EventTypes.ORDER_CANCELLED` constants are available
- **AND** events are wrapped with `EventEnvelope.of` on `Topics.ORDER_EVENTS`
