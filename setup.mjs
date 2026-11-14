import fs from 'node:fs';
import path from 'node:path';

const directories = [
  'content/language-study/japanese/joyo-kanji',
  'content/language-study/japanese/news-articles',
  'content/language-study/english/articles',
  'content/games',
  'content/health',
  'content/utilities',
  'content/music',
  'content/books'
];

const files = {
  'CNAME': `mycreativityexperiment.com\n`,

  'catalog.json': JSON.stringify([
    {
      slug: 'day-1',
      title: 'Joyo Kanji Course: Day 1',
      section: 'Language Study',
      language: 'Japanese',
      subsection: 'Joyo Kanji Course',
      description: 'Foundational Joyo kanji drills, core vocabulary, and interactive grammar cloze.',
      path: '/content/language-study/japanese/joyo-kanji/day-1.html',
      access: 'free'
    },
    {
      slug: 'day-2',
      title: 'Joyo Kanji Course: Day 2',
      section: 'Language Study',
      language: 'Japanese',
      subsection: 'Joyo Kanji Course',
      description: 'Directional particles, essential verb conjugations, and active recall drills.',
      path: '/content/language-study/japanese/joyo-kanji/day-2.html',
      access: 'free'
    },
    {
      slug: 'pixel-bistro',
      title: 'Pixel Bistro',
      section: 'Games',
      language: null,
      subsection: null,
      description: 'Fast-paced retro counter service arcade cartridge. Zero dependencies, plays offline.',
      path: '/content/games/pixel-bistro.html',
      access: 'free'
    }
  ], null, 2) + '\n',

  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Creativity Experiment | Experiments merging Human creativity with AI</title>
  <link rel="stylesheet" href="/style.css" />
  <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
</head>
<body>
  <header class="ls-header">
    <div class="ls-container ls-header-inner">
      <div class="ls-brand">
        <span class="ls-badge">LIGHT SYSTEM // STUDIO</span>
        <h1>My Creativity Experiment</h1>
        <p class="ls-subtitle">Experiments merging Human creativity with AI</p>
      </div>
      <div class="ls-pass-box" id="pass-status-box">
        <a href="https://YOUR-STORE.lemonsqueezy.com/buy/YOUR-PASS-ID?embed=1" class="lemonsqueezy-button ls-btn-primary">
          All-Access Pass — $30
        </a>
        <button class="ls-btn-ghost" id="open-key-modal">Have a license key?</button>
      </div>
    </div>
  </header>

  <main class="ls-container">
    <nav class="ls-tabs" aria-label="Primary Sections">
      <button class="ls-tab active" data-section="All">All</button>
      <button class="ls-tab" data-section="Language Study">Language Study</button>
      <button class="ls-tab" data-section="Games">Games</button>
      <button class="ls-tab" data-section="Health">Health</button>
      <button class="ls-tab" data-section="Utilities">Utilities</button>
      <button class="ls-tab" data-section="Music">Music</button>
      <button class="ls-tab" data-section="Books">Books</button>
    </nav>

    <div class="ls-subnav hidden" id="language-subnav">
      <div class="ls-pill-row">
        <span class="ls-sub-label">Language:</span>
        <button class="ls-subtab active" data-language="All">All Languages</button>
        <button class="ls-subtab" data-language="Japanese">Japanese</button>
        <button class="ls-subtab" data-language="English">English</button>
      </div>

      <div class="ls-pill-row hidden" id="japanese-tracks">
        <span class="ls-sub-label">Japanese Track:</span>
        <button class="ls-subtab active" data-subsection="All">All Japanese</button>
        <button class="ls-subtab" data-subsection="Joyo Kanji Course">Joyo Kanji Course</button>
        <button class="ls-subtab" data-subsection="News Articles">News Articles</button>
      </div>

      <div class="ls-pill-row hidden" id="english-tracks">
        <span class="ls-sub-label">English Track:</span>
        <button class="ls-subtab active" data-subsection="Articles">Articles</button>
      </div>
    </div>

    <section class="ls-grid" id="catalog-grid"></section>
  </main>

  <footer class="ls-footer">
    <div class="ls-container ls-footer-inner">
      <span>&copy; 2026 My Creativity Experiment</span>
      <span>Self-Contained Local-First Editions</span>
    </div>
  </footer>

  <dialog class="ls-modal" id="key-modal">
    <form method="dialog" class="ls-modal-body" id="key-form">
      <h3>Activate All-Access Pass</h3>
      <p>Enter your Lemon Squeezy license key to unlock all vaulted releases and offline downloads.</p>
      <input type="text" id="license-input" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" required />
      <p class="ls-error" id="license-error"></p>
      <div class="ls-modal-actions">
        <button type="button" class="ls-btn-ghost" id="close-key-modal">Cancel</button>
        <button type="submit" class="ls-btn-primary" id="verify-key-btn">Activate</button>
      </div>
    </form>
  </dialog>

  <script src="/unlock.js"></script>
</body>
</html>
`,

  'style.css': `:root {
  --bg: #fafaf9;
  --surface: #ffffff;
  --ink: #171717;
  --muted: #57534e;
  --border: #e7e5e4;
  --accent: #1c1917;
  --accent-hover: #44403c;
  --tag-free: #ecfdf5;
  --tag-free-ink: #065f46;
  --tag-vault: #fef3c7;
  --tag-vault-ink: #92400e;
  --radius: 8px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.hidden { display: none !important; }

.ls-container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 24px;
}

.ls-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 40px 0 32px;
}

