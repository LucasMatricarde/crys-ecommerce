## 1. Config gap — api-gateway probes

- [x] 1.1 Add a `management.endpoint.health.probes.enabled: true` block to `services/api-gateway/src/main/resources/application.yml`, mirroring `order-service/.../application.yml` so the gateway exposes `/actuator/health/liveness` and `/actuator/health/readiness` (WebFlux actuator).

## 2. Helm chart scaffold

- [x] 2.1 Create `backend/deploy/helm/crys/Chart.yaml` — name `crys`, type `application`, `appVersion` matching the backend.
- [x] 2.2 Create `values.yaml` — `image.registry`/`pullPolicy: IfNotPresent`/`tag: dev`; `services:` map (api-gateway 8080, catalog-service 8081, order-service 8082, inventory-service 8083, payment-service 8084, order-query-service 8085, notification-service 8086) with per-entry `port`/`replicas`/`env`/optional `seedProfile`, values copied from docker-compose; shared `probes:` defaults (liveness/readiness paths, initialDelay, period, failureThreshold, startup probe).
- [x] 2.3 Create `templates/_helpers.tpl` — name/label helpers + a named template rendering one Deployment given a service entry.

## 3. Helm chart — application services

- [x] 3.1 Create `templates/app/deployment.yaml` — `range $name, $svc := .Values.services` → one Deployment each: image `crys/<name>:dev`, containerPort `$svc.port`, env merged from `$svc.env` + shared `OTEL_EXPORTER_OTLP_ENDPOINT` (in-cluster jaeger), `envFrom` the shared ConfigMap + Secret, liveness/readiness/startup probes from `.Values.probes`.
- [x] 3.2 Create `templates/app/service.yaml` — `range` → ClusterIP Service per service; api-gateway optionally `NodePort`/LoadBalancer as the only external entrypoint.
- [x] 3.3 Create `templates/app/configmap.yaml` — non-secret shared env using in-cluster DNS (`http://order-service:8082`, `KAFKA_BOOTSTRAP: kafka:9092`, redis/mongo hosts).
- [x] 3.4 Create `templates/secret.yaml` — `JWT_SECRET` (dev default, prod-override note from docker-compose) + DB credentials.

## 4. Helm chart — in-cluster infra (`templates/infra/`)

- [x] 4.1 `postgres` StatefulSet + headless Service + PVC; mount `infra/postgres/init/01-databases.sql` via ConfigMap into `/docker-entrypoint-initdb.d`; env `POSTGRES_USER/PASSWORD/DB`.
- [x] 4.2 `mongo` StatefulSet + Service + PVC.
- [x] 4.3 `kafka` StatefulSet + Service + PVC; KRaft env from compose, advertised listener `PLAINTEXT://kafka:9092`.
- [x] 4.4 `redis` Deployment + Service.
- [x] 4.5 `jaeger` Deployment + Service (`COLLECTOR_OTLP_ENABLED=true`, ports 16686/4317/4318).
- [x] 4.6 `prometheus` Deployment + Service + ConfigMap (reuse `observability/prometheus.yml`, scrape targets rewritten to k8s service DNS).
- [x] 4.7 `grafana` Deployment + Service.
- [x] 4.8 Add a note on convergence (no `depends_on`; rely on readiness probes + Spring retries / restart); add `initContainers` wait-for only if a service can't self-recover.

## 5. Image build + load helper

- [x] 5.1 Add `backend/deploy/build-images.sh` — loop the 7 services, `docker build -f services/<svc>/Dockerfile -t crys/<svc>:dev .` from backend root, then `kind load docker-image crys/<svc>:dev`; document the minikube `minikube image load` alternative.

## 6. Docs

- [x] 6.1 Update `backend/README.md` roadmap line: Inc 4 K8s/Helm status `planned` → `done`; add a "Kubernetes (Helm)" section (prerequisites, build+load, `helm install`, port-forward, teardown).
- [x] 6.2 (Optional) `backend/deploy/helm/crys/README.md` — chart values reference.

## 7. Verification (end-to-end)

- [x] 7.1 Static: `helm lint deploy/helm/crys`; `helm template deploy/helm/crys` renders clean; `kubeconform` validates rendered manifests.
- [x] 7.2 Cluster up: `kind create cluster`; run `build-images.sh` (build + load all 7 images).
- [x] 7.3 Install: `helm install crys ./deploy/helm/crys`; `kubectl get pods -w` → all infra then all 7 services reach Ready, no CrashLoop.
- [x] 7.4 Probe check: `kubectl describe pod <gateway>` shows liveness/readiness probes hitting `/actuator/health/*` and passing.
- [x] 7.5 Saga e2e: `kubectl port-forward svc/api-gateway 8080:8080`; mint demo JWT; `POST` an order; confirm saga reaches CONFIRMED via order-query through the gateway.
- [x] 7.6 Observability: port-forward jaeger 16686 → one order = one multi-span trace; port-forward prometheus 9090 → all 7 service targets `UP`.
- [x] 7.7 Teardown: `helm uninstall crys && kind delete cluster`.
