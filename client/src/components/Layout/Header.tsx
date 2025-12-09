import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FiSun, FiMoon, FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
    setTheme(newTheme);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/menu', label: t('nav.menu') },
    { path: '/about', label: t('nav.about') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/reservations', label: t('nav.reservations') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="header-logo">
          <span className="logo-text">B8</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="header-controls">
          {/* Language Switcher */}
          <div className="language-switcher">
            <button
              className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
              onClick={() => changeLanguage('ru')}
            >
              RU
            </button>
            <button
              className={`lang-btn ${i18n.language === 'ro' ? 'active' : ''}`}
              onClick={() => changeLanguage('ro')}
            >
              RO
            </button>
            <button
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="icon-btn cart-btn">
            <FiShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="icon-btn">
                <FiUser size={20} />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="icon-btn mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                {t('nav.profile')}
              </Link>
              <button className="mobile-nav-link" onClick={() => { logout(); setIsMenuOpen(false); }}>
                {t('nav.logout')}
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
