import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

function About() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2>{t('about.mainTitle')}</h2>
            
            <p>
              {t('about.history')}
            </p>
            
            <p>
              {t('about.capacity')}
            </p>
            
            <p>
              {t('about.events')}
            </p>
            
            <p>
              {t('about.smoking')}
            </p>
            
            <p>
              {t('about.beer')}
            </p>
            
            <p>
              {t('about.welcome')}
            </p>
            
            <p className="about-signature">
              {t('about.visit')}
            </p>
            
            <div className="about-highlight">
              <h3>{t('about.dailyMenuTitle')}</h3>
              <p>{t('about.dailyMenuDesc')}</p>
              <button 
                onClick={() => navigate('/menu')} 
                className="menu-link-btn"
              >
                {t('about.showMenu')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
