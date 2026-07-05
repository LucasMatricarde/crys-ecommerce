#!/usr/bin/env bash
# Build all CRYS service images and load them into a local cluster.
#
# Usage:
#   ./deploy/build-images.sh                 # kind (default), cluster name "kind"
#   CLUSTER=minikube ./deploy/build-images.sh
#   KIND_CLUSTER=mycluster ./deploy/build-images.sh
#
# Run from the backend root (build context = backend root, per each service Dockerfile).
set -euo pipefail

cd "$(dirname "$0")/.."   # -> backend/

TAG="${TAG:-dev}"
PREFIX="${PREFIX:-crys}"
CLUSTER="${CLUSTER:-kind}"          # kind | minikube
KIND_CLUSTER="${KIND_CLUSTER:-kind}"

SERVICES=(
  api-gateway
  catalog-service
  order-service
  inventory-service
  payment-service
  order-query-service
  notification-service
)

for svc in "${SERVICES[@]}"; do
  img="${PREFIX}/${svc}:${TAG}"
  echo "==> building ${img}"
  docker build -f "services/${svc}/Dockerfile" -t "${img}" .

  echo "==> loading ${img} into ${CLUSTER}"
  case "${CLUSTER}" in
    kind)     kind load docker-image "${img}" --name "${KIND_CLUSTER}" ;;
    minikube) minikube image load "${img}" ;;
    *) echo "unknown CLUSTER='${CLUSTER}' (expected kind|minikube)" >&2; exit 1 ;;
  esac
done

echo "==> done: ${#SERVICES[@]} images built + loaded (tag=${TAG})"
