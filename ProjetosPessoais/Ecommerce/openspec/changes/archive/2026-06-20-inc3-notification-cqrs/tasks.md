## 1. Event contract (libs/common-events)

- [x] 1.1 Add `OrderConfirmed(UUID orderId)` record
- [x] 1.2 Add `OrderCancelled(UUID orderId, String reason)` record
- [x] 1.3 Add `ORDER_CONFIRMED` and `ORDER_CANCELLED` constants to `EventTypes`

## 2. order-service emits lifecycle facts

- [x] 2.1 In `OrderSaga`, at the `order.confirm()` point, append an `OrderConfirmed` envelope to the outbox (`Topics.ORDER_EVENTS`) in the same transaction
- [x] 2.2 At the `order.cancel()` point, append an `OrderCancelled` envelope with reason ("inventory rejected" / "payment declined") in the same transaction
- [x] 2.3 Verify the existing outbox relay publishes both new event types to `order.events`

## 3. Shared Mongo idempotency

- [x] 3.1 Add `@Document processed_message` (id = envelope id) + existence/insert-if-absent guard usable by the two new services (reuse via copy per service or a small shared util)

## 4. order-query-service (NEW, port 8085)

- [x] 4.1 Scaffold module from catalog-service skeleton (build.gradle.kts, application.yml, multi-stage Dockerfile, actuator + OTel + Prometheus); register in `settings.gradle.kts`
- [x] 4.2 Define `@Document order_view` (orderId, productSlug, quantity, amountCents, status, reason, createdAt, updatedAt, timeline[])
- [x] 4.3 Add `@KafkaListener` on `order.events`, `inventory.events`, `payment.events` (groupId `order-query-service`) using `EnvelopeCodec`, idempotent per envelope id
- [x] 4.4 Project handlers: OrderCreated→PENDING(+created); InventoryReserved→RESERVED(+reserved); InventoryRejected→reason; PaymentApproved/Declined→payment step; OrderConfirmed→CONFIRMED; OrderCancelled→CANCELLED+reason (upsert + append timeline)
- [x] 4.5 Query API: `GET /order-views/{orderId}` (404 if absent), `GET /order-views?status=` (paged), mirroring catalog `ProductController`/`ProductResponse`

## 5. notification-service (NEW, port 8086)

- [x] 5.1 Scaffold module from catalog-service skeleton; register in `settings.gradle.kts`
- [x] 5.2 Define `@Document notification` (id, orderId, type, channel="mock", message pt-BR, createdAt)
- [x] 5.3 Add `@KafkaListener` on `order.events` (groupId `notification-service`), idempotent per envelope id
- [x] 5.4 Handlers persist + log INFO: OrderCreated→ORDER_RECEIVED ("Recebemos seu pedido…"); OrderConfirmed→ORDER_CONFIRMED ("Pedido confirmado! Sua resina está a caminho."); OrderCancelled→ORDER_CANCELLED ("Seu pedido foi cancelado: <reason>.")
- [x] 5.5 Query API: `GET /notifications?orderId=` (list by order)

## 6. api-gateway routes

- [x] 6.1 Add `/api/order-views/** → order-query-service:8085` route (CORS + Redis rate limiter, RewritePath `(?<segment>/?.*)`)
- [x] 6.2 Add `/api/notifications/** → notification-service:8086` route
- [x] 6.3 Add `ORDER_QUERY_URI` / `NOTIFICATION_URI` env + depends_on

## 7. Infra

- [x] 7.1 Add `order-query-service` + `notification-service` to `docker-compose.yml` (MONGODB_URI, KAFKA_BOOTSTRAP, OTEL endpoint; depends_on mongo+kafka healthy)
- [x] 7.2 Add both as Prometheus scrape jobs in `prometheus.yml`

## 8. Tests

- [x] 8.1 Testcontainers (Mongo + Kafka) for order-query-service: publish OrderCreated then OrderConfirmed → assert `order_view` reaches CONFIRMED with timeline; redelivery is a no-op
- [x] 8.2 Testcontainers for notification-service: assert one notification doc per event; redelivery is a no-op
- [x] 8.3 Adapt catalog `AbstractIntegrationTest` (Mongo) + Inc 2 `AbstractSagaIntegrationTest` Kafka container as the test base

## 9. End-to-end verification

- [x] 9.1 `cd backend && JAVA_HOME=<jdk21> ./gradlew build` — compiles + all tests pass
- [x] 9.2 `docker compose up -d --build` — all 7 services healthy; restart Prometheus after config edit
- [x] 9.3 Happy path via gateway: `POST /api/orders {rosin-premium,1}` → poll `GET /api/order-views/{id}` until CONFIRMED (created→reserved→payment→confirmed); `GET /api/notifications?orderId={id}` lists ORDER_RECEIVED + ORDER_CONFIRMED
- [x] 9.4 Cancel path: order `shatter-cristal` → `order-view` CANCELLED with reason; ORDER_CANCELLED notification exists
- [x] 9.5 Observe: 7 Prometheus targets up; Jaeger shows the event consumers; DLTs empty
