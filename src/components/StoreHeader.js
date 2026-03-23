import { getState, getCartCount, formatBalance, subscribe } from '../store.js';
import { openBalanceOverlay } from './BalanceOverlay.js';
import { openPreferencesModal } from './PreferencesModal.js';

export function renderHeader(container) {
  const state = getState();
  const cartCount = getCartCount();

  // Determine breadcrumb
  const hash = window.location.hash || '#/';
  let breadcrumb = 'INÍCIO';
  if (hash.startsWith('#/products')) breadcrumb = 'INÍCIO > CATÁLOGO DE PRODUTOS';
  else if (hash.startsWith('#/product/')) breadcrumb = 'INÍCIO > CATÁLOGO > PRODUTO';
  else if (hash === '#/cart') breadcrumb = 'INÍCIO > CARRINHO';
  else if (hash === '#/checkout') breadcrumb = 'INÍCIO > CHECKOUT';
  else if (hash.startsWith('#/admin')) breadcrumb = 'INÍCIO > ADMINISTRAÇÃO';

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-inner">
      <div class="header-left">
        <span class="header-breadcrumb">${breadcrumb}</span>
      </div>

      <div class="header-actions">
        <button class="header-balance" id="header-balance" type="button" title="Ver detalhes do saldo">
          <div class="header-balance-pulse">
            <span class="header-balance-pulse-ping"></span>
            <span class="header-balance-pulse-dot"></span>
          </div>

          <div class="header-balance-text-container">
            <span class="header-balance-text-default">Ver saldo</span>
            <span class="header-balance-text-hover">${formatBalance(state.user.balance)}</span>
          </div>

          <span class="material-icons-outlined header-balance-arrow">arrow_forward</span>
        </button>

        <a href="#/cart" class="header-cart-btn" id="header-cart-btn">
          <span class="material-icons-outlined">shopping_bag</span>
          ${cartCount > 0 ? `<span class="header-cart-badge">${cartCount}</span>` : ''}
        </a>
      </div>
    </div>
  `;

  container.prepend(header);

  // Balance badge click → open overlay
  header.querySelector('#header-balance')?.addEventListener('click', () => {
    openBalanceOverlay();
  });

  // Subscribe to updates
  const unsub = subscribe(() => {
    const balHover = header.querySelector('.header-balance-text-hover');
    if (balHover) balHover.innerHTML = formatBalance(getState().user.balance);

    const badge = header.querySelector('.header-cart-badge');
    const count = getCartCount();
    const cartBtn = header.querySelector('#header-cart-btn');
    if (count > 0) {
      if (badge) {
        badge.textContent = count;
      } else {
        const span = document.createElement('span');
        span.className = 'header-cart-badge';
        span.textContent = count;
        cartBtn.appendChild(span);
      }
    } else if (badge) {
      badge.remove();
    }
  });

  return unsub;
}
