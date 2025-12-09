import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <p>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <h1>{t('profile.title')}</h1>
      <div style={{ marginTop: '2rem' }}>
        <h2>{t('profile.myInfo')}</h2>
        <p>Name: {user.firstName} {user.lastName}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <button onClick={logout} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
