import { renderHeader } from '../components/Header.js';
import { showToast } from '../components/Toast.js';
import { products } from '../data/products.js';
import { getState, addToCart, formatBalance } from '../store.js';
import { navigate } from '../router.js';

export function renderProductDetail(app, params) {
  const product = products.find(p => p.id === parseInt(params.id));

  if (!product) {
    app.innerHTML = `
      <div class="container page">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h2 class="empty-state-title">Produto não encontrado</h2>
          <p class="empty-state-text">O produto que você procura não está disponível.</p>
          <a href="#/products" class="btn btn-primary">Ver produtos</a>
        </div>
      </div>
    `;
    renderHeader(app);
    return;
  }

  const state = getState();
  const canAfford = state.user.balance >= product.price;

  const typeLabels = {
    physical: 'Produto físico',
    briefing: 'Com briefing',
    customizable: 'Personalizável',
  };

  const typeIcons = {
    physical: '📦',
    briefing: '📋',
    customizable: '🎨',
  };

  function renderBriefingForm() {
    if (product.type !== 'briefing' || !product.briefingFields) return '';
    return `
      <div class="product-form-section" id="briefing-section">
        <h3 class="product-form-title">Informações do evento</h3>
        <p class="text-sm text-secondary" style="margin-bottom: var(--space-5);">Preencha os dados necessários para o resgate.</p>
        ${product.briefingFields.map(field => {
          if (field.type === 'select') {
            return `
              <div class="input-group">
                <label class="input-label">${field.label} ${field.required ? '*' : ''}</label>
                <select class="input-field" id="bf-${field.id}" ${field.required ? 'required' : ''}>
                  <option value="">Selecione...</option>
                  ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              </div>
            `;
          }
          if (field.type === 'textarea') {
            return `
              <div class="input-group">
                <label class="input-label">${field.label} ${field.required ? '*' : ''}</label>
                <textarea class="input-field" id="bf-${field.id}" placeholder="${field.label}" ${field.required ? 'required' : ''}></textarea>
              </div>
            `;
          }
          return `
            <div class="input-group">
              <label class="input-label">${field.label} ${field.required ? '*' : ''}</label>
              <input type="${field.type || 'text'}" class="input-field" id="bf-${field.id}" placeholder="${field.label}" ${field.required ? 'required' : ''} />
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderCustomFields() {
    if (product.type !== 'customizable' || !product.customFields) return '';
    return `
      <div class="product-form-section" id="custom-section">
        <h3 class="product-form-title">Personalização</h3>
        <p class="text-sm text-secondary" style="margin-bottom: var(--space-5);">Configure as opções de personalização.</p>
        ${product.customFields.map(field => {
          if (field.type === 'select') {
            return `
              <div class="input-group">
                <label class="input-label">${field.label} ${field.required ? '*' : ''}</label>
                <select class="input-field" id="cf-${field.id}" ${field.required ? 'required' : ''}>
                  <option value="">Selecione...</option>
                  ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              </div>
            `;
          }
          return `
            <div class="input-group">
              <label class="input-label">${field.label} ${field.required ? '*' : ''}</label>
              <input type="text" class="input-field" id="cf-${field.id}" placeholder="${field.label}" ${field.required ? 'required' : ''} ${field.maxLength ? `maxlength="${field.maxLength}"` : ''} />
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  app.innerHTML = `
    <div id="page-product-detail">
      <div class="container page">

        <a href="#/products" class="back-link" id="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Voltar aos produtos
        </a>

        <div class="product-detail-layout">
          <!-- Image -->
          <div class="product-detail-image-wrap">
            <img src="${product.image}" alt="${product.name}" class="product-detail-image" id="product-image" />
          </div>

          <!-- Info -->
          <div class="product-detail-info">
            <span class="badge badge-light product-detail-type">${typeIcons[product.type]} ${typeLabels[product.type]}</span>
            <h1 class="product-detail-name">${product.name}</h1>
            <p class="product-detail-description">${product.description}</p>

            <div class="product-detail-price-block">
              <div class="product-detail-price">${formatBalance(product.price)}</div>
              ${canAfford
                ? `<span class="badge badge-success">Saldo suficiente</span>`
                : `<span class="badge badge-warning">Saldo insuficiente</span>`
              }
            </div>

            ${renderBriefingForm()}
            ${renderCustomFields()}

            <button class="btn btn-primary btn-lg btn-block" id="btn-add-cart" ${!canAfford ? 'disabled' : ''}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              ${canAfford ? 'Adicionar ao carrinho' : 'Saldo insuficiente'}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  const unsub = renderHeader(app);

  // Add to cart
  document.getElementById('btn-add-cart')?.addEventListener('click', () => {
    const extras = {};

    // Collect briefing data
    if (product.type === 'briefing' && product.briefingFields) {
      const briefingData = {};
      let valid = true;
      product.briefingFields.forEach(field => {
        const el = document.getElementById(`bf-${field.id}`);
        if (el) {
          briefingData[field.id] = el.value;
          if (field.required && !el.value.trim()) {
            el.style.borderColor = 'var(--color-error)';
            valid = false;
          } else {
            el.style.borderColor = '';
          }
        }
      });
      if (!valid) {
        showToast('Preencha todos os campos obrigatórios.', 'error');
        return;
      }
      extras.briefingData = briefingData;
    }

    // Collect custom data
    if (product.type === 'customizable' && product.customFields) {
      const customData = {};
      let valid = true;
      product.customFields.forEach(field => {
        const el = document.getElementById(`cf-${field.id}`);
        if (el) {
          customData[field.id] = el.value;
          if (field.required && !el.value.trim()) {
            el.style.borderColor = 'var(--color-error)';
            valid = false;
          } else {
            el.style.borderColor = '';
          }
        }
      });
      if (!valid) {
        showToast('Preencha todos os campos de personalização obrigatórios.', 'error');
        return;
      }
      extras.customData = customData;
    }

    addToCart(product, extras);
    showToast('Produto adicionado ao carrinho!', 'success');
  });

  return unsub;
}
