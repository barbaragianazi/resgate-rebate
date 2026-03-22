import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

import { registerRoute, initRouter } from './router.js';
import { renderHome } from './pages/Home.js';
import { renderListing } from './pages/Listing.js';
import { renderProductDetail } from './pages/ProductDetail.js';
import { renderCart } from './pages/Cart.js';
import { renderCheckout } from './pages/Checkout.js';
import { renderProductAdmin } from './pages/ProductAdmin.js';
import { initProductCardListeners } from './components/ProductCard.js';

// Register routes
registerRoute('/', renderHome);
registerRoute('/products', renderListing);
registerRoute('/product/:id', renderProductDetail);
registerRoute('/cart', renderCart);
registerRoute('/checkout', renderCheckout);
registerRoute('/admin/products', renderProductAdmin);

// Initialize
initRouter();
initProductCardListeners();
