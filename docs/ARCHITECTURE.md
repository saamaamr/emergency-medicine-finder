# Emergency Medicine Finder - Architecture Documentation

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Systems](#core-systems)
  - [Authentication & Authorization](#authentication--authorization)
  - [Database Layer](#database-layer)
  - [OTP Verification System](#otp-verification-system)
  - [File Upload System](#file-upload-system)
  - [Backup System](#backup-system)
- [Frontend Architecture](#frontend-architecture)
- [API Route Structure](#api-route-structure)
- [Key Design Patterns](#key-design-patterns)
- [Security Implementation](#security-implementation)
- [Configuration Guide](#configuration-guide)

---

## System Overview

**Emergency Medicine Finder** is a full-stack web application that connects patients with local pharmacies across Bangladesh. The system enables:

- **Patients** to search for medicines across pharmacies, view availability, and submit requests
- **Pharmacy Owners (Shopkeepers)** to manage inventory, process sales/purchases/expenses, and generate reports
- **Administrators** to oversee all users, manage stock transfers, and maintain database backups

### Key Features

| Feature | Implementation |
|---------|---------------|
| Multi-role authentication | JWT + HTTP-only cookies |
| OTP verification | Sequential email → phone |
| Single session per browser | Browser key + localStorage UUID |
| Medicine search | MapLibre GL JS with geo-search |
| Pharmacy management | Full buy/sell cycle with profit calculation |
| Automated backups | node-cron + mysqldump |
| Data export | JSON + CSV formats |

---

## Technology Stack

### Runtime & Framework
- **Node.js** v14+ - JavaScript runtime
- **Express.js** v4.22+ - Web application framework
- **EJS** - Server-side templating engine

### Database
- **MySQL** v5.7+ - Relational database
- **mysql2** - Node.js MySQL driver with promise support
- Connection pooling (10 connections)

### Authentication & Security
- **jsonwebtoken** - JWT token generation/verification
- **bcryptjs** - Password hashing (10 salt rounds)
- **cookie-parser** - Signed HTTP-only cookies

### Utilities
- **express-validator** - Request validation
- **multer** - Multipart file uploads
- **nodemailer** - Email sending (SMTP)
- **node-cron** - Scheduled task execution

### External Services
- **MapLibre GL JS** - Interactive maps
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **Remix Icon** - Icon library

---

## Project Structure

```
emergency-medicine-finder/
├── app.js                          # Express application entry point
├── package.json                    # NPM dependencies and scripts
├── jest.config.js                  # Test configuration
│
├── config/
│   └── database.js                 # MySQL connection pool
│
├── controllers/
│   ├── UserController.js           # User, shopkeeper, admin operations
│   ├── PharmacyController.js       # Pharmacy CRUD operations
│   └── BackupController.js        # Backup & export operations
│
├── middleware/
│   ├── AuthMiddleware.js           # JWT verification & role guards
│   ├── errorHandler.js             # Global error handling
│   ├── decorateHtmlResponse.js    # Page title decoration
│   └── validator/
│       └── userValidator.js       # Express-validator rules
│
├── models/
│   └── UserModels.js               # Database query functions (80+ methods)
│
├── routers/
│   └── routes.js                   # Route definitions (137 routes)
│
├── services/
│   └── OTPService.js               # OTP generation & verification
│
├── cron/
│   ├── index.js                   # Cron job registration
│   └── backup.js                   # Backup execution logic
│
├── public/
│   ├── CSS/
│   │   ├── variables.css           # CSS custom properties / design tokens
│   │   ├── layout.css              # Header, footer, navigation styles
│   │   ├── home.css                # Home page specific styles
│   │   ├── components.css           # Reusable component styles
│   │   ├── style.css                # Main application styles
│   │   ├── astyle.css               # Admin panel styles
│   │   ├── map-style.css            # Map container styles
│   │   └── responsive.css           # Media queries
│   ├── JS/
│   │   ├── home.js                 # Map & search functionality
│   │   ├── signup.js               # Registration form handling
│   │   ├── admin.js                 # Admin page scripts
│   │   ├── service.js              # Service page scripts
│   │   ├── fetch.js                # API fetch utilities
│   │   └── custom.js               # General utilities
│   ├── images/                      # Static images
│   └── uploads/                    # User uploaded files
│
├── views/
│   ├── pages/                      # Full page templates (24 pages)
│   │   └── pharmacy/               # Pharmacy sub-pages (11 pages)
│   └── template/                   # Reusable partials (7 partials)
│
└── tests/                          # Test suite
```

---

## Core Systems

### Authentication & Authorization

#### JWT-Based Authentication

```
User Login Flow:
1. User submits credentials to /login
2. Controller verifies password with bcrypt.compare()
3. If valid, creates JWT with { name, mail, role }
4. Signs JWT with process.env.JWT_SECRET
5. Sets HTTP-only signed cookie with maxAge
6. Redirects to home page
```

#### Role-Based Access Control

| Middleware | Purpose |
|-----------|---------|
| `requireUser` | Guards user-only routes |
| `requireShopkeeper` | Guards shopkeeper routes |
| `requireAdmin` | Guards admin-only routes |

**Implementation** (`middleware/AuthMiddleware.js`):
- Verifies JWT token from signed cookie
- Decodes role from token payload
- Redirects to appropriate login if invalid
- Attaches decoded user to `req.user`

#### Single Session Enforcement

```
Browser Key System:
1. Client generates UUID on first visit (stored in localStorage)
2. UUID sent with login request as browserKey
3. Server hashes UUID with BROWSER_SECRET
4. Hash stored in active_sessions table
5. Subsequent logins from different browser key rejected
```

### Database Layer

#### Connection Pool Configuration

```javascript
// config/database.js
const dbConn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

#### Key Models (`models/UserModels.js`)

| Category | Methods |
|----------|---------|
| User CRUD | `insertRegisterM`, `getUser`, `mailCatchM`, `UserUpdateM` |
| Worker CRUD | `insertWorkerRegisterM`, `workermailCatchM`, `updateWorkerProfile` |
| Medicine | `medicine`, `shopmedicine`, `getMedicine`, `getaService` |
| Requests | `insertMediReqM`, `getMedicineUserReq`, `requestUpdateStatus` |
| Sessions | `createSession`, `deleteSession`, `cleanupExpiredSessions` |
| OTP | `createShopkeeperOTP`, `getShopkeeperOTP`, `deleteShopkeeperOTP` |
| Stock Transfer | `createStockTransfer`, `getStockTransfers`, `updateStockTransferStatus` |
| Pharmacy | `createSupplier`, `addPurchase`, `addSale`, `addExpense` |

### OTP Verification System

#### Sequential Verification Flow

```
Shopkeeper Registration/Login:
1. Submit credentials to /shopkeeperlogin or /shopkeepersignup
2. If not verified, generate email OTP
3. Send email OTP via nodemailer
4. Redirect to /shopkeeper-otp-verify (step=email)
5. Verify email OTP
6. Generate phone OTP
7. Send SMS via SMS API (if configured)
8. Redirect to /shopkeeper-otp-verify (step=phone)
9. Verify phone OTP
10. Mark email_verified=1 and phone_verified=1
11. Create session and redirect to dashboard
```

#### OTP Service Configuration

```javascript
// services/OTPService.js
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 3;

// OTP stored as SHA256 hash (not plaintext)
function hashOTP(otp) {
  return crypto.createHash('sha256')
    .update(otp + process.env.OTP_SECRET)
    .digest('hex');
}
```

### File Upload System

#### Multer Configuration

```javascript
// routers/routes.js
const upload = multer({ dest: 'public/uploads/' });

// Usage in routes
router.post('/signup', upload.fields([{ name: 'propic' }]), ...)
router.post('/shopkeepersignup', upload.fields([
  { name: 'propic' },
  { name: 'nid1' },
  { name: 'nid2' }
]), ...)
```

#### Upload Types

| Route | Fields | Purpose |
|-------|--------|---------|
| `/signup` | `propic` | User profile photo |
| `/shopkeepersignup` | `propic`, `nid1`, `nid2` | Shop photo, NID front/back |
| `/request` | `ppic` | Prescription image |

### Backup System

#### Automated Backup

```javascript
// cron/index.js
cron.schedule('0 2 * * *', async () => {
  await runFullBackup();
});

// Backup runs daily at 2 AM (configurable)
```

#### Backup Features

- mysqldump to .sql.gz format
- Configurable retention (default 30 days)
- Manual trigger via admin panel
- Download and delete capabilities

---

## Frontend Architecture

### CSS Architecture

The project uses a modular CSS structure:

```
CSS Priority (later overrides earlier):
1. variables.css     - Design tokens (colors, shadows, transitions)
2. layout.css        - Header, footer, navigation (shared)
3. components.css   - Reusable UI components
4. home.css          - Page-specific styles
5. style.css         - Main application styles (legacy)
```

#### Design System Variables

```css
/* variables.css */
:root {
  /* Primary Colors */
  --color-primary: #0284C7;
  --color-primary-dark: #0369A1;
  --color-cta: #059669;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Focus Ring */
  --focus-ring: 0 0 0 3px rgba(8, 145, 178, 0.4);
}
```

### Template Structure

#### Layout Partials

| File | Purpose |
|------|---------|
| `header.ejs` | Main app header (for authenticated users) |
| `lheader.ejs` | Light header (for public pages) |
| `aheader.ejs` | Admin panel header |
| `nav.ejs` | Navigation bar with search |
| `footer.ejs` | Full footer |
| `lfooter.ejs` | Light footer |
| `alfooter.ejs` | Admin footer |

### Client-Side Features

#### Map Search (home.js)

```javascript
// Initializes MapLibre GL map
// Fetches shops with searched medicine
// Displays results in sidebar with distance calculation
```

#### Medicine Autocomplete

```javascript
// GET /medicine-suggestions?q=para
// Returns JSON array of matching medicines
// Debounced input for performance
```

---

## API Route Structure

### Total Routes: 137

| Category | Count | Examples |
|----------|-------|----------|
| Public Pages | 15 | `/`, `/home`, `/about`, `/contact` |
| Auth | 15 | `/login`, `/logout`, `/shopkeeperlogin` |
| User | 12 | `/profile`, `/req`, `/userupdate` |
| Shopkeeper | 20 | `/shopkeeperdesh`, `/servicereq` |
| Pharmacy | 25 | `/pharmacy/*` (dashboard, sales, purchases, etc.) |
| Admin | 25 | `/admin`, `/admin/inventory`, `/admin/transfers` |
| Data API | 15 | `/medicine`, `/searchmedicine`, `/medicine-suggestions` |

---

## Key Design Patterns

### Controller-Service-Model

```
Request → Route → Controller → Model → Database
                  ↓
               Service (OTPService)
```

### Middleware Chain

```
Request → AuthMiddleware.checkUser
         → Role Guard (requireUser/Shopkeeper/Admin)
         → Controller
         → Error Handler
```

### Session Management

- JWT stored in signed HTTP-only cookie
- Browser key stored in active_sessions table
- Session cleanup every 10 minutes via setInterval

---

## Security Implementation

### Implemented Security Measures

| Measure | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs with 10 salt rounds |
| JWT Signing | HS256 with JWT_SECRET |
| Cookie Security | httpOnly, signed, secure (production) |
| Session Binding | Browser key hashed with BROWSER_SECRET |
| OTP Storage | SHA256 hashed (not plaintext) |
| SQL Injection | Parameterized queries (mysql2 prepared statements) |
| XSS Protection | EJS auto-escaping, no innerHTML |
| CSRF | Not implemented (cookie-based session limits) |

### Environment Variables Required

```
JWT_SECRET       # JWT signing key
COOKIE_SECRET    # Cookie signing key
BROWSER_SECRET   # Browser key hashing salt
OTP_SECRET       # OTP hashing salt
SMTP_PASS        # Email account password
SMS_API_KEY      # SMS API authentication
```

---

## Configuration Guide

### Required Configuration Files

1. **`.env`** - Environment variables (not in version control)
2. **`.env.sample`** - Template for developers

### Key Configuration Options

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_*` | Database connection | MySQL credentials |
| `JWT_SECRET` | Token signing | `your-secret-key` |
| `SESSION_EXPIRY_HOURS` | Default session | `8` |
| `USER_SESSION_HOURS` | User session | `3` |
| `SHOPKEEPER_SESSION_HOURS` | Shopkeeper session | `24` |
| `BACKUP_SCHEDULE` | Cron schedule | `0 2 * * *` |

### Database Setup

```bash
# Option 1: Direct MySQL
mysql -u root -p < database_setup.sql

# Option 2: Node.js runner
node run-sql.js database_setup.sql
```

---

## Testing

### Test Coverage

| Test Suite | Coverage |
|------------|----------|
| Controller tests | UserController business logic |
| Middleware tests | Auth guards, role verification |
| Model tests | Database queries, edge cases |
| Route tests | Validation, routing |
| Integration tests | Full user journeys |
| Security tests | Auth bypass, injection attempts |

### Running Tests

```bash
npm test           # Run all tests
npm run test:watch  # Watch mode
```

---

## Performance Considerations

- **Database**: Connection pooling (10 connections)
- **Sessions**: Periodic cleanup (every 10 min)
- **Images**: Lazy loading in map view
- **Search**: Debounced autocomplete (300ms)
- **Backups**: Configurable retention to manage disk space

---

## Future Enhancements

Potential improvements for the system:

- Real-time notifications for medicine requests
- Payment integration for online orders
- Mobile application (React Native)
- Analytics dashboard for admins
- Multi-language support
- SMS notifications for users

---

*Last Updated: May 2026*
*Version: 1.0.0*