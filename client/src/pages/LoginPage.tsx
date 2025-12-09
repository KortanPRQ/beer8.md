import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px' }}>
      <h1>{t('nav.login')}</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('auth.email')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>{t('auth.password')}</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              style={{ width: 'auto' }}
            />
            {t('auth.rememberMe')}
          </label>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          {t('auth.loginButton')}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        {t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link>
      </p>
    </div>
  );
};

export default LoginPage;
