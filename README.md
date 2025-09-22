## Hospůdka U Kovárny – Full Stack Restaurant Application

Modern restaurant reservation system with React frontend and Spring MVC backend. Features dynamic menu management through Google Sheets integration, user authentication, and comprehensive reservation management.

### Tech Stack

#### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios (planned)
- **Dynamic Content**: Google Sheets integration (no API keys required)

#### Backend
- **Framework**: Spring Boot 3.x + Spring MVC
- **Language**: Java 17+
- **Build Tool**: Maven
- **Database**: PostgreSQL/MySQL (JPA/Hibernate)
- **Authentication**: JWT + Spring Security
- **Architecture**: Multi-layered (Presentation, Application, Infrastructure, Domain)
- **API**: RESTful Web Services

## Prerequisites

### Frontend
- **Node.js**: 18.0+ (LTS recommended)
- **pnpm**: 9+

### Backend
- **Java**: 17+ (JDK)
- **Maven**: 3.8+
- **Database**: PostgreSQL 13+ or MySQL 8.0+

## Database Setup

### PostgreSQL Installation and Configuration

1. **Install PostgreSQL on Ubuntu/Debian:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create Database and User:**
   ```bash
   # Connect to PostgreSQL as postgres user
   sudo -u postgres psql

   # Create database and user
   CREATE DATABASE kovarna_db;
   CREATE USER kovarna_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE kovarna_db TO kovarna_user;
   \q
   ```

3. **Set Environment Variable:**
   ```bash
   # Set the database password as environment variable
   export DB_PASSWORD=your_secure_password

   # Add to ~/.bashrc for persistence
   echo 'export DB_PASSWORD=your_secure_password' >> ~/.bashrc
   source ~/.bashrc
   ```

4. **Configure Remote Access (Optional):**
   If you need to connect from a different server:
   ```bash
   # Edit postgresql.conf
   sudo nano /etc/postgresql/16/main/postgresql.conf
   # Change: listen_addresses = 'localhost' to listen_addresses = '*'

   # Edit pg_hba.conf
   sudo nano /etc/postgresql/16/main/pg_hba.conf
   # Add line: host kovarna_db kovarna_user 0.0.0.0/0 md5

   # Restart PostgreSQL
   sudo systemctl restart postgresql
   ```

### Database Configuration Files

The project uses environment variables for secure database configuration:

- **`application.properties`**: Contains database configuration with environment variable placeholders
- **`application.properties.example`**: Template file showing required configuration structure
- **Environment Variable Required**: `DB_PASSWORD` must be set before running the application

### Security Notes

- Database passwords are never stored in the repository
- Use the `DB_PASSWORD` environment variable for the database password
- The `application.properties.example` file shows the required configuration structure
- For production, consider using additional environment variables for database URL and username

### Install Prerequisites

#### Install pnpm
```bash
# Recommended (Node 16.13+):
corepack enable
corepack prepare pnpm@latest --activate

# Or via npm (alternative):
npm i -g pnpm
```

#### Install Java (if not already installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# macOS (using Homebrew)
brew install openjdk@17

# Windows (using Chocolatey)
choco install openjdk17
```

## Quick Start

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend_kovarna

# Compile and run Spring Boot application
./mvnw spring-boot:run

# Backend will start on http://localhost:8080
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend_kovarna

# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Frontend will start on http://localhost:5173
```

### Common Scripts

#### Frontend (`frontend_kovarna/`)
- **dev**: start Vite dev server → `pnpm dev`
- **build**: type-check and build for production → `pnpm build`
- **preview**: preview the production build locally → `pnpm preview`
- **lint**: run ESLint → `pnpm lint`

#### Backend (`backend_kovarna/`)
- **run**: start Spring Boot application → `./mvnw spring-boot:run`
- **compile**: compile Java sources → `./mvnw compile`
- **test**: run unit tests → `./mvnw test`
- **package**: create JAR file → `./mvnw package`

