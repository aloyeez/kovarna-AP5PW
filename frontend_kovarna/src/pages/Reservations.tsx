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
      setAvailableSlots(slots.filter(slot => slot.active));
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
        date: selectedDate,
        guestCount: formData.guests,
      });
      alert(t('reservations.successMessage'));
      // Reset form
      setStep("date");
      setSelectedDate(getTodayDate());
      setSelectedSlot(null);
      setFormData({
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
                        {slot.slotFrom.substring(0, 5)} - {slot.slotTo.substring(0, 5)}
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
            <div className="reservation-summary">
              <h3>{t('reservations.confirmationTitle') || 'Reservation Confirmation'}</h3>
              <p><strong>{t('reservations.date') || 'Date'}:</strong> {selectedDate}</p>
              <p><strong>{t('reservations.time') || 'Time'}:</strong> {selectedSlot?.slotFrom.substring(0, 5)} - {selectedSlot?.slotTo.substring(0, 5)}</p>
              <p><strong>{t('reservations.username') || 'Username'}:</strong> {user?.username}</p>
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
                required
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
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep("date")} disabled={loading}>
                {t('common.back') || 'Back'}
              </button>
              <button type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? t('reservations.processing') : t('reservations.confirmReservation')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    
  );
}