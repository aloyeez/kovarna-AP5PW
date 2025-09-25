import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import './SignUp.css'

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (formData.username.length < 3) {
      newErrors.push('Username must be at least 3 characters long')
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Please enter a valid email address')
    }

    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long')
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match')
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      navigate(from, { replace: true })
    } catch (err: any) {
      setErrors([err.message || t('auth.signup.error')])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>{t('auth.signup.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {errors.length > 0 && (
            <div className="error-message">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}


          <div className="form-group">
            <label htmlFor="username">{t('auth.signup.username')} *</label>
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
            <label htmlFor="email">{t('auth.signup.email')} *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.signup.password')} *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.signup.confirmPassword')} *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
          >
            {isLoading ? t('common.loading') : t('auth.signup.signupButton')}
          </button>

          <div className="login-link">
            <p>
              {t('auth.signup.hasAccount')} {' '}
              <Link to="/login" state={{ from: location.state?.from }}>
                {t('auth.signup.loginLink')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp