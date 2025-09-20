## Hospůdka U Kovárny – Web App

Modern restaurant website built with React, TypeScript, and Vite, featuring dynamic menu management through Google Sheets integration.

### Tech stack
- **Frontend**: React + TypeScript
- **Build tool**: Vite
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Routing**: React Router DOM
- **Dynamic Content**: Google Sheets integration (no API keys required)

## Prerequisites
- **Node.js**: 18.0+ (LTS recommended)
- **pnpm**: 9+

### Install pnpm
```bash
# Recommended (Node 16.13+):
corepack enable
corepack prepare pnpm@latest --activate

# Or via npm (alternative):
npm i -g pnpm
```

## Quick start
```bash
# 1) Install dependencies
pnpm install

# 2) Start the dev server (http://localhost:5173 by default)
pnpm dev
```

### Common scripts
- **dev**: start Vite dev server → `pnpm dev`
- **build**: type-check and build for production into `dist/` → `pnpm build`
- **preview**: preview the production build locally → `pnpm preview`
- **lint**: run ESLint → `pnpm lint`

## Project structure
```
.
├─ public/                 # Static assets served as-is
│  └─ index.html          # Main HTML file with Facebook SDK
├─ src/
│  ├─ assets/              # App assets (images, etc.)
│  │  └─ logo.png          # Navbar logo (transparent PNG/SVG recommended)
│  ├─ components/
│  │  ├─ Navbar.tsx        # Top navigation bar with routing
│  │  ├─ Navbar.css        # Navbar styling (dark theme, golden accents)
│  │  ├─ Footer.tsx        # Website footer component
│  │  └─ Footer.css        # Footer styling
│  ├─ pages/
│  │  ├─ Home.tsx          # Homepage component
│  │  ├─ About.tsx         # About page with restaurant information
│  │  ├─ DailyMenu.tsx     # Daily menu (fetches from Google Sheets)
│  │  ├─ RegularMenu.tsx   # Permanent menu items
│  │  └─ Contact.tsx       # Contact page with map and Facebook integration
│  ├─ utils/
│  │  └─ googleSheets.ts   # Google Sheets integration utilities
│  ├─ config/
│  │  └─ sheets.ts         # Configuration for Google Sheets URLs
│  ├─ App.tsx              # App root component with routing
│  ├─ main.tsx             # Vite entry point
│  └─ index.css            # Global styles and Tailwind CSS
├─ vite.config.ts          # Vite configuration with path aliases
└─ tsconfig.json           # TypeScript configuration
```

## Features

### 🍽️ Dynamic Menu Management
- **Daily Menu**: Automatically fetches from Google Sheets
- **Regular Menu**: Permanent menu items
- **Real-time Updates**: Menu changes appear instantly on the website
- **No API Keys Required**: Uses public CSV export from Google Sheets

### 🎨 Modern Design
- **Responsive Layout**: Works on all devices (mobile, tablet, desktop)
- **Dark Theme**: Professional restaurant aesthetic
- **Golden Accents**: Elegant color scheme
- **Smooth Animations**: Enhanced user experience

### 📱 Social Integration
- **Facebook Page Plugin**: Embedded Facebook timeline
- **Google Maps**: Interactive location map
- **Contact Information**: Complete restaurant details

## Google Sheets Integration

### Setup Instructions

1. **Create a Google Sheet** with the following structure:
   ```
   Date | Day | Type | Name | Price | Allergens
   ```

2. **Example Data**:
   ```
   Date        | Day      | Type | Name                                    | Price  | Allergens
   11.8.2025  | Pondělí  | INFO | Pro tento den nebylo zadáno menu.       |        |           |
   12.8.2025  | Úterý    | SOUP | Kuřecí vývar s masem a nudlemi         | 20 Kč  | 1 3 9     |
   12.8.2025  | Úterý    | MAIN | Vepřové výpečky s dušeným špenátem     | 159 Kč | 1 3 7     |
   13.8.2025  | Středa   | OFFER| K menu č. 1 a 2 domácí moučník zdarma  |        |           |
   ```

3. **Make it Public**: Share → Anyone with the link → Viewer

4. **Update Configuration**: Edit `src/config/sheets.ts` with your sheet URL

### Data Types
- **SOUP**: Soup items
- **MAIN**: Main course dishes
- **OFFER**: Special offers or promotions
- **INFO**: General information for a day

### Detailed Sheet Structure

#### **Column Definitions**

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| **Date** | ✅ Yes | Date in DD.MM.YYYY format | `11.8.2025` |
| **Day** | ✅ Yes | Day name in Czech | `Pondělí`, `Úterý`, `Středa` |
| **Type** | ✅ Yes | Item category | `SOUP`, `MAIN`, `OFFER`, `INFO` |
| **Name** | ✅ Yes | Item description | `Kuřecí vývar s masem, zeleninou a nudlemi` |
| **Price** | ⚠️ Conditional | Price in Czech Koruna (not needed for INFO/OFFER) | `20 Kč`, `159 Kč` |
| **Allergens** | ❌ No | Space-separated allergen codes | `1 3 9`, `1 3 7 10` |

