/* Slide-out demo cart with quantity steppers and totals. */
import { useCart } from '../../context/CartContext.jsx';
import { notify } from '../../services/notificationService.js';
import { plural } from '../../utils/format.js';
import { CartIcon } from '../common/Icons.jsx';
import CartItem from './CartItem.jsx';

function EmptyCart() {
  return (
    <div className="cart-empty-state">
      <CartIcon size={48} strokeWidth={1.5} />
      <p style={{ fontWeight: 600, color: '#fff', marginBottom: 6 }}>Your cart is empty</p>
      <p style={{ fontSize: 13 }}>Explore the Merchandise section to add collectibles, apparel, and fan gear.</p>
    </div>
  );
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, totals, clearCart } = useCart();

  const checkout = () => notify(items.length
    ? { type: 'success', title: 'Checkout Successful', message: `${plural(totals.count, 'item')} • $${totals.total}. This is a demo order — no payment was taken.` }
    : { type: 'warning', title: 'Your Cart Is Empty', message: 'Add some fan merchandise before checking out.' });

  return (
    <div className={`cart-drawer-backdrop ${isOpen ? 'active' : ''}`} onClick={closeCart}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <CartIcon size={20} />
            Fan Merchandise Cart
          </div>
          <button type="button" onClick={closeCart} style={{ color: 'var(--text-muted)', fontSize: 20 }}>✕</button>
        </div>

        <div className="cart-items-list">
          {items.length === 0 ? <EmptyCart /> : items.map(item => <CartItem key={item.id} item={item} />)}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-subtotal-row">
            <span>Estimated Subtotal:</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>${totals.subtotal}</span>
          </div>
          <div className="cart-subtotal-row">
            <span>Estimated Taxes & Fees:</span>
            <span>$0.00</span>
          </div>
          <div className="cart-total-row">
            <span>Calculated Total:</span>
            <span style={{ color: 'var(--accent-gold)' }}>${totals.total}</span>
          </div>
          <button type="button" className="btn-checkout-demo" onClick={checkout}>Checkout</button>
          <button type="button" className="btn-clear-cart" onClick={clearCart}>Clear Cart</button>
        </div>
      </aside>
    </div>
  );
}
