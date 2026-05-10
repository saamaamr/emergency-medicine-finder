# Emergency Medicine Finder

A web application for finding emergency medicines and medical services in Bangladesh. Users can search for medicines across local pharmacies, request them from nearby shops, and manage their healthcare needs.

## Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Testing](#testing)
- [Sample Accounts](#sample-accounts)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Features

| Category | Description |
|----------|-------------|
| **Authentication** | User, shopkeeper, and admin registration with email verification |
| **Medicine Search** | Search medicines across shops with autocomplete suggestions |
| **Medicine Requests** | Users request medicines from specific shops with prescription upload |
| **Inventory Management** | Shopkeepers manage their medicine stock and pricing |
| **Admin Dashboard** | Overview of users, shops, inventory, and stock transfers |
| **Stock Transfers** | Admin-initiated medicine transfers between shops |
| **Contact System** | Contact form for user inquiries |

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

```bash
mysql -u root -p < database_setup.sql
```

### 4. Start Server

```bash
npm start
```

Access at `http://localhost:3440`

---

## User Roles

The application has three distinct user roles:

| Role | Description | Dashboard |
|------|-------------|-----------|
| **User** | Patients seeking medicines | `/profile`, `/req` |
| **Shopkeeper** | Pharmacy owners managing inventory | `/shopkeeperdesh`, `/servicereq` |
| **Admin** | System administrators | `/admin`, `/admin/inventory` |

### Quick Reference — Login URLs

| Role | Login Page | After Login |
|------|-----------|-------------|
| User | `/login` | Home page with user menu |
| Shopkeeper | `/shopkeeperlogin` | Shopkeeper dashboard |
| Admin | `/admin` | Admin dashboard |

### Role Permissions

| Action | User | Shopkeeper | Admin |
|--------|------|-----------|-------|
| View services | Yes | Yes | Yes |
| Request medicines | Yes | — | — |
| Manage own inventory | — | Yes | — |
| View all inventories | — | — | Yes |
| Approve requests | — | Yes | Yes |
| Create stock transfers | — | — | Yes |
| Manage users | — | — | Yes |
| Verify accounts | — | — | Yes |

---

## Project Structure

```
emergency-medicine-finder/
├── app.js                    # Application entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── .env.sample               # Environment template
├── jest.config.js            # Jest configuration
│
├── config/
│   └── database.js           # MySQL connection pool
│
├── controllers/
│   └── UserController.js      # All business logic handlers
│
├── middleware/
│   ├── AuthMiddleware.js      # JWT auth & role guards
│   ├── errorHandler.js        # Global error handling
│   ├── decoratorHtmlResponse.js
│   ├── decorateHtmlResponse.js
│   └── validator/
│       └── userValidator.js   # Input validation rules
│
├── models/
│   └── UserModels.js          # Database query functions
│
├── routers/
│   └── routes.js              # All route definitions
│
├── public/
│   ├── CSS/                   # Stylesheets
│   ├── JS/                    # Client-side scripts
│   └── uploads/               # Uploaded files (profiles, prescriptions, NIDs)
│
├── views/
│   ├── pages/                 # Page templates (home, login, dashboard, etc.)
│   └── template/              # Reusable components (header, footer, navbar)
│
├── database_setup.sql         # Complete schema and seed data
├── test_data_dhaka.sql        # Sample data for Dhaka region
├── test_data_chattogram.sql   # Sample data for Chattogram region
│
└── tests/                     # Test suite
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/login` | User login page | — |
| `POST` | `/login` | User login (email, pass) | — |
| `GET` | `/logout` | User logout | User |
| `GET` | `/shopkeeperlogin` | Shopkeeper login page | — |
| `POST` | `/shopkeeperlogin` | Shopkeeper login | — |
| `GET` | `/shopkeeperlogout` | Shopkeeper logout | Shopkeeper |
| `GET` | `/admin` | Admin dashboard | Admin |
| `POST` | `/alogin` | Admin login | — |
| `GET` | `/adminlogout` | Admin logout | Admin |

### User Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/signup` | User registration page | — |
| `POST` | `/signup` | User registration | — |
| `GET` | `/profile` | User profile page | User |
| `GET` | `/userupdate` | Edit profile page | User |
| `POST` | `/userupdate` | Update profile | User |

### Shopkeeper Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/shopkeepersignup` | Shopkeeper registration | — |
| `POST` | `/shopkeepersignup` | Shopkeeper registration | — |
| `GET` | `/shopkeeperdesh` | Shopkeeper dashboard | Shopkeeper |
| `GET` | `/mediupdate` | Inventory update page | Shopkeeper |
| `POST` | `/add-medicine` | Add medicine to inventory | Shopkeeper |

### Medicine & Services

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/service` | View all services/medicines | — |
| `GET` | `/medicine` | Get medicine details by ID | — |
| `GET` | `/searchmedicine` | Search medicines across shops | — |
| `GET` | `/medicine-suggestions` | Autocomplete suggestions | — |
| `POST` | `/book-service` | Book a service | User |
| `POST` | `/admin/add-medi` | Add master medicine catalog | Admin |

### Medicine Requests

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/req` | User's medicine requests | User |
| `GET` | `/request/:service_id` | Request specific medicine | User |
| `POST` | `/request` | Submit medicine request | User |
| `GET` | `/delete-medicine-request/:id` | Delete own request | User |
| `GET` | `/servicereq` | Incoming requests for shop | Shopkeeper |
| `GET` | `/verify-medicine-request/:id` | Approve request | Shopkeeper |
| `GET` | `/hold-medicine-request/:id` | Hold request | Shopkeeper |

### Admin & Inventory

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/inventory` | View all shop inventories | Admin |
| `GET` | `/admin/shop-inventory` | Filter inventory by shop | Admin |
| `GET` | `/admin/transfers` | View stock transfers | Admin |
| `POST` | `/admin/create-transfer` | Create stock transfer | Admin |
| `GET` | `/admin/approve-transfer/:id` | Approve transfer | Admin |
| `GET` | `/admin/reject-transfer/:id` | Reject transfer | Admin |

### Account Verification

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/verify-account/:id` | Verify user account | — |
| `GET` | `/verify-shopkeeper-account/:id` | Verify shopkeeper | Admin |
| `GET` | `/hold-shopkeeper-account/:id` | Hold shopkeeper account | Admin |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page |
| `GET` | `/home` | Home page |
| `GET` | `/about` | About page |
| `GET` | `/contact` | Contact page |
| `POST` | `/contact` | Submit contact form |
| `GET` | `/offer` | Special offers page |
| `GET` | `/booked` | User's booked services |
| `GET` | `/user` | View all users (admin) |
| `GET` | `/shopkeeper` | View all shopkeepers (admin) |

### Query Parameters (GET APIs)

| Endpoint | Parameters | Description |
|----------|------------|-------------|
| `/medicine` | `mid` | Get medicine by ID |
| `/searchmedicine` | `mname` | Search medicine name |
| `/medicine-suggestions` | `q` | Prefix for autocomplete |
| `/admin/shop-inventory` | `email` | Filter by shop email |
| `/admin/shop-inventory-json` | `email` | JSON view of shop inventory |

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `users` | Patient/user accounts with address and profile |
| `worker` | Shopkeeper accounts with shop details and location |
| `medicine` | Master medicine catalog (name, type, strength, generic, company) |
| `shopmedicine` | Shop-specific inventory (stock, price per shop) |
| `medicine_request` | User requests to shops (status: pending/approved/on hold) |
| `org_service` | Available services (medicine delivery, consultation, etc.) |
| `admin` | Administrator accounts |
| `stock_transfer` | Inter-shop medicine transfer records |
| `contact_messages` | Contact form submissions |

### Status Codes

| Table | Field | Values |
|-------|-------|--------|
| `users` | `status` | `0` = inactive, `1` = active |
| `worker` | `status` | `0` = pending, `1` = active, `2` = held |
| `medicine_request` | `status` | `0` = pending, `1` = approved, `2` = on hold |
| `stock_transfer` | `status` | `pending`, `approved`, `rejected` |

---

## Configuration

### Environment Variables

Create a `.env` file based on `.env.sample`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_NAME` | Database name | `emergency_medicine` |
| `DB_PASS` | MySQL password | `your_password` |
| `PORT` | Server port | `3440` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `COOKIE_NAME` | Session cookie name | `token` |
| `COOKIE_SECRET` | Cookie signing secret | `your_cookie_secret` |
| `BASE_URL` | Application base URL | `http://localhost:3440` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `465` |
| `SMTP_USER` | SMTP username | `your_email@gmail.com` |
| `SMTP_PASS` | SMTP password | `your_app_password` |

### Required Dependencies

- Node.js v14 or higher
- MySQL Server

---

## Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Test Configuration

Jest is configured via `jest.config.js`. The test suite uses:
- `supertest` for HTTP assertions
- `jest` as the test runner

---

## Sample Accounts

The database seed includes the following test accounts:

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

> All seed accounts have `status = 1` (active). No email verification required for login.

---

## Contributing

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes
4. Run tests:

   ```bash
   npm test
   ```

5. Commit with a clear message:

   ```bash
   git commit -m "Add: brief description of changes"
   ```

6. Push and open a pull request

---

## Troubleshooting

### Database Connection Issues

1. Ensure MySQL service is running
2. Verify credentials in `.env`
3. Confirm database `emergency_medicine` exists:

   ```sql
   SHOW DATABASES;
   USE emergency_medicine;
   SHOW TABLES;
   ```

4. Check user permissions:

   ```sql
   SHOW GRANTS FOR 'root'@'localhost';
   ```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3440

# Stop the process or change PORT in .env
```

### Missing Dependencies

```bash
npm install
```

If bcrypt fails, ensure build tools are installed:

```bash
npm install --global windows-build-tools
```

### Session/Cookie Issues

- Clear browser cookies for localhost
- Verify `COOKIE_SECRET` is set in `.env`
- Ensure browser allows cookies

---

## License

MIT License