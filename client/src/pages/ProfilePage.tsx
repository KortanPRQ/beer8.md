import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
import './ProfilePage.css';

interface Coupon {
  user_coupon_id: number;
  code: string;
  type: string;
  value: number;
  qr_code_url: string;
  valid_until: string;
  used_at: string | null;
  combo_description: string | null;
}

interface Reservation {
  id: number;
  reservation_number: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  status: string;
  zone_name: string;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (activeTab === 'coupons') {
      fetchCoupons();
    } else if (activeTab === 'reservations') {
      fetchReservations();
    }
  }, [user, activeTab, navigate]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/coupons/my-coupons', { withCredentials: true });
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reservations/user/my-reservations', { withCredentials: true });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <h1 className="profile-title">{t('profile.title')}</h1>
          <p className="profile-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
              <span className="user-role">{user.role}</span>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                {t('profile.myInfo')}
              </button>
              <button
                className={`nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setActiveTab('reservations')}
              >
                {t('profile.myReservations')}
              </button>
              <button
                className={`nav-btn ${activeTab === 'coupons' ? 'active' : ''}`}
                onClick={() => setActiveTab('coupons')}
              >
                {t('profile.myCoupons')}
              </button>
              <button
                className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                {t('profile.settings')}
              </button>
              <button className="nav-btn logout-btn" onClick={logout}>
                {t('nav.logout')}
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-content">
            {activeTab === 'info' && (
              <div className="tab-content">
                <h2>{t('profile.myInfo')}</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Name:</strong>
                    <p>{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-item">
                    <strong>Role:</strong>
                    <p className="capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="tab-content">
                <h2>{t('profile.myReservations')}</h2>
                {loading ? (
                  <div className="loading-container">
                    <div className="loading"></div>
                  </div>
                ) : reservations.length === 0 ? (
                  <p className="empty-message">No reservations yet</p>
                ) : (
                  <div className="reservations-list">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="reservation-card card">
                        <div className="reservation-header">
                          <span className="reservation-number">{reservation.reservation_number}</span>
                          <span className={`status-badge ${reservation.status}`}>
                            {reservation.status}
                          </span>
                        </div>
                        <div className="reservation-details">
                          <p><strong>Date:</strong> {new Date(reservation.reservation_date).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {reservation.reservation_time}</p>
                          <p><strong>Guests:</strong> {reservation.number_of_guests}</p>
                          <p><strong>Zone:</strong> {t(`reservations.zones.${reservation.zone_name}`)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'coupons' && (
              <div className="tab-content">
                <h2>{t('profile.myCoupons')}</h2>
                {loading ? (
                  <div className="loading-container">
                    <div className="loading"></div>
                  </div>
                ) : coupons.length === 0 ? (
                  <p className="empty-message">No coupons available</p>
                ) : (
                  <div className="coupons-grid">
                    {coupons.map((coupon) => (
                      <div key={coupon.user_coupon_id} className="coupon-card card">
                        <div className="coupon-header">
                          <h3>{coupon.code}</h3>
                          {coupon.used_at && <span className="used-badge">Used</span>}
                        </div>
                        <div className="coupon-details">
                          <p className="coupon-value">
                            {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${coupon.value} MDL OFF`}
                          </p>
                          {coupon.combo_description && (
                            <p className="coupon-description">{coupon.combo_description}</p>
                          )}
                          <p className="coupon-expiry">
                            Valid until: {new Date(coupon.valid_until).toLocaleDateString()}
                          </p>
                        </div>
                        {coupon.qr_code_url && !coupon.used_at && (
                          <div className="coupon-qr">
                            <img src={coupon.qr_code_url} alt="QR Code" />
                            <p>Show this at the restaurant</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="tab-content">
                <h2>{t('profile.settings')}</h2>
                <p>Settings page coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
