import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.css'

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (newLanguage: 'cz' | 'en') => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  const getLanguageFlag = (lang: 'cz' | 'en') => {
    if (lang === 'cz') {
      return (
        <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
          <rect width="20" height="7.5" fill="#fff"/>
          <rect y="7.5" width="20" height="7.5" fill="#d7141a"/>
          <polygon points="0,0 10,7.5 0,15" fill="#11457e"/>
        </svg>
      )
    } else {
      return (
        <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
          <rect width="20" height="15" fill="#012169"/>
          <path d="M0,0 L20,15 M20,0 L0,15" stroke="#fff" strokeWidth="3"/>
          <path d="M0,0 L20,15 M20,0 L0,15" stroke="#c8102e" strokeWidth="2"/>
          <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#fff" strokeWidth="5"/>
          <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#c8102e" strokeWidth="3"/>
        </svg>
      )
    }
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="language-flag">{getLanguageFlag(language)}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          <button
            className={`language-option ${language === 'cz' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('cz')}
          >
            <span className="language-flag">
              <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
                <rect width="20" height="7.5" fill="#fff"/>
                <rect y="7.5" width="20" height="7.5" fill="#d7141a"/>
                <polygon points="0,0 10,7.5 0,15" fill="#11457e"/>
              </svg>
            </span>
            <span className="language-name">Čeština</span>
          </button>
          <button
            className={`language-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            <span className="language-flag">
              <svg width="20" height="15" viewBox="0 0 20 15" className="flag-icon">
                <rect width="20" height="15" fill="#012169"/>
                <path d="M0,0 L20,15 M20,0 L0,15" stroke="#fff" strokeWidth="3"/>
                <path d="M0,0 L20,15 M20,0 L0,15" stroke="#c8102e" strokeWidth="2"/>
                <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#fff" strokeWidth="5"/>
                <path d="M10,0 L10,15 M0,7.5 L20,7.5" stroke="#c8102e" strokeWidth="3"/>
              </svg>
            </span>
            <span className="language-name">English</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher