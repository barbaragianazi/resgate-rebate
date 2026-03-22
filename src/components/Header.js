import { getState, getCartCount, formatBalance, subscribe } from '../store.js';
import { openBalanceOverlay } from './BalanceOverlay.js';

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
        <button class="header-menu-btn" id="header-menu-toggle">
          <span class="material-icons-outlined">menu</span>
        </button>
        <span class="header-breadcrumb">${breadcrumb}</span>
      </div>

     <!-- <a href="#/" class="header-logo" id="header-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#1E1D1D"/>
          <path d="M8 14L12 10L16 14L20 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 18L12 14L16 18L20 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
        </svg>
        <span class="header-logo-text">Resgate</span>
      </a>
      -->

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

        <div class="header-avatar" id="header-avatar">
          <div class="avatar-circle">${state.user.name.charAt(0)}</div>
        </div>
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
