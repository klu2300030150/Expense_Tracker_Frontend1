# 💰 Expense Tracker - Full Stack Application

## 🏗️ Architecture

**Frontend:** React 18 + Vite + React Router  
**Backend:** Spring Boot 3.2 + Spring Security + JWT  
**Database:** MySQL 8.0

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│  React Frontend │─────▶│  Spring Boot API │─────▶│    MySQL     │
│  (Port 5173)    │◀─────│  (Port 8080)     │◀─────│              │
└─────────────────┘ JWT  └──────────────────┘      └──────────────┘
```

---

## 📁 Project Structure

```
EF2/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/expense/tracker/
│   │   ├── ExpenseTrackerApplication.java
│   │   ├── entity/                   # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Expense.java
│   │   │   └── Budget.java
│   │   ├── repository/               # Spring Data JPA
│   │   │   ├── UserRepository.java
│   │   │   ├── ExpenseRepository.java
│   │   │   └── BudgetRepository.java
│   │   ├── service/                  # Business Logic
│   │   │   ├── AuthService.java
│   │   │   └── ExpenseService.java
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   └── ExpenseController.java
│   │   ├── security/                 # Security & JWT
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── SecurityConfig.java
│   │   └── dto/                      # Data Transfer Objects
│   │       ├── SignupRequest.java
│   │       ├── LoginRequest.java
│   │       ├── AuthResponse.java
│   │       └── ExpenseRequest.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── src/                              # React Frontend
│   ├── pages/
│   │   ├── Login.jsx                 # Login page
│   │   ├── Signup.jsx                # Signup page
│   │   ├── Dashboard.jsx             # Main dashboard
│   │   ├── Auth.css                  # Auth styling
│   │   └── Dashboard.css             # Dashboard styling
│   ├── App.jsx                       # React Router
│   ├── main.jsx                      # React entry
│   └── index.css                     # Global styles
│
├── package.json                      # Frontend dependencies
├── vite.config.js                    # Vite configuration
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

1. **Java 17+** installed
2. **Maven 3.6+** installed
3. **MySQL 8.0+** running
4. **Node.js 18+** and npm installed

### Step 1: Configure MySQL

Update your MySQL password in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

The application will automatically create the `expense_tracker` database.

### Step 2: Start Spring Boot Backend

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on **http://localhost:8080**

### Step 3: Start React Frontend

Open a new terminal:

```powershell
npm install
npm run dev
```

Frontend will start on **http://localhost:5173**

### Step 4: Access the Application

Open your browser and go to: **http://localhost:5173**

---

## 🔐 API Endpoints

### Authentication (Public)

| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | `/api/auth/signup`    | Register new user |
| POST   | `/api/auth/login`     | Login user        |

### Expenses (Protected - Requires JWT)

| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| GET    | `/api/expenses`     | Get user's expenses   |
| POST   | `/api/expenses`     | Create new expense    |
| DELETE | `/api/expenses/{id}`| Delete expense        |

---

## 🔑 JWT Authentication Flow

1. User signs up/logs in
2. Backend generates JWT token (24-hour expiry)
3. Frontend stores token in localStorage
4. All protected API calls include: `Authorization: Bearer <token>`
5. Spring Security validates token on each request

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    currency VARCHAR(10),
    created_at DATETIME
);
```

### Expenses Table
```sql
CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🛠️ Technologies Used

### Backend
- **Spring Boot 3.2** - Main framework
- **Spring Data JPA** - Database ORM
- **Spring Security** - Authentication & Authorization
- **JWT (jjwt 0.11.5)** - Token-based auth
- **MySQL Connector** - Database driver
- **Lombok** - Reduce boilerplate code
- **Bean Validation** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with gradients & animations

---

## 🎨 Features

✅ **User Authentication** - Secure signup/login with JWT  
✅ **Expense Tracking** - Add, view, delete expenses  
✅ **Category Management** - 7 expense categories  
✅ **Category Analytics** - Spending breakdown by category  
✅ **Multi-Currency Support** - USD, EUR, INR, etc.  
✅ **Responsive Design** - Mobile-friendly UI  
✅ **Protected Routes** - Dashboard requires authentication  
✅ **Auto Database Creation** - Hibernate auto-creates tables  

---

## 🔧 Configuration

### Backend Configuration (`application.properties`)

```properties
# Server
server.port=8080

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=YourSuperSecretKeyForJWTTokenGenerationMustBeLongEnough123456789
jwt.expiration=86400000

# CORS
spring.web.cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration

API base URLs are configured in component files:
- Auth: `http://localhost:8080/api/auth`
- Expenses: `http://localhost:8080/api/expenses`

---

## 🐛 Troubleshooting

### MySQL Connection Error
**Problem:** `Access denied for user 'root'@'localhost'`  
**Solution:** Update password in `application.properties`

### Port Already in Use
**Problem:** Port 8080 or 5173 is busy  
**Solution:** 
- Change Spring Boot port: `server.port=8081` in `application.properties`
- Change Vite port: Update `vite.config.js`

### CORS Error
**Problem:** Frontend can't connect to backend  
**Solution:** Ensure `SecurityConfig.java` allows `http://localhost:5173`

### JWT Token Expired
**Problem:** "Unauthorized" after 24 hours  
**Solution:** Login again to get a new token

---

## 📝 Development Notes

- **Password Encryption:** BCrypt with 10 rounds
- **Token Expiry:** 24 hours (86400000 ms)
- **Database:** Auto-creates schema on first run
- **CORS:** Configured for localhost development
- **Validation:** Bean validation on all DTOs

---

## 🚀 Production Deployment Checklist

- [ ] Change JWT secret to a strong random key
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Configure production database
- [ ] Update CORS allowed origins
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Enable production logging
- [ ] Add rate limiting
- [ ] Implement refresh tokens

---

## 📧 Support

For issues or questions, check:
1. MySQL service is running: `Get-Service MySQL*`
2. Backend logs for errors
3. Browser console for frontend errors
4. Network tab for API call failures

---

**Built with ❤️ using Spring Boot + React**
