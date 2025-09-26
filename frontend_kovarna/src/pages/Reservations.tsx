import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './Reservations.css'

interface ReservationFormData {
  date: string
  time: string
  guests: number
  specialRequests: string
  name: string
  phone: string
  email: string
}

function Reservations() {
  const [formData, setFormData] = useState<ReservationFormData>({
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    name: '',
    phone: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user, token } = useAuth()
  const { t } = useLanguage()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch('http://markoshub.com:6913/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          datetime: `${formData.date}T${formData.time}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create reservation')
      }

      setSuccess(t('reservations.success'))
      setFormData({
        date: '',
        time: '',
        guests: 2,
        specialRequests: '',
        name: '',
        phone: '',
        email: ''
      })
    } catch (err: any) {
      setError(err.message || t('reservations.error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Generate time options (restaurant opening hours)
  const timeOptions = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ]

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h1>{t('reservations.title')}</h1>
      </div>

      <div className="reservations-content">
        <div className="reservation-form-card">
          <form onSubmit={handleSubmit} className="reservation-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">{t('reservations.date')} *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={minDate}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">{t('reservations.time')} *</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">{t('reservations.time')}</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="guests">{t('reservations.guests')} *</label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">{t('reservations.name')} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('reservations.phone')} *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="+420 xxx xxx xxx"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('reservations.email')} *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder={user?.email || ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">{t('reservations.specialRequests')}</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                placeholder="Any dietary restrictions, special occasions, or other requests..."
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading || !formData.date || !formData.time || !formData.name || !formData.phone || !formData.email}
            >
              {isLoading ? t('common.loading') : t('reservations.submitButton')}
            </button>
          </form>
        </div>

        <div className="reservation-info">
          <div className="info-card">
            <h3>{t('contact.openingHoursTitle')}</h3>
            <div className="opening-hours">
              <div className="day-hours">
                <span className="day">{t('contact.mondayThursday')}</span>
              </div>
              <div className="day-hours">
                <span className="day">{t('contact.friday')}</span>
              </div>
              <div className="day-hours">
                <span className="day">{t('contact.saturday')}</span>
              </div>
              <div className="day-hours">
                <span className="day">{t('contact.sunday')}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>{t('contact.phoneTitle')}</h3>
            <p>{t('contact.mobileReservation')}<br />+420 775 954 945</p>
            <p className="note">{t('contact.phoneNote')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservations