# Waypost Documentation

Complete documentation for the multi-domain URL redirect system on Cloudflare Workers.

## Getting Started

**New to Waypost?** Start here:

1. Read [Project Overview & PDR](./project-overview-pdr.md) for product purpose, features, and tech stack (5 min)
2. Skim [System Architecture](./system-architecture.md) to understand how requests flow (10 min)
3. Review [Codebase Summary](./codebase-summary.md) to navigate the source code (10 min)
4. Check [Code Standards](./code-standards.md) before writing code (15 min)

## Documentation Structure

| Document                                             | Purpose                                                                      | Audience                                     |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| [project-overview-pdr.md](./project-overview-pdr.md) | Product requirements, features, tech stack, non-functional requirements      | Product managers, architects, new developers |
| [system-architecture.md](./system-architecture.md)   | System design, data flow, component layout, performance characteristics      | Architects, backend engineers, DevOps        |
| [code-standards.md](./code-standards.md)             | Coding conventions, type system, testing, validation, security checklist     | All developers, code reviewers               |
| [codebase-summary.md](./codebase-summary.md)         | Source code overview, module descriptions, dependency graph, how to navigate | Developers working on features/fixes         |

## Quick Reference

### Key Concepts

- **Redirect Types**: path, wildcard, subdomain (defined in URLPattern API)
- **Storage**: KV for rules/config, D1 (SQLite) for analytics
- **Auth**: Cloudflare Access JWT verification on /admin and /api routes
- **Performance**: Rules evaluated in <10ms, non-blocking analytics writes

### Architecture Layers

```bash
Request → Router (index.ts) → Middleware (auth, CORS) → Handler (routes/)
       → Service layer (services/) → Storage (KV, D1)
```

### API Endpoints (13 total)

**Domains** (3): GET/POST/DELETE /api/domains, DELETE /api/domains/:domain
**Config** (2): GET/PUT /api/config/:domain
**Rules** (5): GET/POST/PUT/DELETE /api/rules/:domain, PUT /api/rules/:domain/:id
**Analytics** (3): GET /api/analytics/:domain, GET /api/analytics/:domain/:id, export/import

All require Cloudflare Access authentication.

### File Structure

```bash
src/
  index.ts              ← Entry point (38 lines)
  types.ts              ← Shared types (49 lines)
  middleware/auth.ts    ← JWT verification (81 lines)
  routes/
    redirect.ts         ← Catch-all handler (44 lines)
    api.ts              ← REST endpoints (210 lines)
    admin.ts            ← Admin UI (17 lines)
  services/
    kv-store.ts         ← KV operations (45 lines)
    rule-matcher.ts     ← URL pattern matching (130 lines)
    analytics.ts        ← D1 queries (170 lines)
  admin/
    html.ts             ← Preact SPA (500+ lines)
```

### Development Commands

```bash
pnpm install            # Install dependencies
pnpm dev                # Local development server
pnpm typecheck          # Type check (strict mode)
pnpm test               # Run tests
pnpm deploy             # Deploy to Cloudflare
```

### Deployment

1. Create KV namespace: `wrangler kv namespace create REDIRECTS_KV`
2. Create D1 database: `wrangler d1 create redirect-analytics`
3. Update `wrangler.toml` with IDs from above
4. Run migrations: `wrangler d1 migrations apply redirect-analytics --remote`
5. Setup Cloudflare Access: Create self-hosted app for `/admin*` and `/api*`
6. Deploy: `pnpm deploy`

## Key Design Decisions

| Decision               | Rationale                                                      |
| ---------------------- | -------------------------------------------------------------- |
| Hono v4                | Lightweight, type-safe routing (2KB overhead)                  |
| URLPattern API         | Native browser API for path matching, no regex escaping needed |
| KV for rules           | Edge-accessible storage, <5ms reads                            |
| Non-blocking analytics | waitUntil() prevents redirect latency from analytics writes    |
| Inline admin UI        | No build step, 6KB bundle (Preact+HTM), served inline          |
| Cloudflare Access auth | Enterprise-grade JWT, OAuth integration, zero config           |
| SQLite via D1          | Structured analytics queries, familiar SQL, low cost           |

## Code Metrics

- **Total Code**: ~1000 lines across 10 modules
- **Test Coverage**: Vitest + @cloudflare/vitest-pool-workers
- **Type Safety**: TypeScript strict mode enabled
- **Module System**: ES Modules (ESM)
- **Package Manager**: pnpm 10.29.3+

## Common Tasks

### Adding a New Redirect Rule

1. Admin UI makes POST /api/rules/:domain with rule payload
2. API validates rule (source, target, type)
3. KV.get(rules:domain), append new rule, KV.put()
4. New rule evaluated on next redirect request

### Debugging a Rule

1. Check rule is enabled: `enabled: true`
2. Verify priority (higher evaluated first)
3. Test URLPattern: try source pattern in browser URLPattern API
4. Check analytics: GET /api/analytics/:domain/:id for click counts

### Querying Analytics

GET /api/analytics/:domain?from=2025-01-01&to=2025-12-31

Returns: totalClicks, byRule, byCountry, byReferrer, recentClicks

## Security Checklist

- [ ] Cloudflare Access configured for /admin and /api routes
- [ ] Custom 404 HTML sanitized (CSP headers applied)
- [ ] URL validation enabled (http/https protocol check)
- [ ] Size limits enforced (custom404Html <50KB)
- [ ] CORS restricted to same-origin
- [ ] No sensitive data in error responses

## Troubleshooting

| Issue              | Solution                                                      |
| ------------------ | ------------------------------------------------------------- |
| Rules not matching | Check enabled status, priority order, URLPattern syntax       |
| Analytics missing  | Verify D1 database connected, check waitUntil() not cancelled |
| Auth failing       | Check Cloudflare Access app setup, AUD token match            |
| CORS errors        | Verify admin served from same domain, check origin header     |

## Contributing

Before submitting changes:

1. Read [Code Standards](./code-standards.md) for style guide
2. Run `pnpm typecheck` (must pass)
3. Run `pnpm test` (all tests passing)
4. Update relevant docs if changing behavior
5. Follow conventional commit format

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono v4 Docs](https://hono.dev/)
- [Cloudflare Access Docs](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/)
- [URLPattern API Spec](https://wicg.github.io/urlpattern/)
- [Preact Docs](https://preactjs.com/)

## License

MIT
