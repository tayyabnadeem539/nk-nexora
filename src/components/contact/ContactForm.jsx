import { notify } from '../../services/notificationService.js';

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 };
const fieldStyle = { width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#fff' };

const INTEREST_OPTIONS = [
  'General FandomVerse Inquiry', 'Anime & Manga Editorial', 'Gaming Coverage',
  'Movies & TV Shows', 'K-Pop Fan Community', 'Comics Lore & Reviews'
];

/** Demo feedback form (no backend — shows a confirmation toast). */
export default function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    notify({ type: 'success', title: 'Message Sent', message: 'Thank you! The FandomVerse editorial desk has received your message. (Demo submission)' });
    e.target.reset();
  };

  return (
    <div className="contact-panel">
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Send Us a Message</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input type="text" required style={fieldStyle} placeholder="Your Name" />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input type="email" required style={fieldStyle} placeholder="name@example.com" />
        </div>
        <div>
          <label style={labelStyle}>Fandom Category Interest</label>
          <select style={fieldStyle}>
            {INTEREST_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Message *</label>
          <textarea required rows={4} style={{ ...fieldStyle, resize: 'vertical' }} placeholder="Your thoughts or questions..." />
        </div>
        <button type="submit" className="btn-hero-primary" style={{ marginTop: 4, justifyContent: 'center' }}>Send Inquiry</button>
      </form>
    </div>
  );
}