.ls-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}

.ls-badge {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ls-subtitle {
  color: var(--muted);
  font-size: 15px;
  margin-top: 4px;
}

.ls-pass-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.ls-btn-primary, .ls-btn-secondary, .ls-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.ls-btn-primary { background: var(--accent); color: #ffffff; }
.ls-btn-primary:hover { background: var(--accent-hover); }

.ls-btn-secondary { background: var(--surface); color: var(--ink); border-color: var(--border); }
.ls-btn-secondary:hover { border-color: var(--ink); }

.ls-btn-ghost { background: transparent; color: var(--muted); padding: 4px 8px; font-size: 12px; }
.ls-btn-ghost:hover { color: var(--ink); }

.ls-tabs {
  display: flex;
  gap: 8px;
  margin: 28px 0 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  overflow-x: auto;
}

.ls-tab {
  background: transparent;
  border: 1px solid transparent;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  white-space: nowrap;
}
.ls-tab:hover { color: var(--ink); }
.ls-tab.active {
  background: var(--surface);
  color: var(--ink);
  border-color: var(--border);
  font-weight: 600;
}

.ls-subnav {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ls-pill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ls-sub-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  margin-right: 4px;
}

.ls-subtab {
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
}
.ls-subtab:hover { color: var(--ink); border-color: var(--ink); }
.ls-subtab.active {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
  font-weight: 600;
}

.ls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(305px, 1fr));
  gap: 20px;
  padding: 8px 0 64px;
}

.ls-empty {
  grid-column: 1 / -1;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  padding: 40px 24px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

.ls-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
}

.ls-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.ls-cat {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
}

.ls-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
}
.ls-pill.free { background: var(--tag-free); color: var(--tag-free-ink); }
.ls-pill.vault { background: var(--tag-vault); color: var(--tag-vault-ink); }

.ls-card h2 {
  font-size: 17px;
  font-weight: 650;
  margin-bottom: 6px;
}

.ls-card p {
  font-size: 14px;
  color: var(--muted);
}

