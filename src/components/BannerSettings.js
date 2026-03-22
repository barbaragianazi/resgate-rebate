import { getBannerSettings, saveBannerSettings } from '../store.js';

export function openBannerSettings() {
  const settings = getBannerSettings();

  const bannerOptions = [
    { key: 'balance', label: 'Banner de Saldo', description: 'Exibe seu saldo disponível, utilizado e restante' },
    { key: 'featured', label: 'Produtos em Destaque', description: 'Mostra uma seleção de produtos em destaque' },
    { key: 'bestSellers', label: 'Mais Vendidos', description: 'Exibe os produtos mais populares' },
    { key: 'recentRedemptions', label: 'Resgates Recentes', description: 'Mostra seus últimos resgates realizados' },
  ];

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'settings-overlay';
  overlay.id = 'banner-settings-overlay';

  overlay.innerHTML = `
    <div class="settings-modal">
      <div class="settings-modal-header">
        <h2 class="settings-modal-title">
          <span class="material-icons-outlined" style="font-size: 1.25rem;">dashboard_customize</span>
          Personalizar Página Inicial
        </h2>
        <button class="settings-close-btn" id="settings-close">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>

      <div class="settings-modal-body">
        <p class="settings-description">Configure quais seções deseja ver na sua página inicial e o tamanho de cada uma.</p>
        
        ${bannerOptions.map(opt => `
          <div class="settings-banner-item" data-key="${opt.key}">
            <div class="settings-banner-info">
              <div class="settings-banner-top">
                <label class="settings-toggle-label">
                  <span class="settings-banner-name">${opt.label}</span>
                  <label class="toggle-switch">
                    <input type="checkbox" class="toggle-input" data-toggle="${opt.key}" ${settings[opt.key]?.visible !== false ? 'checked' : ''} />
                    <span class="toggle-slider"></span>
                  </label>
                </label>
              </div>
              <p class="settings-banner-desc">${opt.description}</p>
            </div>
            <div class="settings-size-selector">
              <button class="settings-size-btn ${settings[opt.key]?.size === 'full' ? 'active' : ''}" data-size-key="${opt.key}" data-size="full">
                <span class="material-icons-outlined" style="font-size: 1rem;">fullscreen</span>
                Inteiro
              </button>
              <button class="settings-size-btn ${settings[opt.key]?.size === 'half' || !settings[opt.key]?.size ? 'active' : ''}" data-size-key="${opt.key}" data-size="half">
                <span class="material-icons-outlined" style="font-size: 1rem;">splitscreen</span>
                Metade
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="settings-modal-footer">
        <button class="btn btn-secondary" id="settings-cancel">Cancelar</button>
        <button class="btn btn-primary" id="settings-save">Salvar Configurações</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Working copy of settings
  const workingSettings = JSON.parse(JSON.stringify(settings));

  // Toggle handlers
  overlay.querySelectorAll('.toggle-input').forEach(input => {
    input.addEventListener('change', () => {
      const key = input.dataset.toggle;
      if (!workingSettings[key]) workingSettings[key] = { visible: true, size: 'full' };
      workingSettings[key].visible = input.checked;
    });
  });

  // Size handlers
  overlay.querySelectorAll('.settings-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sizeKey;
      const size = btn.dataset.size;
      if (!workingSettings[key]) workingSettings[key] = { visible: true, size: 'full' };
      workingSettings[key].size = size;

      // Update active state
      overlay.querySelectorAll(`.settings-size-btn[data-size-key="${key}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function close() {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }

  // Close
  overlay.querySelector('#settings-close').addEventListener('click', close);
  overlay.querySelector('#settings-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Save
  overlay.querySelector('#settings-save').addEventListener('click', () => {
    saveBannerSettings(workingSettings);
    close();
    // Re-render home if on home page
    if (window.location.hash === '#/' || window.location.hash === '') {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  });
}
