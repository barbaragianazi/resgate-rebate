import { renderHeader } from '../components/StoreHeader.js';
import { renderProductCard } from '../components/ProductCard.js';
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';

export function renderListing(app, params) {
  // Parse query params from hash
  const hashParts = (window.location.hash || '').split('?');
  const searchParams = new URLSearchParams(hashParts[1] || '');
  const initialCategory = searchParams.get('category') || '';

  let activeFilter = initialCategory ? `category:${initialCategory}` : 'all';
  let sortBy = 'default';

  function getFilteredProducts() {
    let filtered = [...products];

    // Filter
    if (activeFilter === 'type:physical') {
      filtered = filtered.filter(p => p.type === 'physical');
    } else if (activeFilter === 'type:briefing') {
      filtered = filtered.filter(p => p.type === 'briefing');
    } else if (activeFilter === 'type:customizable') {
      filtered = filtered.filter(p => p.type === 'customizable');
    } else if (activeFilter.startsWith('category:')) {
      const cat = activeFilter.split(':')[1];
      filtered = filtered.filter(p => p.category === cat);
    }

    // Sort
    if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  function renderContent() {
    const filtered = getFilteredProducts();
    const grid = document.getElementById('listing-grid');
    const count = document.getElementById('listing-count');

    if (grid) {
      grid.innerHTML = filtered.length > 0
        ? filtered.map(p => renderProductCard(p)).join('')
        : `
          <div class="empty-state" style="grid-column: 1 / -1">
            <div class="empty-state-icon">🔍</div>
            <h3 class="empty-state-title">Nenhum produto encontrado</h3>
            <p class="empty-state-text">Tente alterar os filtros selecionados.</p>
          </div>
        `;
    }
    if (count) {
      count.textContent = `${filtered.length} produto${filtered.length !== 1 ? 's' : ''}`;
    }

    // Update chip states
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === activeFilter);
    });
  }

  app.innerHTML = `
    <div id="page-listing">
      <div class="container page">

        <div class="listing-header">
          <h1 class="listing-title">Produtos</h1>
          <span class="listing-count text-secondary" id="listing-count"></span>
        </div>

        <!-- Filters -->
        <div class="filter-bar" id="filter-bar">
          <button class="chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todos</button>
          <button class="chip ${activeFilter === 'type:physical' ? 'active' : ''}" data-filter="type:physical">📦 Físicos</button>
          <button class="chip ${activeFilter === 'type:briefing' ? 'active' : ''}" data-filter="type:briefing">📋 Com briefing</button>
          <button class="chip ${activeFilter === 'type:customizable' ? 'active' : ''}" data-filter="type:customizable">🎨 Personalizáveis</button>
          ${categories.map(c => `
            <button class="chip ${activeFilter === 'category:' + c.slug ? 'active' : ''}" data-filter="category:${c.slug}">${c.icon} ${c.name}</button>
          `).join('')}
        </div>

        <!-- Sort -->
        <div class="listing-toolbar">
          <select class="input-field listing-sort" id="listing-sort">
            <option value="default">Ordenar por</option>
            <option value="name-asc">Nome A-Z</option>
            <option value="name-desc">Nome Z-A</option>
            <option value="price-asc">Menor saldo</option>
            <option value="price-desc">Maior saldo</option>
          </select>
        </div>

        <!-- Product Grid -->
        <div class="product-grid" id="listing-grid"></div>

      </div>
    </div>
  `;

  const unsub = renderHeader(app);

  // Event: Filters
  document.getElementById('filter-bar').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip && chip.dataset.filter) {
      activeFilter = chip.dataset.filter;
      renderContent();
    }
  });

  // Event: Sort
  document.getElementById('listing-sort').addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderContent();
  });

  renderContent();
  return unsub;
}
