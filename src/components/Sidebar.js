import { getState } from '../store.js';

export function renderSidebar(container) {
  const state = getState();
  const hash = window.location.hash || '#/';

  const menus = [
    {
      label: 'INÍCIO',
      icon: 'home',
      activeIconClass: 'icon-home-active', // Custom orange styling
      route: '#/'
    },
    {
      label: 'ADMINISTRAÇÃO',
      icon: 'admin_panel_settings',
      children: []
    },
    { label: 'AUDITORIA', icon: 'policy', children: [] },
    { label: 'CAMPANHAS DE MARKETING', icon: 'campaign', children: [] },
    { label: 'CRM', icon: 'cases', children: [] },
    { label: 'DASHBOARDS', icon: 'dashboard', children: [] },
    { label: 'EVENTOS', icon: 'event', children: [] },
    { label: 'MAPEAMENTO', icon: 'map', children: [] },
    { label: 'PLANO DE AÇÃO', icon: 'calendar_month', children: [] },
    { label: 'SOLICITAÇÕES', icon: 'request_quote', children: [] },
    { label: 'TREINAMENTOS', icon: 'school', children: [] },
    {
      label: 'LOJA',
      icon: 'storefront',
      children: [
        { label: 'Página inicial', route: '#/', class: 'menu-sub-item' },
        { label: 'Cadastro de produtos', route: '#/admin/products' }
      ]
    },
    {
      label: 'CARRINHO',
      icon: 'shopping_cart',
      children: [
        { label: 'Meu carrinho', route: '#/cart' }
      ]
    }
  ];

  const sidebar = document.createElement('aside');
  sidebar.className = 'legacy-sidebar';
  sidebar.id = 'legacy-sidebar';



  const profileHtml = `
    <div class="sidebar-profile">

    <div class="legacy-topbar-left">
      <button class="legacy-menu-btn" id="legacy-menu-toggle" title="Alternar Menu">
        <span class="material-icons-outlined">menu</span>
      </button>
    </div>


     
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${state.user.name}</div>
        <div class="sidebar-user-role">Perfil: Administrador</div>
      </div>
      <button class="sidebar-logout-btn" title="Sair">
        <span class="material-icons-outlined">power_settings_new</span>
      </button>
    </div>
  `;

  const renderItem = (item, isSub = false) => {
    const hasChildren = item.children && item.children.length > 0;

    // Check if any deep child matches current hash
    const hasActiveChild = (node) => {
      if (node.route && node.route === hash) return true;
      if (node.children) return node.children.some(c => hasActiveChild(c));
      return false;
    };

    const isLoja = item.label === 'LOJA';
    const isOpen = (hasChildren && hasActiveChild(item)) || isLoja;
    const isDirectLink = !!item.route && !hasChildren;
    const isActiveDirect = isDirectLink && hash === item.route;

    // Build the header line (clickable line)
    const iconHtml = item.icon ? `<div class="sidebar-icon-wrapper ${item.activeIconClass || ''}"><span class="material-icons-outlined">${item.icon}</span></div>` : '';
    const labelHtml = `<span class="sidebar-label">${item.label}</span>`;
    const chevronHtml = hasChildren ? `<span class="material-icons-outlined chevron">expand_more</span>` : '';



    let headerTag = isDirectLink ? 'a' : 'div';
    let headerHref = isDirectLink ? `href="${item.route}"` : '';

    let html = `
      <div class="sidebar-item menu-sub-item ${isSub ? 'sub-item' : ''} ${hasChildren ? 'has-children' : ''} ${isOpen ? 'open' : ''} ${isActiveDirect && !isSub ? 'active' : ''}">
        <${headerTag} ${headerHref} class="sidebar-item-header ${isDirectLink && isSub && isActiveDirect ? 'active-leaf' : ''}">
          ${iconHtml}
          ${labelHtml}
          ${chevronHtml}
        </${headerTag}>
        ${hasChildren ? `
          <div class="sidebar-item-content">
            ${item.children.map(child => renderItem(child, true)).join('')}
          </div>
        ` : ''}
      </div>
    `;

    return html;
  };

  const navHtml = `
    <nav class="sidebar-nav">
      ${menus.map(m => renderItem(m)).join('')}
    </nav>
  `;

  sidebar.innerHTML = profileHtml + navHtml;
  container.appendChild(sidebar);

  // Accordion Logic
  sidebar.querySelectorAll('.sidebar-item.has-children > .sidebar-item-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.preventDefault();
      if (!document.body.classList.contains('sidebar-expanded')) {
        document.body.classList.add('sidebar-expanded');
      }
      const parent = header.closest('.sidebar-item');
      parent.classList.toggle('open');
    });
  });

  // Menu toggle click -> class toggle on body for sidebar
  sidebar.querySelector('#legacy-menu-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-expanded');
  });

}
