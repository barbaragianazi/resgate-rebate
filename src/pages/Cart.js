import { renderHeader } from '../components/StoreHeader.js';
import { renderCartItem } from '../components/CartItem.js';
import { getState, removeFromCart, getCartTotal, getBalanceAfter, formatBalance, subscribe } from '../store.js';

export function renderCart(app) {
  function render() {
    const state = getState();
    const total = getCartTotal();
    const balanceAfter = getBalanceAfter();
    const hasItems = state.cart.length > 0;
    const usagePercent = state.user.balance > 0 ? Math.min(100, (total / state.user.balance) * 100) : 0;

    app.innerHTML = `
      <div id="page-cart">
        <div class="container page">

          <h1 class="page-title">Carrinho</h1>

          ${hasItems ? `
            <div class="cart-layout">
              <div class="cart-items" id="cart-items-list"></div>

              <div class="cart-sidebar">
                <div class="card card-elevated balance-summary">
                  <h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-4);">Resumo do saldo</h3>

                  <div class="balance-row">
                    <span class="text-secondary">Saldo atual</span>
                    <span class="font-semibold">${formatBalance(state.user.balance)}</span>
                  </div>

                  <div class="balance-row">
                    <span class="text-secondary">Valor do resgate</span>
                    <span style="color: var(--color-error);">- ${formatBalance(total)}</span>
                  </div>

                  <div class="balance-bar">
                    <div class="balance-bar-fill" style="width: ${usagePercent}%"></div>
                  </div>

                  <div class="balance-row total">
                    <span>Saldo após resgate</span>
                    <span style="color: ${balanceAfter >= 0 ? 'var(--color-success)' : 'var(--color-error)'}">
                      ${formatBalance(balanceAfter)}
                    </span>
                  </div>

                  <a href="#/checkout" class="btn btn-primary btn-lg btn-block" style="margin-top: var(--space-6);" ${balanceAfter < 0 ? 'disabled style="pointer-events:none;opacity:0.4;margin-top:var(--space-6)"' : ''} id="btn-checkout">
                    Continuar para resgate
                  </a>

                  ${balanceAfter < 0 ? `
                    <p class="text-sm text-secondary" style="text-align: center; margin-top: var(--space-3); color: var(--color-error);">
                      Saldo insuficiente. Remova itens para continuar.
                    </p>
                  ` : ''}
                </div>
              </div>
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">🛒</div>
              <h2 class="empty-state-title">Seu carrinho está vazio</h2>
              <p class="empty-state-text">Explore nossos produtos e adicione itens para resgate.</p>
              <a href="#/products" class="btn btn-primary">Ver produtos</a>
            </div>
          `}

        </div>
      </div>
    `;

    // Render cart items as DOM elements
    if (hasItems) {
      const list = document.getElementById('cart-items-list');
      state.cart.forEach(item => {
        list.appendChild(renderCartItem(item, handleRemove));
      });
    }

    renderHeader(app);
  }

  function handleRemove(productId) {
    removeFromCart(productId);
    render();
  }

  render();

  const unsub = subscribe(() => render());
  return () => {
    unsub();
  };
}
