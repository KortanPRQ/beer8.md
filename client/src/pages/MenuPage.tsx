import { useTranslation } from 'react-i18next';

const MenuPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('menu.title')}</h1>
      <p>Menu page - Coming soon with all 18 categories</p>
    </div>
  );
};

export default MenuPage;
