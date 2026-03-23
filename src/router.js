// ── Hash-based SPA Router ──

const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/';

  // Exact match
  if (routes[path]) return { handler: routes[path], params: {} };

  // Parameterized match (e.g., /product/:id)
  for (const pattern of Object.keys(routes)) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) return { handler: routes[pattern], params };
  }

  return null;
}

function handleRoute() {
  const appRoot = document.getElementById('app');
  const hash = window.location.hash || '#/';
  const result = matchRoute(hash);

  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  // Ensure layout wrapper exists
  let layout = appRoot.querySelector('.app-layout');
  if (!layout) {
    appRoot.innerHTML = `
      <div class="app-layout">
        <div class="app-sidebar" id="app-sidebar"></div>
        <div class="app-main">
          <div class="app-topbar" id="app-topbar"></div>
          <div class="app-content" id="app-content"></div>
        </div>
      </div>
    `;
    layout = appRoot.querySelector('.app-layout');
  }

  const mainContent = layout.querySelector('#app-content');

  // Render legacy sidebar
  const sidebarContainer = layout.querySelector('#app-sidebar');
  if (sidebarContainer && sidebarContainer.children.length === 0) {
    import('./components/Sidebar.js').then(({ renderSidebar }) => {
      renderSidebar(sidebarContainer);
    });
  }

  // Render legacy topbar
  const topbarContainer = layout.querySelector('#app-topbar');
  if (topbarContainer && topbarContainer.children.length === 0) {
    import('./components/LegacyTopBar.js').then(({ renderLegacyTopBar }) => {
      renderLegacyTopBar(topbarContainer);
    });
  }

  if (result) {
    currentCleanup = result.handler(mainContent, result.params);
  } else {
    mainContent.innerHTML = `
      <div class="container page">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h2 class="empty-state-title">Página não encontrada</h2>
          <p class="empty-state-text">A página que você procura não existe.</p>
          <a href="#/" class="btn btn-primary">Voltar ao início</a>
        </div>
      </div>
    `;
  }

  // Scroll to top on navigation
  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
