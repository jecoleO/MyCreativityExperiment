(() => {
  const PASS_CHECKOUT_URL = 'https://mycreativityexperiment.lemonsqueezy.com/checkout/buy/bca9462c-363e-4102-b434-ad7facee7551?embed=1';
  const STORAGE_KEY = 'mce_all_access_key';
  const VALIDATED_FLAG = 'mce_all_access_valid';

  // Creator debug bypass (?debug=creator)
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === 'creator') {
    localStorage.setItem(VALIDATED_FLAG, 'true');
  }

  function isUnlocked() {
    return localStorage.getItem(VALIDATED_FLAG) === 'true';
  }

  async function validateLicenseKey(key) {
    const cleanKey = (key || '').trim();
    if (!cleanKey) return false;

    try {
      const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: cleanKey })
      });
      const data = await res.json();
      if (data && data.valid) {
        localStorage.setItem(STORAGE_KEY, cleanKey);
        localStorage.setItem(VALIDATED_FLAG, 'true');
        window.dispatchEvent(new Event('mce:unlocked'));
        return true;
      }
    } catch (err) {
      console.error('License check failed:', err);
    }
    return false;
  }

  async function downloadStandaloneHtml(targetPath, filename) {
    const url = targetPath || window.location.pathname;
    const res = await fetch(url);
    let html = await res.text();

    // Strip unlock.js so the downloaded file runs 100% standalone offline
    html = html.replace(/<script[^>]*src=["']\/?unlock\.js["'][^>]*>\s*<\/script>/gi, '');

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || url.split('/').pop() || 'app.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  function promptKeyOrCheckout(targetPath, filename) {
    if (isUnlocked()) {
      downloadStandaloneHtml(targetPath, filename);
      return;
    }

    const existing = document.getElementById('mce-download-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'mce-download-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.72);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
    modal.innerHTML = `
      <div style="background:#fff;color:#0f172a;max-width:440px;width:100%;border-radius:14px;padding:24px;box-shadow:0 20px 40px rgba(0,0,0,0.25);">
        <h3 style="margin:0 0 8px;font-size:1.2rem;">Download Standalone Offline Edition</h3>
        <p style="margin:0 0 16px;font-size:0.92rem;color:#475569;line-height:1.5;">
          Every release on MyCreativityExperiment.com is free to use online. Get the <strong>All-Access Pass ($30)</strong> to download standalone offline <code>.html</code> copies of every app, game, and book.
        </p>
        <a href="${PASS_CHECKOUT_URL}" class="lemonsqueezy-button" style="display:block;text-align:center;background:#0f172a;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-weight:600;margin-bottom:14px;">
          Get All-Access Pass — $30
        </a>
        <div style="border-top:1px solid #e2e8f0;padding-top:14px;">
          <label style="display:block;font-size:0.82rem;font-weight:600;margin-bottom:6px;">Already have a license key?</label>
          <div style="display:flex;gap:8px;">
            <input id="mce-key-input" type="text" placeholder="Paste license key..." style="flex:1;padding:9px 11px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.9rem;" />
            <button id="mce-key-submit" style="padding:9px 14px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Unlock</button>
          </div>
          <p id="mce-key-status" style="margin:8px 0 0;font-size:0.82rem;color:#dc2626;"></p>
        </div>
        <button id="mce-modal-close" style="margin-top:14px;background:none;border:none;color:#64748b;font-size:0.85rem;cursor:pointer;padding:0;">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    if (window.createLemonSqueezy) window.createLemonSqueezy();

    modal.querySelector('#mce-modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.querySelector('#mce-key-submit').onclick = async () => {
      const input = modal.querySelector('#mce-key-input').value;
      const status = modal.querySelector('#mce-key-status');
      status.style.color = '#475569';
      status.textContent = 'Checking license key...';
      const ok = await validateLicenseKey(input);
      if (ok) {
        modal.remove();
        downloadStandaloneHtml(targetPath, filename);
      } else {
        status.style.color = '#dc2626';
        status.textContent = 'Invalid or inactive license key.';
      }
    };
  }

  // 1. Storefront Homepage Logic (index.html)
  async function initStorefront() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    let items = [];
    let activeSection = 'All';
    let activeLanguage = 'All';
    let activeSubsection = 'All';

    // Wire up header license key modal
    const keyModal = document.getElementById('key-modal');
    const openKeyBtn = document.getElementById('open-key-modal');
    const closeKeyBtn = document.getElementById('close-key-modal');
    const keyForm = document.getElementById('key-form');
    const keyInput = document.getElementById('license-input');
    const keyError = document.getElementById('license-error');

    function updatePassHeader() {
      const passBox = document.getElementById('pass-status-box');
      if (passBox && isUnlocked()) {
        passBox.innerHTML = `
          <p><strong>All-Access Pass Active</strong> — Offline <code>.html</code> downloads are unlocked across all releases.</p>
          <span class="ls-badge">OFFLINE DOWNLOADS UNLOCKED</span>
        `;
      }
    }

    if (openKeyBtn && keyModal) {
      openKeyBtn.onclick = () => {
        if (keyError) keyError.textContent = '';
        keyModal.showModal();
      };
    }
    if (closeKeyBtn && keyModal) {
      closeKeyBtn.onclick = () => keyModal.close();
    }
    if (keyForm) {
      keyForm.onsubmit = async (e) => {
        e.preventDefault();
        if (keyError) keyError.textContent = 'Verifying license key...';
        const ok = await validateLicenseKey(keyInput.value);
        if (ok) {
          keyModal.close();
          updatePassHeader();
          renderCatalog();
        } else if (keyError) {
          keyError.textContent = 'Invalid or inactive license key.';
        }
      };
    }

    // Wire up primary section tabs & language sub-tabs
    const sectionTabs = document.querySelectorAll('.ls-tab');
    const langSubnav = document.getElementById('language-subnav');
    const jpTracks = document.getElementById('japanese-tracks');
    const enTracks = document.getElementById('english-tracks');

    sectionTabs.forEach(tab => {
      tab.onclick = () => {
        sectionTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeSection = tab.dataset.section;
        activeLanguage = 'All';
        activeSubsection = 'All';

        if (langSubnav) {
          langSubnav.classList.toggle('hidden', activeSection !== 'Language Study');
        }
        if (jpTracks) jpTracks.classList.add('hidden');
        if (enTracks) enTracks.classList.add('hidden');
        renderCatalog();
      };
    });

    document.querySelectorAll('[data-language]').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('[data-language]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeLanguage = btn.dataset.language;
        activeSubsection = 'All';

        if (jpTracks) jpTracks.classList.toggle('hidden', activeLanguage !== 'Japanese');
        if (enTracks) enTracks.classList.toggle('hidden', activeLanguage !== 'English');
        renderCatalog();
      };
    });

    document.querySelectorAll('[data-subsection]').forEach(btn => {
      btn.onclick = () => {
        const parent = btn.closest('.ls-pill-row');
        if (parent) parent.querySelectorAll('[data-subsection]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeSubsection = btn.dataset.subsection;
        renderCatalog();
      };
    });

    function renderCatalog() {
      const unlocked = isUnlocked();
      const filtered = items.filter(item => {
        if (activeSection !== 'All' && (item.section || '').toLowerCase() !== activeSection.toLowerCase()) return false;
        if (activeSection === 'Language Study') {
          if (activeLanguage !== 'All' && (item.language || '').toLowerCase() !== activeLanguage.toLowerCase()) return false;
          if (activeSubsection !== 'All' && (item.subsection || '').toLowerCase() !== activeSubsection.toLowerCase()) return false;
        }
        return true;
      });

      if (!filtered.length) {
        grid.innerHTML = `<p style="opacity:0.7;grid-column:1/-1;">No releases in this section yet.</p>`;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const dlLabel = unlocked ? '⬇ Download Offline (.html)' : '🔒 Offline (.html)';
        const badge = item.badge ? `<span class="ls-badge">${item.badge}</span>` : '';
        return `
          <article class="ls-card">
            <div class="ls-card-top">
              ${badge}
              <span class="ls-tag-free">FREE ONLINE</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.description || ''}</p>
            <div class="ls-card-actions" style="display:flex;gap:8px;margin-top:auto;padding-top:12px;flex-wrap:wrap;">
              <a href="${item.path}" class="ls-btn-primary" style="text-decoration:none;">Open Online</a>
              <button type="button" class="ls-btn-ghost" data-dl-path="${item.path}" data-dl-file="${item.id}.html">${dlLabel}</button>
            </div>
          </article>
        `;
      }).join('');

      grid.querySelectorAll('[data-dl-path]').forEach(btn => {
        btn.onclick = () => promptKeyOrCheckout(btn.dataset.dlPath, btn.dataset.dlFile);
      });
    }

    try {
      const res = await fetch('/catalog.json');
      items = await res.json();
    } catch (err) {
      console.error('Failed to load catalog.json:', err);
    }

    updatePassHeader();
    renderCatalog();
    window.addEventListener('mce:unlocked', () => {
      updatePassHeader();
      renderCatalog();
    });
  }

  // 2. Floating Offline Download Pill Inside /content/ Pages
  function injectContentDownloadPill() {
    if (!window.location.pathname.startsWith('/content/')) return;
    const pill = document.createElement('button');
    pill.id = 'mce-offline-pill';
    pill.textContent = isUnlocked() ? '⬇ Download Offline (.html)' : '⬇ Save Offline (.html)';
    pill.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:9999;background:rgba(15,23,42,0.88);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:999px;padding:8px 14px;font-size:0.8rem;font-family:system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(6px);';
    pill.onclick = () => promptKeyOrCheckout(window.location.pathname);
    document.body.appendChild(pill);

    window.addEventListener('mce:unlocked', () => {
      pill.textContent = '⬇ Download Offline (.html)';
    });
  }

  window.MCE = { isUnlocked, validateLicenseKey, downloadStandaloneHtml, promptKeyOrCheckout };
  document.addEventListener('DOMContentLoaded', () => {
    initStorefront();
    injectContentDownloadPill();
  });
})();