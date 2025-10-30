import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService } from '../services/authService'

interface User {
  id: number
  username: string
  email: string
  enabled: boolean
  reservationDate: string // ISO date string (LocalDate)
  roles: string[] // e.g., ["ROLE_ADMIN", "ROLE_CUSTOMER"]
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (role: string) => boolean
  isAdmin: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load token from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        console.log('✅ User is logged in:', parsedUser.username)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        console.log('❌ User is NOT logged in (invalid saved data)')
      }
    } else {
      console.log('❌ User is NOT logged in (no saved session)')
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const data = await authService.login({ username, password })
      console.log('🔍 Backend response:', data)
      const { token: authToken, user: userData } = data

      setToken(authToken)
      setUser(userData)

      // Save to localStorage
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      console.log('✅ Login successful! User:', userData.username)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      await authService.register(userData)
      // Backend returns UserResponseDto only (no auto-login)
      // User must login separately after registration
      console.log('✅ Registration successful! Please login.')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    console.log('🚪 Logging out user')
    await authService.logout()
    setUser(null)
    setToken(null)
    console.log('❌ User is NOT logged in (logged out)')
  }

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false
    return user.roles.includes(role)
  }

  const isAdmin = user ? hasRole('ROLE_ADMIN') : false

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}