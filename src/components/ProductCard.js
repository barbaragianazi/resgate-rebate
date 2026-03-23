import { formatBalance, addToCart } from '../store.js';

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return '★'.repeat(fullStars) + (hasHalf ? '★' : '') + '☆'.repeat(emptyStars);
}

function formatInstallmentValue(price, installments) {
  if (!installments || installments <= 1) return '';
  const value = price / installments;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function renderProductCard(product) {
  const typeLabels = {
    physical: 'Produto físico',
    briefing: 'Com briefing',
    customizable: 'Personalizado',
  };

  const typeClasses = {
    physical: 'type-physical',
    briefing: 'type-briefing',
    customizable: 'type-custom',
  };

  const hasDiscount = product.originalPrice && product.discount > 0;
  const installmentValue = formatInstallmentValue(product.price, product.installments);
  const tags = product.tags || [];
  const stars = renderStars(product.rating || 0);

  return `
    <div class="product-card card card-elevated" id="product-card-${product.id}">
      <div class="glow-effect"></div>
      <a href="#/product/${product.id}" class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-card-type-badge ${typeClasses[product.type]}">${typeLabels[product.type]}</span>
      </a>

      <div class="product-card-body">
        ${tags.length > 0 ? `
          <div class="product-card-tags">
            ${tags.map(t => `<span class="product-card-tag"><span class="material-icons-outlined" style="font-size: 14px;">category</span> ${t}</span>`).join('')}
          </div>
        ` : ''}

        ${product.rating ? `
          <div class="product-card-rating">
            <span class="product-card-stars">${stars}</span>
            <span class="product-card-sold">(${product.soldCount || 0} vendidos)</span>
          </div>
        ` : ''}

        <a href="#/product/${product.id}" class="product-card-name">${product.name}</a>

        <div class="product-card-pricing">
          ${hasDiscount ? `
            <span class="product-card-original">de ${formatBalance(product.originalPrice)} por</span>
          ` : ''}
          <div class="product-card-price-row">
            <span class="product-card-price">${formatBalance(product.price)}</span>
            ${hasDiscount ? `<span class="product-card-discount-badge">-${product.discount}%</span>` : ''}
          </div>
          ${product.installments > 1 ? `
            <span class="product-card-installments">ou até <strong>${product.installments}x</strong> de <strong>${installmentValue}</strong></span>
          ` : ''}
        </div>

        <div class="product-card-actions">
          <button class="product-card-add-btn" data-product-id="${product.id}">
            <span class="material-icons-outlined" style="font-size: 18px;">shopping_cart</span>
            Adicionar ao carrinho
          </button>
          <button class="product-card-fav-btn" data-product-id="${product.id}" title="Favoritar">
            <span class="material-icons-outlined">favorite_border</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Attach global click handler for add-to-cart buttons
export function initProductCardListeners() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.product-card-add-btn');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = parseInt(addBtn.dataset.productId);
      import('../data/products.js').then(({ products }) => {
        const product = products.find(p => p.id === productId);
        if (product) {
          addToCart(product);
          // Visual feedback
          addBtn.innerHTML = `<span class="material-icons-outlined" style="font-size: 18px;">check</span> Adicionado!`;
          addBtn.classList.add('added');
          setTimeout(() => {
            addBtn.innerHTML = `<span class="material-icons-outlined" style="font-size: 18px;">shopping_cart</span> Adicionar ao carrinho`;
            addBtn.classList.remove('added');
          }, 1500);
        }
      });
    }

    const favBtn = e.target.closest('.product-card-fav-btn');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const icon = favBtn.querySelector('.material-icons-outlined');
      if (icon.textContent === 'favorite_border') {
        icon.textContent = 'favorite';
        favBtn.classList.add('favorited');
      } else {
        icon.textContent = 'favorite_border';
        favBtn.classList.remove('favorited');
      }
    }
  });
}
