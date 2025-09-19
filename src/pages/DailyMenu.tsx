import { useState, useEffect } from 'react'
import { fetchDailyMenuFromSheet, organizeMenuDataByDay } from '../utils/googleSheets'
import type { OrganizedDayData } from '../utils/googleSheets'
import { GOOGLE_SHEET_URL } from '../config/sheets'

function DailyMenu() {
  const [menuData, setMenuData] = useState<Record<string, OrganizedDayData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true)
        const rawData = await fetchDailyMenuFromSheet(GOOGLE_SHEET_URL)
        
        if (rawData) {
          const organizedData = organizeMenuDataByDay(rawData)
          setMenuData(organizedData)
        } else {
          setError('Failed to fetch menu data')
        }
      } catch (err) {
        setError('Error loading menu data')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  if (loading) {
    return (
      <div className="menu-page">
        <div className="menu-container">
          <h1 className="menu-title">DENNÍ MENU</h1>
          <div className="menu-content">
            <div className="loading-message">
              <p>Načítání menu...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="menu-container">
          <h1 className="menu-title">DENNÍ MENU</h1>
          <div className="menu-content">
            <div className="error-message">
              <p>Chyba při načítání menu. Zkuste to prosím později.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!menuData || Object.keys(menuData).length === 0) {
    return (
      <div className="menu-page">
        <div className="menu-container">
          <h1 className="menu-title">DENNÍ MENU</h1>
          <div className="menu-content">
            <div className="no-data-message">
              <p>Žádná data menu nejsou k dispozici.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-page">
      <div className="menu-container">
        <h1 className="menu-title">DENNÍ MENU</h1>
        
        <div className="menu-content">
          {Object.values(menuData).map((dayData: OrganizedDayData, index: number) => (
            <div key={dayData.date}>
              <div className="menu-day">
                <h2 className="day-title">{dayData.day} {dayData.date}</h2>
                
                {dayData.info && (
                  <p className="no-menu-message">{dayData.info}</p>
                )}
                
                {dayData.specialOffers.length > 0 && (
                  <div className="menu-special-offer">
                    {dayData.specialOffers.map((offer: { message: string }, offerIndex: number) => (
                      <p key={offerIndex}><strong>{offer.message}</strong></p>
                    ))}
                  </div>
                )}
                
                {dayData.soups.length > 0 && (
                  <div className="menu-section">
                    <h3 className="section-title">Polévky</h3>
                    {dayData.soups.map((soup: { name: string; price: string; allergens: string }, soupIndex: number) => (
                      <div key={soupIndex} className="menu-item">
                        <div className="item-info">
                          <span className="item-name">{soup.name}</span>
                          {soup.allergens && <span className="allergens">{soup.allergens}</span>}
                        </div>
                        <span className="item-price">{soup.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {dayData.mainDishes.length > 0 && (
                  <div className="menu-section">
                    <h3 className="section-title">Hlavní jídla</h3>
                    {dayData.mainDishes.map((dish: { number: string; name: string; price: string; allergens: string }, dishIndex: number) => (
                      <div key={dishIndex} className="menu-item">
                        <div className="item-info">
                          {dish.number && <span className="item-number">{dish.number}.</span>}
                          <span className="item-name">{dish.name}</span>
                          {dish.allergens && <span className="allergens">{dish.allergens}</span>}
                        </div>
                        <span className="item-price">{dish.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {index < Object.values(menuData).length - 1 && (
                <div className="menu-separator"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="menu-note">
          <p><strong>Poznámka:</strong> Ceny jsou uvedeny včetně DPH. Alergeny jsou označeny čísly v kroužcích.</p>
        </div>
      </div>
    </div>
  )
}

export default DailyMenu
