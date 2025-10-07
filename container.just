import 'variables.just'

set dotenv-load := true

setup:
    just container setup-postgres
    just container setup-redis

setup-postgres:
    #!/usr/bin/env bash
    set -euxo pipefail
    POSTGRES_PORT="${CONTAINER_POSTGRES_PORT:-5433}"
    container system start
    container image pull docker.io/postgres:17-alpine
    container volume create tanooki-prefab-postgres-data || true
    container run -d --name tanooki-prefab-postgres \
      -p "127.0.0.1:${POSTGRES_PORT}:5432" \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_HOST_AUTH_METHOD=trust \
      -e PGDATA=/var/lib/postgresql/data/pgdata \
      -v tanooki-prefab-postgres-data:/var/lib/postgresql/data \
      postgres:17-alpine
    sleep 2
    psql -h 127.0.0.1 -p "${POSTGRES_PORT}" -U postgres -d postgres -c "CREATE DATABASE tanooki_prefab_development;" || true
    psql -h 127.0.0.1 -p "${POSTGRES_PORT}" -U postgres -d postgres -c "CREATE DATABASE tanooki_prefab_test;" || true

setup-redis:
    #!/usr/bin/env bash
    set -euxo pipefail
    REDIS_PORT="${CONTAINER_REDIS_PORT:-6380}"
    container system start
    container image pull docker.io/redis:7-alpine
    container volume create tanooki-prefab-redis-data || true
    container run -d --name tanooki-prefab-redis \
      -p "127.0.0.1:${REDIS_PORT}:6379" \
      -v tanooki-prefab-redis-data:/data \
      redis:7-alpine redis-server --appendonly yes

start:
    #!/usr/bin/env bash
    set -euo pipefail
    container system start
    container volume create tanooki-prefab-postgres-data 2>/dev/null || true
    container volume create tanooki-prefab-redis-data 2>/dev/null || true

    POSTGRES_PORT="${CONTAINER_POSTGRES_PORT:-5433}"
    REDIS_PORT="${CONTAINER_REDIS_PORT:-6380}"

    if ! container run -d --name tanooki-prefab-postgres \
      -p "127.0.0.1:${POSTGRES_PORT}:5432" \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_HOST_AUTH_METHOD=trust \
      -e PGDATA=/var/lib/postgresql/data/pgdata \
      -v tanooki-prefab-postgres-data:/var/lib/postgresql/data \
      postgres:17-alpine 2>&1; then
      echo "postgres container already exists or is running"
    fi

    if ! container run -d --name tanooki-prefab-redis \
      -p "127.0.0.1:${REDIS_PORT}:6379" \
      -v tanooki-prefab-redis-data:/data \
      redis:7-alpine redis-server --appendonly yes 2>&1; then
      echo "redis container already exists or is running"
    fi

stop:
    container stop tanooki-prefab-postgres 2>/dev/null || true
    container stop tanooki-prefab-redis 2>/dev/null || true

restart:
    just container stop
    just container start

logs-postgres:
    container logs -f tanooki-prefab-postgres

logs-redis:
    container logs -f tanooki-prefab-redis

destroy:
    container rm -f tanooki-prefab-postgres
    container rm -f tanooki-prefab-redis
    container volume rm tanooki-prefab-postgres-data
    container volume rm tanooki-prefab-redis-data

# prerequisite: brew install schpet/tap/envset
# sets env vars
setup-dev:
  #!/usr/bin/env bash
  set -euo pipefail
  POSTGRES_PORT="${CONTAINER_POSTGRES_PORT:-5433}"
  REDIS_PORT="${CONTAINER_REDIS_PORT:-6380}"
  envset -f .env.development.local DATABASE_HOST=127.0.0.1 DATABASE_PORT="${POSTGRES_PORT}" DATABASE_USERNAME=postgres REDIS_URL="redis://127.0.0.1:${REDIS_PORT}/1"
  envset -f .env.test.local DATABASE_HOST=127.0.0.1 DATABASE_PORT="${POSTGRES_PORT}" DATABASE_USERNAME=postgres REDIS_URL="redis://127.0.0.1:${REDIS_PORT}/2"
