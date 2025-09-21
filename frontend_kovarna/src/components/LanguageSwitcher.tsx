import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.css'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'cz' ? 'en' : 'cz')
  }

  return (
    <div className="language-switcher">
      <button
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label={`Switch to ${language === 'cz' ? 'English' : 'Czech'}`}
      >
        <span className={`language-option ${language === 'cz' ? 'active' : 'inactive'}`}>
          CZ
        </span>
        <span className="language-separator">|</span>
        <span className={`language-option ${language === 'en' ? 'active' : 'inactive'}`}>
          EN
        </span>
      </button>
    </div>
  )
}

export default LanguageSwitcher
