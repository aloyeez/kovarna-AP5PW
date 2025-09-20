import type { OrganizedDrinksData } from '../utils/googleSheets'
import { useLanguage } from '../contexts/LanguageContext'

interface DrinksProps {
  drinksData?: OrganizedDrinksData | null
}

function Drinks({ drinksData }: DrinksProps) {
  const { t } = useLanguage()

  if (!drinksData || Object.keys(drinksData.categories).length === 0) {
    return (
      <div className="menu-page">
        <div className="menu-container">
          <h1 className="menu-title">{t('drinks.title')}</h1>
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
        <h1 className="menu-title">{t('drinks.title')}</h1>
        
        <div className="menu-content">
          <div className="menu-day">
            {Object.entries(drinksData.categories).map(([category, items]) => (
              <div key={category} className="menu-section">
                <h3 className="section-title">{category}</h3>
                {items.map((item, index) => (
                  <div key={index} className="menu-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      {item.description && (
                        <span className="item-description">{item.description}</span>
                      )}
                    </div>
                    {item.price && <span className="item-price">{item.price}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="menu-note">
          <p><strong>{t('drinks.note')}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default Drinks
