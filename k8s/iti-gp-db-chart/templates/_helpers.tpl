{{- define "db.selectorLabels" -}}
app: mysql
{{- end }}

{{- define "db.network.backendLabels" -}}
app: nodejs-app
{{- end }}