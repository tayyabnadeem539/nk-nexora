/**
 * FandomVerse - Merchandise Demo Cart System
 * SRS Compliance:
 * - Temporary client-side shopping cart with total billing calculation.
 * - Add items, increase/decrease quantity, remove items.
 * - Checkout and payment features are NOT included.
 * - Clearly indicates: "Demo Cart — Checkout is not available."
 */

const Cart = {
  STORAGE_KEY: 'fandomverse_demo_cart',

  getItems() {
    try {
      const data = sessionStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.updateBadges();
      this.renderDrawer();
    } catch (e) {
      console.error('Error saving cart', e);
    }
  },

  addItem(product) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        franchise: product.franchise || '',
        category: product.category || '',
        qty: 1
      });
    }

    this.saveItems(items);
    this.open();
  },

  removeItem(id) {
    let items = this.getItems();
    items = items.filter(i => i.id !== id);
    this.saveItems(items);
  },

  updateQty(id, delta) {
    let items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        items = items.filter(i => i.id !== id);
      }
      this.saveItems(items);
    }
  },

  clear() {
    this.saveItems([]);
  },

  getTotals() {
    const items = this.getItems();
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const estTax = 0; // Demo
    const total = subtotal + estTax;
    return {
      count: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2)
    };
  },

  open() {
    const drawerBackdrop = document.getElementById('cartDrawerBackdrop');
    if (drawerBackdrop) {
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.renderDrawer();
    }
  },

  close() {
    const drawerBackdrop = document.getElementById('cartDrawerBackdrop');
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  updateBadges() {
    const totals = this.getTotals();
    document.querySelectorAll('.cart-badge-counter').forEach(el => {
      el.textContent = totals.count;
      el.style.display = totals.count > 0 ? 'flex' : 'none';
    });
  },

  renderDrawer() {
    const container = document.getElementById('cartDrawerItemsList');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    const totalEl = document.getElementById('cartDrawerTotal');
    if (!container) return;

    const items = this.getItems();
    const totals = this.getTotals();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p style="font-weight: 600; color: #fff; margin-bottom: 6px;">Your cart is empty</p>
          <p style="font-size: 13px;">Explore the Merchandise section to add collectibles, apparel, and fan gear.</p>
        </div>
      `;
    } else {
      container.innerHTML = items.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80'" />
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button type="button" class="qty-btn" onclick="Cart.updateQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
                <span class="qty-number">${item.qty}</span>
                <button type="button" class="qty-btn" onclick="Cart.updateQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="btn-remove-item" onclick="Cart.removeItem('${item.id}')">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal}`;
    if (totalEl) totalEl.textContent = `$${totals.total}`;
  }
};

window.Cart = Cart;
