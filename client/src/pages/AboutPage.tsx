import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('about.title')}</h1>
      <div style={{ maxWidth: '800px', margin: '2rem auto', lineHeight: '1.8' }}>
        <p>{t('about.mission')}</p>
      </div>
    </div>
  );
};

export default AboutPage;
