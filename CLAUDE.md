# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Waypost is a multi-domain URL redirect system running on Cloudflare Workers. It uses Hono as the web framework, KV for redirect rules/config storage, D1 for click analytics, and a Preact + Tailwind CSS admin SPA built with Vite, served as static assets from the edge.

## Commands

```bash
pnpm setup            # Generate wrangler.toml from template + env vars
pnpm dev              # Start local dev server (auto-runs setup)
pnpm admin:dev        # Start Vite dev server with HMR for admin SPA
pnpm admin:build      # Build admin SPA to public/admin/
pnpm test             # Run tests once (vitest + @cloudflare/vitest-pool-workers)
pnpm test:watch       # Run tests in watch mode
pnpm typecheck        # TypeScript type checking (server + admin tsconfigs)
pnpm deploy           # Setup + build admin + deploy to Cloudflare Workers
pnpm d1:migrate       # Setup + apply D1 migrations
```

## Architecture

**Entry point**: `src/index.ts` — Hono app with CORS, Cloudflare Access auth middleware, and three route groups.

**Request flow**: Every request hits the Hono router. `/admin/*` and `/api/*` routes go through `accessAuth` middleware (Cloudflare Access JWT verification). Everything else falls through to the catch-all redirect handler.

**Route groups** (`src/routes/`):

- `api.ts` — REST API for CRUD on domains, rules, config, analytics, import/export
- `admin.ts` — Landing page + SPA fallback via ASSETS binding
- `redirect.ts` — Catch-all handler: looks up domain in KV, matches rules by priority, records click via `waitUntil`, returns redirect or 404

**Services** (`src/services/`):

- `kv-store.ts` — KV read/write for domains list, per-domain rules, and per-domain config
- `rule-matcher.ts` — URLPattern-based matching with LRU-style cache (500 entries). Supports path, wildcard, and subdomain types. Priority-sorted, first match wins.
- `analytics.ts` — D1 write (non-blocking via `waitUntil`) and read for click events

**Admin UI** (`src/admin/`): Preact + Tailwind CSS SPA built with Vite. Served as static assets via Cloudflare Workers Static Assets (`[assets]` in wrangler.toml). Features: collapsible sidebar, domain dashboard with KPI cards, domain detail with Rules/Settings/Analytics tabs, Chart.js analytics, mobile-responsive. Dev: `pnpm admin:dev` (HMR). Build: `pnpm admin:build` → `public/admin/`.

**Bindings** (defined in `src/types.ts`):

- `REDIRECTS_KV` — KV namespace for domains, rules, config
- `ANALYTICS_DB` — D1 database for click_events
- `ACCESS_AUD` / `ACCESS_TEAM` — Cloudflare Access config
- `ASSETS` — Fetcher for static assets (admin SPA)

**KV key schema**: `domains` (string[]), `rules:{domain}` (RedirectRule[]), `config:{domain}` (DomainConfig)

## Testing

Tests use `@cloudflare/vitest-pool-workers` which runs tests inside the Workers runtime with real KV/D1 bindings (miniflare). Config in `vitest.config.ts` points to `wrangler.toml` for bindings.

## Key Patterns

- Redirect rules are priority-sorted descending; first match wins
- Analytics writes are non-blocking (`ctx.waitUntil`) to avoid latency on redirects
- URLPattern cache in rule-matcher clears entirely at 500 entries
- Import supports `?mode=merge` (append) or `replace` (default)
- CORS is restricted to same-origin + localhost
