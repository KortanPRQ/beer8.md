import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram } from 'react-icons/fi';
import './ContactsPage.css';

const ContactsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contacts-page">
      <div className="contacts-hero">
        <div className="container">
          <h1 className="contacts-title">{t('contacts.title')}</h1>
          <p className="contacts-subtitle">Get in touch with us</p>
        </div>
      </div>

      <div className="container">
        <div className="contacts-layout">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Visit Us</h2>
            
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">
                  <FiMapPin size={24} />
                </div>
                <div className="contact-details">
                  <h3>{t('contacts.address')}</h3>
                  <p>Strada Conev 34<br />Bălți MD-3100<br />Moldova</p>
                  <button className="btn-link" onClick={() => {
                    window.open('https://www.google.com/maps/search/Strada+Conev+34,+Bălți+MD-3100,+Moldova', '_blank');
                  }}>
                    Open in Maps →
                  </button>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FiPhone size={24} />
                </div>
                <div className="contact-details">
                  <h3>{t('contacts.phone')}</h3>
                  <p><a href="tel:+373612888880">+373 612 88 880</a></p>
                  <p className="contact-note">Call us for reservations</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FiMail size={24} />
                </div>
                <div className="contact-details">
                  <h3>{t('contacts.email')}</h3>
                  <p><a href="mailto:info@beer8.md">info@beer8.md</a></p>
                  <p className="contact-note">We reply within 24 hours</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FiClock size={24} />
                </div>
                <div className="contact-details">
                  <h3>{t('contacts.workingHours')}</h3>
                  <p>Monday – Sunday<br />12:00 – 01:00</p>
                  <p className="contact-note">Kitchen closes at 00:00</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a 
                  href="https://facebook.com/beer8md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link facebook"
                >
                  <FiFacebook size={24} />
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://instagram.com/beer8md" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link instagram"
                >
                  <FiInstagram size={24} />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>{t('contacts.sendMessage')}</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>{t('contacts.yourName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>{t('contacts.yourEmail')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label>{t('contacts.yourMessage')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Your message here..."
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? t('common.loading') : t('common.submit')}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2698.8!2d27.9286!3d47.7614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDQ1JzQxLjAiTiAyN8KwNTUnNDMuMCJF!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Beer8 Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
