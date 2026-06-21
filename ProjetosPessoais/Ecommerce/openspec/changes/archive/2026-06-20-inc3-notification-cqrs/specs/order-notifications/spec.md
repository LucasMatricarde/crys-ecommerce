## ADDED Requirements

### Requirement: Generate notifications from order events

notification-service SHALL consume `order.events` (consumer group `notification-service`) and persist a Mongo `notification` document per relevant event, with mock delivery (log at INFO).

Each `notification` SHALL hold: `id`, `orderId`, `type` (ORDER_RECEIVED|ORDER_CONFIRMED|ORDER_CANCELLED), `channel` ("mock"), `message` (pt-BR), `createdAt`.

#### Scenario: Order received

- **WHEN** an `OrderCreated` event is consumed
- **THEN** an ORDER_RECEIVED notification is persisted with pt-BR copy ("Recebemos seu pedido…") and logged as sent

#### Scenario: Order confirmed

- **WHEN** an `OrderConfirmed` event is consumed
- **THEN** an ORDER_CONFIRMED notification is persisted ("Pedido confirmado! Sua resina está a caminho.") and logged as sent

#### Scenario: Order cancelled

- **WHEN** an `OrderCancelled` event is consumed
- **THEN** an ORDER_CANCELLED notification is persisted ("Seu pedido foi cancelado: <reason>.") and logged as sent

### Requirement: On-brand pt-BR copy

Notification copy SHALL follow the brand voice (artisanal, pt-BR, no emoji) defined in `frontend/readme.md`.

#### Scenario: Copy style

- **WHEN** any notification is generated
- **THEN** its `message` is pt-BR, contains no emoji, and matches the brand voice

### Requirement: Idempotent event consumption

notification-service SHALL process each event envelope at most once, using a Mongo-backed idempotency check keyed by envelope id.

#### Scenario: Redelivery is a no-op

- **WHEN** an envelope whose id was already processed is redelivered
- **THEN** no duplicate notification is persisted

### Requirement: Notification query API

notification-service SHALL expose a read endpoint listing notifications for an order.

#### Scenario: List by order

- **WHEN** a client calls `GET /notifications?orderId={id}`
- **THEN** the service returns the notifications for that order
