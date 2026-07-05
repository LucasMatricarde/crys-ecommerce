{{/*
Common labels applied to every object.
*/}}
{{- define "crys.labels" -}}
app.kubernetes.io/part-of: crys
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end -}}

{{/*
Selector labels for a single component. Call: {{ include "crys.selectorLabels" "order-service" }}
*/}}
{{- define "crys.selectorLabels" -}}
app.kubernetes.io/name: {{ . }}
{{- end -}}

{{/*
Fully-qualified image ref for an application service.
Call: {{ include "crys.image" (dict "root" $ "name" $name) }}
*/}}
{{- define "crys.image" -}}
{{- $img := .root.Values.image -}}
{{- printf "%s%s/%s:%s" $img.registry $img.repoPrefix .name $img.tag -}}
{{- end -}}

{{/*
One application Deployment from a service entry.
Call: {{ include "crys.appDeployment" (dict "root" $ "name" $name "svc" $svc) }}
*/}}
{{- define "crys.appDeployment" -}}
{{- $root := .root -}}
{{- $svc := .svc -}}
{{- $probes := $root.Values.probes -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .name }}
  labels:
    {{- include "crys.labels" $root | nindent 4 }}
    {{- include "crys.selectorLabels" .name | nindent 4 }}
spec:
  replicas: {{ $svc.replicas | default 1 }}
  selector:
    matchLabels:
      {{- include "crys.selectorLabels" .name | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "crys.labels" $root | nindent 8 }}
        {{- include "crys.selectorLabels" .name | nindent 8 }}
    spec:
      containers:
        - name: {{ .name }}
          image: {{ include "crys.image" (dict "root" $root "name" .name) }}
          imagePullPolicy: {{ $root.Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ $svc.port }}
          envFrom:
            - configMapRef:
                name: crys-shared-env
            - secretRef:
                name: crys-secrets
          env:
            {{- if $svc.seedProfile }}
            - name: SPRING_PROFILES_ACTIVE
              value: seed
            {{- end }}
            {{- range $k, $v := $svc.env }}
            - name: {{ $k }}
              value: {{ $v | quote }}
            {{- end }}
          startupProbe:
            httpGet:
              path: {{ $probes.startup.path }}
              port: http
            periodSeconds: {{ $probes.startup.periodSeconds }}
            timeoutSeconds: {{ $probes.startup.timeoutSeconds }}
            failureThreshold: {{ $probes.startup.failureThreshold }}
          livenessProbe:
            httpGet:
              path: {{ $probes.liveness.path }}
              port: http
            periodSeconds: {{ $probes.liveness.periodSeconds }}
            timeoutSeconds: {{ $probes.liveness.timeoutSeconds }}
            failureThreshold: {{ $probes.liveness.failureThreshold }}
          readinessProbe:
            httpGet:
              path: {{ $probes.readiness.path }}
              port: http
            periodSeconds: {{ $probes.readiness.periodSeconds }}
            timeoutSeconds: {{ $probes.readiness.timeoutSeconds }}
            failureThreshold: {{ $probes.readiness.failureThreshold }}
{{- end -}}
