import { useState, useEffect, useRef } from 'react'
import DailyMenu from './DailyMenu'
import RegularMenu from './RegularMenu'
import Drinks from './Drinks'
import { 
  fetchDailyMenuFromSheet, 
  fetchRegularMenuFromSheet, 
  fetchDrinksFromSheet,
  organizeDailyMenuData,
  organizeRegularMenuData,
  organizeDrinksData
} from '../utils/googleSheets'
import type { 
  OrganizedDailyMenuData, 
  OrganizedRegularMenuData, 
  OrganizedDrinksData 
} from '../utils/googleSheets'
import { GOOGLE_SHEET_CONFIG } from '../config/sheets'
import { useLanguage } from '../contexts/LanguageContext'
import './Menu.css'

function Menu() {
  const [currentMenu, setCurrentMenu] = useState(0) // 0: Daily, 1: Regular, 2: Drinks
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()
  
  // Menu data state - store both languages
  const [menuData, setMenuData] = useState<{
    cz: {
      daily: Record<string, OrganizedDailyMenuData> | null
      regular: OrganizedRegularMenuData | null
      drinks: OrganizedDrinksData | null
    }
    en: {
      daily: Record<string, OrganizedDailyMenuData> | null
      regular: OrganizedRegularMenuData | null
      drinks: OrganizedDrinksData | null
    }
  }>({
    cz: { daily: null, regular: null, drinks: null },
    en: { daily: null, regular: null, drinks: null }
  })
  
  // Current language data (computed from menuData and current language)
  const dailyMenuData = menuData[language].daily
  const regularMenuData = menuData[language].regular
  const drinksData = menuData[language].drinks
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const menuNames = [t('menu.daily'), t('menu.regular'), t('menu.drinks')]

  // Fetch all menu data for both languages when component mounts
  useEffect(() => {
    const fetchAllMenuData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all menu data for both languages in parallel
        const [dailyCz, regularCz, drinksCz, dailyEn, regularEn, drinksEn] = await Promise.all([
          fetchDailyMenuFromSheet(GOOGLE_SHEET_CONFIG.fileId, 'cz', GOOGLE_SHEET_CONFIG),
          fetchRegularMenuFromSheet(GOOGLE_SHEET_CONFIG.fileId, 'cz', GOOGLE_SHEET_CONFIG),
          fetchDrinksFromSheet(GOOGLE_SHEET_CONFIG.fileId, 'cz', GOOGLE_SHEET_CONFIG),
          fetchDailyMenuFromSheet(GOOGLE_SHEET_CONFIG.fileId, 'en', GOOGLE_SHEET_CONFIG),
          fetchRegularMenuFromSheet(GOOGLE_SHEET_CONFIG.fileId, 'en', GOOGLE_SHEET_CONFIG),
          fetchDrinksFromSheet(GOOGLE_SHEET_CONFIG.fileId, 'en', GOOGLE_SHEET_CONFIG)
        ])
        
        // Organize the data for both languages
        const newMenuData = {
          cz: {
            daily: dailyCz ? organizeDailyMenuData(dailyCz) : null,
            regular: regularCz ? organizeRegularMenuData(regularCz) : null,
            drinks: drinksCz ? organizeDrinksData(drinksCz) : null
          },
          en: {
            daily: dailyEn ? organizeDailyMenuData(dailyEn) : null,
            regular: regularEn ? organizeRegularMenuData(regularEn) : null,
            drinks: drinksEn ? organizeDrinksData(drinksEn) : null
          }
        }
        
        setMenuData(newMenuData)
        
        // Check if any data failed to load
        if (!dailyCz && !regularCz && !drinksCz && !dailyEn && !regularEn && !drinksEn) {
          setError('Failed to fetch menu data')
        }
        
      } catch (err) {
        setError('Error loading menu data')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMenuData()
  }, [])

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentMenu < 2) {
      setCurrentMenu(currentMenu + 1)
    } else if (isRightSwipe && currentMenu > 0) {
      setCurrentMenu(currentMenu - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentMenu > 0) {
        setCurrentMenu(currentMenu - 1)
      } else if (e.key === 'ArrowRight' && currentMenu < 2) {
        setCurrentMenu(currentMenu + 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentMenu])

  const goToMenu = (index: number) => {
    setCurrentMenu(index)
  }

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="swipeable-menu-page">
        <div className="menu-navigation">
          <div className="menu-dots">
            {menuNames.map((name, index) => (
              <button
                key={index}
                className={`menu-dot ${index === currentMenu ? 'active' : ''}`}
                disabled
                aria-label={`Go to ${name}`}
              >
                <span className="dot"></span>
                <span className="dot-label">{name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="menu-container">
          <div className="current-menu">
            <div className="menu-page">
              <div className="menu-container">
                <h1 className="menu-title">{t('menu.loading')}</h1>
                <div className="menu-content">
                  <div className="loading-message">
                    <p>{t('menu.loading')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if data failed to load
  if (error) {
    return (
      <div className="swipeable-menu-page">
        <div className="menu-navigation">
          <div className="menu-dots">
            {menuNames.map((name, index) => (
              <button
                key={index}
                className={`menu-dot ${index === currentMenu ? 'active' : ''}`}
                disabled
                aria-label={`Go to ${name}`}
              >
                <span className="dot"></span>
                <span className="dot-label">{name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="menu-container">
          <div className="current-menu">
            <div className="menu-page">
              <div className="menu-container">
                <h1 className="menu-title">{t('menu.error')}</h1>
                <div className="menu-content">
                  <div className="error-message">
                    <p>{t('menu.error')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Function to render the current menu with appropriate props
  const renderCurrentMenu = () => {
    switch (currentMenu) {
      case 0: // Daily Menu
        return <DailyMenu dailyMenuData={dailyMenuData} />
      case 1: // Regular Menu
        return <RegularMenu regularMenuData={regularMenuData} />
      case 2: // Drinks
        return <Drinks drinksData={drinksData} />
      default:
        return <DailyMenu dailyMenuData={dailyMenuData} />
    }
  }

  return (
    <div className="swipeable-menu-page">
      {/* Menu Navigation Dots */}
      <div className="menu-navigation">
        <div className="menu-dots">
          {menuNames.map((name, index) => (
            <button
              key={index}
              className={`menu-dot ${index === currentMenu ? 'active' : ''}`}
              onClick={() => goToMenu(index)}
              aria-label={`Go to ${name}`}
            >
              <span className="dot"></span>
              <span className="dot-label">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Swipeable Menu Container */}
      <div 
        className="menu-container"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Current Menu */}
        <div className="current-menu">
          {loading ? (
            <div className="menu-page">
              <div className="menu-container">
                <h1 className="menu-title">{t('menu.loading')}</h1>
                <div className="menu-content">
                  <div className="loading-message">
                    <p>{t('menu.loading')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="menu-page">
              <div className="menu-container">
                <h1 className="menu-title">{t('menu.error')}</h1>
                <div className="menu-content">
                  <div className="error-message">
                    <p>{t('menu.error')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderCurrentMenu()
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="menu-arrows">
        <button 
          className={`nav-arrow left ${currentMenu === 0 ? 'disabled' : ''}`}
          onClick={() => currentMenu > 0 && setCurrentMenu(currentMenu - 1)}
          disabled={currentMenu === 0}
          aria-label="Previous menu"
        >
        </button>
        <button 
          className={`nav-arrow right ${currentMenu === 2 ? 'disabled' : ''}`}
          onClick={() => currentMenu < 2 && setCurrentMenu(currentMenu + 1)}
          disabled={currentMenu === 2}
          aria-label="Next menu"
        >
        </button>
      </div>
    </div>
  )
}

export default Menu
