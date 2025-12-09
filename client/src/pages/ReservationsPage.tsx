import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ReservationsPage.css';

interface Zone {
  id: number;
  name_key: string;
  capacity: number;
  display_order: number;
}

const ReservationsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestName, setGuestName] = useState(user?.firstName + ' ' + user?.lastName || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (user) {
      setGuestName(`${user.firstName} ${user.lastName}`);
      setGuestEmail(user.email);
    }
  }, [user]);

  const fetchZones = async () => {
    try {
      const response = await axios.get('/api/reservations/zones');
      setZones(response.data.zones);
      if (response.data.zones.length > 0) {
        setSelectedZone(response.data.zones[0].id);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast.error('Failed to load zones');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedZone || !selectedTime) {
      toast.error('Please select a zone and time');
      return;
    }

    setLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const response = await axios.post('/api/reservations', {
        zoneId: selectedZone,
        guestName,
        guestEmail,
        guestPhone,
        reservationDate: formattedDate,
        reservationTime: selectedTime,
        numberOfGuests,
        specialRequests
      });

      toast.success('Reservation created successfully!');
      
      // Reset form
      setSelectedTime('');
      setNumberOfGuests(2);
      setSpecialRequests('');
      
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30'
  ];

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return (
    <div className="reservations-page">
      <div className="reservations-hero">
        <div className="container">
          <h1 className="reservations-title">{t('reservations.title')}</h1>
          <p className="reservations-subtitle">Book your table at Beer8</p>
        </div>
      </div>

      <div className="container">
        <div className="reservations-layout">
          <div className="reservation-form-container">
            <form onSubmit={handleSubmit} className="reservation-form">
              <h2>Make a Reservation</h2>

              {/* Calendar */}
              <div className="form-group">
                <label>{t('reservations.selectDate')}</label>
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  className="reservation-calendar"
                />
              </div>

              {/* Zone Selection */}
              <div className="form-group">
                <label>{t('reservations.selectZone')}</label>
                <div className="zone-grid">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      className={`zone-btn ${selectedZone === zone.id ? 'active' : ''}`}
                      onClick={() => setSelectedZone(zone.id)}
                    >
                      <span className="zone-name">{t(`reservations.zones.${zone.name_key}`)}</span>
                      <span className="zone-capacity">Max {zone.capacity} guests</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="form-group">
                <label>{t('reservations.selectTime')}</label>
                <div className="time-grid">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Guests */}
              <div className="form-group">
                <label>{t('reservations.numberOfGuests')}</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                  required
                />
              </div>

              {/* Guest Information */}
              <div className="form-group">
                <label>{t('reservations.guestName')}</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('reservations.guestEmail')}</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('reservations.guestPhone')}</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  placeholder="+373 XXX XXX XX"
                />
              </div>

              {/* Special Requests */}
              <div className="form-group">
                <label>{t('reservations.specialRequests')}</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                  placeholder="Any special requirements or dietary restrictions..."
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? t('common.loading') : t('reservations.submit')}
              </button>
            </form>
          </div>

          <div className="reservation-info">
            <div className="info-card">
              <h3>Restaurant Information</h3>
              <div className="info-item">
                <strong>Address:</strong>
                <p>Strada Conev 34, Bălți MD-3100, Moldova</p>
              </div>
              <div className="info-item">
                <strong>Phone:</strong>
                <p>+373 612 88 880</p>
              </div>
              <div className="info-item">
                <strong>Working Hours:</strong>
                <p>Mon–Sun 12:00–01:00</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Reservation Policy</h3>
              <ul>
                <li>Please arrive within 15 minutes of your reservation time</li>
                <li>Reservations are held for 15 minutes</li>
                <li>For groups of 10 or more, please call us directly</li>
                <li>Cancellations should be made at least 2 hours in advance</li>
              </ul>
            </div>

            <div className="info-card zone-descriptions">
              <h3>Our Zones</h3>
              <div className="zone-desc">
                <h4>Bar</h4>
                <p>Perfect for casual drinks and quick bites. Great atmosphere for socializing.</p>
              </div>
              <div className="zone-desc">
                <h4>Main Hall</h4>
                <p>Our spacious dining area with comfortable seating for families and groups.</p>
              </div>
              <div className="zone-desc">
                <h4>Terrace</h4>
                <p>Outdoor seating with a beautiful view. Available in good weather.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
