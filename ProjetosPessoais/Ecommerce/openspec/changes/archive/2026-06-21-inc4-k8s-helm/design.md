## Context

The CRYS backend is 7 Java 21 / Spring Boot 3.3.5 microservices plus a Kafka event-driven saga, fronted by a reactive Spring Cloud Gateway. Today the only deployment surface is `backend/infra/docker-compose.yml` (postgres 16, mongo 7, redis 7, kafka 3.8.1 KRaft, jaeger 1.60, prometheus v2.54.1, grafana 11.2.0). This change adds a Kubernetes deployment via a single Helm chart, the last piece of the Inc 4 roadmap. docker-compose is the source of truth for every image, port, and env var — the chart translates it directly. 6/7 services already expose Actuator probe health groups; only api-gateway is missing the toggle.

## Goals / Non-Goals

**Goals:**
- One `helm install crys ./deploy/helm/crys` brings up the full stack on a local `kind`/minikube cluster.
- DRY: a single generic Deployment/Service template ranges over a `.Values.services` map.
- In-cluster infra parity with docker-compose; no external/managed services.
- K8s liveness/readiness/startup probes mapped to Actuator health groups; all pods reach Ready with no CrashLoop.
- Verified end-to-end by running the order saga live on the cluster (JWT mint → order → saga → CONFIRMED), with traces in Jaeger and all targets UP in Prometheus.

**Non-Goals:**
- No cloud/managed cluster, no Ingress/TLS/cert-manager, no HPA, no CI deploy pipeline.
- No production secret management — dev `JWT_SECRET` default with a prod-override note.
- No application code/behavior change; Dockerfiles built as-is.

## Decisions

**Single umbrella chart, generic templated workloads.** One chart `backend/deploy/helm/crys/`. App services rendered via `range $name, $svc := .Values.services` into one Deployment + one ClusterIP Service each, so adding/changing a service is a values edit, not a new template. Alternative considered: subcharts per service — rejected as over-engineered for 7 near-identical Spring Boot apps.

**In-cluster self-managed infra over chart dependencies.** Infra (postgres/mongo/kafka as StatefulSet+PVC; redis/jaeger/prometheus/grafana as Deployment) is authored as plain manifests under `templates/infra/`, copying env directly from docker-compose. Keeps `helm install` fully self-contained and parity-checkable against compose; avoids pinning third-party chart versions. Trade-off: we maintain the infra manifests, but they're single-replica dev infra and mirror compose 1:1.

**Probes mapped to Actuator health groups.** Spring Boot exposes `/actuator/health/liveness` and `/actuator/health/readiness` when `management.endpoint.health.probes.enabled: true`. Shared `.Values.probes` defaults applied to every container. Because JVM cold start is slow, use a `startupProbe` (generous `failureThreshold`) so liveness doesn't kill a slow-starting pod, plus a readiness probe gating traffic.

**No `depends_on` equivalent — converge via readiness + retries.** Kubernetes has no ordering primitive; rely on readiness probes gating Service endpoints plus Spring connection retries / container restart to converge once infra is up. Add `initContainers` wait-for only if a service proves unable to self-recover.

**Images built locally and loaded into the cluster.** `image.pullPolicy: IfNotPresent`, `tag: dev`, no registry. `build-images.sh` builds `crys/<svc>:dev` from the backend root (build context per existing Dockerfiles) and `kind load docker-image`s each; minikube alternative documented.

**Config split: ConfigMap (non-secret) + Secret.** Shared non-secret env (in-cluster service DNS like `http://order-service:8082`, `KAFKA_BOOTSTRAP: kafka:9092`, redis/mongo hosts, `OTEL_EXPORTER_OTLP_ENDPOINT` → in-cluster jaeger) in a ConfigMap; `JWT_SECRET` + DB credentials in a Secret (dev default, prod override). Per-service vars live in `$svc.env`.

## Risks / Trade-offs

- **Slow JVM cold start → false liveness failures / CrashLoop** → mitigated by `startupProbe` with generous `initialDelaySeconds`/`failureThreshold`; tune per-service if needed.
- **Startup ordering (service up before kafka/db)** → readiness probes + Spring retries; container restart converges. `initContainers` reserved as fallback.
- **Dev `JWT_SECRET` leaking to prod** → Secret default is clearly dev-only and documented as prod-must-override, mirroring the docker-compose security note.
- **kind image-load drift** → `pullPolicy: IfNotPresent` + explicit `kind load` step in the helper; rebuild+reload on image change.
- **Prometheus scrape targets** → rewrite `observability/prometheus.yml` jobs to k8s service DNS names in the chart ConfigMap.

## Migration Plan

1. Add the api-gateway probes block; author the chart + build script (no runtime change to deployed compose stack).
2. Static validation: `helm lint`, `helm template`, `kubeconform`.
3. `kind create cluster`; `build-images.sh`; `helm install crys ./deploy/helm/crys`; watch all pods to Ready.
4. Live saga + observability verification (see tasks).
5. Teardown: `helm uninstall crys && kind delete cluster`. Rollback is chart-only — docker-compose remains the untouched alternative deployment path.
