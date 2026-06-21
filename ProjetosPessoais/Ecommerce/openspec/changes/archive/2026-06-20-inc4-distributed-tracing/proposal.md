## Why

A single order today produces fragmented, disconnected traces in Jaeger: the api-gateway records nothing, and every Kafka hop in the saga starts a fresh trace because events are published by a decoupled outbox relay thread that runs outside the originating request's trace. There is no way to follow one order end-to-end, which undermines the observability story for the system.

## What Changes

- Wire OpenTelemetry tracing into **api-gateway** so the entry point records the inbound request and propagates W3C `traceparent` to order-service over HTTP.
- Carry trace context **through the transactional outbox**: capture the active W3C context when an outbox row is written, persist it on the row, re-inject it as Kafka `traceparent`/`tracestate` headers at relay time, and enable consumer-side observation so each saga listener continues the same trace.
- Centralize the outbox propagation in `libs/messaging` so all 6 saga services inherit it uniformly.
- Add tests asserting trace propagation through the outbox (write captures context, relay emits header, no-op when no active span).

Outcome: one order = **one connected trace** spanning api-gateway → order-service → (Kafka) → inventory-service → payment-service → order-service confirmation → order-query-service / notification-service.

## Capabilities

### New Capabilities
- `distributed-tracing`: End-to-end trace propagation across the system — HTTP entry at the gateway and asynchronous Kafka hops via the transactional outbox — so one business transaction maps to one connected trace in Jaeger.

### Modified Capabilities
<!-- None: no existing spec's requirements change; tracing is a new cross-cutting capability. -->

## Impact

- **Code**: `services/api-gateway` (build + config), `libs/messaging` outbox (`OutboxEvent`, `OutboxWriter`, `OutboxRelay`, `KafkaConfig`), shared by all 6 saga services.
- **Dependencies**: add `micrometer-tracing-bridge-otel` + `opentelemetry-exporter-otlp` to api-gateway; `micrometer-tracing` (API) to `libs/messaging`; `micrometer-tracing-test` (test scope).
- **Data**: two nullable columns (`traceparent`, `tracestate`) on the outbox table; `ddl-auto: update` auto-adds them on order/inventory/payment Postgres DBs — no manual migration.
- **Infra**: `OTEL_EXPORTER_OTLP_ENDPOINT` env added to api-gateway in `infra/docker-compose.yml`; Jaeger all-in-one already runs.
- **Non-breaking**: optional tracing beans (`ObjectProvider`) keep non-traced services working.
