import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('nav.blog')}</h1>
      <p>Blog page - Coming soon</p>
    </div>
  );
};

export default BlogPage;
