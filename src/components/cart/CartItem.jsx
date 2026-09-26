import { FALLBACK_MERCH_IMAGE } from '../../constants/index.js';
import { useCart } from '../../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="cart-item-row" data-id={item.id}>
      <div className="cart-item-thumb">
        <img src={item.image} alt={item.name} onError={(e) => { e.currentTarget.src = FALLBACK_MERCH_IMAGE; }} />
      </div>
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
        <div className="cart-item-controls">
          <div className="qty-stepper">
            <button type="button" className="qty-btn" onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">-</button>
            <span className="qty-number">{item.qty}</span>
            <button type="button" className="qty-btn" onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" className="btn-remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      </div>
    </div>
  );
}
