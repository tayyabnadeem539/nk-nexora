/* Demo Sign In / Create Account dialog (UI only — no real authentication). */
import { useRef } from 'react';
import { useUI } from '../../context/UIContext.jsx';
import { notify } from '../../services/notificationService.js';
import ModalShell from './ModalShell.jsx';

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 };
const fieldStyle = { width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: '#fff' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: 14 };
const tabStyle = { flex: 1, borderRadius: 'var(--radius-sm)', textAlign: 'center' };

function Field({ label, ...inputProps }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input required style={fieldStyle} {...inputProps} />
    </div>
  );
}

export default function AuthModal() {
  const { modal, setModal, closeAllModals, setLoggedIn } = useUI();
  const active = modal?.type === 'auth';

  const tabRef = useRef('login');
  if (active) tabRef.current = modal.tab || 'login';
  const tab = tabRef.current;

  const switchTab = (t) => setModal({ type: 'auth', tab: t });

  const handleSubmit = (e, action) => {
    e.preventDefault();
    notify({
      type: 'success',
      title: action === 'signin' ? 'Welcome back, FanExplorer!' : 'Account Created',
      message: 'You are now signed in as a demo FandomVerse member. Authentication is simulated.'
    });
    closeAllModals();
    setLoggedIn(true);
  };

  return (
    <ModalShell id="authModal" active={active} containerStyle={{ maxWidth: 440, padding: 28 }} closeLabel="Close dialog">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>FANDOM<span style={{ color: 'var(--accent-gold)' }}>VERSE</span></div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Join the Universal Fandom Community</div>
      </div>

      <div className="demo-disclaimer-box" style={{ marginBottom: 18 }}>
        <strong>Demonstration UI Only:</strong> Authentication is simulated on client-side. No passwords or accounts are stored on any database per SRS constraints.
      </div>

      <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: 4, marginBottom: 20 }}>
        <button type="button" className={`filter-pill ${tab === 'login' ? 'active' : ''}`} style={tabStyle} onClick={() => switchTab('login')}>Sign In</button>
        <button type="button" className={`filter-pill ${tab === 'signup' ? 'active' : ''}`} style={tabStyle} onClick={() => switchTab('signup')}>Create Account</button>
      </div>

      {tab === 'login' ? (
        <form key="login" onSubmit={(e) => handleSubmit(e, 'signin')} style={formStyle}>
          <Field label="Email Address" type="email" placeholder="fan@fandomverse.io" defaultValue="demo.fan@fandomverse.io" />
          <Field label="Password" type="password" placeholder="••••••••" defaultValue="demo1234" />
          <button type="submit" className="btn-hero-primary" style={{ justifyContent: 'center', marginTop: 6 }}>Sign In (Demo)</button>
        </form>
      ) : (
        <form key="signup" onSubmit={(e) => handleSubmit(e, 'signup')} style={formStyle}>
          <Field label="Username" type="text" placeholder="FandomHero99" />
          <Field label="Email Address" type="email" placeholder="hero@example.com" />
          <Field label="Password" type="password" placeholder="••••••••" />
          <button type="submit" className="btn-hero-primary" style={{ justifyContent: 'center', marginTop: 6 }}>Create Free Account (Demo)</button>
        </form>
      )}
    </ModalShell>
  );
}
