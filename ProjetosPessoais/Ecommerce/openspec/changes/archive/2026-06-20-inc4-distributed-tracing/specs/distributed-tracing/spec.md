## ADDED Requirements

### Requirement: Gateway records and propagates trace context

The api-gateway SHALL participate in distributed tracing: it SHALL record a span for every inbound request and propagate the W3C `traceparent` context to downstream services over HTTP.

#### Scenario: Inbound request creates a gateway span

- **WHEN** a request arrives at the api-gateway
- **THEN** the gateway records a trace span and exports it to the configured OTLP endpoint

#### Scenario: Context propagates to downstream service

- **WHEN** the gateway proxies a request to order-service
- **THEN** the outgoing request carries a W3C `traceparent` header so order-service continues the same trace

#### Scenario: Public route is still traced

- **WHEN** a request hits a public (unauthenticated) route on the gateway
- **THEN** the gateway still records a span for that request

### Requirement: Outbox persists active trace context

When an event is written to the transactional outbox while a trace is active, the outbox row SHALL persist the W3C trace context (`traceparent`, and `tracestate` when present) captured at write time.

#### Scenario: Active span captured on write

- **WHEN** `OutboxWriter.append(...)` is called within an active trace context
- **THEN** the persisted outbox row's `traceparent` is non-null and matches the active context

#### Scenario: No active span stores null

- **WHEN** `OutboxWriter.append(...)` is called with no active trace context
- **THEN** the persisted outbox row's `traceparent` is null

### Requirement: Relay re-injects trace context onto Kafka events

The outbox relay SHALL re-inject the persisted trace context as Kafka record headers when publishing an event, so the asynchronous hop carries the originating trace rather than the scheduler's context.

#### Scenario: Stored context emitted as header

- **WHEN** `OutboxRelay.flush()` publishes a row that has a stored `traceparent`
- **THEN** the produced Kafka record includes a `traceparent` header equal to the stored value (and `tracestate` when present)

#### Scenario: No stored context emits no trace header

- **WHEN** `OutboxRelay.flush()` publishes a row with no stored `traceparent`
- **THEN** the produced Kafka record carries no trace header

### Requirement: Listeners continue the trace from Kafka headers

Saga service Kafka listeners SHALL extract the inbound `traceparent` from record headers and continue the same trace rather than starting a new one.

#### Scenario: Listener continues inbound trace

- **WHEN** a saga listener consumes a record carrying a `traceparent` header
- **THEN** the listener's processing span is a child of that trace, sharing the same traceId

### Requirement: One order maps to one connected trace

A single order placed through the gateway SHALL appear in Jaeger as one connected trace under a single traceId, spanning the gateway, order-service, inventory-service, payment-service, and the read/notification consumers.

#### Scenario: End-to-end order trace is connected

- **WHEN** an order is placed through the gateway and the saga completes
- **THEN** Jaeger shows a single trace whose processes include api-gateway, order-service, inventory-service, payment-service, and order-query-service/notification-service under one traceId
