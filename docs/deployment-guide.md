# Waypost - Deployment Guide

Complete guide for deploying Waypost to Cloudflare Workers.

## Prerequisites

- pnpm 10.29.3+
- Wrangler CLI (`npm install -g wrangler` or use `pnpm add -D wrangler`)
- Cloudflare account with Workers enabled
- Access to create KV namespaces and D1 databases

## Quick Start (Fork & Deploy)

1. Fork this repo on GitHub
2. Create Cloudflare resources in dashboard:
   - **KV namespace** (for redirect rules storage)
   - **D1 database** (for click analytics)
3. Connect your forked repo to **Cloudflare Workers**
4. Set environment variables in **Workers > Settings > Build**:
   - `REDIRECTS_KV_ID` — your KV namespace ID
   - `ANALYTICS_DB_ID` — your D1 database ID
5. Deploy — the build script auto-generates `wrangler.toml` and runs migrations

No source code changes needed. Sync upstream updates without merge conflicts.

## Local Setup

1. Clone repository:

```bash
git clone https://github.com/lamngockhuong/waypost
cd waypost
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment:

```bash
cp .env.example .env
# Edit .env with your Cloudflare resource IDs
```

4. Apply migrations:

```bash
pnpm d1:migrate
```

5. Start development:

```bash
# Terminal 1: Worker dev server (auto-generates wrangler.toml)
pnpm dev

# Terminal 2: Admin SPA dev server
pnpm admin:dev
```

Visit http://localhost:8787/admin

## Production Deployment

### Option A: Fork & Deploy (recommended)

See [Quick Start](#quick-start-fork--deploy) above.

### Option B: Manual Deploy

#### Step 1: Create Cloudflare Resources

```bash
wrangler kv namespace create REDIRECTS_KV
# Returns: id = "xxxxxxx"

