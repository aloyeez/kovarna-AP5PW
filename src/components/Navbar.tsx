import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import logo from '@/assets/logo.png'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { t } = useLanguage()
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

        {/* Hamburger menu button for mobile */}
        <button 
          ref={hamburgerRef}
          className="hamburger-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          ≡
        </button>

        {/* Desktop navigation */}
        <div className="navbar-buttons desktop-only">
          <button type="button" onClick={() => navigate('/')} aria-label="Home">
            {t('nav.home')}
          </button>
          <button type="button" onClick={() => navigate('/menu')} aria-label="Menu">
            {t('nav.menu')}
          </button>
          <button type="button" onClick={() => navigate('/about')} aria-label="About">
            {t('nav.about')}
          </button>
          <button type="button" onClick={() => navigate('/contact')} aria-label="Contact">
            {t('nav.contact')}
          </button>
          <LanguageSwitcher />
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
                <button type="button" onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} aria-label="About">
                  {t('nav.about')}
                </button>
                <button type="button" onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }} aria-label="Contact">
                  {t('nav.contact')}
                </button>
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


