// ── Global State Store ──
// Simple singleton-based state management

const BANNER_SETTINGS_KEY = 'ecommerce_banner_settings';

const defaultBannerSettings = {
  balance: { visible: true, size: 'full' },
  featured: { visible: true, size: 'full' },
  bestSellers: { visible: true, size: 'half' },
  recentRedemptions: { visible: true, size: 'half' },
};

function loadBannerSettings() {
  try {
    const saved = localStorage.getItem(BANNER_SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return { ...defaultBannerSettings };
}

const state = {
  user: {
    name: 'Maria Oliveira',
    balance: 14950,
  },
  cart: [],
  recentRedemptions: [
    { id: 101, name: 'Caixa de Som Bluetooth', date: '12/03/2026', price: 350 },
    { id: 102, name: 'Kit Caderno & Caneta', date: '28/02/2026', price: 120 },
  ],
  bannerSettings: loadBannerSettings(),
};

const listeners = new Set();

export function getState() {
  return state;
}

function notify() {
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ── Cart Operations ──

export function addToCart(product, extras = {}) {
  const existing = state.cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({ product, quantity: 1, ...extras });
  }
  notify();
}

export function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.product.id !== productId);
  notify();
}

export function updateCartItemQuantity(productId, qty) {
  const item = state.cart.find(i => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, qty);
    notify();
  }
}

export function clearCart() {
  state.cart = [];
  notify();
}

export function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getBalanceAfter() {
  return state.user.balance - getCartTotal();
}

// ── Balance ──

export function deductBalance(amount) {
  state.user.balance -= amount;
  notify();
}

// ── Banner Settings ──

export function getBannerSettings() {
  return state.bannerSettings;
}

export function saveBannerSettings(settings) {
  state.bannerSettings = { ...settings };
  try {
    localStorage.setItem(BANNER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) { /* ignore */ }
  notify();
}

// ── Format Helpers ──

export function formatBalance(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
