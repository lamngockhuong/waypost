# Waypost - System Architecture

## High-Level Request Flow

```bash
Incoming Request
    ↓
[Cloudflare Edge]
    ↓
Worker Receives Request
    ↓
├─ Health Check (_health) → 200 OK
├─ Admin Routes (/admin/*) → Auth Middleware → Admin UI (HTML)
├─ API Routes (/api/*) → Auth Middleware → REST Endpoints
└─ Catch-all (/) → Redirect Handler
    ├─ Lookup rules for hostname via KV
    ├─ Match rules by priority (URLPattern API)
    ├─ Execute click analytics write (non-blocking via waitUntil)
    └─ 301/302 redirect to matched target
```

## Component Architecture

```bash
┌─────────────────────────────────────────────────────┐
│           Cloudflare Workers Isolate                │
├─────────────────────────────────────────────────────┤
│  index.ts (Hono App Router)                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Middleware Layer:                                  │
│  ├─ CORS (api/* routes only, same-origin)           │
│  └─ Auth (Cloudflare Access JWT verification)       │
│                                                     │
│  Route Handlers:                                    │
│  ├─ redirect.ts      (catch-all, matching+redirect) │
│  ├─ api.ts           (domain, rule, config, stats)  │
│  └─ admin.ts         (serve admin HTML)             │
│                                                     │
│  Service Layer:                                     │
│  ├─ kv-store.ts      (KV read/write ops)            │
│  ├─ rule-matcher.ts  (URLPattern matching logic)    │
│  └─ analytics.ts     (D1 queries and data capture)  │
│                                                     │
│  Middleware:                                        │
│  └─ auth.ts          (JWT verification, JWKS cache) │
│                                                     │
│  Admin UI:                                          │
│  └─ admin/html.ts    (Preact+HTM SPA inline)        │
│                                                     │
├─────────────────────────────────────────────────────┤
│               Cloudflare Bindings                   │
├─────────────────────────────────────────────────────┤
│  REDIRECTS_KV ──→ [Cloudflare KV Namespace]         │
│  ANALYTICS_DB ──→ [Cloudflare D1 Database]          │
└─────────────────────────────────────────────────────┘
```

## KV Data Model

Waypost stores all redirect rules and configuration in Cloudflare KV with the following schema:

| Key Pattern       | Value                              | Purpose                                              |
| ----------------- | ---------------------------------- | ---------------------------------------------------- |
| `domains`         | JSON array of domain strings       | List of all managed domains                          |
| `rules:{domain}`  | JSON array of RedirectRule objects | Rules for a specific domain, sorted by priority desc |
| `config:{domain}` | JSON object (DomainConfig)         | Per-domain settings (custom 404, default URL)        |

### Example KV Contents

```json
// domains
["example.com", "short.io"]

// rules:example.com
[
  {
    "id": "uuid-1",
    "source": "/blog/(.*)",
    "target": "https://blog.example.com/$1",
    "type": "path",
    "statusCode": 301,
    "preserveQuery": true,
    "enabled": true,
    "priority": 100,
    "createdAt": "2025-03-01T10:00:00Z",
    "updatedAt": "2025-03-01T10:00:00Z"
  }
]

// config:example.com
{
  "domain": "example.com",
  "custom404Html": "<h1>Not Found</h1>",
  "defaultUrl": "https://example.com/"
}
```

## D1 Schema (SQLite)

### click_events Table

```sql
CREATE TABLE click_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  redirect_id TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_url TEXT NOT NULL,
  country TEXT,
  device TEXT,
  referrer TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_click_domain_time ON click_events(domain, timestamp);
CREATE INDEX idx_click_redirect ON click_events(redirect_id, timestamp);
```

**Column Details**:

- `domain`: Hostname being accessed
- `redirect_id`: UUID of matched RedirectRule
- `source_path`: Original request pathname
- `target_url`: Final redirect destination URL
- `country`: Cloudflare geo country code (from `request.cf.country`)
- `device`: Parsed device type (desktop, mobile, bot)
- `referrer`: HTTP Referer header value
- `user_agent`: HTTP User-Agent header value
- `timestamp`: Server-side click timestamp (UTC)

## Request Processing Pipeline

### 1. Redirect Request Handler (routes/redirect.ts)

```bash
Request arrives at Worker
    ↓
Extract hostname from URL
    ↓
Lookup rules via KV.get(`rules:{hostname}`)
    ↓
No rules? → Check for custom 404 or default URL → Respond
    ↓
Filter enabled rules, sort by priority DESC
    ↓
Iterate rules, test URLPattern against request URL
    ↓
First match found?
    ├─ No matches → handleNotFound() → custom 404 or default
    └─ Match found
        ├─ Build target URL (replace capture groups, preserve query if enabled)
        ├─ Queue analytics write (non-blocking waitUntil)
        └─ Redirect with rule.statusCode (301 or 302)
```

### 2. Analytics Pipeline (services/analytics.ts)

```bash
recordClick() called (non-blocking):
    ↓
Extract geolocation from request.cf.country
    ↓
Parse device type from User-Agent (bot/mobile/desktop)
    ↓
Build ClickData object
    ↓
D1.prepare() INSERT into click_events
    ↓
executionCtx.waitUntil() → Send to analytics, don't block response
```

### 3. Rule Matching Algorithm (services/rule-matcher.ts)

```bash
matchAllRules(request, rules[]):
    ↓
Filter rules: enabled === true
    ↓
Sort by priority DESC (higher first)
    ↓
For each rule:
    ├─ If type === 'subdomain':
    │   ├─ Extract first subdomain from request hostname
    │   └─ Direct string match against rule.source
    │
    └─ If type === 'path' or 'wildcard':
        ├─ Create URLPattern from rule.source
        ├─ Test pattern against request URL
        └─ If match, extract capture groups
            └─ Replace groups in rule.target ($1, $2, :named, etc.)
            └─ If preserveQuery: merge request params into target
            └─ Return MatchResult { rule, targetUrl }
    ↓
No match → return null → serve 404 or default
```

## Authentication & Security

### Cloudflare Access Integration

```bash
Request includes header: Cf-Access-Jwt-Assertion
    ↓
auth.ts middleware intercepts /admin/* and /api/*
    ↓
Extract JWT from Cf-Access-Jwt-Assertion header
    ↓
Skip validation if ACCESS_TEAM not configured (local dev)
    ↓
Fetch JWKS from https://{ACCESS_TEAM}.cloudflareaccess.com/certs
    ├─ Cache keys for 5 minutes
    ├─ Verify RS256 signature
    └─ Verify audience claim against ACCESS_AUD
    ↓
Invalid? → 401 Unauthorized
    ↓
Valid? → Proceed to route handler
```

### CORS Policy

```bash
/api/* routes only allow:
  - Origin: Exact match on request origin
  - Methods: GET, POST, PUT, DELETE
  - Headers: Content-Type
  - Same-origin or localhost:* (dev only)
```

### Content Security

```bash
Custom 404 HTML served with:
  Content-Security-Policy: default-src 'self'; script-src 'none'; style-src 'unsafe-inline'
  └─ Prevents XSS via injected HTML
```

## Data Flow Diagrams

### Admin Create Rule

```bash
Admin Browser (protected by Access)
    ↓
POST /api/rules/{domain}
    ├─ Auth middleware validates JWT
    ├─ Route handler validates rule schema
    ├─ KV.get(`rules:{domain}`) to fetch current
    ├─ Append new rule, sort by priority
    ├─ KV.put(`rules:{domain}`, updated rules)
    └─ Return 201 + rule object
    ↓
Next redirect matches new rule immediately
```

### Analytics Query

```bash
Admin requests GET /api/analytics/{domain}
    ├─ D1.prepare(SELECT COUNT(*) FROM click_events WHERE domain=?)
    ├─ D1.prepare(SELECT * GROUP BY redirect_id)
    ├─ D1.prepare(SELECT * GROUP BY country LIMIT 10)
    ├─ D1.prepare(SELECT * GROUP BY referrer LIMIT 10)
    └─ D1.prepare(SELECT * ORDER BY timestamp DESC LIMIT 50)
    ↓
Parallel Promise.all() executes all 5 queries
    ↓
Aggregate results: { totalClicks, byRule, byCountry, byReferrer, recentClicks }
    ↓
Return 200 + JSON
```

## Performance Characteristics

| Operation              | Latency       | Notes                               |
| ---------------------- | ------------- | ----------------------------------- |
| KV read (rules)        | 1-5ms         | Cached at edge PoP                  |
| URLPattern matching    | 0.5-2ms       | In-memory, no I/O                   |
| Analytics write        | <1ms response | Non-blocking (waitUntil)            |
| D1 analytics query     | 50-500ms      | SQL aggregation                     |
| Admin auth validation  | 5-50ms        | First hit fetches JWKS, then cached |
| Total redirect latency | 10-30ms       | Most requests hit cache             |

## Scaling Considerations

- **KV Limits**: 1GB per namespace, auto-sharding by domain
- **D1 Limits**: Storage scales, query parallelization recommended
- **Analytics**: Non-blocking writes prevent redirect slowdown
- **Rule Limit**: URLPattern caching (500 entry LRU) prevents memory bloat
- **Concurrency**: Worker handles millions of concurrent requests

## Fault Tolerance

| Failure Scenario   | Behavior                                                      |
| ------------------ | ------------------------------------------------------------- |
| KV unreachable     | Request fails, 500 error                                      |
| Rule not found     | Serve custom 404 or default URL                               |
| D1 unavailable     | Analytics write fails silently (waitUntil), redirect succeeds |
| Invalid URLPattern | Rule skipped, next rule checked                               |
| Auth unavailable   | Request denied (401) until JWKS refreshes                     |
| KV unreachable     | Request fails, 500 error                                      |
| Rule not found     | Serve custom 404 or default URL                               |
| D1 unavailable     | Analytics write fails silently (waitUntil), redirect succeeds |
| Invalid URLPattern | Rule skipped, next rule checked                               |
| Auth unavailable   | Request denied (401) until JWKS refreshes                     |