#### **Data Type Rules**

##### **INFO Type**
- Used for general information about a day
- **Required fields**: Date, Day, Type, Name
- **Optional fields**: All others can be empty
- **Example**:
  ```
  Date: 11.8.2025 | Day: Pondělí | Type: INFO | Name: Pro tento den nebylo zadáno menu.
  ```

##### **SOUP Type**
- Used for soup items
- **Required fields**: Date, Day, Type, Name, Price
- **Optional fields**: Allergens, Special
- **Example**:
  ```
  Date: 11.8.2025 | Day: Pondělí | Type: SOUP | Name: Kuřecí vývar s masem, zeleninou a nudlemi | Price: 20 Kč | Allergens: 1 3 9
  ```

##### **MAIN Type**
- Used for main course dishes
- **Required fields**: Date, Day, Type, Name, Price
- **Optional fields**: Allergens, Special
- **Example**:
  ```
  Date: 11.8.2025 | Day: Pondělí | Type: MAIN | Name: Vepřové výpečky, dušený špenát, bramborový knedlík / brambory / | Price: 159 Kč | Allergens: 1 3 7
  ```

##### **OFFER Type**
- Used for special offers or promotions
- **Required fields**: Date, Day, Type, Name
- **Optional fields**: All others can be empty
- **Example**:
  ```
  Date: 11.8.2025 | Day: Pondělí | Type: OFFER | Name: K menu č. 1 a 2 domácí moučník zdarma
  ```

#### **Complete Example Sheet**

Here's a complete example of how your Google Sheet should look:

| Date | Day | Type | Name | Price | Allergens |
|------|-----|------|------|-------|-----------|
| 11.8.2025 | Pondělí | INFO | | Pro tento den nebylo zadáno menu. | | |
| 11.8.2025 | Pondělí | SOUP | | Kuřecí vývar s masem, zeleninou a nudlemi | 20 Kč | 1 3 9 |
| 11.8.2025 | Pondělí | MAIN | | Vepřové výpečky, dušený špenát, bramborový knedlík / brambory / | 159 Kč | 1 3 7 |
| 11.8.2025 | Pondělí | MAIN | | Brynzové halušky s opečenou slaninou | 149 Kč | 1 3 7 |
| 11.8.2025 | Pondělí | MAIN | | Vídeňská hovězí roštěná s opečenou cibulkou (150g), dušená rýže / hranolky / | 189 Kč | 1 3 7 10 |
| 11.8.2025 | Pondělí | OFFER | | K menu č. 1 a 2 domácí moučník zdarma | | |

#### **Best Practices**

1. **Consistent Date Format**: Always use DD.MM.YYYY format
2. **Day Names**: Use full Czech day names (Pondělí, Úterý, Středa, Čtvrtek, Pátek, Sobota, Neděle)
3. **Type Values**: Use exact values: `SOUP`, `MAIN`, `OFFER`, `INFO` (case sensitive)
4. **Price Format**: Use "XX Kč" format consistently
5. **Allergen Codes**: Use space-separated numbers (1 3 9)

#### **Common Mistakes to Avoid**

❌ **Don't do this:**
- Mix date formats (11.8.2025 vs 11/8/2025)
- Use abbreviated day names (Po, Út, St)
- Leave required fields empty
- Use incorrect Type values (soup, main, offer)

✅ **Do this instead:**
- Use consistent DD.MM.YYYY format
- Use full day names (Pondělí, Úterý, Středa)
- Fill all required fields
- Use exact Type values (SOUP, MAIN, OFFER, INFO)

#### **Troubleshooting Sheet Issues**

| Problem | Solution |
|---------|----------|
| Menu not loading | Check if sheet is public and URL is correct |
| Missing menu items | Verify all required fields are filled |
| Wrong data display | Check Type values are exactly: SOUP, MAIN, OFFER, INFO |
| Price not showing | Ensure Price field is filled for SOUP and MAIN types |
| Allergens missing | Check Allergens column format (space-separated numbers) |
| Special offers not working | Verify OFFER type items have Name field filled |

### Advanced Features

#### **Adding New Data Types**
To add new menu categories (e.g., DESSERT, DRINK), update the `googleSheets.ts` file:

1. Add new type to the switch statement
2. Update the OrganizedDayData interface
3. Add corresponding display logic in DailyMenu.tsx

#### **Custom Fields**
You can add custom columns like:
- **Image**: For food photos
- **Description**: Additional item details
- **Category**: Sub-categories within main types
- **Availability**: Stock status

Remember to update the TypeScript interfaces and parsing logic accordingly.

## Customization

### Logo and Branding
- **Logo**: Replace `