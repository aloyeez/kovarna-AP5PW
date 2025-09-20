import './Footer.css'
import { useLanguage } from '../contexts/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t('footer.title')}</h3>
            <p>{t('footer.subtitle')}</p>
            {/* <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="TripAdvisor">⭐</a> 
            </div> */}
          </div>
          
          <div className="footer-section">
            <h4>{t('footer.contact')}</h4>
            <p>{t('footer.address')}</p>
            <p>{t('footer.phone')}</p>
            <p>{t('footer.email')}</p>
          </div>
          
          <div className="footer-section">
<<<<<<< HEAD
            <h4>Otevírací doba</h4>
            <p>Po-Čt: 11:00 - 14:00 | 17:00 - 22:00</p>
            <p>Pá-So: 11:00 - 14:00 | 17:00 - 22:00</p>
            <p>Ne: 18:00 - 22:00</p>
=======
            <h4>{t('footer.openingHours')}</h4>
            <p>{t('footer.mondayThursday')}</p>
            <p>{t('footer.friday')}</p>
            <p>{t('footer.saturday')}</p>
            <p>{t('footer.sunday')}</p>
>>>>>>> d1b75d4bf1256bb975826898643705f674851323
          </div>
          
          <div className="footer-section">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><a href="/menu">{t('footer.menu')}</a></li>
              <li><a href="/about">{t('footer.about')}</a></li>
              <li><a href="/contact">{t('footer.contactLink')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
          <div className="footer-links">
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer