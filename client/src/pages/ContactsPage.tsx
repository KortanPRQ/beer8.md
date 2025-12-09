import { useTranslation } from 'react-i18next';

const ContactsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('contacts.title')}</h1>
      <p>Contacts page - Coming soon</p>
    </div>
  );
};

export default ContactsPage;
