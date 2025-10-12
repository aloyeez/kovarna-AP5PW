import { useState, useEffect } from "react";
import { reservationService, type ReservationSlot } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Reservations.css'

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function ReservationPage() {
  const [step, setStep] = useState<"date" | "form">("date");
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedSlot, setSelectedSlot] = useState<ReservationSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ReservationSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'fetch' | 'submit' | null>(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    guests: 1,
  });

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const slots = await reservationService.getAvailableSlots(selectedDate);
      setAvailableSlots(slots.filter(slot => slot.isAvailable));
    } catch (err) {
      setError('fetch');
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    setError(null);
    try {
      await reservationService.createReservation({
        slotId: selectedSlot.id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        numberOfGuests: formData.guests,
      });
      alert(t('reservations.successMessage'));
      // Reset form
      setStep("date");
      setSelectedDate("");
      setSelectedSlot(null);
      setFormData({
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        phone: "",
        guests: 1,
      });
    } catch (err) {
      setError('submit');
      console.error('Error submitting reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservations-container">
      <div className="reservation-card">
        <h2>{t('reservations.title')}</h2>

        {step === "date" && (
          <div>
            <div>
              <label htmlFor="date">
                {t('reservations.selectDate')}
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(e) => setSelectedDate(e.target.value)}
                onClick={(e) => {
                  try {
                    (e.target as HTMLInputElement).showPicker?.();
                  } catch (error) {
                    // showPicker not supported in this browser
                  }
                }}
                onKeyDown={(e) => {
                  // Allow tab and arrow keys, prevent typing numbers
                  if (e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
                required
              />
            </div>

            {selectedDate && (
              <div>
                <label>
                  {t('reservations.selectTime')}
                </label>
                {loading ? (
                  <div className="loading-message">
                    <div className="loading-spinner"></div>
                    <p>{t('reservations.loading')}</p>
                  </div>
                ) : error ? (
                  <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <p>{error === 'fetch' ? t('reservations.fetchError') : t('reservations.submitError')}</p>
                    <span className="error-hint">{error === 'fetch' ? t('reservations.fetchErrorHint') : t('reservations.submitErrorHint')}</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="no-slots-message">
                    <div className="no-slots-icon">📅</div>
                    <p>{t('reservations.noSlots')}</p>
                    <span className="no-slots-hint">{t('reservations.noSlotsHint')}</span>
                  </div>
                ) : (
                  <div className="time-slot-grid">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        className={`time-slot-btn ${
                          selectedSlot?.id === slot.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {new Date(slot.startTime).toLocaleTimeString('cs-CZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedDate && selectedSlot && (
              <button
                className="primary"
                onClick={() => setStep("form")}
                disabled={loading}
              >
                {t('reservations.continue')}
              </button>
            )}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">
                {t('reservations.fullName')}
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('reservations.namePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="email">
                {t('reservations.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('reservations.emailPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="phone">
                {t('reservations.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder={t('reservations.phonePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="guests">
                {t('reservations.guestsLabel')}
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? t('reservations.person') : num < 5 ? t('reservations.people') : t('reservations.people2')}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <p>{error === 'submit' ? t('reservations.submitError') : t('reservations.fetchError')}</p>
                <span className="error-hint">{error === 'submit' ? t('reservations.submitErrorHint') : t('reservations.fetchErrorHint')}</span>
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? t('reservations.processing') : t('reservations.confirmReservation')}
            </button>
          </form>
        )}
      </div>
    </div>
    
  );
}