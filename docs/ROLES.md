# User Roles Guide

This document describes the three user roles in the Emergency Medicine Finder application and their permissions.

## Overview

| Role | Description | Role ID in JWT |
|------|-------------|----------------|
| **User** | Patients seeking medicines | `user` |
| **Shopkeeper** | Pharmacy owners managing inventory, sales, purchases, expenses | `shopkeeper` |
| **Admin** | System administrators overseeing the entire platform | `admin` |

---

## User (Patient)

### Description

Regular users browse medicines, search shops, and request medications from pharmacies. They manage their own profile and view their request history.

### Access

| Page | Method | Description |
|------|--------|-------------|
| Home | `GET /` | Browse services and medicine catalog |
| Login | `GET /login` | Sign in to account |
| Register | `GET /signup` | Create new account |
| Profile | `GET /profile` | View/edit profile |
| My Requests | `GET /req` | View all medicine requests |
| Book Service | `POST /book-service` | Request a service |

### Permissions

- View medicine catalog and shop inventories
- Search for medicines by name with autocomplete
- Request medicines from specific shops
- Upload prescription images with requests
- View own request status (pending/approved/on hold)
- Delete own requests
- Update own profile
- Logout

### Registration Flow

1. User visits `/signup`
2. Fills form: name, gender, email, phone, address, password
3. Profile photo upload optional
4. Submit creates account with `status = 0` (inactive)
5. Verification email sent to user's email
6. User clicks link at `/verify-account/:id`
7. Account activated (`status = 1`)

---

## Shopkeeper

### Description

Pharmacy owners manage their shop's medicine inventory, set prices and stock levels, handle incoming medicine requests, and run full pharmacy operations including supplier management, purchases, sales, expenses, and profit/loss reporting. They can also export their data for offline use.

### Access

| Page | Method | Description |
|------|--------|-------------|
| Login | `GET /shopkeeperlogin` | Sign in to shop account |
| Register | `GET /shopkeepersignup` | Register new shop |
| Dashboard | `GET /shopkeeperdesh` | Main shop dashboard (inventory, stock) |
| Profile | `GET /shopprofile` | Edit shop profile (incl. lat/lng) |
| Requests | `GET /servicereq` | View incoming medicine requests |
| Pharmacy | `GET /pharmacy/dashboard` | Pharmacy overview (sales/profit/expenses) |
| Suppliers | `GET /pharmacy/suppliers` | Manage suppliers |
| Purchases | `GET /pharmacy/purchases` | Purchase orders with batch/expiry tracking |
| Sales | `GET /pharmacy/sales` | Sales with profit calculation |
| Expenses | `GET /pharmacy/expenses` | Expenses by category |
| Reports | `GET /pharmacy/reports` | Profit/loss with date range |
| Export | `GET /pharmacy/export` | Export data as JSON or CSV |
| Logout | `GET /shopkeeperlogout` | Sign out |

### Permissions

**Inventory:**
- View own shop dashboard with full inventory
- Add medicines to inventory (name, type, strength, generic, company, stock, price)
- Update stock (increase or decrease)
- View medicine stock alerts (low stock threshold: 10)

**Medicine Requests:**
- View incoming medicine requests from users
- Approve requests (sets status to approved)
- Hold requests (sets status to on hold)

**Pharmacy Management:**
- Manage suppliers (CRUD: name, company, email, phone, address, city)
- Record purchases with multi-item support (medicine, batch no, expiry date, quantity, unit price, MRP)
- Auto-increase inventory stock on purchase
- Record sales with multi-item support (medicine, quantity, selling price, cost price for profit calc)
- Auto-deduct inventory stock on sale
- Record expenses by category (rent, utility, salary, maintenance, marketing, other)
- Manage expense categories (custom per shop)
- View profit/loss reports with date range filter
- View expense breakdown by category
- View monthly summary (sales, profit, expenses, transaction count)

**Profile:**
- Update personal info (name, gender, phone)
- Update shop location (latitude, longitude)
- Change profile picture
- Address management (house, road, division, zila, upazila)

**Data Export:**
- Download all shop data as a single JSON file
- Download individual CSV files per table:
  - Suppliers, Purchases, Purchase Items, Sales, Sale Items, Expenses, Inventory

### Registration Flow

1. Shopkeeper visits `/shopkeepersignup`
2. Fills form: name, shop name, email, phone, NID front/back, address, location (lat/lng), password
3. Profile photo upload optional
4. Submit creates worker record with `status = 0`
5. Admin verifies and sets `status = 1` (or `status = 2` for hold)
6. Shopkeeper logs in after activation

---

## Admin

### Description

System administrators oversee the entire platform. They manage users and shopkeepers, the master medicine catalog, view all inventories, manage stock transfers between shops, and handle database backups.

### Access

| Page | Method | Description |
|------|--------|-------------|
| Dashboard | `GET /admin` | Main admin panel (stats: users, shops, medicines) |
| Users | `GET /user` | View all registered users |
| Shopkeepers | `GET /shopkeeper` | View all shopkeepers |
| Inventory | `GET /admin/inventory` | View all shop inventories |
| Filter by Shop | `GET /admin/shop-inventory` | Inventory for specific shop |
| Transfers | `GET /admin/transfers` | Manage stock transfers |
| Add Medicine | `POST /admin/add-medi` | Add to master catalog |
| Backups | `GET /admin/backups` | Database backup management |

### Permissions

**User Management:**
- View all registered users
- View all registered shopkeepers
- Verify shopkeeper accounts (`/verify-shopkeeper-account/:id`)
- Hold/block shopkeeper accounts (`/hold-shopkeeper-account/:id`)

