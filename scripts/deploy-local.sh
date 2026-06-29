#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-121.40.161.248}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE="${REMOTE_USER}@${REMOTE_HOST}"
APP_NAME="${APP_NAME:-henryge}"
SERVICE_NAME="${SERVICE_NAME:-henryge}"
APP_DIR="${APP_DIR:-/opt/henryge}"
REMOTE_ARCHIVE_DIR="${REMOTE_ARCHIVE_DIR:-/tmp}"
PORT="${PORT:-3000}"
SMOKE_PORT="${SMOKE_PORT:-3001}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
ALLOW_DIRTY="${ALLOW_DIRTY:-0}"
BUILD_SOURCE="${BUILD_SOURCE:-local}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMMIT="$(git -C "$ROOT_DIR" rev-parse --short=12 HEAD)"
BUILD_DIR=""
RELEASE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/henryge-release.XXXXXX")"
ARCHIVE="${TMPDIR:-/tmp}/henryge-release-${COMMIT}.tar.gz"

cleanup() {
  if [ -n "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
  fi
  rm -rf "$RELEASE_DIR"
}
trap cleanup EXIT

log() {
  printf '\n== %s ==\n' "$1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_local_build() {
  if [ ! -d "$ROOT_DIR/.next/standalone" ] || [ ! -d "$ROOT_DIR/.next/static" ]; then
    echo "Missing local build output. Run pnpm build first, or set BUILD_SOURCE=clean." >&2
    exit 1
  fi
}

require_cmd git
require_cmd tar
require_cmd ssh
require_cmd scp

case "$BUILD_SOURCE" in
  local)
    log "Use local build output"
    require_local_build
    SOURCE_DIR="$ROOT_DIR"
    ;;
  clean)
    if [ "$ALLOW_DIRTY" != "1" ] && [ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]; then
      echo "Working tree is not clean. Commit/stash changes or rerun with ALLOW_DIRTY=1." >&2
      git -C "$ROOT_DIR" status --short >&2
      exit 1
    fi

    require_cmd pnpm
    BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/henryge-build.XXXXXX")"

    log "Create clean build copy"
    git -C "$ROOT_DIR" archive --format=tar HEAD | tar -C "$BUILD_DIR" -xf -

    log "Install dependencies"
    pnpm --dir "$BUILD_DIR" install --frozen-lockfile --prefer-offline

    log "Build Next.js standalone"
    pnpm --dir "$BUILD_DIR" build
    SOURCE_DIR="$BUILD_DIR"
    ;;
  *)
    echo "Unsupported BUILD_SOURCE: $BUILD_SOURCE (use local or clean)." >&2
    exit 1
    ;;
esac

log "Package release ${COMMIT}"
rm -f "$ARCHIVE"
mkdir -p "$RELEASE_DIR/.next"
cp -a "$SOURCE_DIR/.next/standalone/." "$RELEASE_DIR/"
cp -a "$SOURCE_DIR/.next/static" "$RELEASE_DIR/.next/static"
cp -a "$SOURCE_DIR/public" "$RELEASE_DIR/public"
printf '%s\n' "$COMMIT" > "$RELEASE_DIR/REVISION"

COPYFILE_DISABLE=1 tar \
  --no-xattrs \
  --no-mac-metadata \
  -C "$RELEASE_DIR" \
  -czf "$ARCHIVE" \
  .
ls -lh "$ARCHIVE"

log "Upload release"
scp "$ARCHIVE" "$REMOTE:${REMOTE_ARCHIVE_DIR}/$(basename "$ARCHIVE")"

log "Activate release on server"
ssh "$REMOTE" \
  "APP_NAME='$APP_NAME' SERVICE_NAME='$SERVICE_NAME' APP_DIR='$APP_DIR' PORT='$PORT' SMOKE_PORT='$SMOKE_PORT' KEEP_RELEASES='$KEEP_RELEASES' COMMIT='$COMMIT' ARCHIVE='${REMOTE_ARCHIVE_DIR}/$(basename "$ARCHIVE")' bash -s" <<'REMOTE_SCRIPT'
set -euo pipefail

RELEASES_DIR="$APP_DIR/releases"
RELEASE_DIR="$RELEASES_DIR/$COMMIT"
CURRENT_LINK="$APP_DIR/current"

wait_for_http() {
  local url="$1"
  local attempts="${2:-30}"
  local i

  for i in $(seq 1 "$attempts"); do
    if curl -fsS -I "$url" >/tmp/${APP_NAME}-healthcheck.txt; then
      cat /tmp/${APP_NAME}-healthcheck.txt
      return 0
    fi
    sleep 1
  done

  return 1
}

echo "== Extract release =="
mkdir -p "$RELEASES_DIR"
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
tar -xzf "$ARCHIVE" -C "$RELEASE_DIR"
cat "$RELEASE_DIR/REVISION"

echo "== Smoke test on port $SMOKE_PORT =="
SMOKE_LOG="/tmp/${APP_NAME}-smoke-${COMMIT}.log"
(
  cd "$RELEASE_DIR"
  NODE_ENV=production HOSTNAME=127.0.0.1 PORT="$SMOKE_PORT" node server.js >"$SMOKE_LOG" 2>&1
) &
SMOKE_PID="$!"

cleanup_smoke() {
  if kill -0 "$SMOKE_PID" >/dev/null 2>&1; then
    kill "$SMOKE_PID" >/dev/null 2>&1 || true
    wait "$SMOKE_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup_smoke EXIT

if ! wait_for_http "http://127.0.0.1:$SMOKE_PORT" 30; then
  echo "Smoke test failed. Logs:" >&2
  tail -120 "$SMOKE_LOG" >&2 || true
  exit 1
fi
cleanup_smoke
trap - EXIT

echo "== Install systemd service =="
cat > "/etc/systemd/system/${SERVICE_NAME}.service" <<SERVICE
[Unit]
Description=Henryge Next.js site
After=network.target

[Service]
Type=simple
WorkingDirectory=$CURRENT_LINK
Environment=NODE_ENV=production
Environment=HOSTNAME=127.0.0.1
Environment=PORT=$PORT
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
SERVICE

ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME" >/dev/null

echo "== Stop old Docker container if present =="
if command -v docker >/dev/null 2>&1 && docker ps -a --format '{{.Names}}' | grep -Fxq 'henrys-blog-next'; then
  docker rm -f henrys-blog-next || true
fi

echo "== Restart service =="
systemctl restart "$SERVICE_NAME"
if ! wait_for_http "http://127.0.0.1:$PORT" 30; then
  echo "Service failed. Logs:" >&2
  journalctl -u "$SERVICE_NAME" -n 120 --no-pager >&2 || true
  exit 1
fi

echo "== Verify nginx routes =="
curl -fsS -I -H 'Host: henryge.com' http://127.0.0.1 | sed -n '1,12p'
curl -kfsS -I --resolve henryge.com:443:127.0.0.1 https://henryge.com | sed -n '1,12p'

echo "== Clean old releases =="
find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' \
  | sort -rn \
  | awk "NR>$KEEP_RELEASES {print \$2}" \
  | xargs -r rm -rf
rm -f "$ARCHIVE"

echo "== Status =="
systemctl --no-pager --full status "$SERVICE_NAME" | sed -n '1,18p'
ss -tulpn | awk 'NR==1 || /:(3000|80|443)[[:space:]]/'
REMOTE_SCRIPT

log "Done"
