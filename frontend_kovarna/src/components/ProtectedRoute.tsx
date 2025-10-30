import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string // Optional role requirement (e.g., "ROLE_ADMIN")
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role requirement if specified
  if (requiredRole && !hasRole(requiredRole)) {
    // User doesn't have required role, redirect to home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute