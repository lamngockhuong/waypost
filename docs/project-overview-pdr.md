# Waypost - Project Overview & PDR

## Product Overview

**Waypost** is a multi-domain URL redirect system running on Cloudflare Workers, providing fast, geographically-distributed redirects with real-time analytics and a secure admin interface.

### Core Value Proposition

- **Instant global redirects** via Cloudflare edge, no server latency
- **Fine-grained rule matching** with priority-based evaluation (path, wildcard, subdomain patterns)
- **Built-in analytics** tracking clicks by country, device, referrer per redirect rule
- **Secure admin console** protected by Cloudflare Access
- **Zero external dependencies** for redirect matching (URLPattern API native)

## Features

| Feature               | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| Multi-domain support  | Manage redirects across any number of domains                                        |
| Pattern matching      | Path, wildcard, and subdomain-level rules via URLPattern API                         |
| Priority-based rules  | Higher priority rules evaluated first, first match wins                              |
| Query string handling | Optional `preserveQuery` flag to merge request params with redirect target           |
| Click analytics       | Non-blocking D1 writes capturing country, device, referrer per click                 |
| Custom 404 pages      | Per-domain HTML customization with CSP protection                                    |
| Default fallback URLs | Domain-level fallback for unmatched requests                                         |
| Rule export/import    | JSON-based backup and migration                                                      |
| Admin UI              | Preact + Vite SPA with Tailwind CSS, violet theme, dark mode, built to static assets |
| Landing Page          | Responsive marketing landing page with violet theme and dark mode                    |

## Technology Stack

| Component          | Technology                               | Rationale                                     |
| ------------------ | ---------------------------------------- | --------------------------------------------- |
| **Runtime**        | Cloudflare Workers                       | Global edge deployment, serverless            |
| **Framework**      | Hono v4                                  | Lightweight, type-safe routing                |
| **KV Storage**     | Cloudflare KV                            | Rule and config persistence, edge-accessible  |
| **Analytics DB**   | Cloudflare D1 (SQLite)                   | Structured analytics queries, low cost        |
| **Authentication** | Cloudflare Access                        | JWT token verification, enterprise-ready      |
| **Admin UI**       | Preact + Vite + Tailwind CSS             | Modern SPA with build optimization, dark mode |
| **Language**       | TypeScript strict mode                   | Type safety, better DX                        |
| **Testing**        | Vitest + @cloudflare/vitest-pool-workers | Local Worker simulation                       |

## Deployment Target

- **Platform**: Cloudflare Workers
- **Scale**: Global edge deployment across Cloudflare PoPs
- **Bindings Required**:
  - `REDIRECTS_KV`: KV namespace for rules and configs
  - `ANALYTICS_DB`: D1 database for click events
  - `ACCESS_AUD`: Cloudflare Access application audience tag
  - `ACCESS_TEAM`: Cloudflare Zero Trust team name

## Non-Functional Requirements

| Requirement              | Target                      | Notes                                     |
| ------------------------ | --------------------------- | ----------------------------------------- |
| **Response Time**        | <100ms                      | CDN edge execution                        |
| **Redirect Latency**     | <10ms                       | URLPattern matching in-memory             |
| **Analytics Throughput** | 1000s clicks/sec            | Non-blocking D1 writes via waitUntil      |
| **KV Hit Rate**          | >99%                        | Rules cached in edge location             |
| **Rule Limit**           | 1000+ per domain            | Practical limit before performance impact |
| **Availability**         | 99.9%                       | Cloudflare SLA                            |
| **Storage**              | KV: 1GB quota, D1: scalable | Sufficient for most use cases             |

## Security Requirements

- **Admin Access**: Cloudflare Access JWT authentication (RS256)
- **API Routes**: Protected by same auth middleware
- **Custom HTML**: CSP headers prevent inline script injection
- **URL Validation**: Protocol check (http/s only) on default URLs
- **Size Limits**: Custom 404 HTML capped at 50KB to prevent abuse
- **Token Caching**: JWKS keys cached 5 minutes to reduce cert fetch overhead

## Functional Requirements

### Domain Management

- [x] List all domains
- [x] Add new domain
- [x] Delete domain (cascade removes rules and config)

### Rule Management

- [x] List rules per domain
- [x] Create rule with source, target, type, priority, status code
- [x] Update rule properties
- [x] Delete rule
- [x] Sort by priority (higher evaluated first)
- [x] Toggle rule enabled/disabled state

### Analytics

- [x] Domain-level click totals
- [x] Click breakdown by rule, country, referrer
- [x] Rule-level analytics with device breakdown
- [x] Date range filtering
- [x] Recent clicks (last 50)

### Redirect Behavior

ytics with device breakdown

- [x] Date range filtering
- [x] Recent clicks (last 50)

### Redirect Behavior

- [x] Execute first matching rule by priority
- [x] Preserve query parameters on demand
- [x] Capture click data non-blocking
- [x] Support custom 404 HTML per domain
- [x] Fallback to default URL if configured

## Success Metrics

- Rules process in <10ms median latency
- Admin UI load time <500ms
- Analytics queries complete <1s
- Zero cross-origin CORS errors in admin
- All redirect types (path/wildcard/subdomain) match correctly
- Click data loss <0.1% (accounting for timeouts)

## Roadmap Status

- [x] Phase 1: Project setup, types, tooling
- [x] Phase 2: Redirect engine (rule matching, analytics recording)
- [x] Phase 3: Admin API (CRUD endpoints)
- [x] Phase 4: Analytics service (SQL queries)
- [x] Phase 5: Admin UI (Preact SPA)
- [x] Phase 6: Auth middleware, security hardening
- [x] Phase 7: Testing, deployment

**Current Status**: Complete (v1.0.0)
