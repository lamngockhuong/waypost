# Waypost

Multi-domain URL redirect system with KV rules, D1 analytics, and Preact admin UI on Cloudflare Workers.

## Features

- **Multi-domain redirects**: Path, wildcard, and subdomain matching via URLPattern API
- **Priority-based rules**: Higher priority rules checked first, first match wins
- **Click analytics**: Non-blocking D1 writes via `waitUntil`, country/device/referrer tracking
- **Admin UI**: Preact + Vite SPA with Tailwind CSS, violet theme, dark mode support, served as static assets
- **Auth**: Cloudflare Access protected admin and API routes
- **Per-domain config**: Custom 404 pages and default redirect URLs

## Quick Start (Fork & Deploy)

1. Fork this repo
2. Create Cloudflare resources in dashboard:
   - KV namespace (for redirect rules)
   - D1 database (for analytics)
3. Connect your repo to Cloudflare Workers
4. Set environment variables in **Workers Build Settings**:
   - `REDIRECTS_KV_ID` — your KV namespace ID
   - `ANALYTICS_DB_ID` — your D1 database ID
5. Deploy — the build script auto-generates config and runs migrations

## Local Development

```bash
pnpm install

# Copy .env.example and fill in your Cloudflare resource IDs
cp .env.example .env

# Apply D1 migrations (local)
pnpm d1:migrate

# Terminal 1: Start Worker dev server
pnpm dev

# Terminal 2: Start Vite dev server (for admin SPA with HMR)
pnpm admin:dev
```

Visit:

- `http://localhost:8787/_health` - Health check
- `http://localhost:8787/` - Landing page
- `http://localhost:8787/admin` - Admin UI (SPA)

## Testing

```bash
pnpm test
```

## Deploy

### Option A: Fork & Deploy (recommended)

See [Quick Start](#quick-start-fork--deploy) above.

### Option B: Manual Deploy

```bash
# Create KV namespace
wrangler kv namespace create REDIRECTS_KV
# Returns: id = "xxxxxxx"

# Create D1 database
wrangler d1 create redirect-analytics
# Returns: database_id = "xxxxxxx"

# Set env vars (or create .env file)
export REDIRECTS_KV_ID=xxxxxxx
export ANALYTICS_DB_ID=xxxxxxx

# Run D1 migration
wrangler d1 migrations apply redirect-analytics --remote

# Deploy (auto-generates wrangler.toml from template)
pnpm deploy
```

## Configuration

`wrangler.toml` is auto-generated from `wrangler.toml.template` using environment variables. Set them via `.env` file (local) or CI/CD build settings (Cloudflare).

| Variable            | Required | Description                                      |
| ------------------- | -------- | ------------------------------------------------ |
| `REDIRECTS_KV_ID`   | Yes      | KV namespace ID                                  |
| `ANALYTICS_DB_ID`   | Yes      | D1 database ID                                   |
| `ANALYTICS_DB_NAME` | No       | D1 database name (default: `redirect-analytics`) |
| `ACCESS_AUD`        | No       | Cloudflare Access AUD tag                        |
| `ACCESS_TEAM`       | No       | Cloudflare Access team name                      |

## Cloudflare Access Setup

1. Go to Cloudflare Zero Trust dashboard
2. Create a self-hosted application for `yourdomain.com/admin*` and `yourdomain.com/api*`
3. Add an email allow policy
4. Set `ACCESS_AUD` and `ACCESS_TEAM` in your `.env` or build settings

## KV Data Model

| Key               | Value                                           |
| ----------------- | ----------------------------------------------- |
| `domains`         | `["example.com", "short.io"]`                   |
| `rules:{domain}`  | `[{id, source, target, type, statusCode, ...}]` |
| `config:{domain}` | `{domain, custom404Html?, defaultUrl?}`         |

## API Endpoints

All `/api/*` routes require Cloudflare Access authentication.

| Method | Path                         | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/domains`               | List domains          |
| POST   | `/api/domains`               | Add domain            |
| DELETE | `/api/domains/:domain`       | Delete domain + rules |
| GET    | `/api/config/:domain`        | Get domain config     |
| PUT    | `/api/config/:domain`        | Update domain config  |
| GET    | `/api/rules/:domain`         | List rules            |
| POST   | `/api/rules/:domain`         | Create rule           |
| PUT    | `/api/rules/:domain/:id`     | Update rule           |
| DELETE | `/api/rules/:domain/:id`     | Delete rule           |
| GET    | `/api/analytics/:domain`     | Domain analytics      |
| GET    | `/api/analytics/:domain/:id` | Rule analytics        |
| GET    | `/api/export/:domain`        | Export rules JSON     |
| POST   | `/api/import/:domain`        | Import rules JSON     |

## License

MIT
