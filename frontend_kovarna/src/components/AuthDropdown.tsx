import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './AuthDropdown.css'

function AuthDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setError('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData.username, formData.password)
      setIsOpen(false)
      setFormData({ username: '', password: '', rememberMe: false })

      // Redirect to reservations if they were trying to access it
      const from = location.pathname
      if (from === '/reservations') {
        // Stay on current page (will now show reservations since authenticated)
      } else {
        // Could redirect to a welcome page or stay where they are
      }
    } catch (err: any) {
      setError(err.message || t('auth.login.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpClick = () => {
    setIsOpen(false)
    navigate('/signup', { state: { from: location } })
  }

  const handleForgotPasswordClick = () => {
    setIsOpen(false)
    navigate('/forgot-password')
  }

  return (
    <div className="auth-dropdown-container">
      <button
        ref={buttonRef}
        className="auth-cta-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sign In"
        aria-expanded={isOpen}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="auth-icon">
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

      {isOpen && (
        <div ref={dropdownRef} className="auth-dropdown-menu">
          <div className="auth-dropdown-header">
            <h3>{t('auth.dropdown.title')}</h3>
            <p>{t('auth.dropdown.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-dropdown-form">
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="form-field">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('auth.login.username')}
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="form-field">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.login.password')}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span>{t('auth.dropdown.rememberMe')}</span>
              </label>

              <button
                type="button"
                className="forgot-link"
                onClick={handleForgotPasswordClick}
                disabled={isLoading}
              >
                {t('auth.dropdown.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              className="dropdown-login-button"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? t('common.loading') : t('auth.login.loginButton')}
            </button>
          </form>

          <div className="auth-dropdown-divider">
            <span>{t('auth.dropdown.or')}</span>
          </div>

          <div className="auth-dropdown-signup">
            <p>{t('auth.dropdown.newCustomer')}</p>
            <button
              className="signup-cta-button"
              onClick={handleSignUpClick}
              disabled={isLoading}
            >
              {t('auth.dropdown.createAccount')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthDropdown