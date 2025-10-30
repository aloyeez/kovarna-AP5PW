import { useState, useEffect } from 'react'
import { reservationService, type ReservationResponse } from '../services/reservationService'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './MyReservations.css'

export default function MyReservations() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reservationService.getUserReservations()
      // Sort by date descending (newest first)
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })
      setReservations(sorted)
    } catch (err: any) {
      setError(err.message || t('reservations.fetchError'))
      console.error('Error fetching reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id: number) => {
    if (!window.confirm(t('reservations.myReservations.cancelConfirm') || 'Are you sure you want to cancel this reservation?')) {
      return
    }

    try {
      await reservationService.cancelReservation(id)
      // Refresh the list
      await fetchReservations()
    } catch (err: any) {
      setError(err.message || t('reservations.submitError'))
      console.error('Error canceling reservation:', err)
    }
  }

  const isUpcoming = (reservation: ReservationResponse): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reservationDate = new Date(reservation.date)
    return reservationDate >= today && reservation.status === 'ACTIVE'
  }

  const isPast = (reservation: ReservationResponse): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reservationDate = new Date(reservation.date)
    return reservationDate < today
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string): string => {
    return timeString.substring(0, 5)
  }

  const upcomingReservations = reservations.filter(isUpcoming)
  const pastReservations = reservations.filter(r => !isUpcoming(r))

  if (loading) {
    return (
      <div className="my-reservations-container">
        <div className="my-reservations-card">
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-reservations-container">
      <div className="my-reservations-card">
        <h1>{t('reservations.myReservations.title') || 'My Reservations'}</h1>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="no-reservations">
            <div className="no-reservations-icon">📅</div>
            <p>{t('reservations.myReservations.noReservations') || 'You have no reservations yet.'}</p>
            <a href="/reservations" className="btn-primary">
              {t('reservations.makeReservation') || 'Make a Reservation'}
            </a>
          </div>
        ) : (
          <>
            {/* Upcoming Reservations */}
            {upcomingReservations.length > 0 && (
              <div className="reservations-section">
                <h2 className="section-title">
                  {t('reservations.myReservations.upcoming') || 'Upcoming Reservations'}
                </h2>
                <div className="reservations-list">
                  {upcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="reservation-item upcoming">
                      <div className="reservation-header">
                        <div className="reservation-date">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                          {reservation.status}
                        </span>
                      </div>

                      <div className="reservation-details">
                        <div className="detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>{formatTime(reservation.slotFrom)} - {formatTime(reservation.slotTo)}</span>
                        </div>

                        <div className="detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>
                            {reservation.guestCount} {reservation.guestCount === 1
                              ? t('reservations.person')
                              : reservation.guestCount < 5
                                ? t('reservations.people')
                                : t('reservations.people2')}
                          </span>
                        </div>

                        <div className="detail-item reservation-id">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span className="reservation-id-text">
                            {t('reservations.myReservations.reservationId') || 'ID'}: {reservation.reservationId}
                          </span>
                        </div>
                      </div>

                      <div className="reservation-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          {t('reservations.myReservations.cancel') || 'Cancel Reservation'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Reservations */}
            {pastReservations.length > 0 && (
              <div className="reservations-section">
                <h2 className="section-title">
                  {t('reservations.myReservations.past') || 'Past Reservations'}
                </h2>
                <div className="reservations-list">
                  {pastReservations.map((reservation) => (
                    <div key={reservation.id} className={`reservation-item past ${reservation.status.toLowerCase()}`}>
                      <div className="reservation-header">
                        <div className="reservation-date">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                          {reservation.status}
                        </span>
                      </div>

                      <div className="reservation-details">
                        <div className="detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>{formatTime(reservation.slotFrom)} - {formatTime(reservation.slotTo)}</span>
                        </div>

                        <div className="detail-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>
                            {reservation.guestCount} {reservation.guestCount === 1
                              ? t('reservations.person')
                              : reservation.guestCount < 5
                                ? t('reservations.people')
                                : t('reservations.people2')}
                          </span>
                        </div>

                        <div className="detail-item reservation-id">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span className="reservation-id-text">
                            {t('reservations.myReservations.reservationId') || 'ID'}: {reservation.reservationId}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
