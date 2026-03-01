# Waypost - Codebase Summary

Complete overview of source code structure, modules, and responsibilities.

## Source Tree

```bash
src/
├── index.ts                              # Main entry, app initialization
├── types.ts                              # Shared type definitions
│
├── middleware/
│   └── auth.ts                           # Cloudflare Access JWT verification
│
├── routes/
│   ├── redirect.ts                       # Catch-all redirect handler (no auth)
│   ├── api.ts                            # REST API endpoints (auth required)
│   └── admin.ts                          # Admin UI route (auth required)
│
├── services/
│   ├── kv-store.ts                       # KV operations (domains, rules, config)
│   ├── rule-matcher.ts                   # URLPattern matching & target building
│   └── analytics.ts                      # D1 queries & click data extraction
│
└── admin/
    └── html.ts                           # Inline Preact+HTM SPA

tests/
└── *.test.ts                             # Vitest unit/integration tests

migrations/
└── 0001_create_click_events.sql          # D1 schema initialization
```

## Module Descriptions

### Core Entry Point

#### `src/index.ts` (~40 lines)

Hono app router setup with:

- Health check endpoint `/_health`
- CORS middleware for `/api/*` (same-origin only)
- Auth middleware for `/admin/*` and `/api/*`
- Route mounting (redirect, api, admin)
- Catch-all redirect handler

**Key Exports**: `app` (default)

---

### Type Definitions

#### `src/types.ts` (~50 lines)

Shared TypeScript interfaces and types:

- `Bindings` - Worker environment (KV, D1, auth vars)
- `RedirectType` - Union type: 'path' | 'wildcard' | 'subdomain'
- `RedirectRule` - Full rule object with metadata
- `DomainConfig` - Per-domain settings
- `MatchResult` - URL match result with rule + target
- `ClickData` - Analytics event payload
- `AnalyticsOptions` - Filter options (from, to dates)

**Dependency Graph**: Required by all modules

---

### Middleware

#### `src/middleware/auth.ts` (~80 lines)

Cloudflare Access JWT verification with JWKS caching:

- Extracts `Cf-Access-Jwt-Assertion` header
- Fetches JWKS from `https://{team}.cloudflareaccess.com/certs`
- Verifies RS256 signature
- Checks audience claim (AUD)
- Caches keys for 5 minutes
- Skips validation if `ACCESS_TEAM` not configured (local dev)

**Exports**: `accessAuth` middleware

---

### Route Handlers

#### `src/routes/redirect.ts` (~45 lines)

Main catch-all request handler (no authentication):

- Resolves hostname from request URL
- Queries KV for domain rules
- Matches against enabled rules sorted by priority
- Records click analytics non-blocking (waitUntil)
- Returns 301/302 redirect or custom 404/default URL
- Sets CSP headers on custom 404 HTML

**Key Functions**:

- `handleNotFound()` - 404 response with custom HTML or fallback
- Router: `redirect.all('*', ...)` - Matches all methods

**Dependencies**: kv-store, rule-matcher, analytics

---

#### `src/routes/api.ts` (~210 lines)

REST API endpoints (all require auth):

**Domain Endpoints**:

- `GET /api/domains` - List all domains
- `POST /api/domains` - Add domain (validate no duplicates)
- `DELETE /api/domains/:domain` - Remove domain + cascade (rules, config)

**Config Endpoints**:

- `GET /api/config/:domain` - Get domain settings
- `PUT /api/config/:domain` - Update (custom404Html, defaultUrl)
  - Validates HTML size <50KB
  - Validates URL protocol (http/https)

**Rule Endpoints**:

- `GET /api/rules/:domain` - List rules
- `POST /api/rules/:domain` - Create rule (validates source, target, type)
- `PUT /api/rules/:domain/:id` - Update rule fields
- `DELETE /api/rules/:domain/:id` - Remove rule

**Analytics Endpoints**:

- `GET /api/analytics/:domain` - Domain stats (total, by rule, by country, by referrer)
- `GET /api/analytics/:domain/:id` - Rule-specific stats (by country, device, referrer)

**Key Helpers**:

- `validateRule()` - Check source, target, type, URL validity

**Dependencies**: kv-store, analytics

---

#### `src/routes/admin.ts` (~17 lines)

Admin UI route handler:

- `GET /` - Serve admin HTML (inline SPA)
- `GET /*` - Fallback for hash-based routing

**Dependencies**: admin/html

---

### Services

#### `src/services/kv-store.ts` (~45 lines)

