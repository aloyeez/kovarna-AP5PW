// Google Sheets utility for fetching menu data
// This approach uses the public URL method (no API keys needed)

export interface MenuItem {
  Date: string;
  Day: string;
  Type: string;
  Name: string;
  Price: string;
  Allergens: string;
}

export interface OrganizedDayData {
  date: string;
  day: string;
  soups: Array<{
    name: string;
    price: string;
    allergens: string;
  }>;
  mainDishes: Array<{
    number: string;
    name: string;
    price: string;
    allergens: string;
  }>;
  specialOffers: Array<{
    message: string;
  }>;
  info: string | null;
}

export const fetchDailyMenuFromSheet = async (sheetUrl: string): Promise<MenuItem[] | null> => {
  try {
    // Extract the sheet ID from the URL
    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL');
    }

    // Construct the CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }
    
    const csvText = await response.text();
    return parseCSVToMenuData(csvText);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return null;
  }
};

// Extract sheet ID from Google Sheets URL
const extractSheetId = (url: string): string | null => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

// Parse CSV data to structured menu data with proper comma handling
const parseCSVToMenuData = (csvText: string): MenuItem[] => {
  const lines = csvText.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  const menuData: MenuItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row: Partial<MenuItem> = {};
      
      headers.forEach((header, index) => {
        if (header === 'Date') row.Date = values[index] || '';
        if (header === 'Day') row.Day = values[index] || '';
        if (header === 'Type') row.Type = values[index] || '';
        if (header === 'Name') row.Name = values[index] || '';
        if (header === 'Price') row.Price = values[index] || '';
        if (header === 'Allergens') row.Allergens = values[index] || '';
      });
      
      if (row.Date && row.Day && row.Type && row.Name) {
        menuData.push(row as MenuItem);
      }
    }
  }
  
  return menuData;
};

// Robust CSV line parser that handles commas within quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      // Regular character
      current += char;
      i++;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
};

// Helper function to organize menu data by day
export const organizeMenuDataByDay = (menuData: MenuItem[]): Record<string, OrganizedDayData> => {
  const organizedData: Record<string, OrganizedDayData> = {};
  
  menuData.forEach(row => {
    const date = row.Date;
    const day = row.Day;
    const type = row.Type;
    
    if (!organizedData[date]) {
      organizedData[date] = {
        date: date,
        day: day,
        soups: [],
        mainDishes: [],
        specialOffers: [],
        info: null
      };
    }
    
    switch (type) {
      case 'SOUP':
        organizedData[date].soups.push({
          name: row.Name,
          price: row.Price,
          allergens: row.Allergens
        });
        break;
      case 'MAIN':
        organizedData[date].mainDishes.push({
          number: '', // Will be set below
          name: row.Name,
          price: row.Price,
          allergens: row.Allergens
        });
        break;
      case 'OFFER':
        organizedData[date].specialOffers.push({
          message: row.Name
        });
        break;
      case 'INFO':
        organizedData[date].info = row.Name;
        break;
    }
  });
  
  // Auto-number main dishes for each day
  Object.values(organizedData).forEach(dayData => {
    dayData.mainDishes.forEach((dish, index) => {
      dish.number = (index + 1).toString();
    });
  });
  
  return organizedData;
};