**Inventory:**
- View complete inventory across all shops with shop details
- Filter inventory by specific shop
- Get shop inventory as JSON (for transfer forms)

**Stock Transfers:**
- Create stock transfers between shops (from_shop, to_shop, medicine_name, quantity)
- Approve transfers (auto-deducts source stock, auto-adds to destination)
- Reject transfers (no stock movement)

**Master Catalog:**
- Add new medicines to the master catalog (name, type, strength, generic, company)

**Backup Management:**
- View backup statistics (total count, total size, last backup date)
- Trigger manual full database backup via `mysqldump`
- Download backup `.sql.gz` files
- Delete old backup files

### Stock Transfer Flow

1. Admin creates transfer: `/admin/create-transfer`
   - Specifies `from_shop`, `to_shop`, `medicine_name`, `quantity`
2. Transfer created with `status = pending`
3. Admin approves: `/admin/approve-transfer/:id`
   - Source shop stock reduced
   - Destination shop stock increased
4. Or admin rejects: `/admin/reject-transfer/:id`

### Backup Flow

1. Automated: Runs daily at 2:00 AM via `node-cron` (configurable via `BACKUP_SCHEDULE`)
2. Manual: Admin clicks "Backup Now" on `/admin/backups`
3. Backup is created as `emergency_medicine_YYYY-MM-DD_HHmmss.sql.gz`
4. Old backups beyond `BACKUP_RETENTION_DAYS` are auto-deleted
5. Admin can download or delete individual backups from the web interface

---

## Authentication & Session Flow

### JWT Structure

On successful login, a JWT token is signed containing:

```json
{
  "name": "User Name",
  "mail": "user@email.com",
  "role": "user" | "shopkeeper" | "admin"
}
```

The token is stored in a signed HTTP-only cookie named by `COOKIE_NAME` env variable.

### Cookie Settings

- `httpOnly: true` — prevents JavaScript access
- `signed: true` — cookie is signed with `COOKIE_SECRET`
- `maxAge: 3 * 24 * 60 * 60 * 1000` (3 days)
- `encode: String` — no special encoding
- `path: /` — applies to entire site

### Single-Session-Per-Browser Enforcement

The app prevents the same account from being used on multiple browsers simultaneously:

1. On login, the browser generates a UUID stored in `localStorage` (`browserKey`)
2. The key is sent as a hidden form field during login
3. Server hashes it with SHA256 + `BROWSER_SECRET`
4. The hash is stored in `active_sessions` table with the email + role
5. If another browser tries to log into the same account, the existing session is detected and rejected
6. The same browser can re-login (same UUID replaces the session)
7. Sessions expire after `SESSION_EXPIRY_HOURS` (default: 8 hours)
8. Expired sessions are cleaned up every 10 minutes via `setInterval`

### Middleware Guards

| Middleware | Purpose |
|-----------|---------|
| `requireUser` | Redirect to `/login` if not user role |
| `requireShopkeeper` | Redirect to `/shopkeeperlogin` if not shopkeeper |
| `requireAdmin` | Redirect to `/admin` if not admin |
| `checkUser` | Populate `res.locals.user` and `res.locals.role` for all EJS templates |
| `redirectLoggedIn` | Redirect logged-in users away from login/signup pages |
| `redirectIfLoggedInAsRole(role)` | Redirect if already logged in as a specific role (prevents seeing wrong login page) |

### Logout Flow

Each logout controller:
1. Deletes the active session from `active_sessions` table
2. Clears the JWT cookie
3. Redirects to the appropriate login page

---

## Status Codes

| Table | Status | Meaning |
|-------|--------|---------|
| User | `0` | Inactive (email not verified) |
| User | `1` | Active |
| Shopkeeper | `0` | Pending admin verification |
| Shopkeeper | `1` | Active |
| Shopkeeper | `2` | On hold / Blocked |
| Admin | N/A | Single admin account, no status field |
| Medicine Request | `0` | Pending |
| Medicine Request | `1` | Approved |
| Medicine Request | `2` | On hold |
| Stock Transfer | `pending` | Awaiting approval |
| Stock Transfer | `approved` | Executed, stock moved |
| Stock Transfer | `rejected` | Cancelled |
| Purchase | `paid` | Fully paid |
| Purchase | `partial` | Partially paid |
| Purchase | `due` | Outstanding balance |

---

## Cross-Role Email Uniqueness

The same email address **cannot** be used to register as both a user and a shopkeeper (or admin). The `checkEmailAcrossRoles()` method checks all three tables (`users`, `worker`, `admin`) during registration and rejects duplicate emails.

---

## Quick Reference

| Task | How |
|------|-----|
| Login as user | `POST /login` → redirect to `/` |
| Login as shopkeeper | `POST /shopkeeperlogin` → redirect to `/shopkeeperdesh` |
| Login as admin | `POST /alogin` → redirect to `/admin` |
| Check current user in code | `req.user` (set by auth middleware) |
| Check current user in template | `res.locals.user` (set by `checkUser`) |
| Get user role in template | `res.locals.role` |
| Protect route for user only | Add `requireUser` middleware |
| Protect route for shopkeeper only | Add `requireShopkeeper` middleware |
| Protect route for admin only | Add `requireAdmin` middleware |
| Redirect if logged in | Add `redirectLoggedIn` or `redirectIfLoggedInAsRole()` |
| Trigger manual backup | Admin clicks "Backup Now" at `GET /admin/backups` |
| Export shop data | Shopkeeper visits `GET /pharmacy/export` |
