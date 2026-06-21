## 1. Gateway tracing (Gap 1)

- [x] 1.1 Add `io.micrometer:micrometer-tracing-bridge-otel` and `io.opentelemetry:opentelemetry-exporter-otlp` to `services/api-gateway/build.gradle.kts` (versions from Boot BOM)
- [x] 1.2 Add the standard `management.tracing.sampling.probability: 1.0` + `management.otlp.tracing.endpoint` block to `services/api-gateway/src/main/resources/application.yml`
- [x] 1.3 Add `OTEL_EXPORTER_OTLP_ENDPOINT: http://jaeger:4318/v1/traces` to the `api-gateway` service env in `infra/docker-compose.yml`
- [x] 1.4 Confirm `:services:api-gateway:test` passes

## 2. Outbox data model (Gap 2)

- [x] 2.1 Add `micrometer-tracing` (API) to `libs/messaging/build.gradle.kts` implementation deps
- [x] 2.2 Add nullable `traceparent` and `tracestate` columns (`@Column(columnDefinition = "text")`) to `outbox/OutboxEvent.java` with constructor params and getters

## 3. Outbox write-side capture

- [x] 3.1 Inject `ObjectProvider<Tracer>` + `ObjectProvider<Propagator>` into `outbox/OutboxWriter.java` (optional → no-op when tracing absent)
- [x] 3.2 In `append(...)`, when a current `TraceContext` exists, `propagator.inject(...)` into a `Map<String,String>` carrier and persist `traceparent`/`tracestate` on the row

## 4. Outbox relay re-injection

- [x] 4.1 In `outbox/OutboxRelay.java` build a `ProducerRecord<>(topic, null, key, payload)` and, when `traceparent != null`, add `traceparent` (and `tracestate` if present) as record headers before `kafka.send(record).get()`
- [x] 4.2 Verify template observation stays disabled (manual injection only, no scheduler-context leak)

## 5. Listener continuation

- [x] 5.1 Enable observation on the `kafkaListenerContainerFactory` bean in `libs/messaging` `config/KafkaConfig.java`
- [x] 5.2 Set `factory.getContainerProperties().setObservationEnabled(true)` (the container resolves the `ObservationRegistry` bean from context; `setObservationRegistry` is not available in this spring-kafka version)
- [x] 5.3 Enable the same observation on the leaf consumers' own `KafkaConfig` (notification-service, order-query-service — they do NOT use `libs:messaging`), so their spans join the trace (required by 7.4)

## 6. Tests

- [x] 6.1 Add `testImplementation("io.micrometer:micrometer-tracing-test")` to `libs/messaging/build.gradle.kts`
- [x] 6.2 `OutboxTracePropagationTest`: with a `SimpleTracer` span active, `append(...)` persists a non-null `traceparent` matching the active context
- [x] 6.3 `OutboxTracePropagationTest`: `flush()` adds a `traceparent` Kafka header equal to the stored value (mock `KafkaTemplate`, capture `ProducerRecord`)
- [x] 6.4 `OutboxTracePropagationTest`: with no active span, `append` stores null and `flush` sends no trace header

## 7. End-to-end verification

- [x] 7.1 `cd backend && ./gradlew :libs:messaging:test :services:api-gateway:test` green, then full `./gradlew build`
- [x] 7.2 Rebuild touched images: `docker compose up -d --build api-gateway order-service inventory-service payment-service order-query-service notification-service`
- [x] 7.3 Mint token, place order through gateway (`POST /api/auth/token` → `POST /api/orders` with bearer → 202) — order `04d9538b`, HTTP 202
- [x] 7.4 Confirm one connected trace in Jaeger — order trace `9452cf4b...`: 19 spans, single traceId, processes = api-gateway, order-service, inventory-service, payment-service, order-query-service, notification-service
- [x] 7.5 Negative sanity: public catalog route recorded its own gateway trace (`dbb99d7d`, api-gateway+catalog-service); saga spans all share the order's single root traceId (not one-per-hop)
