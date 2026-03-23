import { getState } from '../store.js';
import { openPreferencesModal } from './PreferencesModal.js';

export function renderLegacyTopBar(container) {
  const state = getState();

  const topbar = document.createElement('header');
  topbar.className = 'legacy-topbar';

  topbar.innerHTML = `
    <div class="legacy-topbar-right" style="margin-left: auto;">
      <div class="legacy-avatar" id="legacy-avatar" title="Preferências">
        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="${state.user.name}" />
      </div>
    </div>
  `;

  container.appendChild(topbar);

  // Avatar click -> preferences modal
  topbar.querySelector('#legacy-avatar')?.addEventListener('click', () => {
    openPreferencesModal();
  });
}
