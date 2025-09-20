// Configuration for Google Sheets integration
export const GOOGLE_SHEET_CONFIG = {
  fileId: '1UykTaLDzCM9zFWNNnpQ0zAAyC78fp8yg1ysAvVpWKgo',
  sheets: {
    // Czech tabs
    cz: {
      dailyMenu: 0,                    // Tab 1: "1. Denní Menu CZ" (gid=0)
      regularMenu: 142166290,          // Tab 3: "3. Jídelní Lístek CZ" (gid=142166290) 
      drinks: 2046705173               // Tab 5: "5. Nápojový lístek CZ" (gid=2046705173)
    },
    // English tabs
    en: {
      dailyMenu: 1705051182,           // Tab 2: "2. Daily Menu EN" (gid=1705051182)
      regularMenu: 1813967871,         // Tab 4: "4. Regular Menu EN" (gid=1813967871)
      drinks: 863593778                // Tab 6: "6. Drinks Menu EN" (gid=863593778)
    }
  }
}

// You can also add other configuration values here
export const SHEET_CONFIG = {
  // How often to refresh the menu data (in milliseconds)
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  
  // Fallback data if sheet is unavailable
  fallbackMessage: 'Menu data is temporarily unavailable. Please check back later.'
}
