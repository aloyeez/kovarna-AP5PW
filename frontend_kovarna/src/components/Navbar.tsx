import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import logo from '@/assets/logo.png'
import LanguageSwitcher from './LanguageSwitcher'
import UserDropdown from './UserDropdown'
import AuthDropdown from './AuthDropdown'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="Home">
          <img src={logo} alt="Hospůdka U Kovárny logo" />
        </Link>

        {/* Mobile controls - hamburger menu */}
        <div className="mobile-controls">
          <button
            ref={hamburgerRef}
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            ≡
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="navbar-content desktop-only">
          {/* Main navigation section */}
          <div className="navbar-nav">
            <button type="button" onClick={() => navigate('/')} aria-label="Home">
              {t('nav.home')}
            </button>
            <button type="button" onClick={() => navigate('/menu')} aria-label="Menu">
              {t('nav.menu')}
            </button>
            <button
              type="button"
              className="reservations-button"
              onClick={() => navigate('/reservations')}
              aria-label="Reservations"
            >
              {t('nav.reservations')}
            </button>
            <button type="button" onClick={() => navigate('/about')} aria-label="About">
              {t('nav.about')}
            </button>
            <button type="button" onClick={() => navigate('/contact')} aria-label="Contact">
              {t('nav.contact')}
            </button>
          </div>

          {/* Actions section */}
          <div className="navbar-actions">
            <div className="auth-section">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <AuthDropdown />
              )}
            </div>

            <div className="language-section">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Mobile navigation overlay */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              <div className="mobile-menu-items">
                <button type="button" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} aria-label="Home">
                  {t('nav.home')}
                </button>
                <button type="button" onClick={() => { navigate('/menu'); setIsMobileMenuOpen(false); }} aria-label="Menu">
                  {t('nav.menu')}
                </button>
                <button type="button" onClick={() => { navigate('/reservations'); setIsMobileMenuOpen(false); }} aria-label="Reservations">
                  {t('nav.reservations')}
                </button>
                <button type="button" onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} aria-label="About">
                  {t('nav.about')}
                </button>
                <button type="button" onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }} aria-label="Contact">
                  {t('nav.contact')}
                </button>

                {/* Mobile Authentication */}
                {!isAuthenticated && (
                  <div className="mobile-auth-buttons">
                    <button
                      type="button"
                      className="nav-button mobile-signin-button"
                      onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      aria-label="Sign In"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {t('nav.signIn')}
                    </button>
                    <button
                      type="button"
                      className="nav-button mobile-signup-button"
                      onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                      aria-label="Create Account"
                    >
                      {t('auth.dropdown.createAccount')}
                    </button>
                  </div>
                )}

                <div className="mobile-language-switcher">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar


