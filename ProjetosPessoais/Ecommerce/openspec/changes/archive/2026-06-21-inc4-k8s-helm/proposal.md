## Why

The CRYS backend (Inc 0–3 + Inc 4 JWT auth and distributed tracing) only runs via `backend/infra/docker-compose.yml`. The README roadmap lists Inc 4 as "JWT auth, full tracing, **K8s/Helm**", and the K8s/Helm slice is the last unbuilt piece. This change delivers a single self-contained Helm chart that deploys the full stack — 7 services plus infra and observability — to a local Kubernetes cluster, with liveness/readiness probes wired to the Spring Boot Actuator health groups the services already expose.

## What Changes

- Add a single umbrella Helm chart `backend/deploy/helm/crys/` that installs the whole stack with one `helm install`, mirroring docker-compose parity.
- Generic, DRY templates: a `.Values.services` map drives one templated Deployment + Service per application service (api-gateway, catalog, order, inventory, payment, order-query, notification).
- In-cluster, self-managed infra manifests: postgres, mongo, redis, kafka (KRaft), jaeger, prometheus, grafana — no external/managed dependencies.
- Wire Kubernetes liveness/readiness (and startup) probes to `/actuator/health/liveness` and `/actuator/health/readiness`.
- Fix the one config gap: add `management.endpoint.health.probes.enabled` to `services/api-gateway` (the other 6 services already have it).
- Add an image build + `kind load` helper script (`backend/deploy/build-images.sh`).
- Update `backend/README.md`: roadmap status and a "Kubernetes (Helm)" section.

## Capabilities

### New Capabilities
- `deployment`: Kubernetes/Helm deployment of the full CRYS stack — single umbrella chart, env-driven config, in-cluster infra parity with docker-compose, container probes mapped to Actuator health groups, and single-command install/teardown.

### Modified Capabilities
<!-- None. Application behavior and existing capabilities (gateway-auth, distributed-tracing, order-*, etc.) are unchanged; this change only adds a deployment surface. -->

## Impact

- **New**: `backend/deploy/helm/crys/**` (Chart.yaml, values.yaml, templates for app + infra), `backend/deploy/build-images.sh`, `openspec/changes/inc4-k8s-helm/**`.
- **Edit**: `services/api-gateway/src/main/resources/application.yml` (add probes block), `backend/README.md` (roadmap status + deploy section).
- **No code/behavior change** to any service runtime logic; Dockerfiles built as-is.
- **Tooling**: requires `kind` (or minikube), `helm`, `kubectl` for local verification.
- **Non-goals (this increment)**: no cloud/managed cluster, no Ingress/TLS/cert-manager, no production secret management (dev `JWT_SECRET` default, prod must override), no HPA/autoscaling, no CI deploy pipeline.