.ls-card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ls-footer {
  border-top: 1px solid var(--border);
  padding: 24px 0;
  font-size: 12px;
  color: var(--muted);
}
.ls-footer-inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.ls-modal {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0;
  max-width: 420px;
  width: 90%;
  background: var(--surface);
  color: var(--ink);
}
.ls-modal::backdrop { background: rgba(0, 0, 0, 0.35); }
.ls-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.ls-modal-body input {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
}
.ls-error { color: #b91c1c; font-size: 12px; min-height: 16px; }
.ls-modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
`,

  'unlock.js': `(function () {
  const PASS_KEY = 'mce_all_access_unlocked';
  const DEBUG_KEY = 'mce_creator_debug';
  const PASS_CHECKOUT_URL = 'https://YOUR-STORE.lemonsqueezy.com/buy/YOUR-PASS-ID?embed=1';

  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === 'creator') {
    localStorage.setItem(DEBUG_KEY, 'true');
  }

  function isUnlocked() {
    return localStorage.getItem(PASS_KEY) === 'true' || localStorage.getItem(DEBUG_KEY) === 'true';
  }

  async function downloadOfflineApp(filePath, slug) {
    try {
      const res = await fetch(filePath);
      let html = await res.text();
      html = html.replace(/<script src="\\/unlock\\.js"><\\/script>/gi, '');
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`\${slug}-offline.html\`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Could not prepare offline download.');
    }
  }

  const grid = document.getElementById('catalog-grid');
  if (grid) {
    let catalog = [];
    let state = { section: 'All', language: 'All', subsection: 'All' };

    const subnav = document.getElementById('language-subnav');
    const jpTracks = document.getElementById('japanese-tracks');
    const enTracks = document.getElementById('english-tracks');

    function updatePassUI() {
      const box = document.getElementById('pass-status-box');
      if (isUnlocked() && box) {
        box.innerHTML = \`<span class="ls-pill free">ALL-ACCESS UNLOCKED</span>\`;
      }
    }

    function syncSubnavUI() {
      if (state.section !== 'Language Study') {
        subnav.classList.add('hidden');
        return;
      }
      subnav.classList.remove('hidden');
      jpTracks.classList.toggle('hidden', state.language !== 'Japanese');
      enTracks.classList.toggle('hidden', state.language !== 'English');
    }

    function renderGrid() {
      const unlocked = isUnlocked();
      const filtered = catalog.filter(item => {
        if (state.section !== 'All' && item.section !== state.section) return false;
        if (state.section === 'Language Study') {
          if (state.language !== 'All' && item.language !== state.language) return false;
          if (state.subsection !== 'All' && item.subsection !== state.subsection) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        grid.innerHTML = \`<div class="ls-empty">No releases published in this section yet. New experiments coming soon.</div>\`;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const canLaunch = item.access === 'free' || unlocked;
        const breadcrumb = [item.section, item.language, item.subsection].filter(Boolean).join(' / ');
        const badge = item.access === 'free'
          ? \`<span class="ls-pill free">Free</span>\`
          : \`<span class="ls-pill vault">\${unlocked ? 'Unlocked' : 'Vault'}</span>\`;

        const primaryBtn = canLaunch
          ? \`<a href="\${item.path}" class="ls-btn-primary">Open</a>\`
          : \`<a href="\${item.checkout_url || PASS_CHECKOUT_URL}" class="lemonsqueezy-button ls-btn-primary">Unlock</a>\`;

        const offlineBtn = unlocked
          ? \`<button class="ls-btn-secondary" data-path="\${item.path}" data-slug="\${item.slug}">Save .html</button>\`
          : '';

        return \`
          <article class="ls-card">
            <div>
              <div class="ls-card-meta">
                <span class="ls-cat">\${breadcrumb}</span>
                \${badge}
              </div>
              <h2>\${item.title}</h2>
              <p>\${item.description}</p>
            </div>
            <div class="ls-card-actions">
              \${primaryBtn}
              \${offlineBtn}
            </div>
          </article>
        \`;
      }).join('');

      grid.querySelectorAll('[data-path]').forEach(btn => {
        btn.addEventListener('click', () => downloadOfflineApp(btn.dataset.path, btn.dataset.slug));
      });
    }

    document.querySelectorAll('.ls-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ls-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.section = tab.dataset.section;
        state.language = 'All';
        state.subsection = 'All';
        subnav.querySelectorAll('.ls-subtab').forEach(st => {
          st.classList.toggle('active', st.dataset.language === 'All' || st.dataset.subsection === 'All');
        });
        syncSubnavUI();
        renderGrid();
      });
    });

    subnav.querySelectorAll('[data-language]').forEach(btn => {
      btn.addEventListener('click', () => {
        subnav.querySelectorAll('[data-language]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.language = btn.dataset.language;
        state.subsection = state.language === 'English' ? 'Articles' : 'All';
        jpTracks.querySelectorAll('.ls-subtab').forEach(b => b.classList.toggle('active', b.dataset.subsection === 'All'));
        syncSubnavUI();
        renderGrid();
      });
    });

    subnav.querySelectorAll('[data-subsection]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.parentElement.querySelectorAll('.ls-subtab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.subsection = btn.dataset.subsection;
        renderGrid();
      });
    });

    const modal = document.getElementById('key-modal');
    const openBtn = document.getElementById('open-key-modal');
    const closeBtn = document.getElementById('close-key-modal');
    const form = document.getElementById('key-form');

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.showModal());
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.close());

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const key = document.getElementById('license-input').value.trim();
        const errEl = document.getElementById('license-error');
        const submitBtn = document.getElementById('verify-key-btn');
        errEl.textContent = '';
        submitBtn.textContent = 'Checking...';

        try {
          const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ license_key: key })
          });
          const data = await res.json();
          if (data.valid) {
            localStorage.setItem(PASS_KEY, 'true');
            modal.close();
            updatePassUI();
            renderGrid();
          } else {
            errEl.textContent = data.error || 'Invalid license key.';
          }
        } catch (err) {
          errEl.textContent = 'Network error verifying license.';
        } finally {
          submitBtn.textContent = 'Activate';
        }
      });
    }

    fetch('/catalog.json')
      .then(r => r.json())
      .then(data => {
        catalog = data;
        updatePassUI();
        renderGrid();
      });
  }

  if (window.location.pathname.startsWith('/content/')) {
    const slug = window.location.pathname.split('/').pop().replace('.html', '');
    const bar = document.createElement('div');
    bar.style.cssText = 'background:#ffffff;border-bottom:1px solid #e7e5e4;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;font-family:system-ui,sans-serif;font-size:13px;position:sticky;top:0;z-index:9999;';

    const rightAction = isUnlocked()
      ? \`<button id="mce-app-dl" style="background:#1c1917;color:#fff;border:none;padding:5px 12px;border-radius:5px;font-weight:600;cursor:pointer;font-size:12px;">Download Offline .html</button>\`
      : \`<a href="\${PASS_CHECKOUT_URL}" style="background:#1c1917;color:#fff;text-decoration:none;padding:5px 12px;border-radius:5px;font-weight:600;font-size:12px;">All-Access Pass — $30</a>\`;

    bar.innerHTML = \`
      <a href="/" style="color:#171717;text-decoration:none;font-weight:600;">&larr; My Creativity Experiment</a>
      <div>\${rightAction}</div>
    \`;

    document.body.prepend(bar);
    const dlBtn = document.getElementById('mce-app-dl');
    if (dlBtn) dlBtn.addEventListener('click', () => downloadOfflineApp(window.location.pathname, slug));
  }
})();
`
};

// Build directory structure with .gitkeep files
for (const dir of directories) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.gitkeep'), '', 'utf8');
  console.log(`Created directory: ${dir}`);
}

// Write root files
for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(filename, content, 'utf8');
  console.log(`Created file:      ${filename}`);
}

console.log('\nScaffold complete! You can delete setup.mjs now and push to GitHub.');
