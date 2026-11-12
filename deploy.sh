#!/usr/bin/env bash
# Publica o Grimoria: envia o commit para o GitHub e roda o git pull no servidor por SSH.
# Uso: ./deploy.sh            (push + pull no servidor)
#      ./deploy.sh --sem-push (só o pull no servidor; use se você já deu push por outro lugar)
set -euo pipefail
cd "$(dirname "$0")"

CONF="deploy.conf"
[ -f "$CONF" ] || { echo "Falta o $CONF. Copie o deploy.conf.example e preencha." >&2; exit 1; }
# shellcheck disable=SC1090
source "$CONF"
for v in SSH_HOST SSH_USER REMOTE_DIR; do
  [ -n "${!v:-}" ] || { echo "Preencha $v no $CONF." >&2; exit 1; }
done
SSH_PORT="${SSH_PORT:-22}"
PUSH=1
[ "${1:-}" = "--sem-push" ] && PUSH=0

[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || { echo "Troque para a branch main antes de publicar." >&2; exit 1; }
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Há alterações sem commit. Faça o commit antes de publicar:" >&2
  git status --short --untracked-files=no >&2
  exit 1
fi

if [ "$PUSH" = 1 ]; then
  echo "==> git push origin main"
  git push origin main
fi
LOCAL="$(git rev-parse HEAD)"

SSH=(ssh -p "$SSH_PORT" -o BatchMode=yes -o ConnectTimeout=15)
[ -n "${SSH_KEY:-}" ] && SSH+=(-i "$SSH_KEY" -o IdentitiesOnly=yes)
ALVO="$SSH_USER@$SSH_HOST"

CMD="set -e; cd '$REMOTE_DIR'; git pull --ff-only origin main"
if [ -n "${PRIVADO_DEST:-}" ]; then
  CMD="$CMD; mkdir -p '$PRIVADO_DEST'; cp -a privado/. '$PRIVADO_DEST'/"
fi
CMD="$CMD; git rev-parse HEAD"

echo "==> git pull no servidor ($ALVO:$REMOTE_DIR)"
REMOTO="$("${SSH[@]}" "$ALVO" "$CMD" | tee /dev/stderr | tail -n 1)"

if [ "$REMOTO" != "$LOCAL" ]; then
  echo "ATENÇÃO: o servidor está em ${REMOTO:0:7}, mas o local está em ${LOCAL:0:7}." >&2
  exit 1
fi
echo "==> Servidor atualizado em ${LOCAL:0:7}."

if [ -n "${SITE_URL:-}" ]; then
  COD="$(curl -s -o /dev/null -m 15 -w '%{http_code}' "$SITE_URL" || true)"
  echo "==> $SITE_URL respondeu $COD"
fi
