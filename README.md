# Waypost

Multi-domain URL redirect system with KV rules, D1 analytics, and Preact admin UI on Cloudflare Workers.

## Features

- **Multi-domain redirects**: Path, wildcard, and subdomain matching via URLPattern API
- **Priority-based rules**: Higher priority rules checked first, first match wins
- **Click analytics**: Non-blocking D1 writes via `waitUntil`, country/device/referrer tracking
- **Admin UI**: Preact + HTM + Signals SPA (~6KB), no build step, served inline
- **Auth**: Cloudflare Access protected admin and API routes
- **Per-domain config**: Custom 404 pages and default redirect URLs

## Local Development

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:8787/_health` to verify, `http://localhost:8787/admin` for admin UI.

## Testing

```bash
pnpm test
```

## Deploy

```bash
# Create KV namespace
wrangler kv namespace create REDIRECTS_KV

# Create D1 database
wrangler d1 create redirect-analytics

# Update wrangler.toml with real IDs from above commands

# Run D1 migration
wrangler d1 migrations apply redirect-analytics --remote

# Deploy
pnpm deploy
```

## Cloudflare Access Setup

1. Go to Cloudflare Zero Trust dashboard
2. Create a self-hosted application for `yourdomain.com/admin*` and `yourdomain.com/api*`
3. Add an email allow policy
4. Copy the Application Audience (AUD) tag to `wrangler.toml` `ACCESS_AUD` var
5. Set your team name in `ACCESS_TEAM` var

## KV Data Model

| Key | Value |
|-----|-------|
| `domains` | `["example.com", "short.io"]` |
| `rules:{domain}` | `[{id, source, target, type, statusCode, ...}]` |
| `config:{domain}` | `{domain, custom404Html?, defaultUrl?}` |

## API Endpoints

All `/api/*` routes require Cloudflare Access authentication.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/domains` | List domains |
| POST | `/api/domains` | Add domain |
| DELETE | `/api/domains/:domain` | Delete domain + rules |
| GET | `/api/config/:domain` | Get domain config |
| PUT | `/api/config/:domain` | Update domain config |
| GET | `/api/rules/:domain` | List rules |
| POST | `/api/rules/:domain` | Create rule |
| PUT | `/api/rules/:domain/:id` | Update rule |
| DELETE | `/api/rules/:domain/:id` | Delete rule |
| GET | `/api/analytics/:domain` | Domain analytics |
| GET | `/api/analytics/:domain/:id` | Rule analytics |
| GET | `/api/export/:domain` | Export rules JSON |
| POST | `/api/import/:domain` | Import rules JSON |

## License

MIT
