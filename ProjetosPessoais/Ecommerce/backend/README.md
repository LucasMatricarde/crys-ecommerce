# CRYS. — Backend

Java microservices backing the **CRYS.** premium cannabis storefront. Built in
increments; this repo currently covers **Inc 0 (Foundation)**, **Inc 1 (Catalog
read path / CQRS read side)**, and **Inc 2 (Order + Saga core)**.

## Target architecture (reference)

Spring Boot (Java 21) services, polyglot persistence, Kafka-orchestrated order
saga (event-driven). Reliability via transactional outbox + idempotent consumers
+ DLQ. Observability via Micrometer/OpenTelemetry → Prometheus + Grafana + Jaeger.

| Increment | Scope | Status |
|-----------|-------|--------|
| 0 Foundation | Gradle monorepo, `common-events`, infra compose, observability | ✅ done |
| 1 Catalog | `catalog-service` (Mongo + Redis cache), `api-gateway` | ✅ done |
| 2 Order + Saga core | `order/inventory/payment-service`, Kafka orchestration, outbox, idempotency, DLQ | ✅ done |
| 3 Notification + CQRS projection | — | ⏳ next |
| 4 Hardening | JWT auth, full tracing, K8s/Helm | planned |

## Layout

```
backend/
  settings.gradle.kts          # subproject registry
  build.gradle.kts             # Java 21 toolchain, shared test config
  gradle/libs.versions.toml    # version catalog
  libs/common-events/          # shared event envelope, topics, saga payloads (pure Java)
  libs/messaging/              # shared Spring plumbing: outbox, idempotency, Kafka/DLQ
  services/
    catalog-service/           # Spring Boot + Mongo + Redis (CQRS read side)
    api-gateway/               # Spring Cloud Gateway (BFF, CORS, rate limit)
    order-service/             # saga orchestrator + order API (Postgres: crys_order)
    inventory-service/         # stock reserve/release (Postgres: crys_inventory)
    payment-service/           # mock approve/decline (Postgres: crys_payment)
  infra/
    docker-compose.yml         # postgres, mongo, redis, kafka(KRaft), prom, grafana, jaeger + 5 services
    postgres/init/             # creates crys_order / crys_inventory / crys_payment
    observability/             # prometheus.yml, grafana datasource provisioning
```

## Order saga (Inc 2)

Placing an order runs an **orchestration saga** driven by Kafka, with the
orchestrator inside `order-service`. Reliability rests on three patterns, factored
into the shared `libs/messaging` library: a **transactional outbox** (domain write
+ event insert commit together; a scheduled relay publishes to Kafka), **idempotent
consumers** (a `processed_message` row per handled envelope id), and a **DLQ**
(`DefaultErrorHandler` + `DeadLetterPublishingRecoverer` → `<topic>.DLT`).

```
POST order ─▶ OrderCreated ─▶ [orchestrator] ─▶ ReserveInventory
                                                      │
                          InventoryReserved ◀─────────┤ (or InventoryRejected ─▶ CANCELLED)
                                  │
            [orchestrator] ─▶ ProcessPayment ─▶ PaymentApproved ─▶ CONFIRMED
                                              └▶ PaymentDeclined ─▶ ReleaseInventory ─▶ CANCELLED
```

## Build & test

Requires a JDK **17+** to run Gradle (the Spring Boot plugin needs it) and a
JDK **21** toolchain for compilation (auto-provisioned via foojay if absent).
Integration tests use Testcontainers, so **Docker must be running**.

```bash
export JAVA_HOME=/path/to/jdk-21      # or any JDK 17+
./gradlew build
```

### Docker Engine ≥ 29 note

Engine 29 raised its minimum API version to 1.40, but the docker-java client
bundled with Testcontainers defaults below that — the engine then rejects `/info`
with HTTP 400 and tests fail with "Could not find a valid Docker environment".
The build pins a compatible version via the `api.version` system property
(default `1.44`, see root `build.gradle.kts`). Override if needed:

```bash
./gradlew build -PdockerApiVersion=1.45
```

If your Docker socket isn't at `/var/run/docker.sock`, point Testcontainers at it:

```bash
export DOCKER_HOST=unix://$HOME/.docker/run/docker.sock
```

## Run the full stack

```bash
cd infra
docker compose up -d --build
```

Brings up the datastores, Kafka, the observability stack, and both services.
`catalog-service` boots with the `seed` profile and loads the example CRYS catalog.

| Endpoint | URL |
|----------|-----|
| Gateway → catalog list | http://localhost:8080/api/catalog/products |
| Gateway → product by slug | http://localhost:8080/api/catalog/products/rosin-premium |
| Gateway → place order (POST) | http://localhost:8080/api/orders |
| Gateway → order status | http://localhost:8080/api/orders/{id} |
| Catalog service (direct) | http://localhost:8081/catalog/products |
| Prometheus | http://localhost:9090 |
| Grafana (anon enabled) | http://localhost:3000 |
| Jaeger UI | http://localhost:16686 |

## API contract (Inc 1)

`GET /api/catalog/products?strainType={INDICA|SATIVA|HYBRID}&page=&size=`
→ paginated products.

`GET /api/catalog/products/{slug}` → single product (second call served from the
Redis cache). Money is returned as both `priceCents` (int) and `priceFormatted`
(`"R$ 189,90"`, BRL).

## API contract (Inc 2 — orders)

`POST /api/orders` `{ "productSlug": "rosin-premium", "quantity": 1 }` → **202**
with `{ id, status: "PENDING", amountCents, ... }`. The order is priced from
catalog-service server-side. The saga then resolves it asynchronously.

`GET /api/orders/{id}` → current status; poll until `CONFIRMED` or `CANCELLED`.

Demo paths against the seeded data:
- **Happy:** `rosin-premium` qty 1 → `CONFIRMED` (stock 100, amount under the
  payment decline threshold).
- **Inventory reject:** `shatter-cristal` (seeded stock 0) → `CANCELLED`.
- **Payment decline + compensation:** `rosin-premium` qty 60 → amount ≥ the
  `crys.payment.decline-threshold-cents` (default `1000000`) → stock is reserved,
  payment declines, stock is released, order `CANCELLED`.

The static storefront in `../frontend/` does not consume these APIs yet — wiring it
up is out of scope; the REST contracts above are the deliverable.
