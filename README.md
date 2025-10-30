# Hospůdka U Kovárny - Restaurant Reservation System

**School Project:** AP5PW - Web Applications

Modern restaurant reservation system with React frontend and Spring Boot backend.

---

## 🔧 Prerequisites

Ensure you have the following installed:

- **Java 21** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Node.js 18+** with npm ([Download](https://nodejs.org/))
- **PostgreSQL 16+** ([Download](https://www.postgresql.org/download/))
- **Maven 3.6+** (or use included wrapper)

---

## 🚀 Quick Start

### 1. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kovarna_db;

# Exit
\q
```

### 2. Configure Backend

```bash
cd backend_kovarna

# Copy configuration template
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your settings:
# - Database URL, username, password
# - JWT secret key (minimum 256 bits)
```

### 3. Start Backend

```bash
# Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# Or with Maven
mvn clean install
mvn spring-boot:run
```

**Backend:** http://localhost:8080
**API Docs:** http://localhost:8080/swagger-ui.html

### 4. Start Frontend

```bash
# New terminal
cd frontend_kovarna

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend:** http://localhost:5173

---

## 📝 Detailed Setup

### Database Configuration

1. **Create PostgreSQL Database:**

```sql
CREATE DATABASE kovarna_db;
CREATE USER kovarna_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kovarna_db TO kovarna_user;
```

2. **Configure Backend** (`backend_kovarna/src/main/resources/application.properties`):

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/kovarna_db
spring.datasource.username=kovarna_user
spring.datasource.password=your_password

# JWT
jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000

# Flyway migrations (automatic)
spring.flyway.enabled=true
```

**Note:** Tables are created automatically by Flyway on first startup.

### Backend Configuration

- **Framework:** Spring Boot 3.5.6
- **Java Version:** 21
- **Database:** PostgreSQL with Flyway migrations
- **Security:** JWT authentication + Spring Security
- **API Docs:** Swagger/OpenAPI

### Frontend Configuration

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Custom CSS + Bootstrap
- **State:** React Context API
- **HTTP:** Axios

**API URL:** Configured in `src/services/api.ts` (default: `http://localhost:8080`)

---

## 🏃 Running the Application

### Development Mode

**Backend (Terminal 1):**

```bash
cd backend_kovarna
./mvn clean install
./mvn spring-boot:run
```

**Frontend (Terminal 2):**

```bash
cd frontend_kovarna
npm run dev
```

### Production Build

**Backend:**

```bash
cd backend_kovarna
./mvnw clean package
java -jar target/backend_kovarna-0.0.1-SNAPSHOT.jar
```

**Frontend:**

```bash
cd frontend_kovarna
npm run build
# Output in dist/ folder
```

---

## 📁 Project Structure

```
kovarna-AP5PW/
├── backend_kovarna/                 # Spring Boot Backend
│   ├── src/main/java/.../
│   │   ├── presentation/            # Controllers (REST API)
│   │   ├── application/             # Services (Business Logic)
│   │   ├── domain/                  # Entities, DTOs, Validation
│   │   └── infrastructure/          # Repositories, Config
│   ├── src/main/resources/
│   │   ├── db/migration/            # Flyway migrations (V1-V7)
│   │   └── application.properties
│   └── pom.xml
│
├── frontend_kovarna/                # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API layer
│   │   ├── contexts/                # Auth, Language contexts
│   │   └── translations/            # Czech, English i18n
│   └── package.json
│
└── README.md                        # This file
```

---

## 📚 API Documentation

### Access Points

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs:** http://localhost:8080/v3/api-docs

### Key Endpoints

**Public:**

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/opening-hours` - Get hours

**Authenticated:**

- `GET /api/auth/me` - Current user
- `GET /api/reservations/slots?date=YYYY-MM-DD` - Available slots
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - User's reservations
- `DELETE /api/reservations/{id}` - Cancel reservation

**Admin (ROLE_ADMIN):**

- `GET /admin/reservations` - All reservations
- `DELETE /admin/reservations/{id}` - Delete any reservation
- `GET /admin/users` - All users
- `CRUD /admin/slots` - Manage time slots
- `CRUD /admin/opening-hours` - Manage hours

**Full Documentation:** Available in Swagger UI at http://localhost:8080/swagger-ui.html

---

**Relationships:**

- User ↔ Role (M:M via join table)
- Reservation → User (M:1)
- Reservation → ReservationSlot (M:1)
- ReservationSlot ← Reservation (1:M)

#### 4. ORM Integration

- Spring Data JPA + Hibernate
- PostgreSQL database
- All entities with JPA annotations:
  - `@Entity`, `@Table`, `@Id`
  - `@ManyToOne`, `@OneToMany`, `@ManyToMany`
  - `@Column`, `@JoinColumn`, `@JoinTable`

#### 5. Database Migrations

**Flyway** with 7 migrations in `resources/db/migration/`:

- V1: Initial schema (users, roles, slots, reservations)
- V2-V7: Schema evolution
- Auto-executes on startup

#### 6. Additional Requirements

- ✅ Admin area (`/admin/*` endpoints)
- ✅ Full CRUD + Edit functionality
- ✅ 2+ roles (ADMIN, CUSTOMER)
- ✅ User registration & login
- ✅ JWT authentication
- ✅ Server-side validation
- ✅ Custom validator: `@FutureReservationDate`
- ✅ Responsive frontend (Bootstrap)
- ✅ React framework

---

## 🔐 Default Users

After setup, create admin user:

### Option 1: Register via UI + Manual Role Assignment

1. Register at http://localhost:5173/signup
2. Add admin role in database:

```sql
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'your_username'
  AND r.name = 'ROLE_ADMIN';
```

### Option 2: Direct SQL Insert

```sql
-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password_hash, enabled, reservation_date)
VALUES ('admin', 'admin@kovarna.cz',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  true, CURRENT_DATE);

-- Assign admin role
INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';
```

---

## 🐛 Troubleshooting

### Port 8080 in use

```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Database connection failed

- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `application.properties`
- Ensure `kovarna_db` database exists

### Flyway migration errors

- Drop database and recreate
- Verify migration file syntax
- Check numbering (V1, V2, V3...)

### Frontend can't connect

- Verify backend on port 8080
- Check `src/services/api.ts` base URL
- Look for CORS errors in browser console

### npm install fails

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### CORS errors

- Backend configured for `http://localhost:5173`
- Update `SecurityConfig.java` if using different port

---

## 📄 License

Academic project for AP5PW course.

---