## Project Structure
```
kovarna-AP5PW/
├─ frontend_kovarna/       # React Frontend Application
│  ├─ public/              # Static assets served as-is
│  │  └─ index.html        # Main HTML file with Facebook SDK
│  ├─ src/
│  │  ├─ assets/           # App assets (images, etc.)
│  │  │  └─ logo.png       # Navbar logo
│  │  ├─ components/       # Reusable UI components
│  │  │  ├─ Navbar.tsx     # Navigation bar with auth buttons
│  │  │  ├─ Footer.tsx     # Website footer
│  │  │  └─ *.css          # Component styles
│  │  ├─ pages/            # Page components
│  │  │  ├─ Home.tsx       # Homepage
│  │  │  ├─ About.tsx      # About page
│  │  │  ├─ DailyMenu.tsx  # Daily menu (Google Sheets)
│  │  │  ├─ RegularMenu.tsx# Permanent menu
│  │  │  ├─ Contact.tsx    # Contact page
│  │  │  ├─ Login.tsx      # User login (planned)
│  │  │  └─ Register.tsx   # User registration (planned)
│  │  ├─ contexts/         # React Context providers
│  │  │  ├─ LanguageContext.tsx # i18n support
│  │  │  └─ AuthContext.tsx     # Auth state (planned)
│  │  ├─ services/         # API communication (planned)
│  │  │  ├─ api.ts         # Base API config
│  │  │  ├─ authService.ts # Authentication API
│  │  │  └─ reservationService.ts # Reservation API
│  │  ├─ utils/
│  │  │  └─ googleSheets.ts# Google Sheets integration
│  │  ├─ config/
│  │  │  └─ sheets.ts      # Google Sheets URLs
│  │  ├─ translations/     # i18n translation files
│  │  │  ├─ en.json        # English translations
│  │  │  └─ cz.json        # Czech translations
│  │  ├─ App.tsx           # Root component with routing
│  │  ├─ main.tsx          # Vite entry point
│  │  └─ index.css         # Global styles and Tailwind CSS
│  ├─ package.json         # Frontend dependencies
│  ├─ vite.config.ts       # Vite configuration
│  └─ tsconfig.json        # TypeScript configuration
│
├─ backend_kovarna/        # Spring Boot Backend Application
│  ├─ src/
│  │  ├─ main/
│  │  │  ├─ java/com/kovarna/
│  │  │  │  ├─ presentation/      # Controllers (Presentation Layer)
│  │  │  │  │  ├─ controllers/    # REST Controllers
│  │  │  │  │  └─ dto/            # Data Transfer Objects
│  │  │  │  ├─ application/       # Services (Application Layer)
│  │  │  │  │  ├─ services/       # Business logic services
│  │  │  │  │  └─ validators/     # Custom validation attributes
│  │  │  │  ├─ infrastructure/    # Data Access (Infrastructure Layer)
│  │  │  │  │  ├─ repositories/   # JPA Repositories
│  │  │  │  │  └─ config/         # Database configuration
│  │  │  │  ├─ domain/            # Entities (Domain Layer)
│  │  │  │  │  ├─ entities/       # JPA Entities
│  │  │  │  │  └─ enums/          # Domain enums
│  │  │  │  └─ security/          # Spring Security configuration
│  │  │  │     ├─ jwt/            # JWT token handling
│  │  │  │     └─ config/         # Security configuration
│  │  │  └─ resources/
│  │  │     ├─ application.properties # Spring Boot configuration
│  │  │     └─ db/migration/      # Database migrations
│  │  └─ test/                    # Unit and integration tests
│  ├─ pom.xml              # Maven dependencies
│  ├─ mvnw                 # Maven wrapper (Unix)
│  └─ mvnw.cmd             # Maven wrapper (Windows)
│
├─ README.md               # Project documentation
└─ .gitignore             # Git ignore rules
```

## Features

