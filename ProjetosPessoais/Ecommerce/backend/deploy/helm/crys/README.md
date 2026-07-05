# crys Helm chart

Single umbrella chart that deploys the full CRYS backend (7 Spring Boot services +
Kafka saga) plus in-cluster infra and observability to a local Kubernetes cluster.
docker-compose parity; one `helm install` brings up everything.

```bash
helm install crys ./deploy/helm/crys
```

Images are built locally and loaded into the cluster (`../../build-images.sh`) — the
chart uses `pullPolicy: IfNotPresent` and tag `dev`, so no registry is required.

## How it works

- **Application services** are rendered generically: `templates/app/deployment.yaml`
  and `service.yaml` `range` over `.Values.services`, calling the `crys.appDeployment`
  helper. Adding a service = a new entry under `services:`, no template change.
- **Infra** (`templates/infra/`) mirrors docker-compose: postgres/mongo/kafka as
  StatefulSets with PVCs, redis/jaeger/prometheus/grafana as Deployments.
- **Config** is split: shared non-secret env → `crys-shared-env` ConfigMap; secrets
  (`JWT_SECRET`, DB creds) → `crys-secrets` Secret. Both injected via `envFrom`;
  per-service specifics live in each entry's `env` map.
- **Probes** map to Actuator health groups (`/actuator/health/liveness|readiness`).
  A generous `startupProbe` absorbs JVM cold start; readiness gates Service traffic.

## Values

| Key | Default | Description |
|-----|---------|-------------|
| `image.registry` | `""` | Registry prefix; empty = local `crys/<svc>:dev` |
| `image.repoPrefix` | `crys` | Image repo prefix |
| `image.tag` | `dev` | Image tag (matches build-images.sh) |
| `image.pullPolicy` | `IfNotPresent` | No registry pull for kind-loaded images |
| `probes.{liveness,readiness,startup}` | see values | Shared probe timing |
| `sharedEnv` | in-cluster DNS | Non-secret env for all services (ConfigMap) |
| `secrets.jwtSecret` | dev default | **PROD MUST OVERRIDE** — HS256 gateway key |
| `secrets.dbUser` / `secrets.dbPassword` | `crys` | DB credentials (**override in prod**) |
| `services.<name>.port` | — | Container/Service port |
| `services.<name>.replicas` | `1` | Replica count |
| `services.<name>.seedProfile` | unset | Sets `SPRING_PROFILES_ACTIVE=seed` |
| `services.<name>.env` | `{}` | Per-service env (e.g. DB_URL, MONGODB_URI) |
| `services.<name>.serviceType` | `ClusterIP` | `NodePort` for api-gateway |
| `services.<name>.nodePort` | — | Node port when `serviceType: NodePort` |
| `infra.<comp>.image` | compose pins | Infra image tags |
| `infra.{postgres,mongo,kafka}.storage` | `1Gi` | PVC size |

## Service inventory

| Service | Port | Notes |
|---------|------|-------|
| api-gateway | 8080 | NodePort 30080 — only external entrypoint |
| catalog-service | 8081 | seed profile; mongo + redis |
| order-service | 8082 | postgres + kafka + catalog |
| inventory-service | 8083 | seed profile; postgres + kafka |
| payment-service | 8084 | postgres + kafka |
| order-query-service | 8085 | mongo + kafka |
| notification-service | 8086 | mongo + kafka |
