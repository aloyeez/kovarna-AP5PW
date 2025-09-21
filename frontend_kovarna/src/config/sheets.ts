// Configuration for Google Sheets
export const GOOGLE_SHEET_CONFIG = {
  fileId: '1UykTaLDzCM9zFWNNnpQ0zAAyC78fp8yg1ysAvVpWKgo',
  sheets: {
    // Czech tabs
    cz: {
      dailyMenu: 0,
      regularMenu: 142166290,
      drinks: 2046705173
    },
    // English tabs
    en: {
      dailyMenu: 1705051182,
      regularMenu: 1813967871,
      drinks: 863593778
    }
  }
}

export const SHEET_CONFIG = {
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  fallbackMessage: 'Menu data is temporarily unavailable. Please check back later.'
}
