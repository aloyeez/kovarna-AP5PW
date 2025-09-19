// Configuration for Google Sheets integration
export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1UykTaLDzCM9zFWNNnpQ0zAAyC78fp8yg1ysAvVpWKgo'

// You can also add other configuration values here
export const SHEET_CONFIG = {
  // How often to refresh the menu data (in milliseconds)
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  
  // Fallback data if sheet is unavailable
  fallbackMessage: 'Menu data is temporarily unavailable. Please check back later.'
}
