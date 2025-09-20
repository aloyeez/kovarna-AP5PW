// Google Sheets utility for fetching menu data
// This approach uses the public URL method (no API keys needed)

export interface DailyMenuItem {
  Date: string;
  Day: string;
  Type: string;
  Name: string;
  Price: string;
  Allergens: string;
}

export interface OrganizedDailyMenuData {
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

// New interface for regular menu items
export interface RegularMenuItem {
  Category: string;
  Name: string;
  Price: string;
  Description?: string;
}

export interface OrganizedRegularMenuData {
  categories: Record<string, Array<{
    name: string;
    price: string;
    description?: string;
  }>>;
}

// New interface for drinks items
export interface DrinksItem {
  Category: string;
  Name: string;
  Price: string;
  Description?: string;
}

export interface OrganizedDrinksData {
  categories: Record<string, Array<{
    name: string;
    price: string;
    description?: string;
  }>>;
}

export const fetchDailyMenuFromSheet = async (
  fileId: string, 
  language: 'cz' | 'en' = 'cz',
  sheetConfig: { sheets: { cz: { dailyMenu: number }, en: { dailyMenu: number } } }
): Promise<DailyMenuItem[] | null> => {
  try {
    // Get the appropriate gid based on language
    const gid = sheetConfig.sheets[language].dailyMenu;
    
    // Construct the CSV export URL with specific gid
    const csvUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv&gid=${gid}`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }
    
    const csvText = await response.text();
    return parseDailyMenu(csvText);
  } catch (error) {
    console.error('Error fetching daily menu data:', error);
    return null;
  }
};

// New function for fetching regular menu data
export const fetchRegularMenuFromSheet = async (
  fileId: string, 
  language: 'cz' | 'en' = 'cz',
  sheetConfig: { sheets: { cz: { regularMenu: number }, en: { regularMenu: number } } }
): Promise<RegularMenuItem[] | null> => {
  try {
    // Get the appropriate gid based on language
    const gid = sheetConfig.sheets[language].regularMenu;
    
    // Construct the CSV export URL with specific gid
    const csvUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv&gid=${gid}`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch regular menu data from Google Sheets');
    }
    
    const csvText = await response.text();
    return parseRegularMenuCSV(csvText);
  } catch (error) {
    console.error('Error fetching regular menu data:', error);
    return null;
  }
};

// New function for fetching drinks data
export const fetchDrinksFromSheet = async (
  fileId: string, 
  language: 'cz' | 'en' = 'cz',
  sheetConfig: { sheets: { cz: { drinks: number }, en: { drinks: number } } }
): Promise<DrinksItem[] | null> => {
  try {
    // Get the appropriate gid based on language
    const gid = sheetConfig.sheets[language].drinks;
    
    // Construct the CSV export URL with specific gid
    const csvUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv&gid=${gid}`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch drinks data from Google Sheets');
    }
    
    const csvText = await response.text();
    return parseDrinksCSV(csvText);
  } catch (error) {
    console.error('Error fetching drinks data:', error);
    return null;
  }
};

// Parse CSV data to structured daily menu data with proper comma handling
const parseDailyMenu = (csvText: string): DailyMenuItem[] => {
  const lines = csvText.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  const menuData: DailyMenuItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row: Partial<DailyMenuItem> = {};
      
      headers.forEach((header, index) => {
        if (header === 'Date') row.Date = values[index] || '';
        if (header === 'Day') row.Day = values[index] || '';
        if (header === 'Type') row.Type = values[index] || '';
        if (header === 'Name') row.Name = values[index] || '';
        if (header === 'Price') row.Price = values[index] || '';
        if (header === 'Allergens') row.Allergens = values[index] || '';
      });
      
      if (row.Date && row.Day && row.Type && row.Name) {
        menuData.push(row as DailyMenuItem);
      }
    }
  }
  
  return menuData;
};

// Parse regular menu CSV data
const parseRegularMenuCSV = (csvText: string): RegularMenuItem[] => {
  const lines = csvText.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  const menuData: RegularMenuItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row: Partial<RegularMenuItem> = {};
      
      headers.forEach((header, index) => {
        if (header === 'Category') row.Category = values[index] || '';
        if (header === 'Name') row.Name = values[index] || '';
        if (header === 'Price') row.Price = values[index] || '';
        if (header === 'Description') row.Description = values[index] || '';
      });
      
      if (row.Category && row.Name) {
        menuData.push(row as RegularMenuItem);
      }
    }
  }
  
  return menuData;
};

// Parse drinks CSV data
const parseDrinksCSV = (csvText: string): DrinksItem[] => {
  const lines = csvText.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  const menuData: DrinksItem[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row: Partial<DrinksItem> = {};
      
      headers.forEach((header, index) => {
        if (header === 'Category') row.Category = values[index] || '';
        if (header === 'Name') row.Name = values[index] || '';
        if (header === 'Price') row.Price = values[index] || '';
        if (header === 'Description') row.Description = values[index] || '';
      });
      
      if (row.Category && row.Name) {
        menuData.push(row as DrinksItem);
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

// Helper function to organize daily menu data by day
export const organizeDailyMenuData = (menuData: DailyMenuItem[]): Record<string, OrganizedDailyMenuData> => {
  const organizedData: Record<string, OrganizedDailyMenuData> = {};
  
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

// Helper function to organize regular menu data by category
export const organizeRegularMenuData = (menuData: RegularMenuItem[]): OrganizedRegularMenuData => {
  const organizedData: OrganizedRegularMenuData = {
    categories: {}
  };
  
  menuData.forEach(row => {
    const category = row.Category;
    
    if (!organizedData.categories[category]) {
      organizedData.categories[category] = [];
    }
    
    organizedData.categories[category].push({
      name: row.Name,
      price: row.Price,
      description: row.Description
    });
  });
  
  return organizedData;
};

// Helper function to organize drinks data by category
export const organizeDrinksData = (menuData: DrinksItem[]): OrganizedDrinksData => {
  const organizedData: OrganizedDrinksData = {
    categories: {}
  };
  
  menuData.forEach(row => {
    const category = row.Category;
    
    if (!organizedData.categories[category]) {
      organizedData.categories[category] = [];
    }
    
    organizedData.categories[category].push({
      name: row.Name,
      price: row.Price,
      description: row.Description
    });
  });
  
  return organizedData;
};
