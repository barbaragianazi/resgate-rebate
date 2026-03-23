export let preferencesModalEl = null;

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyTheme(true);
  } else if (savedTheme === 'light') {
    applyTheme(false);
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme(true);
    }
  }
}

export function openPreferencesModal() {
  if (preferencesModalEl) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  preferencesModalEl = document.createElement('div');
  preferencesModalEl.className = 'settings-overlay';
  preferencesModalEl.innerHTML = `
    <div class="settings-modal" style="max-width: 400px;">
      <div class="settings-modal-header">
        <h2 class="settings-modal-title">
          <span class="material-icons-outlined">settings</span>
          Preferências
        </h2>
        <button class="settings-close-btn" id="pref-modal-close">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>
      <div class="settings-modal-body">
        
        <div class="settings-banner-item">
          <div class="settings-toggle-label">
            <div>
              <div class="settings-banner-name">Dark Mode</div>
              <div class="settings-banner-desc">Alternar para o tema escuro</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" class="toggle-input" id="dark-mode-toggle" ${isDark ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(preferencesModalEl);

  requestAnimationFrame(() => {
    preferencesModalEl.classList.add('active');
  });

  const closeBtn = preferencesModalEl.querySelector('#pref-modal-close');
  closeBtn.addEventListener('click', closePreferencesModal);

  preferencesModalEl.addEventListener('click', (e) => {
    if (e.target === preferencesModalEl) closePreferencesModal();
  });

  const toggle = preferencesModalEl.querySelector('#dark-mode-toggle');
  toggle.addEventListener('change', (e) => {
    applyTheme(e.target.checked);
  });
}

function closePreferencesModal() {
  if (!preferencesModalEl) return;
  preferencesModalEl.classList.remove('active');
  setTimeout(() => {
    preferencesModalEl?.remove();
    preferencesModalEl = null;
  }, 300);
}
