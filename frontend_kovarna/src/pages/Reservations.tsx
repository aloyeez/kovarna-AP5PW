import { useState, useEffect } from "react";
import { reservationService, type ReservationSlot } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import './Reservations.css'
export default function ReservationPage() {
  const [step, setStep] = useState<"date" | "form">("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<ReservationSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ReservationSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
      setError('Failed to fetch available time slots');
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
      alert("Reservation submitted successfully! We'll confirm by email.");
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
      setError('Failed to submit reservation');
      console.error('Error submitting reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservations-container">
      <div className="reservation-card">
        <h2>Rezervace stolu</h2>

        {step === "date" && (
          <div>
            <div>
              <label htmlFor="date">
                Vyberte datum
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            {selectedDate && (
              <div>
                <label>
                  Vyberte čas
                </label>
                {loading ? (
                  <div>Loading available slots...</div>
                ) : error ? (
                  <div style={{ color: 'red' }}>{error}</div>
                ) : availableSlots.length === 0 ? (
                  <div>No available slots for this date</div>
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
                Pokračovat
              </button>
            )}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">
                Celé jméno
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Vaše jméno"
              />
            </div>
            <div>
              <label htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="vas.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone">
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+420 xxx xxx xxx"
              />
            </div>
            <div>
              <label htmlFor="guests">
                Počet hostů
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'osoba' : num < 5 ? 'osoby' : 'osob'}
                  </option>
                ))}
              </select>
            </div>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Potvrdit rezervaci'}
            </button>
          </form>
        )}
      </div>
    </div>
    
  );
}