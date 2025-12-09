import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Logo & Description */}
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <span className="logo-text">B8</span>
            </Link>
            <p className="footer-description">
              {t('hero.subtitle')}
            </p>
            <div className="footer-social">
              <a
                href="https://facebook.com/beer8md"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="https://instagram.com/beer8md"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <FiInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-title">{t('contacts.title')}</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <FiMapPin size={18} />
                <span>{t('footer.address')}</span>
              </div>
              <div className="contact-item">
                <FiPhone size={18} />
                <a href="tel:+373612888880">{t('footer.phone')}</a>
              </div>
              <div className="contact-item">
                <FiMail size={18} />
                <a href="mailto:info@beer8.md">info@beer8.md</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('contacts.workingHours')}:</span>
                <span>{t('footer.workingHours')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">{t('nav.menu')}</h4>
            <ul className="footer-links">
              <li><Link to="/menu">{t('nav.menu')}</Link></li>
              <li><Link to="/reservations">{t('nav.reservations')}</Link></li>
              <li><Link to="/gallery">{t('nav.gallery')}</Link></li>
              <li><Link to="/blog">{t('nav.blog')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/contacts">{t('nav.contacts')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms">{t('footer.termsOfUse')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
