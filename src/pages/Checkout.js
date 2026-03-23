import { renderHeader } from '../components/StoreHeader.js';
import { showToast } from '../components/Toast.js';
import { getState, getCartTotal, getBalanceAfter, formatBalance, clearCart, deductBalance } from '../store.js';
import { navigate } from '../router.js';

export function renderCheckout(app) {
  const state = getState();
  const total = getCartTotal();
  const balanceAfter = getBalanceAfter();
  const hasPhysical = state.cart.some(item => item.product.type === 'physical' || item.product.type === 'customizable');

  if (state.cart.length === 0) {
    navigate('/cart');
    return;
  }

  let confirmed = false;

  app.innerHTML = `
    <div id="page-checkout">
      <div class="container page">

        <a href="#/cart" class="back-link" id="back-to-cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Voltar ao carrinho
        </a>

        <h1 class="page-title">Confirmar Resgate</h1>

        <div class="checkout-layout" id="checkout-content">
          <div class="checkout-main">

            <!-- Order Summary -->
            <div class="card card-elevated checkout-section">
              <h3 class="checkout-section-title">Itens do resgate</h3>
              <div class="checkout-items">
                ${state.cart.map(item => `
                  <div class="checkout-item">
                    <img src="${item.product.image}" alt="${item.product.name}" class="checkout-item-img" />
                    <div class="checkout-item-info">
                      <span class="checkout-item-name">${item.product.name}</span>
                      <span class="checkout-item-type text-sm text-secondary">${
                        item.product.type === 'briefing' ? '📋 Com briefing' :
                        item.product.type === 'customizable' ? '🎨 Personalizado' : '📦 Físico'
                      }</span>
                    </div>
                    <span class="checkout-item-price">${formatBalance(item.product.price * item.quantity)}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Address (if physical) -->
            ${hasPhysical ? `
            <div class="card card-elevated checkout-section">
              <h3 class="checkout-section-title">Endereço de entrega</h3>
              <div class="checkout-form">
                <div class="input-group">
                  <label class="input-label">CEP *</label>
                  <input type="text" class="input-field" id="cep" placeholder="00000-000" maxlength="9" required />
                </div>
                <div class="checkout-form-row">
                  <div class="input-group" style="flex: 3;">
                    <label class="input-label">Rua *</label>
                    <input type="text" class="input-field" id="rua" placeholder="Nome da rua" required />
                  </div>
                  <div class="input-group" style="flex: 1;">
                    <label class="input-label">Número *</label>
                    <input type="text" class="input-field" id="numero" placeholder="Nº" required />
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Complemento</label>
                  <input type="text" class="input-field" id="complemento" placeholder="Apto, bloco, referência..." />
                </div>
                <div class="checkout-form-row">
                  <div class="input-group" style="flex: 1;">
                    <label class="input-label">Cidade *</label>
                    <input type="text" class="input-field" id="cidade" placeholder="Cidade" required />
                  </div>
                  <div class="input-group" style="flex: 1;">
                    <label class="input-label">Estado *</label>
                    <select class="input-field" id="estado" required>
                      <option value="">UF</option>
                      <option>AC</option><option>AL</option><option>AP</option><option>AM</option>
                      <option>BA</option><option>CE</option><option>DF</option><option>ES</option>
                      <option>GO</option><option>MA</option><option>MT</option><option>MS</option>
                      <option>MG</option><option>PA</option><option>PB</option><option>PR</option>
                      <option>PE</option><option>PI</option><option>RJ</option><option>RN</option>
                      <option>RS</option><option>RO</option><option>RR</option><option>SC</option>
                      <option>SP</option><option>SE</option><option>TO</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Sidebar -->
          <div class="checkout-sidebar">
            <div class="card card-elevated balance-summary">
              <h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-4);">Resumo do saldo</h3>

              <div class="balance-row">
                <span class="text-secondary">Saldo atual</span>
                <span style="font-weight: var(--font-weight-semibold);">${formatBalance(state.user.balance)}</span>
              </div>

              <div class="balance-row">
                <span class="text-secondary">Total do resgate</span>
                <span style="color: var(--color-error); font-weight: var(--font-weight-semibold);">- ${formatBalance(total)}</span>
              </div>

              <div class="balance-row total">
                <span>Saldo restante</span>
                <span style="color: var(--color-success); font-weight: var(--font-weight-bold);">${formatBalance(balanceAfter)}</span>
              </div>

              <button class="btn btn-primary btn-lg btn-block" id="btn-confirm" style="margin-top: var(--space-6);">
                Confirmar resgate
              </button>

              <p class="text-xs text-tertiary" style="text-align: center; margin-top: var(--space-3);">
                Ao confirmar, o saldo será deduzido imediatamente.
              </p>
            </div>
          </div>
        </div>

        <!-- Success State (hidden initially) -->
        <div class="success-screen" id="checkout-success" style="display: none;">
          <div class="success-icon">✓</div>
          <h2 class="success-title">Resgate confirmado!</h2>
          <p class="success-text">
            Seus produtos foram resgatados com sucesso. Você receberá uma confirmação por e-mail em breve.
          </p>
          <div class="card card-elevated" style="padding: var(--space-6); margin-bottom: var(--space-8); text-align: left; width: 100%; max-width: 400px;">
            <div class="balance-row">
              <span class="text-secondary">Saldo anterior</span>
              <span>${formatBalance(state.user.balance)}</span>
            </div>
            <div class="balance-row">
              <span class="text-secondary">Valor resgatado</span>
              <span style="color: var(--color-error);">- ${formatBalance(total)}</span>
            </div>
            <div class="balance-row total">
              <span>Novo saldo</span>
              <span style="color: var(--color-success); font-weight: var(--font-weight-bold);">${formatBalance(balanceAfter)}</span>
            </div>
          </div>
          <a href="#/" class="btn btn-primary btn-lg" id="btn-back-home">Voltar ao início</a>
        </div>

      </div>
    </div>
  `;

  const unsub = renderHeader(app);

  // Confirm
  document.getElementById('btn-confirm')?.addEventListener('click', () => {
    if (confirmed) return;

    // Validate address if physical
    if (hasPhysical) {
      const required = ['cep', 'rua', 'numero', 'cidade', 'estado'];
      let valid = true;
      required.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          el.style.borderColor = 'var(--color-error)';
          valid = false;
        } else if (el) {
          el.style.borderColor = '';
        }
      });
      if (!valid) {
        showToast('Preencha o endereço de entrega.', 'error');
        return;
      }
    }

    confirmed = true;
    deductBalance(total);
    clearCart();

    // Show success
    document.getElementById('checkout-content').style.display = 'none';
    document.querySelector('.back-link')?.remove();
    document.querySelector('.page-title')?.remove();
    document.getElementById('checkout-success').style.display = 'flex';

    showToast('Resgate realizado com sucesso!', 'success');
  });

  return unsub;
}
