
import { useLanguage } from '../contexts/LanguageContext'
import { useOpeningHours } from '../hooks/useOpeningHours'

function Contact() {
  const { t } = useLanguage()
  const { groupedHours, loading } = useOpeningHours()

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>{t('contact.mainTitle')}</h2>

            <div className="contact-details">
              <div className="contact-item">
                <h3>{t('contact.openingHoursTitle')}</h3>
                <div className="opening-hours">
                  {loading ? (
                    <div className="day-group">
                      <span className="time-value">Načítání...</span>
                    </div>
                  ) : (
                    groupedHours.map((group, index) => (
                      <div className="day-group" key={index}>
                        <span className="day-label">{group.daysLabel}:</span>
                        <span className="time-value">
                          {group.timeRange}
                          {group.note && <span className="hours-note"> ({group.note})</span>}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="contact-item features-box">
                <h3>{t('contact.featuresTitle')}</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon"><span>🍽️</span></span>
                    <span className="feature-text">{t('contact.dailyMenu')}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon"><span>☀️</span></span>
                    <span className="feature-text">{t('contact.outdoorSeating')}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon"><span>💳</span></span>
                    <span className="feature-text">{t('contact.cardsAccepted')}</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon"><span>🐕</span></span>
                    <span className="feature-text">{t('contact.petFriendly')}</span>
                  </div>
                </div>
              </div>

              <div className="contact-item">
                <h3>{t('contact.addressTitle')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('contact.addressText') }}></p>
                <p className="map-note">{t('contact.mapNote')}</p>
              </div>

              <div className="contact-item">
                <h3>{t('contact.phoneTitle')}</h3>
                <p><strong>{t('contact.mobileReservation')}</strong> 775 954 945</p>
                <p className="phone-note">{t('contact.phoneNote')}</p>
                <p><strong>{t('contact.mobileManager')}</strong> 606 717 668</p>
                <p><strong>Email:</strong> hospudka@ukovarny.cz</p>
              </div>
            </div>
          </div>

          <div className="media-container">
            <div className="map-section">
              <h3>{t('contact.mapSectionTitle')}</h3>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2605.5249839691837!2d17.670652576877867!3d49.22853507458658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4713735764a50473%3A0xd4ff190b0352d7!2zTGXFoWV0w61uIEkgNjEwLCA3NjAgMDEgWmzDrW4gMQ!5e0!3m2!1sen!2scz!4v1755289113502!5m2!1sen!2scz"
                  height={600}
                  style={{ border: 0, width: '100%' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hospůdka U Kovárny Zlín"
                ></iframe>
              </div>
            </div>

            <div className="social-media-section">
              <div className="facebook-plugin">
                <h4>{t('contact.facebookTitle')}</h4>
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fukovarny&tabs=timeline&width=450&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="500"
                  height="600"
                  style={{ border: 'none', overflow: 'hidden', width: '100%', maxWidth: '500px' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
