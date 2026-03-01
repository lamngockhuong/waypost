export function getAdminHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waypost Admin</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --danger: #dc2626;
      --danger-hover: #b91c1c;
      --success: #16a34a;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 8px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px 16px; }
    h1 { font-size: 1.5rem; margin-bottom: 24px; }
    h2 { font-size: 1.25rem; margin-bottom: 16px; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    nav { background: var(--surface); border-bottom: 1px solid var(--border); padding: 12px 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
    nav .brand { font-weight: 700; font-size: 1.1rem; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--border); }
    th { font-weight: 600; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
    tr:hover td { background: var(--bg); }
    .btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; border: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; font-weight: 500; transition: background 0.15s; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover { background: var(--danger-hover); }
    .btn-sm { padding: 4px 10px; font-size: 0.8rem; }
    .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
    .btn-outline:hover { background: var(--bg); }
    input, select, textarea { padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 0.875rem; width: 100%; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(37,99,235,0.15); }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-gray { background: #f1f5f9; color: #475569; }
    .bar-chart { display: flex; flex-direction: column; gap: 6px; }
    .bar-row { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; }
    .bar-label { width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar { height: 22px; background: var(--primary); border-radius: 4px; transition: width 0.3s; min-width: 2px; }
    .bar-count { font-size: 0.8rem; color: var(--text-muted); min-width: 40px; }
    .flex { display: flex; }
    .gap-2 { gap: 8px; }
    .gap-4 { gap: 16px; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
    .loading { color: var(--text-muted); padding: 20px; text-align: center; }
    .error { color: var(--danger); padding: 12px; background: #fef2f2; border-radius: var(--radius); margin-bottom: 12px; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 50; }
    .modal { background: var(--surface); border-radius: var(--radius); padding: 24px; width: 90%; max-width: 560px; max-height: 80vh; overflow-y: auto; }
    .toggle { width: 40px; height: 22px; border-radius: 11px; background: #cbd5e1; cursor: pointer; position: relative; transition: background 0.2s; border: none; }
    .toggle.active { background: var(--success); }
    .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: white; top: 2px; left: 2px; transition: transform 0.2s; }
    .toggle.active::after { transform: translateX(18px); }
    @media (max-width: 640px) { table { font-size: 0.75rem; } th, td { padding: 6px 8px; } .form-row { grid-template-columns: 1fr; } }
  </style>
  <script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.25.4",
      "preact/hooks": "https://esm.sh/preact@10.25.4/hooks",
      "@preact/signals": "https://esm.sh/@preact/signals@2.0.4?deps=preact@10.25.4",
      "htm/preact": "https://esm.sh/htm@3.1.1/preact?deps=preact@10.25.4"
    }
  }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { render } from 'preact';
    import { useState, useEffect, useCallback } from 'preact/hooks';
    import { signal } from '@preact/signals';
    import { html } from 'htm/preact';

    // --- API helper ---
    async function api(path, options = {}) {
      const res = await fetch('/api' + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return res.json();
    }

    // --- Router ---
    const route = signal(location.hash || '#/');
    window.addEventListener('hashchange', () => { route.value = location.hash || '#/'; });

    function App() {
      const hash = route.value;
      const m = hash.match(/^#\\/domain\\/(.+)$/);
      const a = hash.match(/^#\\/analytics\\/(.+)$/);
      return html\`
        <nav>
          <span class="brand"><a href="#/">Waypost</a></span>
          <a href="#/">Dashboard</a>
        </nav>
        <div class="container">
          \${a ? html\`<\${AnalyticsPage} domain=\${decodeURIComponent(a[1])} />\`
            : m ? html\`<\${RulesPage} domain=\${decodeURIComponent(m[1])} />\`
            : html\`<\${Dashboard} />\`}
        </div>
      \`;
    }

    // --- Dashboard ---
    function Dashboard() {
      const [domains, setDomains] = useState(null);
      const [error, setError] = useState('');
      const [adding, setAdding] = useState(false);
      const [newDomain, setNewDomain] = useState('');

      const load = useCallback(() => { api('/domains').then(setDomains).catch(e => setError(e.message)); }, []);
      useEffect(() => { load(); }, [load]);

      const addDomain = async () => {
        if (!newDomain.trim()) return;
        try { await api('/domains', { method: 'POST', body: { domain: newDomain.trim() } }); setNewDomain(''); setAdding(false); load(); }
        catch(e) { setError(e.message); }
      };

      const deleteDomain = async (d) => {
        if (!confirm('Delete domain ' + d + ' and all its rules?')) return;
        try { await api('/domains/' + encodeURIComponent(d), { method: 'DELETE' }); load(); }
        catch(e) { setError(e.message); }
      };

      if (domains === null) return html\`<div class="loading">Loading...</div>\`;

      return html\`
        <div class="flex justify-between items-center mb-4">
          <h1>Domains</h1>
          <button class="btn btn-primary" onClick=\${() => setAdding(true)}>+ Add Domain</button>
        </div>
        \${error && html\`<div class="error">\${error}</div>\`}
        \${adding && html\`
          <div class="card mb-4">
            <div class="form-row">
              <div class="form-group"><label>Domain</label><input value=\${newDomain} onInput=\${e => setNewDomain(e.target.value)} placeholder="example.com" /></div>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-primary" onClick=\${addDomain}>Save</button>
              <button class="btn btn-outline" onClick=\${() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        \`}
        <div class="card">
          \${domains.length === 0
            ? html\`<p style="color:var(--text-muted)">No domains yet. Add one to get started.</p>\`
            : html\`<table>
              <thead><tr><th>Domain</th><th>Actions</th></tr></thead>
              <tbody>\${domains.map(d => html\`
                <tr key=\${d}>
                  <td>\${d}</td>
                  <td class="flex gap-2">
                    <a href=\${'#/domain/' + encodeURIComponent(d)} class="btn btn-sm btn-outline">Rules</a>
                    <a href=\${'#/analytics/' + encodeURIComponent(d)} class="btn btn-sm btn-outline">Analytics</a>
                    <button class="btn btn-sm btn-danger" onClick=\${() => deleteDomain(d)}>Delete</button>
                  </td>
                </tr>
              \`)}</tbody>
            </table>\`}
        </div>
      \`;
    }

    // --- Rules Page ---
    function RulesPage({ domain }) {
      const [rules, setRules] = useState(null);
      const [error, setError] = useState('');
      const [showForm, setShowForm] = useState(false);
      const [editing, setEditing] = useState(null);

      const load = useCallback(() => { api('/rules/' + encodeURIComponent(domain)).then(setRules).catch(e => setError(e.message)); }, [domain]);
      useEffect(() => { load(); }, [load]);

      const deleteRule = async (id) => {
        if (!confirm('Delete this rule?')) return;
        try { await api('/rules/' + encodeURIComponent(domain) + '/' + id, { method: 'DELETE' }); load(); }
        catch(e) { setError(e.message); }
      };

      const toggleRule = async (rule) => {
        try { await api('/rules/' + encodeURIComponent(domain) + '/' + rule.id, { method: 'PUT', body: { enabled: !rule.enabled } }); load(); }
        catch(e) { setError(e.message); }
      };

      const handleExport = () => { window.open('/api/export/' + encodeURIComponent(domain)); };

      const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.json';
        input.onchange = async () => {
          const text = await input.files[0].text();
          try { const data = JSON.parse(text); await api('/import/' + encodeURIComponent(domain), { method: 'POST', body: data }); load(); }
          catch(e) { setError(e.message); }
        };
        input.click();
      };

      if (rules === null) return html\`<div class="loading">Loading...</div>\`;

      return html\`
        <div class="flex justify-between items-center mb-4">
          <h1>Rules: \${domain}</h1>
          <div class="flex gap-2">
            <button class="btn btn-outline" onClick=\${handleExport}>Export</button>
            <button class="btn btn-outline" onClick=\${handleImport}>Import</button>
            <button class="btn btn-primary" onClick=\${() => { setEditing(null); setShowForm(true); }}>+ Add Rule</button>
          </div>
        </div>
        \${error && html\`<div class="error">\${error}</div>\`}
        \${showForm && html\`<\${RuleForm} domain=\${domain} rule=\${editing} onSave=\${() => { setShowForm(false); load(); }} onCancel=\${() => setShowForm(false)} />\`}
        <div class="card">
          \${rules.length === 0
            ? html\`<p style="color:var(--text-muted)">No rules yet.</p>\`
            : html\`<table>
              <thead><tr><th>Source</th><th>Target</th><th>Type</th><th>Code</th><th>On</th><th>Pri</th><th>Actions</th></tr></thead>
              <tbody>\${rules.sort((a,b) => b.priority - a.priority).map(r => html\`
                <tr key=\${r.id}>
                  <td>\${r.source}</td>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title=\${r.target}>\${r.target}</td>
                  <td><span class="badge badge-gray">\${r.type}</span></td>
                  <td>\${r.statusCode}</td>
                  <td><button class=\${'toggle' + (r.enabled ? ' active' : '')} onClick=\${() => toggleRule(r)}></button></td>
                  <td>\${r.priority}</td>
                  <td class="flex gap-2">
                    <button class="btn btn-sm btn-outline" onClick=\${() => { setEditing(r); setShowForm(true); }}>Edit</button>
                    <button class="btn btn-sm btn-danger" onClick=\${() => deleteRule(r.id)}>Del</button>
                  </td>
                </tr>
              \`)}</tbody>
            </table>\`}
        </div>
      \`;
    }

    // --- Rule Form ---
    function RuleForm({ domain, rule, onSave, onCancel }) {
      const [form, setForm] = useState(rule || { source: '', target: '', type: 'path', statusCode: 302, preserveQuery: false, enabled: true, priority: 0 });
      const [error, setError] = useState('');

      const set = (k, v) => setForm(f => ({...f, [k]: v}));

      const submit = async () => {
        try {
          if (rule) {
            await api('/rules/' + encodeURIComponent(domain) + '/' + rule.id, { method: 'PUT', body: form });
          } else {
            await api('/rules/' + encodeURIComponent(domain), { method: 'POST', body: form });
          }
          onSave();
        } catch(e) { setError(e.message); }
      };

      return html\`
        <div class="card mb-4">
          <h2>\${rule ? 'Edit' : 'Add'} Rule</h2>
          \${error && html\`<div class="error">\${error}</div>\`}
          <div class="form-row">
            <div class="form-group"><label>Source</label><input value=\${form.source} onInput=\${e => set('source', e.target.value)} placeholder="/path or /blog/*" /></div>
            <div class="form-group"><label>Target</label><input value=\${form.target} onInput=\${e => set('target', e.target.value)} placeholder="https://example.com" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Type</label><select value=\${form.type} onChange=\${e => set('type', e.target.value)}><option value="path">Path</option><option value="wildcard">Wildcard</option><option value="subdomain">Subdomain</option></select></div>
            <div class="form-group"><label>Status</label><select value=\${form.statusCode} onChange=\${e => set('statusCode', Number(e.target.value))}><option value="301">301 Permanent</option><option value="302">302 Temporary</option></select></div>
            <div class="form-group"><label>Priority</label><input type="number" value=\${form.priority} onInput=\${e => set('priority', Number(e.target.value))} /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label><input type="checkbox" checked=\${form.preserveQuery} onChange=\${e => set('preserveQuery', e.target.checked)} /> Preserve Query</label></div>
            <div class="form-group"><label><input type="checkbox" checked=\${form.enabled} onChange=\${e => set('enabled', e.target.checked)} /> Enabled</label></div>
          </div>
          <div class="flex gap-2 mt-4">
            <button class="btn btn-primary" onClick=\${submit}>\${rule ? 'Update' : 'Create'}</button>
            <button class="btn btn-outline" onClick=\${onCancel}>Cancel</button>
          </div>
        </div>
      \`;
    }

    // --- Analytics Page ---
    function AnalyticsPage({ domain }) {
      const [data, setData] = useState(null);
      const [error, setError] = useState('');
      const [from, setFrom] = useState('');
      const [to, setTo] = useState('');

      const load = useCallback(() => {
        let q = '/analytics/' + encodeURIComponent(domain);
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        const qs = params.toString();
        if (qs) q += '?' + qs;
        api(q).then(setData).catch(e => setError(e.message));
      }, [domain, from, to]);
      useEffect(() => { load(); }, [load]);

      if (data === null) return html\`<div class="loading">Loading...</div>\`;

      const maxCount = Math.max(1, ...((data.byRule || []).map(r => r.count)));

      return html\`
        <div class="flex justify-between items-center mb-4">
          <h1>Analytics: \${domain}</h1>
          <a href=\${'#/domain/' + encodeURIComponent(domain)} class="btn btn-outline">Back to Rules</a>
        </div>
        \${error && html\`<div class="error">\${error}</div>\`}
        <div class="card mb-4">
          <div class="form-row">
            <div class="form-group"><label>From</label><input type="date" value=\${from} onInput=\${e => setFrom(e.target.value)} /></div>
            <div class="form-group"><label>To</label><input type="date" value=\${to} onInput=\${e => setTo(e.target.value)} /></div>
          </div>
        </div>
        <div class="card mb-4">
          <h2>Total Clicks: \${data.totalClicks}</h2>
        </div>
        \${data.byRule?.length > 0 && html\`
          <div class="card mb-4">
            <h2>Clicks by Rule</h2>
            <div class="bar-chart">\${data.byRule.map(r => html\`
              <div class="bar-row" key=\${r.redirect_id}>
                <span class="bar-label" title=\${r.source_path}>\${r.source_path || r.redirect_id}</span>
                <div class="bar" style=\${'width:' + Math.round(r.count/maxCount*100) + '%'}></div>
                <span class="bar-count">\${r.count}</span>
              </div>
            \`)}</div>
          </div>
        \`}
        \${data.byCountry?.length > 0 && html\`
          <div class="card mb-4">
            <h2>Top Countries</h2>
            <table><thead><tr><th>Country</th><th>Clicks</th></tr></thead>
            <tbody>\${data.byCountry.map(r => html\`<tr key=\${r.country}><td>\${r.country}</td><td>\${r.count}</td></tr>\`)}</tbody></table>
          </div>
        \`}
        \${data.byReferrer?.length > 0 && html\`
          <div class="card mb-4">
            <h2>Top Referrers</h2>
            <table><thead><tr><th>Referrer</th><th>Clicks</th></tr></thead>
            <tbody>\${data.byReferrer.map(r => html\`<tr key=\${r.referrer}><td>\${r.referrer || '(direct)'}</td><td>\${r.count}</td></tr>\`)}</tbody></table>
          </div>
        \`}
      \`;
    }

    render(html\`<\${App} />\`, document.getElementById('app'));
  </script>
</body>
</html>`;
}
