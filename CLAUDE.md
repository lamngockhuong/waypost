# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Waypost is a multi-domain URL redirect system running on Cloudflare Workers. It uses Hono as the web framework, KV for redirect rules/config storage, D1 for click analytics, and a Preact + HTM + Signals admin SPA (~6KB, no build step) served inline.

## Commands

```bash
pnpm dev              # Start local dev server (wrangler) at localhost:8787
pnpm test             # Run tests once (vitest + @cloudflare/vitest-pool-workers)
pnpm test:watch       # Run tests in watch mode
pnpm typecheck        # TypeScript type checking (tsc --noEmit)
pnpm deploy           # Deploy to Cloudflare Workers
pnpm d1:migrate       # Apply D1 migrations
```

## Architecture

**Entry point**: `src/index.ts` — Hono app with CORS, Cloudflare Access auth middleware, and three route groups.

**Request flow**: Every request hits the Hono router. `/admin/*` and `/api/*` routes go through `accessAuth` middleware (Cloudflare Access JWT verification). Everything else falls through to the catch-all redirect handler.

**Route groups** (`src/routes/`):

- `api.ts` — REST API for CRUD on domains, rules, config, analytics, import/export
- `admin.ts` — Serves the inline Preact SPA
- `redirect.ts` — Catch-all handler: looks up domain in KV, matches rules by priority, records click via `waitUntil`, returns redirect or 404

**Services** (`src/services/`):

- `kv-store.ts` — KV read/write for domains list, per-domain rules, and per-domain config
- `rule-matcher.ts` — URLPattern-based matching with LRU-style cache (500 entries). Supports path, wildcard, and subdomain types. Priority-sorted, first match wins.
- `analytics.ts` — D1 write (non-blocking via `waitUntil`) and read for click events

**Admin UI** (`src/admin/html.ts`): Single-file inline HTML with Preact + HTM + Signals loaded from CDN. No build step.

**Bindings** (defined in `src/types.ts`):
e-file inline HTML with Preact + HTM + Signals loaded from CDN. No build step.

**Bindings** (defined in `src/types.ts`):

- `REDIRECTS_KV` — KV namespace for domains, rules, config
- `ANALYTICS_DB` — D1 database for click_events
- `ACCESS_AUD` / `ACCESS_TEAM` — Cloudflare Access config

**KV key schema**: `domains` (string[]), `rules:{domain}` (RedirectRule[]), `config:{domain}` (DomainConfig)

## Testing

Tests use `@cloudflare/vitest-pool-workers` which runs tests inside the Workers runtime with real KV/D1 bindings (miniflare). Config in `vitest.config.ts` points to `wrangler.toml` for bindings.

## Key Patterns

- Redirect rules are priority-sorted descending; first match wins
- Analytics writes are non-blocking (`ctx.waitUntil`) to avoid latency on redirects
- URLPattern cache in rule-matcher clears entirely at 500 entries
- Import supports `?mode=merge` (append) or `replace` (default)
- CORS is restricted to same-origin + localhost
