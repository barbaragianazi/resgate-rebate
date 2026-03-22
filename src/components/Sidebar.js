import { navigate } from '../router.js';

export function renderSidebar(container) {
  const sidebarItems = [
    { icon: 'home', label: 'Início', route: '#/' },
    { icon: 'storefront', label: 'Produtos', route: '#/products' },
    { icon: 'shopping_cart', label: 'Carrinho', route: '#/cart' },
    { icon: 'inventory_2', label: 'Cadastro', route: '#/admin/products' },
    { icon: 'favorite', label: 'Favoritos', route: '#/favorites' },
    { icon: 'history', label: 'Histórico', route: '#/history' },
    { icon: 'account_circle', label: 'Meu Perfil', route: '#/profile' },
    { icon: 'help_outline', label: 'Ajuda', route: '#/help' },
  ];

  const hash = window.location.hash || '#/';

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'main-sidebar';
  sidebar.innerHTML = `
    <nav class="sidebar-nav">
      ${sidebarItems.map(item => {
        const isActive = hash === item.route || 
          (item.route === '#/products' && hash.startsWith('#/product')) ||
          (item.route === '#/admin/products' && hash.startsWith('#/admin'));
        return `
          <a href="${item.route}" class="sidebar-item ${isActive ? 'active' : ''}" title="${item.label}">
            <span class="material-icons-outlined sidebar-icon">${item.icon}</span>
            <span class="sidebar-label">${item.label}</span>
          </a>
        `;
      }).join('')}
    </nav>
  `;

  container.prepend(sidebar);
}
