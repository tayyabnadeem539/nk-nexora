import ContactForm from '../components/contact/ContactForm.jsx';
import ContactHero from '../components/contact/ContactHero.jsx';
import ContactInfo from '../components/contact/ContactInfo.jsx';
import LocationMap from '../components/contact/LocationMap.jsx';

export default function ContactPage() {
  return (
    <section className="content-section contact-page">
      <ContactHero />

      <div className="container contact-container">
        <div className="contact-grid">
          <ContactInfo />
          <ContactForm />
        </div>
        <LocationMap />
      </div>
    </section>
  );
}
