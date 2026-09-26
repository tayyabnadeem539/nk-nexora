const keyStyle = { color: 'var(--accent-gold)', fontWeight: 700 };
const rowStyle = { display: 'flex', alignItems: 'center', gap: 10 };

export default function ContactInfo() {
  return (
    <div className="contact-panel">
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Headquarters & Community Hub</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
        FandomVerse Digital Entertainment Lab<br />
        Tech Innovation District, Aptech Campus<br />
        Global Media Tower, Suite 404
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, marginBottom: 24 }}>
        <div style={rowStyle}>
          <span style={keyStyle}>Email:</span>
          <span style={{ color: 'var(--text-primary)' }}>editorial@fandomverse-portal.io</span>
        </div>
        <div style={rowStyle}>
          <span style={keyStyle}>Support:</span>
          <span style={{ color: 'var(--text-primary)' }}>community@fandomverse-portal.io</span>
        </div>
        <div style={rowStyle}>
          <span style={keyStyle}>GPS Coordinates:</span>
          <span style={{ fontFamily: 'monospace', color: 'var(--accent-green)', background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>34.0522° N, 118.2437° W</span>
        </div>
      </div>

      <div style={{ padding: 12, background: 'rgba(245, 197, 24, 0.08)', borderLeft: '3px solid var(--accent-gold)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-secondary)' }}>
        <strong>Operating Hours:</strong> 24/7 Global Editorial Coverage • Community Inquiries Answered within 24 Hours
      </div>
    </div>
  );
}
