import { useTranslation } from 'react-i18next';

const ReservationsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('reservations.title')}</h1>
      <p>Reservations page - Coming soon</p>
    </div>
  );
};

export default ReservationsPage;
