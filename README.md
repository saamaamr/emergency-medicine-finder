# Emergency Medicine Finder

A full-stack web application for finding emergency medicines and managing pharmacy operations in Bangladesh. Users search medicines across local pharmacies, shopkeepers manage inventory/sales/expenses, and admins oversee the entire platform.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Testing](#testing)
- [Sample Accounts](#sample-accounts)
- [Troubleshooting](#troubleshooting)

---

## Features

| Category | Description |
|----------|-------------|
| **Authentication** | Three-role auth (user/shopkeeper/admin) with JWT cookies, email verification, single-session-per-browser enforcement |
| **Medicine Search** | Search across shops with autocomplete suggestions |
| **Medicine Requests** | Users request medicines from shops with prescription photo upload |
| **Stock Management** | Shopkeepers manage inventory stock levels and pricing |
| **Pharmacy Management** | Full buy/sell cycle: suppliers, purchases (with batch/expiry), sales (with profit calc), expenses/categories, profit/loss reports |
| **Data Export** | Shopkeepers export their data as JSON or per-table CSV files |
| **Stock Transfers** | Admin-initiated medicine transfers between shops |
| **Automated Backups** | Daily cron `mysqldump` to gzipped SQL files with configurable retention |
| **Manual Backups** | Admin can trigger, download, and delete database backups on demand |
| **Admin Dashboard** | Users, shops, inventory, transfers, and backup management |
| **Contact System** | Contact form for user inquiries |
| **Location Tracking** | Shopkeepers can set their latitude/longitude on their profile |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js v14+ |
| **Framework** | Express 4 |
| **Template Engine** | EJS |
| **Database** | MySQL (via mysql2 driver with connection pool) |
| **Auth** | JSON Web Tokens (jsonwebtoken) stored in signed HTTP-only cookies |
| **Validation** | express-validator |
| **File Uploads** | Multer |
| **Password Hashing** | bcryptjs |
| **Email** | Nodemailer (SMTP) |
| **Scheduling** | node-cron (daily backup) |
| **Testing** | Jest + Supertest |

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.sample .env
```

Edit `.env` with your settings (see [Configuration](#configuration)).

### 3. Setup Database

Option A — MySQL CLI:
```bash
mysql -u root -p < database_setup.sql
```

Option B — Node.js runner:
```bash
node run-sql.js database_setup.sql
```

### 4. Start Server

```bash
npm start          # production
npm run dev        # development (nodemon + auto-kill-port)
```

Access at `http://localhost:3000`

---

## User Roles

The application has three distinct user roles:

| Role | Description | Dashboard |
|------|-------------|-----------|
| **User** | Patients seeking medicines | `/profile`, `/req` |
| **Shopkeeper** | Pharmacy owners managing inventory, sales, purchases, expenses | `/shopkeeperdesh`, `/pharmacy/dashboard` |
| **Admin** | System administrators overseeing everything | `/admin`, `/admin/backups` |

### Login URLs

| Role | Login Page | After Login |
|------|-----------|-------------|
| User | `/login` | Home page with user menu |
| Shopkeeper | `/shopkeeperlogin` | Shopkeeper dashboard |
| Admin | `/admin` | Admin dashboard |

### Role Permissions

| Action | User | Shopkeeper | Admin |
|--------|------|-----------|-------|
| Browse medicines & services | Yes | Yes | Yes |
| Search medicines with autocomplete | Yes | Yes | Yes |
| Request medicines from shops | Yes | — | — |
| Upload prescription with requests | Yes | — | — |
| View own request history | Yes | — | — |
| Delete own requests | Yes | — | — |
| Update own profile | Yes | — | — |
| View incoming medicine requests | — | Yes | Yes |
| Approve / hold medicine requests | — | Yes | Yes |
| Manage own inventory (add/view/update stock) | — | Yes | — |
| Manage medicine catalog (shop-level) | — | Yes | — |
| **Pharmacy: Manage suppliers** | — | Yes | — |
| **Pharmacy: Record purchases (multi-item with batch/expiry)** | — | Yes | — |
| **Pharmacy: Record sales (multi-item with profit calc)** | — | Yes | — |
| **Pharmacy: Record expenses by category** | — | Yes | — |
| **Pharmacy: View profit/loss reports** | — | Yes | — |
| **Pharmacy: View monthly summary** | — | Yes | — |
| **Pharmacy: Export data (JSON / CSV)** | — | Yes | — |
| Update shop location (lat/lng) | — | Yes | — |
| Update shop profile picture | — | Yes | — |
| View all shop inventories | — | — | Yes |
| Filter inventory by shop | — | — | Yes |
| Manage stock transfers between shops | — | — | Yes |
| Manage all users & shopkeepers | — | — | Yes |
| Verify / hold / block shopkeeper accounts | — | — | Yes |
| Add master medicine catalog | — | — | Yes |
| Trigger / download / delete database backups | — | — | Yes |
| Submit contact form | Yes | Yes | Yes |

---

## Project Structure

```
emergency-medicine-finder/
├── app.js                    # Application entry point (Express)
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── .env.sample               # Environment template
├── jest.config.js            # Jest configuration
├── database_setup.sql        # Full DB schema + seed data (18 tables)
├── run-sql.js                # SQL file runner (Node.js)
│
├── config/
│   └── database.js           # MySQL connection pool
│
├── controllers/
│   ├── UserController.js     # User, shopkeeper, admin business logic (935 lines)
│   ├── PharmacyController.js # Pharmacy management CRUD (369 lines)
│   └── BackupController.js   # Backup & data export (128 lines)
│
├── middleware/
│   ├── AuthMiddleware.js      # JWT auth, role guards, session enforcement
│   ├── errorHandler.js        # Global Express error handler
│   ├── decorateHtmlResponse.js
│   └── validator/
│       └── userValidator.js   # express-validator rules
│
├── models/
│   └── UserModels.js          # All database query functions (616 lines, 65+ methods)
│
├── routers/
│   └── routes.js              # All route definitions (82 routes)
│
├── cron/
│   ├── index.js               # Cron job registration (node-cron)
│   └── backup.js              # Backup engine (mysqldump, export, listing)
│
├── public/
│   ├── CSS/                   # Stylesheets (7 files)
│   ├── JS/                    # Client-side scripts (9 files)
│   ├── images/                # Logos, icons, map markers (18 files)
│   └── uploads/               # Uploaded photos, NIDs, prescriptions
│
├── views/
│   ├── pages/                 # 23 page templates
│   │   └── pharmacy/          # 11 pharmacy management sub-pages
│   └── template/              # 7 reusable partials (header, footer, nav)
│
├── docs/
│   ├── API.md                 # Full API reference
│   ├── ROLES.md               # User roles & permissions guide
│   └── SECURITY.md            # Security architecture & hardening guide
│
├── tests/
│   ├── controllers/           # UserController tests
│   ├── middleware/            # AuthMiddleware tests
│   ├── models/                # UserModels + edge case tests
│   ├── routes/                # Route/validator tests
│   ├── integration/           # Full user journey tests
│   ├── security/              # Security tests
│   └── __mocks__/             # Nodemailer mock
│
├── backups/                   # Backup .sql.gz files (gitignored)
├── scripts/
│   └── kill-port.js           # Utility to kill port process
└── utils/
    └── emailUtils.js          # Nodemailer email utilities
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/login` | User login page | — |
| `POST` | `/login` | User login (email, pass, browserKey) | — |
| `GET` | `/logout` | User logout | User |
| `GET` | `/shopkeeperlogin` | Shopkeeper login page | — |
| `POST` | `/shopkeeperlogin` | Shopkeeper login | — |
| `GET` | `/shopkeeperlogout` | Shopkeeper logout | Shopkeeper |
| `GET` | `/admin` | Admin dashboard | Admin |
| `POST` | `/alogin` | Admin login (userid, pass) | — |
| `GET` | `/adminlogout` | Admin logout | Admin |

### User Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/signup` | User registration page | — |
| `POST` | `/signup` | Register new user (multipart) | — |
| `GET` | `/profile` | User profile page | User |
| `GET` | `/userupdate` | Edit profile page | User |
| `POST` | `/userupdate` | Update profile (multipart) | User |
| `GET` | `/verify-account/:id` | Verify email (activates user) | — |

### Shopkeeper Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/shopkeepersignup` | Shopkeeper registration page | — |
| `POST` | `/shopkeepersignup` | Register shop (multipart) | — |
| `GET` | `/shopkeeperdesh` | Main dashboard + inventory | Shopkeeper |
| `GET` | `/shopprofile` | Profile page with lat/lng | Shopkeeper |
| `POST` | `/shopprofile` | Update profile (multipart) | Shopkeeper |
| `POST` | `/add-medicine` | Add medicine to inventory | Shopkeeper |
| `POST` | `/update-stock` | Increase/decrease stock | Shopkeeper |

### Medicine Requests

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/req` | User's request history | User |
| `GET` | `/request/:service_id` | Request a specific medicine | User |
| `POST` | `/request` | Submit request (multipart) | User |
| `GET` | `/delete-medicine-request/:id` | Delete own request | User |
| `GET` | `/servicereq` | Incoming requests (shopkeeper) | Shopkeeper |
| `GET` | `/verify-medicine-request/:id` | Approve request | Shopkeeper |
| `GET` | `/hold-medicine-request/:id` | Hold request | Shopkeeper |

### Pharmacy Management (Shopkeeper)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/pharmacy/dashboard` | Pharmacy overview (today sales, profit, expenses) |
| `GET` | `/pharmacy/suppliers` | Supplier list |
| `POST` | `/pharmacy/suppliers/add` | Add supplier |
| `POST` | `/pharmacy/suppliers/update/:id` | Update supplier |
| `GET` | `/pharmacy/suppliers/delete/:id` | Delete supplier |
| `GET` | `/pharmacy/expenses` | Expense list with categories |
| `POST` | `/pharmacy/expenses/add` | Add expense |
| `POST` | `/pharmacy/expenses/update/:id` | Update expense |
| `GET` | `/pharmacy/expenses/delete/:id` | Delete expense |
| `POST` | `/pharmacy/expense-categories/add` | Add expense category |
| `GET` | `/pharmacy/purchases` | Purchase order list |
| `GET` | `/pharmacy/purchases/add` | Add purchase form |
| `POST` | `/pharmacy/purchases/add` | Create purchase (multi-item, auto-stock) |
| `GET` | `/pharmacy/purchases/view/:id` | Purchase detail |
| `GET` | `/pharmacy/purchases/delete/:id` | Delete purchase |
| `GET` | `/pharmacy/sales` | Sales list |
| `GET` | `/pharmacy/sales/add` | Add sale form |
| `POST` | `/pharmacy/sales/add` | Create sale (multi-item, auto-profit) |
| `GET` | `/pharmacy/sales/view/:id` | Sale detail |
| `GET` | `/pharmacy/sales/delete/:id` | Delete sale |
| `GET` | `/pharmacy/reports` | Profit/loss with date range |

### Data Export (Shopkeeper)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/pharmacy/export` | Export page with format options |
| `GET` | `/pharmacy/export/download/json` | Download all shop data as JSON |
| `GET` | `/pharmacy/export/download/csv/suppliers` | Download suppliers CSV |
| `GET` | `/pharmacy/export/download/csv/purchases` | Download purchases CSV |
| `GET` | `/pharmacy/export/download/csv/purchase-items` | Download purchase items CSV |
| `GET` | `/pharmacy/export/download/csv/sales` | Download sales CSV |
| `GET` | `/pharmacy/export/download/csv/sale-items` | Download sale items CSV |
| `GET` | `/pharmacy/export/download/csv/expenses` | Download expenses CSV |
| `GET` | `/pharmacy/export/download/csv/inventory` | Download inventory CSV |

### Admin — Inventory & Transfers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/inventory` | View all shop inventories | Admin |
| `GET` | `/admin/shop-inventory` | Filter inventory by shop | Admin |
| `GET` | `/admin/shop-inventory-json` | JSON inventory by shop | Admin |
| `GET` | `/admin/transfers` | View stock transfers | Admin |
| `POST` | `/admin/create-transfer` | Create stock transfer | Admin |
| `GET` | `/admin/approve-transfer/:id` | Approve transfer (moves stock) | Admin |
| `GET` | `/admin/reject-transfer/:id` | Reject transfer | Admin |

### Admin — Backup Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/backups` | List backups with stats |
| `POST` | `/admin/backups/trigger` | Run manual mysqldump now |
| `GET` | `/admin/backups/download/:file` | Download backup .sql.gz |
| `GET` | `/admin/backups/delete/:file` | Delete backup file |

### Admin — Account Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/user` | List all users | Admin |
| `GET` | `/shopkeeper` | List all shopkeepers | Admin |
| `POST` | `/add-medi` | Add to master medicine catalog | Admin |
| `GET` | `/verify-shopkeeper-account/:id` | Activate shopkeeper | Admin |
| `GET` | `/hold-shopkeeper-account/:id` | Hold/block shopkeeper | Admin |

### Public Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page |
| `GET` | `/home` | Home page |
| `GET` | `/about` | About page |
| `GET` | `/contact` | Contact form page |
| `POST` | `/contact` | Submit contact form |
| `GET` | `/offer` | Offers page |
| `GET` | `/service` | Services / medicine catalog |
| `GET` | `/medicine` | Medicine detail by `?mid=` |
| `GET` | `/searchmedicine` | Search by `?mname=` |
| `GET` | `/medicine-suggestions` | Autocomplete by `?q=` |

### Query Parameters (GET APIs)

| Endpoint | Parameters | Description |
|----------|------------|-------------|
| `/medicine` | `mid` | Get medicine by ID (JSON) |
| `/searchmedicine` | `mname` | Search medicine name across shops (JSON) |
| `/medicine-suggestions` | `q` | Prefix string (min 1 char, limit 10) |
| `/admin/shop-inventory` | `email` | Filter inventory by shop email |
| `/admin/shop-inventory-json` | `email` | JSON of shop inventory |
| `/pharmacy/reports` | `start`, `end` | Date range for report |

---

## Database Schema

### Tables (17 total)

| Table | Description |
|-------|-------------|
| `users` | Patient/user accounts with address and profile |
| `worker` | Shopkeeper accounts with shop details, lat/lng |
| `medicine` | Master medicine catalog (name, type, strength, generic, company) |
| `shopmedicine` | Shop-specific inventory (stock, price per shop) |
| `medicine_request` | User requests to shops (pending/approved/hold) |
| `org_service` | Available services |
| `admin` | Administrator accounts |
| `active_sessions` | Browser session tracking (single-session enforcement) |
| `stock_transfer` | Inter-shop medicine transfers |
| `suppliers` | Pharmacy supplier records |
| `expense_categories` | Expense categories per shop (rent, utility, salary, etc.) |
| `expenses` | Shop expense transactions |
| `purchases` | Purchase orders from suppliers |
| `purchase_items` | Purchase line items (batch no, expiry, qty, price) |
| `sales` | Sales transactions (retail/wholesale/prescription) |
| `sale_items` | Sale line items with cost price and profit |
| `daily_summary` | Daily profit/loss summary |

### Status Codes

| Table | Field | Values |
|-------|-------|--------|
| `users` | `status` | `0` = inactive, `1` = active |
| `worker` | `status` | `0` = pending, `1` = active, `2` = held |
| `medicine_request` | `status` | `0` = pending, `1` = approved, `2` = on hold |
| `stock_transfer` | `status` | `pending`, `approved`, `rejected` |
| `purchases` | `payment_status` | `paid`, `partial`, `due` |

---

## Configuration

### Environment Variables

Create a `.env` file from `.env.sample`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_NAME` | Database name | `emergency_medicine` |
| `DB_PASS` | MySQL password | _(empty)_ |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret | |
| `COOKIE_NAME` | Session cookie name | `token` |
| `COOKIE_SECRET` | Cookie signing secret | |
| `BASE_URL` | App base URL (for email links) | `http://localhost:3000` |
| `SESSION_EXPIRY_HOURS` | Active session lifetime | `8` |
| `BROWSER_SECRET` | Secret for browser key hashing | |
| `SMTP_HOST` | SMTP server for emails | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `465` |
| `SMTP_USER` | SMTP username | |
| `SMTP_PASS` | SMTP password | |
| `BACKUP_DIR` | Directory for backup files | `./backups` |
| `BACKUP_SCHEDULE` | Cron expression for auto-backup | `0 2 * * *` (daily 2 AM) |
| `BACKUP_RETENTION_DAYS` | Keep backups for N days | `30` |

### Required Dependencies

- Node.js v14 or higher
- MySQL Server 5.7+
- `mysqldump` CLI (for backup functionality — included with MySQL)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Development with auto-restart + port kill |
| `npm run dev:force` | Nodemon without port kill |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run kill` | Kill process on the configured port |

---

## Testing

### Run Tests

```bash
npm test
```

### Test Structure

| File | Lines | Coverage |
|------|-------|----------|
| `tests/controllers/UserController.test.js` | 614 | Controller logic |
| `tests/middleware/AuthMiddleware.test.js` | 240 | Auth guards |
| `tests/models/UserModels.test.js` | 353 | Database queries |
| `tests/models/ModelEdgeCases.test.js` | 169 | Edge cases |
| `tests/routes/routes.test.js` | 72 | Route validation |
| `tests/integration/userJourney.test.js` | 349 | Full user flow |
| `tests/security/security.test.js` | 306 | Security tests |

### Test Configuration

Jest is configured via `jest.config.js`:
- Uses `supertest` for HTTP assertions
- `__mocks__/nodemailer.js` mails mock SMTP calls
- Tests set their own `process.env` values in `tests/setup.js`

---

## Sample Accounts

The database seed includes the following test accounts (all `status = 1`, no email verification needed):

### Admin

| Email | Password |
|-------|----------|
| `admin@emf.com` | `admin123` |

### Users (Patients)

| Email | Password | Name |
|-------|----------|------|
| `rahim@email.com` | `user123` | Rahim Miah |
| `fatima@email.com` | `user123` | Fatima Begum |
| `karim@email.com` | `user123` | Karim Hossain |

### Shopkeepers (Pharmacies)

| Email | Password | Shop Name | Location |
|-------|----------|-----------|----------|
| `haque@pharmacy.com` | `worker123` | Haques Pharmacy | Dhaka, Mirpur |
| `shahida@medical.com` | `worker123` | Shahida Medical Store | Chattogram, Agrabad |
| `alam@pharma.com` | `worker123` | Alam Brothers Pharma | Dhaka, Uttara |

---

## Troubleshooting

### Database Connection Issues

1. Ensure MySQL service is running
2. Verify credentials in `.env`
3. Confirm database exists: `SHOW DATABASES;`
4. Run the full setup: `node run-sql.js database_setup.sql`

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
# or use the kill script
npm run kill
```

### Backup Fails

- Ensure `mysqldump` is installed and accessible via PATH
- Verify `BACKUP_DIR` is writable (default `./backups`)
- Check the cron schedule expression in `BACKUP_SCHEDULE`
- Backups folder is gitignored — files won't appear in version control

### Session / Cookie Issues

- Clear browser cookies for localhost
- Verify `COOKIE_SECRET` and `BROWSER_SECRET` are set in `.env`
- The app enforces single-session-per-browser using `localStorage` UUID

### Missing Dependencies

```bash
npm install
```

If bcrypt fails on Windows:
```bash
npm install --global windows-build-tools
```

---

## License

MIT License
