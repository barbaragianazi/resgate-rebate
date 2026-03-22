import { renderHeader } from '../components/Header.js';
import { renderProductCard } from '../components/ProductCard.js';
import { renderCategoryCard } from '../components/CategoryCard.js';
import { getState, formatBalance, getCartTotal, getBannerSettings } from '../store.js';
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';
import { openBannerSettings } from '../components/BannerSettings.js';

function createCarousel(id, title, linkHref, items) {
  return `
    <section class="home-section">
      <div class="section-header">
        <h2 class="section-title">${title}</h2>
        ${linkHref ? `<a href="${linkHref}" class="section-link">Ver todos →</a>` : ''}
      </div>
      <div class="carousel-wrapper">
        <button class="carousel-arrow carousel-arrow-left" data-carousel="${id}" data-dir="left">
          <span class="material-icons-outlined">chevron_left</span>
        </button>
        <div class="carousel-track" id="carousel-${id}">
          ${items}
        </div>
        <button class="carousel-arrow carousel-arrow-right" data-carousel="${id}" data-dir="right">
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>
    </section>
  `;
}

export function renderHome(app) {
  const state = getState();
  const settings = getBannerSettings();
  const featured = products.filter(p => p.featured);
  const bestSellers = [...products].sort((a, b) => a.price - b.price).slice(0, 6);
  const cartTotal = getCartTotal();
  const remaining = state.user.balance - cartTotal;
  const usedPercent = state.user.balance > 0 ? Math.round((cartTotal / state.user.balance) * 100) : 0;
  const availablePercent = 100 - usedPercent;

  const affordable = products.filter(p => p.price <= remaining).length;

  const bannerSections = [];

  // Balance Banner
  if (settings.balance?.visible !== false) {
    const sizeClass = settings.balance?.size === 'half' ? 'banner-half' : 'banner-full';
    bannerSections.push(`
      <div class="home-banner ${sizeClass}" id="banner-balance">
        <div class="balance-banner">
          <div class="balance-banner-left">
            <div class="balance-banner-promo">
              <h2 class="balance-banner-headline">Seu saldo está pronto para ser utilizado</h2>
              <p class="balance-banner-sub">Explore os itens disponíveis e adicione ao carrinho de acordo com sua verba</p>
            </div>
          </div>

          <div class="balance-banner-right">
            <div class="balance-banner-card">
              <div class="balance-banner-card-top">
                <div class="balance-banner-card-info">
                  <div class="balance-banner-card-header">
                    <span class="balance-banner-card-label">Saldo disponível <span class="material-icons-outlined" style="font-size: 14px; vertical-align: middle;">info</span></span>
                  </div>
                  <div class="balance-banner-amount">${formatBalance(state.user.balance)}</div>
                  <p class="balance-banner-affordable">Você pode resgatar <strong>${affordable} produtos</strong></p>
                </div>
                <div class="balance-banner-ring">
                  <svg viewBox="0 0 120 120" class="percent-ring">
                    <circle cx="60" cy="60" r="52" class="percent-ring-bg"/>
                    <circle cx="60" cy="60" r="52" class="percent-ring-fill ${usedPercent > 0 ? 'percent-ring-used' : ''}" 
                      style="stroke-dasharray: ${usedPercent * 3.267} ${326.7 - usedPercent * 3.267}; stroke-dashoffset: 81.675;" />
                  </svg>
                  <div class="percent-ring-text">
                    <span class="percent-ring-value">${usedPercent}%</span>
                    <span class="percent-ring-label">utilizado</span>
                  </div>
                </div>
              </div>
              <div class="balance-banner-details">
                <div class="balance-banner-detail">
                  <span class="balance-banner-detail-label">Utilizado no carrinho</span>
                  <span class="balance-banner-detail-value">${formatBalance(cartTotal)}</span>
                </div>
                <div class="balance-banner-detail">
                  <span class="balance-banner-detail-label">Disponível para resgate</span>
                  <span class="balance-banner-detail-value" style="color: var(--color-success);">${formatBalance(remaining)}</span>
                </div>
              </div>
              <a href="#/history" class="balance-banner-history">
                <span class="material-icons-outlined" style="font-size: 14px;">history</span>
                Ver histórico
              </a>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  // Categories
  const categoriesToShow = categories.filter(c => c.slug !== 'todos');

  // Featured Products
  if (settings.featured?.visible !== false) {
    const sizeClass = settings.featured?.size === 'half' ? 'banner-half' : 'banner-full';
    bannerSections.push(`
      <div class="home-banner ${sizeClass}" id="banner-featured">
        ${createCarousel('featured', 'Em Destaque', '#/products', featured.map(p => renderProductCard(p)).join(''))}
      </div>
    `);
  }

  // Best Sellers
  if (settings.bestSellers?.visible !== false) {
    const sizeClass = settings.bestSellers?.size === 'half' ? 'banner-half' : 'banner-full';
    bannerSections.push(`
      <div class="home-banner ${sizeClass}" id="banner-best-sellers">
        ${createCarousel('bestsellers', 'Mais Vendidos', '#/products', bestSellers.map(p => renderProductCard(p)).join(''))}
      </div>
    `);
  }

  // Recent Redemptions
  if (settings.recentRedemptions?.visible !== false && state.recentRedemptions.length > 0) {
    const sizeClass = settings.recentRedemptions?.size === 'half' ? 'banner-half' : 'banner-full';
    bannerSections.push(`
      <div class="home-banner ${sizeClass}" id="banner-recent">
        <section class="home-section">
          <div class="section-header">
            <h2 class="section-title">Resgates Recentes</h2>
          </div>
          <div class="recent-list">
            ${state.recentRedemptions.map(r => `
              <div class="recent-item card card-elevated">
                <div class="recent-item-info">
                  <span class="recent-item-name">${r.name}</span>
                  <span class="recent-item-date text-sm text-secondary">${r.date}</span>
                </div>
                <span class="recent-item-price">${formatBalance(r.price)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `);
  }

  app.innerHTML = `
    <div id="page-home">
      <div class="home-content">

        <!-- Categories Bar -->
        <section class="home-categories-section">
          <div class="carousel-wrapper">
            <button class="carousel-arrow carousel-arrow-left" data-carousel="categories" data-dir="left">
              <span class="material-icons-outlined">chevron_left</span>
            </button>
            <div class="carousel-track carousel-categories" id="carousel-categories">
              ${categoriesToShow.map(c => renderCategoryCard(c)).join('')}
            </div>
            <button class="carousel-arrow carousel-arrow-right" data-carousel="categories" data-dir="right">
              <span class="material-icons-outlined">chevron_right</span>
            </button>
          </div>
        </section>

        <!-- Settings & Banners -->
        <div class="home-settings-bar">
          <button class="btn btn-ghost btn-sm" id="banner-settings-btn">
            <span class="material-icons-outlined" style="font-size: 18px;">settings</span>
            Personalizar
          </button>
          <a href="#/products" class="btn btn-secondary btn-sm">
            <span class="material-icons-outlined" style="font-size: 16px;">storefront</span>
            Ver todos os produtos
          </a>
        </div>

        <div class="home-banners-grid">
          ${bannerSections.join('')}
        </div>

      </div>
    </div>
  `;

  const unsub = renderHeader(app);

  // Settings button
  document.getElementById('banner-settings-btn')?.addEventListener('click', () => {
    openBannerSettings();
  });

  // Carousel arrow handlers
  document.querySelectorAll('.carousel-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const carouselId = btn.dataset.carousel;
      const dir = btn.dataset.dir;
      const track = document.getElementById(`carousel-${carouselId}`);
      if (!track) return;

      const scrollAmount = 280;
      track.scrollBy({
        left: dir === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    });
  });

  return unsub;
}
