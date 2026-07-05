## Context

CRYS. backend Inc 0–2 are done and verified: foundation, catalog read path, and the Kafka order saga (`order/inventory/payment-service` + `libs/messaging` outbox/idempotency/DLQ). The saga publishes facts to `order.events`, `inventory.events`, `payment.events`, but the order's *final* state (CONFIRMED/CANCELLED) is written only to order-service's Postgres and is never emitted — so nothing downstream can react to a completed order.

Inc 3 adds the **read side** of CQRS: two new pure-consumer services that build a query-optimized order view and drive customer notifications. Constraints: reuse existing patterns (`EventEnvelope`/`Topics`/`EventTypes`, `libs/messaging` consumer config, catalog-service Mongo skeleton), don't touch write-side transactional logic, and keep the brand voice (artisanal pt-BR, no emoji) for customer-facing copy.

## Goals / Non-Goals

**Goals:**
- Emit `OrderConfirmed`/`OrderCancelled` from order-service's existing outbox when the saga concludes.
- Build a Mongo CQRS `order_view` read model with a status timeline, consuming order/inventory/payment events.
- Generate and persist mock pt-BR notifications from order events.
- Expose both read models through the gateway (`/api/order-views`, `/api/notifications`).
- Demonstrate event-driven fan-out to multiple independent consumer groups.

**Non-Goals:**
- No changes to write-side saga semantics (only an additive outbox append).
- No real notification delivery (email/SMS/push) — mock + log only.
- No new auth (JWT lands in Inc 4).
- No Postgres for the new services; Mongo only.

## Decisions

**Two new services, not one.** `order-query-service` and `notification-service` are separate consumer groups so each scales/fails independently and the fan-out is real. Alternative — one consumer doing both — was rejected: it couples two unrelated read concerns and hides the fan-out the increment is meant to demonstrate.

**Pure consumers, no outbox.** Neither new service issues commands or produces events, so they skip the outbox entirely and reuse `libs/messaging` only for `EnvelopeCodec` + Kafka consumer/DLQ config. Keeps them thin.

**Mongo-backed idempotency instead of JPA.** The existing `IdempotencyGuard`/`ProcessedMessage` are JPA-only; pulling JPA into Mongo-only services just for idempotency is wasteful. Instead add a small `@Document processed_message` + existence check (insert-if-absent keyed by envelope id). Alternative — share the JPA guard — rejected to avoid a second datasource per service.

**order-service emits lifecycle facts via the existing outbox.** At the saga's confirm/cancel points, `outbox.append(Topics.ORDER_EVENTS, …)` runs in the same transaction as the state write, so emission is atomic with the state change and the existing relay publishes it. No new infra. Alternative — a separate CDC/poller on the orders table — rejected as redundant with the working outbox.

**Read APIs exposed via the gateway**, mirroring the existing `orders` route (CORS + Redis rate limiter, `RewritePath` with the bare-path-safe regex `(?<segment>/?.*)`). Keeps one ingress and consistent cross-cutting policy.

**Reuse catalog-service skeleton** for Mongo config, `application.yml`, multi-stage Dockerfile, actuator + OTel + Prometheus wiring, and the controller/paged-response shape. Minimizes novel surface.

**Timeline as an embedded array** on `order_view` (`{step, at}`) rather than a separate events collection — single-document reads, no joins, matches the denormalized CQRS intent.

## Risks / Trade-offs

- **Out-of-order / interleaved events** (e.g. `OrderConfirmed` before `InventoryReserved` is projected) → upsert semantics: every handler upserts the view and appends its timeline entry, so a missing prior step doesn't drop data; terminal status is set idempotently.
- **Eventual consistency lag** between write side and read model → acceptable by design; verification polls `GET /order-views/{id}` until terminal.
- **Idempotency race** (two consumers of same partition) → single consumer group per service + insert-if-absent on `processed_message` (unique `_id` = envelope id) makes the second insert fail/no-op.
- **DLQ growth on poison events** → reuse Inc 2 DLT config; verification asserts DLTs empty.
- **Prometheus not picking up new jobs** → restart Prometheus after editing `prometheus.yml` (known Inc 2 gotcha).

## Migration Plan

1. Add records/constants to `libs/common-events`; register 2 new Gradle modules in `settings.gradle.kts`.
2. Modify `OrderSaga` to append lifecycle events (backward-compatible, additive).
3. Build the two new services from the catalog skeleton.
4. Wire gateway routes + docker-compose services + Prometheus jobs.
5. `./gradlew build` (Testcontainers Mongo+Kafka) then `docker compose up -d --build`; restart Prometheus.
6. Rollback: the new services and gateway routes are additive — remove them and revert the `OrderSaga` outbox-append to return to Inc 2 state; no schema migration to undo.

## Open Questions

- None blocking. Pagination defaults for `GET /order-views?status=` follow the catalog controller's existing convention.