wrangler d1 create redirect-analytics
# Returns: database_id = "xxxxxxx"
```

#### Step 2: Configure Environment

Create `.env` file (or export env vars):

```bash
cp .env.example .env
# Fill in REDIRECTS_KV_ID and ANALYTICS_DB_ID
```

Or export directly:

```bash
export REDIRECTS_KV_ID=xxxxxxx
export ANALYTICS_DB_ID=xxxxxxx
```

#### Step 3: Configure Cloudflare Access (optional)

Set in `.env`:

```
ACCESS_AUD=your-access-aud-from-cloudflare-console
ACCESS_TEAM=your-team-name
```

Or set via `wrangler secret`:

```bash
wrangler secret put ACCESS_AUD
wrangler secret put ACCESS_TEAM
```

#### Step 4: Apply Database Migrations

```bash
wrangler d1 migrations apply redirect-analytics --remote
```

#### Step 5: Deploy

```bash
pnpm deploy
```

This runs:

1. `pnpm setup` - Generates `wrangler.toml` from template + env vars
2. `pnpm admin:build` - Builds SPA to `public/admin/`
3. `wrangler deploy` - Deploys Worker and static assets

Verify deployment:

```bash
wrangler deployments list
```

## How wrangler.toml Generation Works

`wrangler.toml` is **not tracked in git**. Instead:

- `wrangler.toml.template` contains placeholders (`${REDIRECTS_KV_ID}`, etc.)
- `scripts/generate-wrangler.sh` reads env vars (from `.env` or CI/CD) and generates `wrangler.toml`
- All `pnpm` commands (`dev`, `deploy`, `d1:migrate`) auto-run generation before execution
- If `wrangler.toml` already exists and no env vars are set, it's left untouched

| Variable            | Required | Default              | Description                 |
| ------------------- | -------- | -------------------- | --------------------------- |
| `REDIRECTS_KV_ID`   | Yes      | —                    | KV namespace ID             |
| `ANALYTICS_DB_ID`   | Yes      | —                    | D1 database ID              |
| `ANALYTICS_DB_NAME` | No       | `redirect-analytics` | D1 database name            |
| `ACCESS_AUD`        | No       | `""`                 | Cloudflare Access AUD       |
| `ACCESS_TEAM`       | No       | `""`                 | Cloudflare Access team name |

## Cloudflare Access Setup

To protect `/admin/*` and `/api/*` routes with Cloudflare Access:

1. Go to Cloudflare Zero Trust dashboard
2. Applications > Create application
3. Select "Self-hosted" application
4. Set application domain: `yourdomain.com`
5. Configure application URL: `https://yourdomain.com/admin*` (for admin routes)
6. Create access policy:
   - Policy name: "Email access"
   - Rule: Allow `emails` ending with `@yourcompany.com`
7. Copy Application Audience (AUD) tag
8. Copy team name from account settings

Add to `.env`:

```
ACCESS_AUD=xxxxxxx.cloudflareaccess.com
ACCESS_TEAM=your-team
```

Or set in Cloudflare Workers Build Settings as environment variables.

## Custom Domain Setup

1. Add domain to Cloudflare (DNS records)
2. Create Worker route in Cloudflare dashboard:
   - Route: `yourdomain.com/*` (or subdomain)
   - Worker: `waypost`
3. Deploy via `pnpm deploy`

## CI/CD Integration

### GitHub Actions

Two workflows are provided:

**`.github/workflows/ci.yml`** - Runs on PR:

- Install dependencies
- Type check
- Run tests
- Build admin SPA

**`.github/workflows/deploy.yml`** - Runs on push to main:

- Install dependencies
- Type check
- Run tests
- Build admin SPA
- Deploy to Cloudflare

Requires GitHub secret: `CLOUDFLARE_API_TOKEN`

Create token:

1. Cloudflare dashboard > My Profile > API Tokens
2. Create Custom Token with permissions:
   - `Workers Scripts: Edit`
   - `Workers KV Storage: Edit`
   - `D1 Database: Edit`
3. Add to GitHub repo secrets as `CLOUDFLARE_API_TOKEN`

## Monitoring & Debugging

### View Logs

```bash
wrangler tail
```

### Check KV Contents

```bash
wrangler kv:key list --namespace-id=<NAMESPACE_ID>
wrangler kv:key get domains --namespace-id=<NAMESPACE_ID>
```

### Query D1

```bash
wrangler d1 execute redirect-analytics --remote --command "SELECT COUNT(*) FROM click_events;"
```

### View Active Deployments

```bash
wrangler deployments list
```

## Rollback

Rollback to previous deployment:

```bash
wrangler rollback
```

Or manually deploy a previous version:

```bash
git checkout <previous-commit>
pnpm deploy
```

## Scaling Considerations

- **KV Namespace**: 1GB per namespace (auto-sharding by domain)
- **D1 Database**: SQLite, scales with storage
- **Analytics**: Non-blocking writes prevent redirect latency
- **Rules per domain**: 1000+ before performance impact
- **Concurrent requests**: Cloudflare handles millions

## Security Checklist

Before production:

- [ ] Cloudflare Access configured with allowed emails/groups
- [ ] `ACCESS_AUD` and `ACCESS_TEAM` set in wrangler.toml or secrets
- [ ] CORS properly configured (same-origin only)
- [ ] Custom 404 HTML validated (no XSS)
- [ ] SSL/TLS enabled on custom domain
- [ ] WAF rules configured (if needed)
- [ ] Rate limiting configured (if needed)
- [ ] Backups configured for D1 (Cloudflare handles auto)

## Backup & Recovery

### KV Backup

Export all KV data:

```bash
wrangler kv:key list --namespace-id=<ID> > domains.json
# Then export each domain's rules
```

### D1 Backup

Export D1 database:

```bash
wrangler d1 execute redirect-analytics --remote --command ".dump" > backup.sql
```

Restore from backup:

```bash
wrangler d1 execute redirect-analytics --remote < backup.sql
```

## Troubleshooting

### 401 Unauthorized on /admin

- Check `ACCESS_AUD` matches Cloudflare Access application
- Check `ACCESS_TEAM` matches team name
- Verify JWT token is present in `Cf-Access-Jwt-Assertion` header
- Check token expiration

### 404 on Static Assets

- Ensure `public/admin/` exists and built (run `pnpm admin:build`)
- Check `wrangler.toml` has `[assets]` section pointing to `public/`
- Verify ASSETS binding is configured

### D1 Migrations Failed

Re-run migrations:

```bash
wrangler d1 migrations apply redirect-analytics --remote
```

Check migration status:

```bash
wrangler d1 migrations list redirect-analytics --remote
```

### High Latency on Redirects

- Check rule count per domain (reduce if >500)
- Check URLPattern complexity (simplify patterns)
- Check KV hit rate via Analytics dashboard
- Consider enabling caching headers on static assets

## Support

For issues, check:

- GitHub Issues: https://github.com/lamngockhuong/waypost/issues
- Cloudflare Docs: https://developers.cloudflare.com/workers/
- Hono Docs: https://hono.dev/
