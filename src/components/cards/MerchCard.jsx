import { useCart } from '../../context/CartContext.jsx';
import { highlight } from '../../utils/highlight.jsx';
import { CartIcon } from '../common/Icons.jsx';

export default function MerchCard({ m, term = '' }) {
  const { addToCart } = useCart();

  return (
    <div className="card-merch" data-id={m.id}>
      <div className="merch-thumb-wrap">
        <img className="merch-thumb-img" src={m.image} alt={m.name} loading="lazy" />
        {m.badge && <span className="merch-badge">{m.badge}</span>}
        <div className="merch-body">
          <div className="merch-franchise">{m.franchise} • {m.category}</div>
          <h3 className="merch-title">{highlight(m.name, term)}</h3>
          <div className="merch-rating-row">
            <span className="star-rating">★ {m.rating}</span>
            <span>({m.reviews} reviews)</span>
          </div>
          <div className="merch-price-row">
            <span className="merch-price">${m.price.toFixed(2)}</span>
            <button type="button" className="btn-add-cart" onClick={(e) => { e.stopPropagation(); addToCart(m); }}>
              <CartIcon size={14} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
