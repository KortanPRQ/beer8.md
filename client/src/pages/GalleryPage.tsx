import { useTranslation } from 'react-i18next';

const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('nav.gallery')}</h1>
      <p>Gallery page - Coming soon</p>
    </div>
  );
};

export default GalleryPage;
