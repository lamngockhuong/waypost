export function getLandingHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Waypost — URL Redirect System</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cstyle%3E%40media(prefers-color-scheme:dark)%7B.bg%7Bfill:url(%23gd)%7D%7D%3C/style%3E%3Cdefs%3E%3ClinearGradient id='gl' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%237c3aed'/%3E%3Cstop offset='100%25' stop-color='%23a78bfa'/%3E%3C/linearGradient%3E%3ClinearGradient id='gd' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23a78bfa'/%3E%3Cstop offset='100%25' stop-color='%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect class='bg' width='24' height='24' rx='5' fill='url(%23gl)'/%3E%3Cg fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='2,2 5,15 9.5,5 13,15'/%3E%3Ccircle cx='2' cy='2' r='1.8' fill='%23fff' opacity='0.15' stroke='none'/%3E%3Ccircle cx='2' cy='2' r='0.9' fill='%23fff' stroke='none'/%3E%3Ccircle cx='9.5' cy='5' r='3' fill='%23fff' opacity='0.15' stroke='none'/%3E%3Ccircle cx='9.5' cy='5' r='1.2' fill='%23fff' stroke='none'/%3E%3Cpath d='M13 15 Q15.5 8 19 4.5 M16.8 5 L19 4.5 L18.5 6.7'/%3E%3Cpath d='M13 15 Q16.5 10.5 20 8.5 M18 8 L20 8.5 L19 10' opacity='0.6'/%3E%3Cpath d='M13 15 Q17 15.5 20 15 M18.5 13.5 L20 15 L18.5 16.5' opacity='0.35'/%3E%3C/g%3E%3C/svg%3E">
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
    .feature{background:color-mix(in srgb,var(--surface) 85%,transparent);backdrop-filter:blur(8px);border:1px solid var(--border);border-radius:16px;padding:24px;transition:all .2s;position:relative;overflow:hidden}
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

    /* Background logo */
    .bg-logo{position:fixed;top:50%;left:50%;transform:translate(-50%,-55%);width:min(95vw,900px);height:min(95vw,900px);z-index:0;pointer-events:none;opacity:.08}
    .bg-logo svg{width:100%;height:100%}
    .bg-logo .glow1{animation:pulse1 3s ease-in-out infinite}
    .bg-logo .glow2{animation:pulse2 4s ease-in-out infinite}
    .bg-logo .ring1{animation:ring1 3s ease-in-out infinite}
    .bg-logo .ring2{animation:ring2 4s ease-in-out infinite}
    .bg-logo .line1,.bg-logo .line2,.bg-logo .line3{will-change:stroke-dashoffset,opacity}
    .bg-logo .line1{stroke-dasharray:20;stroke-dashoffset:20;animation:drawL1 8s cubic-bezier(.4,0,.2,1) infinite}
    .bg-logo .tip1{opacity:0;animation:popT1 8s ease infinite}
    .bg-logo .line2{stroke-dasharray:18;stroke-dashoffset:18;animation:drawL2 8s cubic-bezier(.4,0,.2,1) infinite}
    .bg-logo .tip2{opacity:0;animation:popT2 8s ease infinite}
    .bg-logo .line3{stroke-dasharray:15;stroke-dashoffset:15;animation:drawL3 8s cubic-bezier(.4,0,.2,1) infinite}
    .bg-logo .tip3{opacity:0;animation:popT3 8s ease infinite}
    @keyframes pulse1{0%,100%{r:2;opacity:.2}50%{r:4;opacity:.5}}
    @keyframes pulse2{0%,100%{r:3;opacity:.2}50%{r:6;opacity:.45}}
    @keyframes ring1{0%,100%{r:3;opacity:.15;stroke-width:.3}50%{r:5.5;opacity:0;stroke-width:.1}}
    @keyframes ring2{0%,100%{r:4.5;opacity:.15;stroke-width:.3}50%{r:8;opacity:0;stroke-width:.1}}
    /* Arrow 1: draw, hold, hide instant, reset while hidden */
    @keyframes drawL1{0%{stroke-dashoffset:20;opacity:0}2%{opacity:1}18%{stroke-dashoffset:0;opacity:1}69%{stroke-dashoffset:0;opacity:1}69.01%{stroke-dashoffset:0;opacity:0}80%{stroke-dashoffset:0;opacity:0}80.01%{stroke-dashoffset:20;opacity:0}100%{stroke-dashoffset:20;opacity:0}}
    @keyframes popT1{0%,17%{opacity:0}20%{opacity:1}69%{opacity:1}69.01%{opacity:0}100%{opacity:0}}
    /* Arrow 2 */
    @keyframes drawL2{0%,22%{stroke-dashoffset:18;opacity:0}24%{opacity:.6}38%{stroke-dashoffset:0;opacity:.6}69%{stroke-dashoffset:0;opacity:.6}69.01%{stroke-dashoffset:0;opacity:0}80%{stroke-dashoffset:0;opacity:0}80.01%{stroke-dashoffset:18;opacity:0}100%{stroke-dashoffset:18;opacity:0}}
    @keyframes popT2{0%,36%{opacity:0}40%{opacity:.6}69%{opacity:.6}69.01%{opacity:0}100%{opacity:0}}
    /* Arrow 3 */
    @keyframes drawL3{0%,42%{stroke-dashoffset:15;opacity:0}44%{opacity:.35}56%{stroke-dashoffset:0;opacity:.35}69%{stroke-dashoffset:0;opacity:.35}69.01%{stroke-dashoffset:0;opacity:0}80%{stroke-dashoffset:0;opacity:0}80.01%{stroke-dashoffset:15;opacity:0}100%{stroke-dashoffset:15;opacity:0}}
    @keyframes popT3{0%,54%{opacity:0}58%{opacity:.35}69%{opacity:.35}69.01%{opacity:0}100%{opacity:0}}

    /* Animations */
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @media(max-width:540px){.features{grid-template-columns:1fr}.cta-group{flex-direction:column;align-items:center}}
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="bg-glow"></div>
  <div class="bg-logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="2,2 5,15 9.5,5 13,15"/>
      <circle class="ring1" cx="2" cy="2" r="3" fill="none" stroke="var(--primary)" opacity=".15"/>
      <circle class="glow1" cx="2" cy="2" r="2" fill="var(--primary)" opacity=".2" stroke="none"/>
      <circle cx="2" cy="2" r="0.9" fill="var(--primary)" stroke="none"/>
      <circle class="ring2" cx="9.5" cy="5" r="4.5" fill="none" stroke="var(--primary)" opacity=".15"/>
      <circle class="glow2" cx="9.5" cy="5" r="3" fill="var(--primary)" opacity=".2" stroke="none"/>
      <circle cx="9.5" cy="5" r="1.2" fill="var(--primary)" stroke="none"/>
      <path class="line1" d="M13 15 Q15.5 8 19 4.5"/>
      <polyline class="tip1" points="16.8,5 19,4.5 18.5,6.7"/>
      <path class="line2" d="M13 15 Q16.5 10.5 20 8.5"/>
      <polyline class="tip2" points="18,8 20,8.5 19,10"/>
      <path class="line3" d="M13 15 Q17 15.5 20 15"/>
      <polyline class="tip3" points="18.5,13.5 20,15 18.5,16.5"/>
    </svg>
  </div>

  <div class="page">
    <div class="hero">
      <div class="logo-wrap">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2,2 5,15 9.5,5 13,15"/>
            <circle cx="2" cy="2" r="1.8" fill="#fff" opacity="0.15" stroke="none"/>
            <circle cx="2" cy="2" r="0.9" fill="#fff" stroke="none"/>
            <circle cx="9.5" cy="5" r="3" fill="#fff" opacity="0.15" stroke="none"/>
            <circle cx="9.5" cy="5" r="1.2" fill="#fff" stroke="none"/>
            <path d="M13 15 Q15.5 8 19 4.5 M16.8 5 L19 4.5 L18.5 6.7"/>
            <path d="M13 15 Q16.5 10.5 20 8.5 M18 8 L20 8.5 L19 10" opacity="0.6"/>
            <path d="M13 15 Q17 15.5 20 15 M18.5 13.5 L20 15 L18.5 16.5" opacity="0.35"/>
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
