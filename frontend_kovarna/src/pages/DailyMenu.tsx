import type { OrganizedDailyMenuData } from '../utils/googleSheets'
import { useLanguage } from '../contexts/LanguageContext'

interface DailyMenuProps {
  dailyMenuData?: Record<string, OrganizedDailyMenuData> | null
}

function DailyMenu({ dailyMenuData }: DailyMenuProps) {
  const { t } = useLanguage()

  if (!dailyMenuData || Object.keys(dailyMenuData).length === 0) {
    return (
      <div className="menu-page">
        <div className="menu-container">
          <h1 className="menu-title">{t('dailyMenu.title')}</h1>
          <div className="menu-content">
            <div className="no-data-message">
              <p>{t('common.noData')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-page">
      <div className="menu-container">
        <h1 className="menu-title">{t('dailyMenu.title')}</h1>
        
        <div className="menu-content">
          {Object.values(dailyMenuData).map((dayData: OrganizedDailyMenuData) => (
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
                  <div className="menu-soups">
                    <h3 className="section-title">{t('dailyMenu.soups')}</h3>
                    {dayData.soups.map((soup, soupIndex) => (
                      <div key={soupIndex} className="menu-item">
                        <div className="item-info">
                          <span className="item-name">{soup.name}</span>
                        </div>
                        <div className="item-right">
                          {soup.allergens && (
                            <div className="allergens">
                              {soup.allergens.split(/\s+/).map((allergen, index) => (
                                <span key={index} className="allergen-tag">{allergen}</span>
                              ))}
                            </div>
                          )}
                          {soup.price && <span className="item-price">{soup.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {dayData.mainDishes.length > 0 && (
                  <div className="menu-main-dishes">
                    <h3 className="section-title">{t('dailyMenu.mainDishes')}</h3>
                    {dayData.mainDishes.map((dish, dishIndex) => (
                      <div key={dishIndex} className="menu-item">
                        <div className="item-info">
                          <span className="item-number">{dish.number}.</span>
                          <span className="item-name">{dish.name}</span>
                        </div>
                        <div className="item-right">
                          {dish.allergens && (
                            <div className="allergens">
                              {dish.allergens.split(/\s+/).map((allergen, index) => (
                                <span key={index} className="allergen-tag">{allergen}</span>
                              ))}
                            </div>
                          )}
                          {dish.price && <span className="item-price">{dish.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="menu-note">
          <p><strong>{t('dailyMenu.note')}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default DailyMenu
