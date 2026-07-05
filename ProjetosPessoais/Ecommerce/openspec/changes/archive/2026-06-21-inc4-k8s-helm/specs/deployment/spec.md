## ADDED Requirements

### Requirement: Single-command full-stack install

The chart SHALL deploy the entire CRYS stack — all 7 application services plus all infra (postgres, mongo, redis, kafka, jaeger, prometheus, grafana) — from a single `helm install crys ./deploy/helm/crys` with no external/managed dependencies. The chart MUST pass `helm lint` and render valid Kubernetes manifests via `helm template`.

#### Scenario: Lint and render

- **WHEN** `helm lint deploy/helm/crys` and `helm template deploy/helm/crys` are run
- **THEN** lint reports no errors and the rendered manifests validate against the Kubernetes schema (e.g. `kubeconform`)

#### Scenario: All workloads reach Ready

- **WHEN** `helm install crys ./deploy/helm/crys` is run on a cluster with the images loaded
- **THEN** every infra pod and all 7 service pods reach `Ready` with no pod in `CrashLoopBackOff`

### Requirement: DRY service templating from a values map

Application services SHALL be rendered generically by ranging over a `.Values.services` map, producing one Deployment and one ClusterIP Service per entry. Adding or changing a service MUST require only a values edit, not a new template file. Each entry MUST carry at least `port`, `replicas`, and a `env` map; per-service config values MUST derive from the docker-compose env blocks.

#### Scenario: One Deployment and Service per service entry

- **WHEN** the chart is rendered with the 7-entry `services` map
- **THEN** exactly 7 application Deployments and 7 application Services are produced, each named for its service and using image `crys/<name>:dev`

#### Scenario: Adding a service is values-only

- **WHEN** a new entry is added to `.Values.services`
- **THEN** a corresponding Deployment and Service are rendered with no change to any template file

### Requirement: Container probes mapped to Actuator health groups

Every application container SHALL define liveness and readiness probes targeting `/actuator/health/liveness` and `/actuator/health/readiness` on the service port, plus a startup probe with a generous failure budget to tolerate JVM cold start. The api-gateway service MUST expose these health groups (its `application.yml` MUST enable `management.endpoint.health.probes.enabled`).

#### Scenario: Probes hit Actuator health endpoints

- **WHEN** `kubectl describe pod <api-gateway-pod>` is inspected after install
- **THEN** its liveness and readiness probes target `/actuator/health/liveness` and `/actuator/health/readiness` and report passing

#### Scenario: Slow start does not trigger restart

- **WHEN** a service is slow to start due to JVM cold start
- **THEN** the startup probe holds off liveness so the pod is not killed before the application is up

### Requirement: Env-driven in-cluster configuration

Service-to-service and infra connectivity SHALL use in-cluster DNS names (e.g. `http://order-service:8082`, `KAFKA_BOOTSTRAP=kafka:9092`) supplied via a shared ConfigMap and a Secret. Non-secret config MUST live in a ConfigMap; `JWT_SECRET` and database credentials MUST live in a Secret with a dev-only default that is documented as requiring a production override. Tracing MUST point each service at the in-cluster jaeger service via `OTEL_EXPORTER_OTLP_ENDPOINT`.

#### Scenario: Services resolve dependencies by cluster DNS

- **WHEN** a service container starts
- **THEN** its env resolves dependencies via in-cluster Service DNS names, not localhost or external hosts

#### Scenario: Secret override path

- **WHEN** an operator sets a non-default `JWT_SECRET` at install time
- **THEN** the deployed services consume the overridden secret rather than the dev default

### Requirement: In-cluster infra parity with docker-compose

The chart SHALL provision stateful infra (postgres, mongo, kafka) as StatefulSets with persistent volumes and stateless infra (redis, jaeger, prometheus, grafana) as Deployments, matching the images, ports, and key env of `backend/infra/docker-compose.yml`. Postgres MUST initialize the `crys_order`, `crys_inventory`, and `crys_payment` databases (reusing the existing init SQL). Kafka MUST advertise `PLAINTEXT://kafka:9092`. Prometheus MUST scrape the in-cluster service targets.

#### Scenario: Databases initialized

- **WHEN** the postgres pod becomes Ready
- **THEN** the `crys_order`, `crys_inventory`, and `crys_payment` databases exist

#### Scenario: Prometheus targets up

- **WHEN** the Prometheus UI targets page is viewed after the stack is Ready
- **THEN** all 7 service scrape targets report `UP`

### Requirement: Image build and load helper

The repository SHALL provide a helper (`backend/deploy/build-images.sh`) that builds all 7 service images as `crys/<svc>:dev` from the backend root using the existing per-service Dockerfiles and loads them into the local cluster (`kind load docker-image`), with the minikube equivalent documented. The chart MUST use `pullPolicy: IfNotPresent` and tag `dev` so no registry is required.

#### Scenario: Build and load all images

- **WHEN** `build-images.sh` is run against a `kind` cluster
- **THEN** all 7 `crys/<svc>:dev` images are built and available in the cluster, and `helm install` schedules pods without attempting a registry pull

### Requirement: Live order saga on the cluster

The deployed stack SHALL support the end-to-end order saga. After install and a `kubectl port-forward` to the api-gateway, a client MUST be able to mint a demo JWT, place an order, and observe the saga complete (order → inventory reserve → payment → confirmed) via the order-query service, with the resulting distributed trace visible in Jaeger.

#### Scenario: Order reaches CONFIRMED

- **WHEN** an authenticated `POST` order is placed through the port-forwarded gateway
- **THEN** querying the order-query service through the gateway shows the order reach `CONFIRMED`

#### Scenario: Trace visible

- **WHEN** the same order is inspected in the port-forwarded Jaeger UI
- **THEN** a single multi-span trace spanning the participating services is present
