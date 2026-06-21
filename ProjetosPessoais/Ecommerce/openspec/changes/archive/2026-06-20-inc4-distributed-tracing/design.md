## Context

The CRYS backend is an event-driven saga across 6 services. 5 of 6 already wire `micrometer-tracing-bridge-otel` + `opentelemetry-exporter-otlp` and export OTLP to Jaeger all-in-one (`http://jaeger:4318/v1/traces`, 100% sampling; UI :16686). Two gaps break end-to-end tracing:

- **Gap 1 — api-gateway has no tracing.** No deps, no `management.tracing`/`otlp` config. The entry point neither records nor propagates a trace.
- **Gap 2 — the trace fragments at every Kafka hop.** Events are emitted through a transactional outbox: `OutboxWriter.append(...)` writes a row in the request's transaction; `OutboxRelay.flush()` (a `@Scheduled` thread) publishes it later. The relay runs outside the originating trace, so automatic Kafka instrumentation cannot carry the context across — downstream listeners land in disconnected traces.

Constraint: the outbox decouples publish in time and thread from the originating request, so auto-instrumentation alone cannot bridge the async hop.

## Goals / Non-Goals

**Goals:**
- One order = one connected trace in Jaeger spanning gateway → order → (Kafka) → inventory → payment → confirmation → query/notification.
- Gateway records and propagates W3C `traceparent` to order-service over HTTP.
- Outbox carries trace context across the async Kafka hop for all 6 services uniformly.
- Tests assert outbox write-capture, relay header-emit, and no-op when no span.

**Non-Goals:**
- No K8s/Helm manifests or probe config (separate Inc 4 part).
- No custom business spans/baggage beyond auto-instrumentation + the outbox carrier.
- No sampling/perf tuning (stays 100% for a portfolio/demo system).

## Decisions

### Gateway: rely on WebFlux + Spring Cloud Gateway auto-instrumentation
Add the two tracing deps and the standard `management.tracing`/`otlp` config block, mirroring the other 5 services. WebFlux + Gateway auto-instrument both the inbound request and the downstream proxy call, so `traceparent` flows to order-service over HTTP with no extra code.
- *Alternative considered*: manual filter to inject headers — rejected, redundant with auto-instrumentation.

### Outbox: store-and-replay the W3C context (not auto-instrumentation)
Capture the active context at write time, persist it on the outbox row, re-inject as Kafka headers at relay time, and enable consumer-side observation so listeners continue the trace.
- *Why not template observation on the relay*: it would stamp the **scheduler's** context onto the record, not the originating request's. Manual header injection preserves the correct origin context.
- *Why centralize in `libs/messaging`*: all 6 saga services share the lib, so they inherit propagation uniformly with one change.

### Data model: two nullable text columns via `ddl-auto: update`
Add `traceparent` and `tracestate` (`@Column(columnDefinition = "text")`, nullable) to `OutboxEvent`. `ddl-auto: update` on order/inventory/payment Postgres DBs auto-adds them — no manual migration. Nullable keeps non-traced paths working.

### Optional tracing beans for graceful degradation
`OutboxWriter` injects `ObjectProvider<Tracer>` + `ObjectProvider<Propagator>`; absent tracing (non-traced service) → no-op path. `KafkaConfig` injects `ObservationRegistry` and sets `setObservationEnabled(true)` + `setObservationRegistry(registry)` on the listener container factory. Default Boot propagation is W3C — matches the header written.

## Risks / Trade-offs

- **Scheduler context leaks onto the record if template observation is enabled** → use manual header injection on the relay; do not enable producer-side template observation.
- **Schema drift in non-dev environments** (where `ddl-auto` is not `update`) → portfolio/demo uses `update`; a real migration would be needed for prod (out of scope).
- **Stored context goes stale if a row sits in the outbox a long time** → acceptable; `traceparent` is a context id, not time-sensitive; trace simply spans the real elapsed time.
- **Mixed traced/untraced services** → nullable columns + optional beans mean untraced services write null and emit no header (no-op), no failures.

## Migration Plan

1. Build & test `:libs:messaging` and `:services:api-gateway`, then full `./gradlew build`.
2. Rebuild touched images: `docker compose up -d --build api-gateway order-service inventory-service payment-service order-query-service notification-service`.
3. New outbox columns auto-applied by `ddl-auto: update` on first boot.
4. Verify one connected trace in Jaeger (UI + scripted `curl` of `/api/traces`).
5. Rollback: revert deps/config; nullable columns are inert if unused — no data migration to undo.

## Open Questions

- None blocking. (Part-1 gateway auth work is still uncommitted — commit/branch before or alongside this part.)
