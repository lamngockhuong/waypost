export function getLandingHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waypost — URL Redirect System</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.6; }
    .hero { max-width: 640px; margin: 0 auto; padding: 80px 24px; text-align: center; }
    .logo { font-size: 2.5rem; font-weight: 800; color: #2563eb; margin-bottom: 12px; }
    .tagline { font-size: 1.15rem; color: #64748b; margin-bottom: 40px; }
    .features { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: left; margin-bottom: 40px; }
    .feature { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .feature h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; }
    .feature p { font-size: 0.8rem; color: #64748b; }
    .cta { display: inline-block; padding: 10px 24px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: background 0.15s; }
    .cta:hover { background: #1d4ed8; }
    .footer { font-size: 0.8rem; color: #94a3b8; margin-top: 24px; }
    @media (max-width: 480px) { .features { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="hero">
    <div class="logo">Waypost</div>
    <p class="tagline">Multi-domain URL redirect system powered by Cloudflare Workers</p>
    <div class="features">
      <div class="feature">
        <h3>Multi-Domain</h3>
        <p>Manage redirect rules across multiple domains from one place</p>
      </div>
      <div class="feature">
        <h3>Pattern Matching</h3>
        <p>Path, wildcard, and subdomain redirect rules with priority</p>
      </div>
      <div class="feature">
        <h3>Analytics</h3>
        <p>Track clicks by rule, country, and referrer in real time</p>
      </div>
      <div class="feature">
        <h3>Edge Speed</h3>
        <p>Sub-millisecond redirects at the edge via Cloudflare Workers</p>
      </div>
    </div>
    <a class="cta" href="/admin">Go to Admin Panel</a>
    <p class="footer">Waypost &mdash; open-source URL redirect system</p>
  </div>
</body>
</html>`;
}
