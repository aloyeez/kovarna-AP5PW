import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import czTranslations from '../translations/cz.json'
import enTranslations from '../translations/en.json'

// Define the type for our translations
type Translations = typeof czTranslations

// Define the language context type
interface LanguageContextType {
  language: 'cz' | 'en'
  setLanguage: (lang: 'cz' | 'en') => void
  t: (key: string) => string
  currentTranslations: Translations
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language provider component
interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get language from localStorage or default to English
  const [language, setLanguageState] = useState<'cz' | 'en'>(() => {
    const saved = localStorage.getItem('language')
    return (saved as 'cz' | 'en') || 'en'
  })

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  // Function to change language
  const setLanguage = (lang: 'cz' | 'en') => {
    setLanguageState(lang)
  }

  // Get current translations
  const currentTranslations = language === 'cz' ? czTranslations : enTranslations

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = currentTranslations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Return the key if translation not found
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    currentTranslations
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}