import { useTranslation } from 'react-i18next';
import './HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <h1 className="hero-title fade-in">{t('hero.title')}</h1>
          <p className="hero-subtitle fade-in">{t('hero.subtitle')}</p>
          <button className="btn btn-primary btn-large">
            {t('hero.cta')}
          </button>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title text-center">{t('menu.title')}</h2>
          <p className="section-subtitle text-center">
            Discover our selection of craft beers and delicious food
          </p>
          <div className="grid grid-3">
            <div className="card feature-card">
              <h3>Premium Beers</h3>
              <p>Explore our selection of craft and imported beers</p>
            </div>
            <div className="card feature-card">
              <h3>Delicious Food</h3>
              <p>Perfectly paired dishes to complement your beer</p>
            </div>
            <div className="card feature-card">
              <h3>Cozy Atmosphere</h3>
              <p>Enjoy your time in our comfortable setting</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
