#!/usr/bin/env bash
# Stop hook: hace commit y push de cualquier cambio pendiente en el repo.
# Silencioso cuando no hay cambios. No bloquea si el push falla (p.ej. sin red).

set -u
cd "$(dirname "$0")/../.." || exit 0

[ -d .git ] || exit 0

if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

git add -A
fecha="$(date '+%Y-%m-%d %H:%M')"
git commit -m "auto-guardado: cambios del ${fecha}" >/dev/null 2>&1 || exit 0
git push origin main >/dev/null 2>&1 || true

echo "{\"systemMessage\": \"Cambios guardados y enviados a GitHub (${fecha}).\"}"
