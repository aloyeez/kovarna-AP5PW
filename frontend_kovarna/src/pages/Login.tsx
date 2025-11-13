import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './Login.css'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage)
      // Pre-fill username if provided from registration
      if (location.state.username) {
        setFormData(prev => ({
          ...prev,
          username: location.state.username
        }))
      }
    }
  }, [location.state])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData.username, formData.password)
      toast.success(t('auth.login.successMessage'))
      navigate(from, { replace: true })
    } catch (err: any) {
      // Map backend error messages to translated messages
      const errorMessage = err.message === 'Bad credentials'
        ? t('auth.login.invalidCredentials')
        : err.message || t('auth.login.error')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{t('auth.login.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.login.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>


          <button
            type="submit"
            className="login-button"
            disabled={isLoading || !formData.username || !formData.password}
          >
            {isLoading ? t('common.loading') : t('auth.login.loginButton')}
          </button>

          <div className="signup-link">
            <p>
              {t('auth.login.noAccount')} {' '}
              <Link to="/signup" state={{ from: location.state?.from }}>
                {t('auth.login.signUpLink')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login