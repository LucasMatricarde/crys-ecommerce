## Why

The CRYS. order saga (Inc 0–2) writes the order's final state (CONFIRMED/CANCELLED) only to order-service's Postgres and never emits it, so no downstream consumer can react to a completed order. We need a query-optimized view of orders and customer notifications without touching the write-side transactional logic. Inc 3 builds the **read side** of CQRS plus event-driven notification fan-out.

## What Changes

- order-service **emits order-lifecycle events** (`OrderConfirmed`, `OrderCancelled`) to `order.events` via its existing outbox when the saga concludes (same transaction, reuses `OutboxWriter`).
- New `order-query-service` (port 8085): a Mongo CQRS read model that consumes `order.events`, `inventory.events`, `payment.events` and maintains a denormalized, eventually-consistent `order_view` with a status timeline; exposes a query API.
- New `notification-service` (port 8086): consumes `order.events`, persists mock pt-BR notifications to Mongo, logs them as "sent"; exposes a query API.
- Both new services are **pure event consumers** (no commands/outbox); they reuse `libs/messaging` only for `EnvelopeCodec` + Kafka consumer config, and add a **Mongo-backed idempotency** guard (the existing `IdempotencyGuard`/`ProcessedMessage` are JPA-only).
- api-gateway routes `/api/order-views/**` → order-query-service and `/api/notifications/**` → notification-service (CORS + Redis rate limiter, mirroring the `orders` route).
- New event records in `libs/common-events`: `OrderConfirmed(orderId)`, `OrderCancelled(orderId, reason)`; new `EventTypes` constants `ORDER_CONFIRMED`, `ORDER_CANCELLED`.
- Infra: 2 new docker-compose services (Mongo + Kafka, no Postgres), 2 new Prometheus scrape jobs, 2 new Gradle modules.

## Capabilities

### New Capabilities
- `order-lifecycle-events`: order-service emits `OrderConfirmed`/`OrderCancelled` facts to `order.events` when the saga reaches a terminal state.
- `order-read-model`: a Mongo-backed CQRS read model of orders (`order_view` + status timeline) maintained by consuming order/inventory/payment events, exposed via a query API.
- `order-notifications`: customer-facing notifications generated from order events, persisted to Mongo with mock delivery and exposed via a query API.

### Modified Capabilities
<!-- None: no existing OpenSpec specs; Inc 0–2 were not tracked in OpenSpec. -->

## Impact

- **Code**: `libs/common-events` (new records/types), `services/order-service` (saga emits lifecycle facts), 2 new services, `services/api-gateway` (routes).
- **Infra**: `infra/docker-compose.yml` (+2 services), `infra/observability/prometheus.yml` (+2 scrape jobs), `settings.gradle.kts` (+2 modules).
- **Topics**: `order.events` gains `ORDER_CONFIRMED`/`ORDER_CANCELLED` event types; new consumer groups `order-query-service`, `notification-service`.
- **Datastores**: new Mongo collections `order_view`, `notification`, `processed_message` (idempotency). No Postgres schema changes.
- **Non-breaking**: write-side saga logic unchanged; new events are additive.
