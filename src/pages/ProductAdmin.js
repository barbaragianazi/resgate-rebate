import { renderHeader } from '../components/StoreHeader.js';
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';
import { formatBalance } from '../store.js';

export function renderProductAdmin(app) {
  const typeLabels = {
    physical: '📦 Físico',
    briefing: '📋 Com briefing',
    customizable: '🎨 Personalizável',
  };

  function getCategoryName(slug) {
    const cat = categories.find(c => c.slug === slug || c.id === slug);
    return cat ? cat.name : slug;
  }

  app.innerHTML = `
    <div id="page-admin">
      <div class="container page">

        <div class="admin-header">
          <div>
            <h1 class="page-title" style="margin-bottom: var(--space-2);">Cadastro de Produtos</h1>
            <p class="text-secondary text-sm">${products.length} produtos cadastrados</p>
          </div>
          <div class="admin-header-actions">
            <div class="admin-search-wrap">
              <span class="material-icons-outlined admin-search-icon">search</span>
              <input type="text" class="input-field admin-search" id="admin-search" placeholder="Procurar no catálogo..." />
            </div>
            <button class="btn btn-primary" id="btn-add-product">
              <span class="material-icons-outlined" style="font-size: 18px;">add</span>
              Novo Produto
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="admin-filters" id="admin-filters">
          <button class="chip active" data-filter="all">Todos</button>
          <button class="chip" data-filter="type:physical">📦 Físicos</button>
          <button class="chip" data-filter="type:briefing">📋 Com briefing</button>
          <button class="chip" data-filter="type:customizable">🎨 Personalizáveis</button>
        </div>

        <!-- Product Grid/Table -->
        <div class="admin-grid" id="admin-product-grid">
          ${products.map(p => `
            <div class="admin-product-row card card-elevated" data-id="${p.id}" data-type="${p.type}" data-name="${p.name.toLowerCase()}">
              <div class="admin-product-image">
                <img src="${p.image}" alt="${p.name}" loading="lazy" />
              </div>
              <div class="admin-product-info">
                <h3 class="admin-product-name">${p.name}</h3>
                <p class="admin-product-desc text-sm text-secondary">${p.description.substring(0, 80)}...</p>
              </div>
              <div class="admin-product-meta">
                <span class="badge badge-light">${typeLabels[p.type]}</span>
                <span class="text-xs text-secondary">${getCategoryName(p.category)}</span>
              </div>
              <div class="admin-product-price">
                <span class="admin-price-value">${formatBalance(p.price)}</span>
              </div>
              <div class="admin-product-actions">
                <button class="btn btn-ghost btn-sm" title="Editar">
                  <span class="material-icons-outlined" style="font-size: 18px;">edit</span>
                </button>
                <button class="btn btn-ghost btn-sm" title="Duplicar">
                  <span class="material-icons-outlined" style="font-size: 18px;">content_copy</span>
                </button>
                <button class="btn btn-ghost btn-sm admin-delete-btn" title="Excluir" style="color: var(--color-error);">
                  <span class="material-icons-outlined" style="font-size: 18px;">delete_outline</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  const unsub = renderHeader(app);

  // Search
  const searchInput = document.getElementById('admin-search');
  const grid = document.getElementById('admin-product-grid');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    grid.querySelectorAll('.admin-product-row').forEach(row => {
      const name = row.dataset.name;
      row.style.display = name.includes(query) ? '' : 'none';
    });
  });

  // Filters
  let activeFilter = 'all';
  document.getElementById('admin-filters')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeFilter = chip.dataset.filter;

    document.querySelectorAll('#admin-filters .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    grid.querySelectorAll('.admin-product-row').forEach(row => {
      if (activeFilter === 'all') {
        row.style.display = '';
      } else if (activeFilter.startsWith('type:')) {
        const type = activeFilter.split(':')[1];
        row.style.display = row.dataset.type === type ? '' : 'none';
      }
    });
  });

  return unsub;
}
