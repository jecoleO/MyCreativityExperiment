(function () {
  const PASS_KEY = 'mce_all_access_unlocked';
  const DEBUG_KEY = 'mce_creator_debug';
  const PASS_CHECKOUT_URL = 'https://mycreativityexperiment.lemonsqueezy.com/checkout/buy/bca9462c-363e-4102-b434-ad7facee7551?embed=1';

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
      html = html.replace(/<script src="\/unlock\.js"><\/script>/gi, '');
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-offline.html`;
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
        box.innerHTML = `<span class="ls-pill free">ALL-ACCESS UNLOCKED</span>`;
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
        grid.innerHTML = `<div class="ls-empty">No releases published in this section yet. New experiments coming soon.</div>`;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const canLaunch = item.access === 'free' || unlocked;
        const breadcrumb = [item.section, item.language, item.subsection].filter(Boolean).join(' / ');
        const badge = item.access === 'free'
          ? `<span class="ls-pill free">Free</span>`
          : `<span class="ls-pill vault">${unlocked ? 'Unlocked' : 'Vault'}</span>`;

        const primaryBtn = canLaunch
          ? `<a href="${item.path}" class="ls-btn-primary">Open</a>`
          : `<a href="${item.checkout_url || PASS_CHECKOUT_URL}" class="lemonsqueezy-button ls-btn-primary">Unlock</a>`;

        const offlineBtn = unlocked
          ? `<button class="ls-btn-secondary" data-path="${item.path}" data-slug="${item.slug}">Save .html</button>`
          : '';

        return `
          <article class="ls-card">
            <div>
              <div class="ls-card-meta">
                <span class="ls-cat">${breadcrumb}</span>
                ${badge}
              </div>
              <h2>${item.title}</h2>
              <p>${item.description}</p>
            </div>
            <div class="ls-card-actions">
              ${primaryBtn}
              ${offlineBtn}
            </div>
          </article>
        `;
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
      ? `<button id="mce-app-dl" style="background:#1c1917;color:#fff;border:none;padding:5px 12px;border-radius:5px;font-weight:600;cursor:pointer;font-size:12px;">Download Offline .html</button>`
      : `<a href="${PASS_CHECKOUT_URL}" style="background:#1c1917;color:#fff;text-decoration:none;padding:5px 12px;border-radius:5px;font-weight:600;font-size:12px;">All-Access Pass — $30</a>`;

    bar.innerHTML = `
      <a href="/" style="color:#171717;text-decoration:none;font-weight:600;">&larr; My Creativity Experiment</a>
      <div>${rightAction}</div>
    `;

    document.body.prepend(bar);
    const dlBtn = document.getElementById('mce-app-dl');
    if (dlBtn) dlBtn.addEventListener('click', () => downloadOfflineApp(window.location.pathname, slug));
  }
})();
