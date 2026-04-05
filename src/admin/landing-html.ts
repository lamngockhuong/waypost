export function getLandingHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Waypost — URL Redirect System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;700&family=Fira+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #7c3aed; --primary-glow: rgba(124,58,237,.15);
      --bg: #faf8ff; --surface: #fff; --surface-hover: #f5f3ff;
      --border: #e5e2f0; --text: #1e1b3a; --text-sub: #6b6580; --text-muted: #8b8598;
    }
    @media(prefers-color-scheme:dark){:root{
      --primary: #a78bfa; --primary-glow: rgba(167,139,250,.12);
      --bg: #0c0a1a; --surface: #16132a; --surface-hover: #1e1b35;
      --border: #2a2745; --text: #e8e5f5; --text-sub: #a8a3b8; --text-muted: #6b6580;
    }}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Fira Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}

    /* Animated background grid */
    .bg-grid{position:fixed;inset:0;z-index:0;opacity:.35;
      background-image:radial-gradient(var(--border) 1px,transparent 1px);
      background-size:32px 32px;pointer-events:none}
    .bg-glow{position:fixed;top:-40%;left:50%;transform:translateX(-50%);width:800px;height:800px;
      border-radius:50%;background:var(--primary-glow);filter:blur(100px);z-index:0;pointer-events:none}

    .page{position:relative;z-index:1;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px}

    /* Hero */
    .hero{max-width:680px;text-align:center;animation:fadeUp .6s ease-out both}
    .logo-wrap{display:inline-flex;align-items:center;gap:12px;margin-bottom:20px}
    .logo-icon{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#7c3aed,#a78bfa);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(124,58,237,.3)}
    .logo-icon svg{width:28px;height:28px;color:#fff}
    .logo-text{font-family:'Fira Code',monospace;font-size:2rem;font-weight:700;color:var(--text);letter-spacing:-0.02em}
    h1{font-size:clamp(1.8rem,5vw,3rem);font-weight:700;line-height:1.15;margin-bottom:16px;letter-spacing:-0.03em}
    h1 .highlight{background:linear-gradient(135deg,#7c3aed,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .subtitle{font-size:clamp(1rem,2.5vw,1.2rem);color:var(--text-sub);max-width:520px;margin:0 auto 48px}

    /* CTA */
    .cta-group{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:64px}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:12px;font-weight:600;font-size:.95rem;text-decoration:none;transition:all .2s;border:none;cursor:pointer}
    .btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 16px rgba(124,58,237,.3)}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(124,58,237,.35)}
    .btn-outline{background:transparent;color:var(--text);border:1.5px solid var(--border)}
    .btn-outline:hover{background:var(--surface-hover);border-color:var(--primary)}
    .btn svg{width:18px;height:18px}
    @media(prefers-color-scheme:dark){
      .btn-primary{color:#0c0a1a}
    }

    /* Features */
    .features{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:680px;width:100%;animation:fadeUp .6s .15s ease-out both}
    .feature{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;transition:all .2s;position:relative;overflow:hidden}
    .feature:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(124,58,237,.08);border-color:var(--primary)}
    .feature-icon{width:40px;height:40px;border-radius:10px;background:var(--primary-glow);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
    .feature-icon svg{width:20px;height:20px;color:var(--primary)}
    .feature h3{font-size:.95rem;font-weight:600;margin-bottom:6px}
    .feature p{font-size:.85rem;color:var(--text-sub);line-height:1.5}

    /* Footer */
    .footer{margin-top:64px;text-align:center;animation:fadeUp .6s .3s ease-out both}
    .footer p{font-size:.8rem;color:var(--text-muted)}
    .footer a{color:var(--primary);text-decoration:none}
    .footer a:hover{text-decoration:underline}

    /* Animations */
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @media(max-width:540px){.features{grid-template-columns:1fr}.cta-group{flex-direction:column;align-items:center}}
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="bg-glow"></div>

  <div class="page">
    <div class="hero">
      <div class="logo-wrap">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558"/>
          </svg>
        </div>
        <span class="logo-text">Waypost</span>
      </div>
      <h1>Redirect URLs at the <span class="highlight">speed of edge</span></h1>
      <p class="subtitle">Multi-domain URL redirect system with analytics, pattern matching, and a beautiful admin panel &mdash; all powered by Cloudflare Workers.</p>

      <div class="cta-group">
        <a class="btn btn-primary" href="/admin">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
          Open Admin Panel
        </a>
        <a class="btn btn-outline" href="https://github.com/lamngockhuong/waypost" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.466.73-3.558"/></svg>
        </div>
        <h3>Multi-Domain</h3>
        <p>Manage redirect rules across unlimited domains from a single dashboard.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>
        </div>
        <h3>Pattern Matching</h3>
        <p>Path, wildcard, and subdomain rules with priority-based routing.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
        </div>
        <h3>Real-time Analytics</h3>
        <p>Track clicks by rule, country, and referrer with visual dashboards.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/></svg>
        </div>
        <h3>Edge Speed</h3>
        <p>Sub-millisecond redirects powered by Cloudflare Workers worldwide.</p>
      </div>
    </div>

    <div class="footer">
      <p>Waypost &mdash; open-source URL redirect system</p>
    </div>
  </div>
</body>
</html>`;
}
