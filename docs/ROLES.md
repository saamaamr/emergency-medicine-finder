# User Roles Guide

This document describes the three user roles in the Emergency Medicine Finder application and their permissions.

## Overview

| Role | Description | Role ID in JWT |
|------|-------------|----------------|
| **User** | Patients seeking medicines | `user` |
| **Shopkeeper** | Pharmacy owners | `shopkeeper` |
| **Admin** | System administrators | `admin` |

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
- Search for medicines by name
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

Pharmacy owners manage their shop's medicine inventory, set prices and stock levels, and handle incoming medicine requests from users.

### Access

| Page | Method | Description |
|------|--------|-------------|
| Login | `GET /shopkeeperlogin` | Sign in to shop account |
| Register | `GET /shopkeepersignup` | Register new shop |
| Dashboard | `GET /shopkeeperdesh` | Main shop dashboard |
| Inventory | `GET /mediupdate` | Manage medicine stock |
| Requests | `GET /servicereq` | View incoming requests |
| Logout | `GET /shopkeeperlogout` | Sign out |

### Permissions

- View own shop dashboard
- Add medicines to shop inventory (name, type, strength, stock, price)
- Update medicine stock and pricing
- View incoming medicine requests
- Approve requests (`/verify-medicine-request/:id`)
- Hold requests (`/hold-medicine-request/:id`)
- Logout

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

System administrators oversee the entire platform. They manage users, shopkeepers, the master medicine catalog, inventory views, and stock transfers between shops.

### Access

| Page | Method | Description |
|------|--------|-------------|
| Dashboard | `GET /admin` | Main admin panel |
| Users | `GET /user` | View all registered users |
| Shopkeepers | `GET /shopkeeper` | View all shops |
| Inventory | `GET /admin/inventory` | View all shop inventories |
| Filter by Shop | `GET /admin/shop-inventory` | Inventory for specific shop |
| Transfers | `GET /admin/transfers` | Manage stock transfers |
| Add Medicine | `POST /admin/add-medi` | Add to master catalog |

### Permissions

- View all registered users
- View all registered shopkeepers
- Verify shopkeeper accounts (`/verify-shopkeeper-account/:id`)
- Hold/block shopkeeper accounts (`/hold-shopkeeper-account/:id`)
- View complete inventory across all shops
- Filter inventory by specific shop
- Create stock transfers between shops
- Approve stock transfers
- Reject stock transfers
- Add medicines to master catalog

### Stock Transfer Flow

1. Admin creates transfer: `/admin/create-transfer`
   - Specifies `from_shop`, `to_shop`, `medicine_name`, `quantity`
2. Transfer created with `status = pending`
3. Admin approves: `/admin/approve-transfer/:id`
   - Source shop stock reduced
   - Destination shop stock increased
4. Or admin rejects: `/admin/reject-transfer/:id`

---

## Authentication Flow

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

### Middleware Guards

| Middleware | Purpose |
|-----------|---------|
| `requireUser` | Redirect to `/login` if not user role |
| `requireShopkeeper` | Redirect to `/shopkeeperlogin` if not shopkeeper |
| `requireAdmin` | Redirect to `/admin` if not admin |
| `checkUser` | Populate `res.locals.user` and `res.locals.role` for templates |
| `checkCurrentLogin` | Redirect logged-in users away from auth pages |
| `redirectLoggedIn` | Redirect logged-in users away from login pages |

### Cookie Settings

- `httpOnly: true` — prevents JavaScript access
- `signed: true` — cookie is signed with `COOKIE_SECRET`
- `maxAge: 3 * 24 * 60 * 60 * 1000` (3 days)

---

## Status Codes

| Role | Status | Meaning |
|------|--------|---------|
| User | `0` | Inactive (email not verified) |
| User | `1` | Active |
| Shopkeeper | `0` | Pending verification |
| Shopkeeper | `1` | Active |
| Shopkeeper | `2` | On hold / Blocked |
| Admin | N/A | Single admin account, no status field |

---

## Session vs Token

This application uses **JWT in cookies** rather than server-side sessions:

- **Session Management**: Express-session is included but not actively used
- **Auth Method**: JWT signed token stored in HTTP-only cookie
- **Verification**: Each protected request reads and verifies the token
- **Logout**: Clears the cookie client-side

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
| Protect route for admin only | Add `requireAdmin` middleware |