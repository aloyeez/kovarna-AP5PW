import { useState } from "react";
import './Reservations.css'
export default function ReservationPage() {
  const [step, setStep] = useState<"date" | "form">("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
  });

  const availableSlots = [
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation submitted", {
      ...formData,
      selectedDate,
      selectedTime,
    });
    alert("Reservation submitted! We'll confirm by email.");
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
                <div className="time-slot-grid">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot-btn ${
                        selectedTime === slot ? "selected" : ""
                      }`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button
                className="primary"
                onClick={() => setStep("form")}
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
            <button type="submit">
              Potvrdit rezervaci
            </button>
          </form>
        )}
      </div>
    </div>
    
  );
}