### 🍽️ Dynamic Menu Management
- **Daily Menu**: Automatically fetches from Google Sheets
- **Regular Menu**: Permanent menu items
- **Real-time Updates**: Menu changes appear instantly on the website
- **No API Keys Required**: Uses public CSV export from Google Sheets

### 🔐 User Authentication & Authorization
- **Multi-role System**: Admin, Manager, Customer roles
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **User Registration**: Self-service user registration

### 📅 Reservation Management
- **Customer Reservations**: Users can create, view, and cancel their reservations
- **Table Management**: Admin/Manager can manage restaurant tables
- **Service Management**: Configurable restaurant services
- **Admin Dashboard**: Complete CRUD operations for all entities
- **Manager Interface**: Limited admin access for customer-facing operations

### 🎨 Modern Design
- **Responsive Layout**: Works on all devices (mobile, tablet, desktop)
- **Dark Theme**: Professional restaurant aesthetic
- **Golden Accents**: Elegant color scheme
- **Smooth Animations**: Enhanced user experience
- **Multilingual Support**: Czech and English translations

### 📱 Social Integration
- **Facebook Page Plugin**: Embedded Facebook timeline
- **Google Maps**: Interactive location map
- **Contact Information**: Complete restaurant details

### 🏗️ Architecture & Development
- **Multi-layered Architecture**: Clean separation of concerns
- **RESTful API**: Standard REST endpoints for frontend-backend communication
- **Code-First Database**: JPA/Hibernate with automatic migrations
- **Custom Validation**: Server-side validation with custom attributes
- **Unit Testing**: Comprehensive test coverage (planned)
- **Logging**: Application logging for monitoring and debugging (planned)

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phoneNumber": "+420123456789",
  "role": "CUSTOMER"
}
```

#### POST `/auth/login`
Login with existing credentials
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER"
  }
}
```

### Reservation Endpoints

#### GET `/reservations` (Customer)
Get user's own reservations
**Headers:** `Authorization: Bearer {token}`

#### POST `/reservations` (Customer)
Create a new reservation
```json
{
  "tableId": 1,
  "dateTime": "2025-09-25T19:00:00",
  "numberOfGuests": 4,
  "notes": "Birthday celebration",
  "services": [1, 2]
}
```

#### PUT `/reservations/{id}` (Customer)
Update existing reservation (own reservations only)

#### DELETE `/reservations/{id}` (Customer)
Cancel reservation (own reservations only)

### Admin/Manager Endpoints

#### GET `/admin/reservations` (Admin, Manager)
Get all reservations with filtering
**Query Parameters:**
- `date`: Filter by date (YYYY-MM-DD)
- `status`: Filter by status (PENDING, CONFIRMED, CANCELLED)
- `tableId`: Filter by table

#### GET `/admin/tables` (Admin, Manager)
Get all restaurant tables

#### POST `/admin/tables` (Admin, Manager)
Create new table
```json
{
  "number": "T1",
  "capacity": 4,
  "location": "Main dining area",
  "isActive": true
}
```

#### GET `/admin/services` (Admin, Manager)
Get all available services

#### POST `/admin/services` (Admin, Manager)
Create new service
```json
{
  "name": "Wine tasting",
  "description": "Premium wine selection",
  "duration": 120,
  "price": 50.00
}
```

#### GET `/admin/users` (Admin only)
Get all users with role management

### Entity Models

#### User
```typescript
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER'
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

#### Reservation
```typescript
interface Reservation {
  id: number
  userId: number
  tableId: number
  dateTime: string
  numberOfGuests: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  services: Service[]
  createdAt: string
  updatedAt: string
}
```

#### Table
```typescript
interface Table {
  id: number
  number: string
  capacity: number
  location: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

#### Service
```typescript
interface Service {
  id: number
  name: string
  description: string
  duration: number // minutes
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### Error Responses
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2025-09-20T10:30:00Z"
}
```

### Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

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