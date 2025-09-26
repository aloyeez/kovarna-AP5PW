import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService } from '../services/authService'

interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
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
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const data = await authService.login({ username, password })
      const { token: authToken, user: userData } = data

      setToken(authToken)
      setUser(userData)

      // Save to localStorage
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await authService.register(userData)

      // Check if response includes token (auto-login after registration)
      if ('token' in response) {
        // Full auth response with token
        const { token: authToken, user: userData } = response
        setToken(authToken)
        setUser(userData)
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('auth_user', JSON.stringify(userData))
        return true // Auto-login successful
      } else {
        // User-only response (need to login separately)
        setUser(response)
        localStorage.setItem('auth_user', JSON.stringify(response))
        return false // Need to login manually
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    await authService.logout()
    setUser(null)
    setToken(null)
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
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