KV namespace operations:

- `getDomains()` - Fetch all domain names
- `setDomains()` - Update domain list
- `getRulesForDomain()` - Fetch rules for domain
- `setRulesForDomain()` - Update rules for domain
- `getDomainConfig()` - Fetch domain config
- `setDomainConfig()` - Update domain config

**Data Format**: All values stored as JSON strings

---

#### `src/services/rule-matcher.ts` (~130 lines)

URL pattern matching and target URL building:

**Key Functions**:

- `getPattern()` - Create URLPattern from rule, with LRU caching (500 entries)
- `matchRule()` - Test single rule against request URL
- `matchAllRules()` - Find first matching rule by priority
- `buildTargetUrl()` - Replace capture groups ($1, :named) and optional query params
- `stripTrailingSlash()` - Normalize path for matching

**Pattern Types**:

- `'path'` - URLPattern pathname matching with capture groups
- `'wildcard'` - URLPattern with wildcards
- `'subdomain'` - String match on first DNS label

**Features**:

- Capture group replacement ($1, $2, :named)
- Query string preservation (if `preserveQuery: true`)
- Infinite redirect guard (source !== target)
- Cache eviction on size limit

---

#### `src/services/analytics.ts` (~170 lines)

D1 analytics operations:

**Key Functions**:

- `recordClick()` - Insert click event into D1
- `extractClickData()` - Parse request and match result into ClickData
- `parseDevice()` - Identify device type from User-Agent (bot/mobile/desktop)
- `buildWhereClause()` - Build SQL WHERE clause with params
- `getAnalytics()` - Domain-level aggregations (total, byRule, byCountry, byReferrer, recent)
- `getAnalyticsByRule()` - Rule-level aggregations (byCountry, byDevice, byReferrer, recent)

**Data Captured**:

- `domain`, `redirectId`, `sourcePath`, `targetUrl`
- `country` (from request.cf.country)
- `device` (parsed from User-Agent)
- `referrer` (HTTP Referer header)
- `userAgent` (full User-Agent string)
- `timestamp` (server-side, CURRENT_TIMESTAMP)

**Queries**:

- Parallel aggregations via `Promise.all()`
- Uses indexes on (domain, timestamp) and (redirectId, timestamp)

---

### Admin UI

#### `src/admin/html.ts` (~500+ lines)

Inline Preact+HTM single-page application:

- No build step, embedded as JavaScript string
- Uses Preact Signals for state management
- Vanilla CSS-in-JS with CSS custom properties
- Routes via hash navigation (#/domains, #/rules/:domain, #/analytics)
- Makes fetch requests to `/api/*` endpoints

**Features**:

- Domain CRUD (add, delete, view config)
- Rule CRUD (create, edit, delete, enable/disable)
- Config management (custom 404 HTML, default URL)
- Analytics dashboard (charts, tables, date range filters)
- Export/import rules as JSON

**Bundle Size**: ~6KB (Preact+HTM inline)

---

### Database

#### `migrations/0001_create_click_events.sql` (~15 lines)

D1 schema:

- `click_events` table with columns: id, domain, redirect_id, source_path, target_url, country, device, referrer, user_agent, timestamp
- Index on (domain, timestamp) for analytics queries
- Index on (redirect_id, timestamp) for rule-specific stats
- Auto-increment ID, default CURRENT_TIMESTAMP

---

## Data Flow Diagram

```bash
Request Flow:
  Browser
    ↓
  Worker receives request
    ├─ _health → 200 OK
    ├─ /admin/* → Auth → Admin HTML
    ├─ /api/* → Auth → API handler
    │   ├─ Validates request
    │   ├─ KV read/write
    │   ├─ D1 queries (async)
    │   └─ JSON response
    └─ /* → Redirect handler
        ├─ Extract hostname
        ├─ KV.get(rules:{domain})
        ├─ Match rules (rule-matcher)
        ├─ D1.insert (analytics, non-blocking)
        └─ 301/302 redirect

Admin Click Analytics:
  Admin clicks "Analytics" in UI
    ↓
  Fetch GET /api/analytics/:domain
    ↓
  api.ts calls getAnalytics()
    ↓
  D1 executes 5 parallel queries
    ├─ SELECT COUNT(*) (total clicks)
    ├─ SELECT GROUP BY redirect_id (by rule)
    ├─ SELECT GROUP BY country (by country)
    ├─ SELECT GROUP BY referrer (by referrer)
    └─ SELECT * ORDER BY timestamp DESC (recent)
    ↓
  Aggregate results, return JSON
    ↓
  Admin UI renders charts/tables
```

---

## Testing

#### Test Structure

- Vitest with `@cloudflare/vitest-pool-workers` for Worker simulation
- Mocked KV and D1 bindings
- Unit tests for services (rule-matcher, kv-store, analytics)
- Integration tests for API routes

#### Running Tests

```bash
pnpm test          # Run once
pnpm test:watch    # Watch mode
```

---

## Configuration

#### `wrangler.toml`

- `main` = src/index.ts
- KV binding: `REDIRECTS_KV`
- D1 binding: `ANALYTICS_DB`
- Environment variables: `ACCESS_AUD`, `ACCESS_TEAM`

#### `tsconfig.json`

- Strict mode enabled
- ESM output
- Target: es2020

#### `package.json`

- Dependencies: hono@^4.12.3
- DevDeps: vitest, @cloudflare/vitest-pool-workers, wrangler, typescript

---

## Code Metrics

| Metric              | Value                    |
| ------------------- | ------------------------ |
| Total Source Files  | 10                       |
| Total Lines of Code | ~1000                    |
| Largest Module      | api.ts (210 lines)       |
| Largest Service     | analytics.ts (170 lines) |
| Smallest Module     | admin.ts (17 lines)      |
| Test Files          | 1+                       |
| TypeScript Strict   | Yes                      |
| Module System       | ESM                      |

---

## Key Patterns

### Error Handling

- Try-catch for external calls (URLPattern, fetch, URL parsing)
- Graceful fallback to null on parse errors
- HTTP status codes per API semantics (400, 401, 404, 409, 500)

### Performance

- KV caching at edge
- URLPattern LRU cache (500 entries)
- JWKS key caching (5 min TTL)
- Non-blocking analytics writes (waitUntil)
- Parallel D1 queries (Promise.all)

### Security

- Cloudflare Access JWT validation
- CORS restricted to same-origin
- CSP headers on custom 404 HTML
- URL validation (http/https only)
- Size limits (custom404Html <50KB)

### Maintainability

## Code Metrics

| Metric              | Value                    |
| ------------------- | ------------------------ |
| Total Source Files  | 10                       |
| Total Lines of Code | ~1000                    |
| Largest Module      | api.ts (210 lines)       |
| Largest Service     | analytics.ts (170 lines) |
| Smallest Module     | admin.ts (17 lines)      |
| Test Files          | 1+                       |
| TypeScript Strict   | Yes                      |
| Module System       | ESM                      |

---

## Key Patterns

### Error Handling

- Try-catch for external calls (URLPattern, fetch, URL parsing)
- Graceful fallback to null on parse errors
- HTTP status codes per API semantics (400, 401, 404, 409, 500)

### Performance

- KV caching at edge
- URLPattern LRU cache (500 entries)
- JWKS key caching (5 min TTL)
- Non-blocking analytics writes (waitUntil)
- Parallel D1 queries (Promise.all)

### Security

- Cloudflare Access JWT validation
- CORS restricted to same-origin
- CSP headers on custom 404 HTML
- URL validation (http/https only)
- Size limits (custom404Html <50KB)

### Maintainability

- Clear separation of concerns (routes, services, middleware)
- Type safety (TypeScript strict mode)
- Inline admin UI (no build step)
- Comprehensive JSDoc comments

---

## Dependency Tree

```bash
index.ts
├── types.ts
├── middleware/auth.ts → types.ts
├── routes/redirect.ts → types.ts, services/kv-store.ts, services/rule-matcher.ts, services/analytics.ts
├── routes/api.ts → types.ts, services/kv-store.ts, services/analytics.ts
├── routes/admin.ts → types.ts, admin/html.ts
└── admin/html.ts (self-contained inline SPA)

services/kv-store.ts → types.ts
services/rule-matcher.ts → types.ts
services/analytics.ts → types.ts
```

---

## How to Navigate the Code

1. **Understanding requests**: Start at `src/index.ts` (routing) → `src/routes/redirect.ts` (handler)
2. **Rule matching logic**: `src/services/rule-matcher.ts`
3. **API endpoints**: `src/routes/api.ts`
4. **Analytics**: `src/services/analytics.ts`
5. **Storage**: `src/services/kv-store.ts`
6. **Types**: `src/types.ts` (all interfaces)
7. **Auth**: `src/middleware/auth.ts`
8. **Admin UI**: `src/admin/html.ts`
