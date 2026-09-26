import { PinIcon } from '../common/Icons.jsx';

export default function LocationMap() {
  return (
    <div className="contact-map-stage">
      <div className="contact-map-card">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <PinIcon size={16} />
          Google Map & GPS Satellite Location (Aptech Global Tech Hub)
        </div>
        <iframe
          title="FandomVerse Global Location Map"
          width="100%"
          height="350"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%)' }}
          loading="lazy"
          allowFullScreen
          src="https://maps.google.com/maps?q=Los%20Angeles%20Convention%20Center&t=&z=13&ie=UTF8&iwloc=&output=embed"
        />
      </div>
    </div>
  );
}
