// ── Balance Overlay ──
// Opens as a Figma-style overlay when clicking the balance badge

import { getState, getCartTotal, formatBalance, subscribe } from '../store.js';
import { products } from '../data/products.js';

let overlayEl = null;
let unsub = null;

function buildContent() {
  const state = getState();
  const cartTotal = getCartTotal();
  const remaining = state.user.balance - cartTotal;
  const usedPercent = state.user.balance > 0 ? Math.round((cartTotal / state.user.balance) * 100) : 0;
  const affordable = products.filter(p => p.price <= remaining).length;

  return `
    <div class="balance-overlay-card">
      <div class="balance-overlay-header">
        <h2 class="balance-overlay-title">
          <span class="material-icons-outlined" style="font-size: 22px; color: var(--color-success);">account_balance_wallet</span>
          Seu Saldo
        </h2>
        <button class="settings-close-btn" id="balance-overlay-close">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>

      <div class="balance-overlay-body">
        <div class="balance-overlay-main">
          <div class="balance-overlay-amount-section">
            <span class="balance-overlay-label">Saldo disponível</span>
            <div class="balance-overlay-amount">${formatBalance(state.user.balance)}</div>
            <p class="balance-overlay-affordable">Você pode resgatar <strong>${affordable} produtos</strong></p>
          </div>

          <div class="balance-overlay-ring-section">
            <svg viewBox="0 0 120 120" class="percent-ring" style="width: 90px; height: 90px;">
              <circle cx="60" cy="60" r="52" class="percent-ring-bg"/>
              <circle cx="60" cy="60" r="52" class="percent-ring-fill ${usedPercent > 0 ? 'percent-ring-used' : ''}" 
                style="stroke-dasharray: ${usedPercent * 3.267} ${326.7 - usedPercent * 3.267}; stroke-dashoffset: 81.675;" />
            </svg>
            <div class="percent-ring-text">
              <span class="percent-ring-value" style="font-size: var(--font-size-lg);">${usedPercent}%</span>
              <span class="percent-ring-label">utilizado</span>
            </div>
          </div>
        </div>

        <div class="balance-overlay-details">
          <div class="balance-overlay-detail-row">
            <span class="balance-overlay-detail-icon" style="color: var(--color-success);">
              <span class="material-icons-outlined" style="font-size: 16px;">check_circle</span>
            </span>
            <span class="balance-overlay-detail-label">Saldo total</span>
            <span class="balance-overlay-detail-value">${formatBalance(state.user.balance)}</span>
          </div>
          <div class="balance-overlay-detail-row">
            <span class="balance-overlay-detail-icon" style="color: var(--color-warning);">
              <span class="material-icons-outlined" style="font-size: 16px;">shopping_cart</span>
            </span>
            <span class="balance-overlay-detail-label">Utilizado no carrinho</span>
            <span class="balance-overlay-detail-value" style="color: var(--color-warning);">- ${formatBalance(cartTotal)}</span>
          </div>
          <div class="balance-overlay-detail-row balance-overlay-detail-total">
            <span class="balance-overlay-detail-icon" style="color: var(--color-success);">
              <span class="material-icons-outlined" style="font-size: 16px;">savings</span>
            </span>
            <span class="balance-overlay-detail-label">Disponível para resgate</span>
            <span class="balance-overlay-detail-value" style="color: var(--color-success); font-weight: var(--font-weight-bold);">${formatBalance(remaining)}</span>
          </div>
        </div>

        <div class="balance-overlay-actions">
          <a href="#/products" class="btn btn-primary" id="balance-overlay-browse">
            <span class="material-icons-outlined" style="font-size: 18px;">storefront</span>
            Ver produtos
          </a>
          <a href="#/cart" class="btn btn-secondary" id="balance-overlay-cart">
            <span class="material-icons-outlined" style="font-size: 18px;">shopping_cart</span>
            Ir ao carrinho
          </a>
        </div>
      </div>
    </div>
  `;
}

export function openBalanceOverlay() {
  closeBalanceOverlay();

  overlayEl = document.createElement('div');
  overlayEl.className = 'balance-overlay';
  overlayEl.innerHTML = buildContent();

  document.body.appendChild(overlayEl);

  requestAnimationFrame(() => {
    overlayEl.classList.add('active');
  });

  overlayEl.querySelector('#balance-overlay-close')?.addEventListener('click', closeBalanceOverlay);
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) closeBalanceOverlay();
  });

  overlayEl.querySelector('#balance-overlay-browse')?.addEventListener('click', closeBalanceOverlay);
  overlayEl.querySelector('#balance-overlay-cart')?.addEventListener('click', closeBalanceOverlay);

  unsub = subscribe(() => {
    if (overlayEl) {
      overlayEl.innerHTML = buildContent();
      overlayEl.querySelector('#balance-overlay-close')?.addEventListener('click', closeBalanceOverlay);
      overlayEl.querySelector('#balance-overlay-browse')?.addEventListener('click', closeBalanceOverlay);
      overlayEl.querySelector('#balance-overlay-cart')?.addEventListener('click', closeBalanceOverlay);
    }
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeBalanceOverlay();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

export function closeBalanceOverlay() {
  if (unsub) {
    unsub();
    unsub = null;
  }
  if (overlayEl) {
    overlayEl.classList.remove('active');
    setTimeout(() => {
      overlayEl?.remove();
      overlayEl = null;
    }, 300);
  }
}
