import { useState } from 'react';
import FANDOM_DATA from '../data/fandomData.js';
import { MerchCard } from '../components/cards/index.js';
import ContentSection from '../components/common/ContentSection.jsx';
import FilterPills from '../components/common/FilterPills.jsx';
import { CartIcon } from '../components/common/Icons.jsx';
import { FILTER_CATEGORIES } from '../constants/index.js';
import { useCart } from '../context/CartContext.jsx';

export default function MerchandisePage() {
  const { openCart } = useCart();
  const [category, setCategory] = useState('all');
  const list = (FANDOM_DATA.merchandise || []).filter(m => category === 'all' || m.category === category);

  return (
    <ContentSection
      headingLevel="h1"
      title="Official Merchandise Showcase"
      subtitle="Browse licensed collectibles, limited apparel, vinyl records, and art prints. Add items to your demo cart."
      action={
        <button type="button" className="btn-hero-primary" onClick={openCart}>
          <CartIcon size={16} />
          View Cart Drawer
        </button>
      }
    >
      <FilterPills options={FILTER_CATEGORIES} value={category} onChange={setCategory} />
      <div className="grid-3">{list.map(m => <MerchCard key={m.id} m={m} />)}</div>
    </ContentSection>
  );
}
