import { formatBalance } from '../store.js';

export function renderCartItem(item, onRemove) {
  const div = document.createElement('div');
  div.className = 'cart-item card card-elevated';
  div.id = `cart-item-${item.product.id}`;

  const typeLabels = {
    physical: 'Produto físico',
    briefing: 'Com briefing',
    customizable: 'Personalizável',
  };

  div.innerHTML = `
    <div class="cart-item-image">
      <img src="${item.product.image}" alt="${item.product.name}" />
    </div>
    <div class="cart-item-info">
      <h4 class="cart-item-name">${item.product.name}</h4>
      <span class="badge badge-light" style="margin-top: 4px;">${typeLabels[item.product.type]}</span>
      ${item.briefingData ? '<p class="cart-item-meta text-sm text-secondary" style="margin-top: 6px;">Briefing preenchido ✓</p>' : ''}
      ${item.customData ? '<p class="cart-item-meta text-sm text-secondary" style="margin-top: 6px;">Personalização definida ✓</p>' : ''}
    </div>
    <div class="cart-item-right">
      <div class="cart-item-price">${formatBalance(item.product.price * item.quantity)}</div>
      <button class="btn btn-ghost btn-sm cart-item-remove" id="remove-${item.product.id}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        Remover
      </button>
    </div>
  `;

  div.querySelector('.cart-item-remove').addEventListener('click', () => onRemove(item.product.id));

  return div;
}
