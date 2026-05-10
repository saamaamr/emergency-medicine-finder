# API Reference

Complete reference for all endpoints in the Emergency Medicine Finder application.

## Authentication Endpoints

### User Login

`GET /login`

Returns the user login page.

**Response:** HTML page with login form

---

`POST /login`

Authenticates a user with email and password.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `pass` | string | Yes | User password |

**Response (success):** Redirects to home page with user session

**Response (error):** Renders login page with error message

**Validation:** Email format and password required

---

### User Logout

`GET /logout`

Clears the user session cookie and redirects to home.

**Auth:** User

---

### Shopkeeper Login

`GET /shopkeeperlogin`

Returns the shopkeeper login page.

**Response:** HTML page

---

`POST /shopkeeperlogin`

Authenticates a shopkeeper.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Shopkeeper email |
| `pass` | string | Yes | Shopkeeper password |

**Response (success):** Redirects to `/shopkeeperdesh`

**Response (error):** Shows error message

---

### Shopkeeper Logout

`GET /shopkeeperlogout`

Clears shopkeeper session and redirects to shopkeeper login page.

**Auth:** Shopkeeper

---

### Admin Login

`POST /alogin`

Authenticates an admin user.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userid` | string | Yes | Admin UID |
| `pass` | string | Yes | Admin password |

**Response (success):** Redirects to `/admin`

**Response (error):** Shows error message

---

### Admin Logout

`GET /adminlogout`

Clears admin session and redirects to admin page.

**Auth:** Admin

---

### Admin Dashboard

`GET /admin`

Main admin dashboard showing all users, services, and shopkeepers.

**Auth:** Admin

**Response:** HTML page with dashboard data

---

## User Management

### User Registration

`GET /signup`

Returns the user registration page.

**Response:** HTML registration form

---

`POST /signup`

Creates a new user account with profile photo upload.

**Auth:** None (public registration)

**Request (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `gender` | string | Yes | Male, Female, or Other |
| `email` | string | Yes | Valid email address |
| `phone` | string | Yes | Phone number |
| `pass` | string | Yes | Password (min 6 chars) |
| `house` | string | No | House number |
| `road` | string | No | Road number |
| `division` | string | No | Division |
| `zila` | string | No | District |
| `upazila` | string | No | Upazila |
| `propic` | file | No | Profile image (jpg, png, gif) |

**Response (success):** Redirects to `/login`

**Response (error):** Re-renders form with validation errors

**Side Effect:** Sends verification email to user

---

### User Profile

`GET /profile`

Returns the current user's profile page.

**Auth:** User

**Response:** HTML page with user data

---

### Edit Profile

`GET /userupdate`

Returns the profile edit form.

**Auth:** User

**Response:** HTML form pre-filled with user data

---

`POST /userupdate`

Updates the user's profile information.

**Auth:** User

**Request:** Same as signup form (multipart)

**Response:** Redirects to `/profile`

---

## Shopkeeper Management

### Shopkeeper Registration

`GET /shopkeepersignup`

Returns the shopkeeper registration page.

**Response:** HTML form with shop details

---

`POST /shopkeepersignup`

Registers a new shopkeeper/pharmacy.

**Request (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | First name |
| `lastName` | string | Yes | Last name |
| `gender` | string | Yes | Gender |
| `shopname` | string | Yes | Shop name |
| `email` | string | Yes | Shop email |
| `phone` | string | Yes | Phone number |
| `pass` | string | Yes | Password |
| `lat` | string | No | Latitude |
| `lng` | string | No | Longitude |
| `house` | string | No | Address |
| `road` | string | No | Road |
| `division` | string | No | Division |
| `zila` | string | No | District |
| `upazila` | string | No | Upazila |
| `propic` | file | No | Profile image |
| `nid1` | file | No | NID front image |
| `nid2` | file | No | NID back image |

**Response:** Redirects to `/shopkeeperlogin`

---

### Shopkeeper Dashboard

`GET /shopkeeperdesh`

Main dashboard for shopkeepers showing inventory and services.

**Auth:** Shopkeeper

**Response:** HTML page with shop data and medicine list

---

### Update Inventory

`GET /mediupdate`

Returns the inventory management page.

**Auth:** Shopkeeper

---

`POST /add-medicine`

Adds a new medicine to the shop's inventory.

**Auth:** Shopkeeper

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mediname` | string | Yes | Medicine name |
| `meditype` | string | No | Type (tablet, capsule, etc.) |
| `medistrength` | string | No | Dosage strength |
| `medigeneric` | string | No | Generic name |
| `medicompany` | string | No | Manufacturer |
| `medistock` | number | Yes | Stock quantity |
| `mediprice` | number | Yes | Price |

**Response:** Redirects to `/shopkeeperdesh`

---

## Medicine & Services

### View Services

`GET /service`

Returns a page listing all services or medicine categories.

**Response:** HTML page with service list

---

### Add Master Medicine (Admin)

`POST /admin/add-medi`

Adds a medicine to the master catalog.

**Auth:** Admin

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mediname` | string | Yes | Medicine name |
| `meditype` | string | No | Type |
| `medistrength` | string | No | Strength |
| `medigeneric` | string | No | Generic name |
| `medicompany` | string | No | Company |

**Response:** Redirects to `/service`

---

### Get Medicine Details

`GET /medicine`

Gets details for a specific medicine.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `mid` | number | Medicine ID |

**Response:** JSON array with medicine data

---

### Search Medicines

`GET /searchmedicine`

Searches medicines across all shops.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `mname` | string | Search term (partial match) |

**Response:** JSON array of medicines with shop info

**SQL:** `LIKE '%mname%'` against `mediname` joined with `worker`

---

### Medicine Suggestions (Autocomplete)

`GET /medicine-suggestions`

Returns autocomplete suggestions as user types.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Prefix string (min 1 char) |

**Response:**
```json
["Napa", "Napa Extra", "Naprosin"]
```

**Limit:** 10 results

---

### Book Service

`POST /book-service`

Redirects to the medicine request form.

**Auth:** User

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `service_id` | string | Yes | Service or medicine ID |

**Response:** Redirects to `/request/:service_id`

---

## Medicine Requests

### User Request Page

`GET /request/:service_id`

Returns the request form for a specific medicine.

**Auth:** User

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `service_id` | number | Medicine/shop ID |

**Response:** HTML form with medicine details

---

### Submit Request

`POST /request`

Submits a medicine request with optional prescription image.

**Auth:** User

**Request (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mediId` | number | Yes | Medicine ID |
| `mediName` | string | Yes | Medicine name |
| `shopMail` | string | Yes | Shopkeeper email |
| `quantity` | number | Yes | Requested quantity |
| `ppic` | file | No | Prescription image |

**Response:** Redirects to `/req`

---

### User Request List

`GET /req`

Shows all requests made by the current user.

**Auth:** User

**Response:** HTML page with request history and status

---

### Delete Request

`GET /delete-medicine-request/:id`

Deletes a medicine request (user can only delete own requests).

**Auth:** User

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Request ID |

**Response:** Redirects to `/req`

---

### Shopkeeper Request List

`GET /servicereq`

Shows all incoming requests for the shopkeeper's shop.

**Auth:** Shopkeeper

**Response:** HTML page with request list

---

### Approve Request

`GET /verify-medicine-request/:id`

Approves a medicine request (sets status to 1).

**Auth:** Shopkeeper

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Request ID |

**Response:** Redirects to `/servicereq`

---

### Hold Request

`GET /hold-medicine-request/:id`

Puts a request on hold (sets status to 2).

**Auth:** Shopkeeper

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Request ID |

**Response:** Redirects to `/servicereq`

---

## Admin Inventory

### View All Inventories

`GET /admin/inventory`

Shows complete inventory across all shops.

**Auth:** Admin

**Response:** HTML page with inventory table

---

### Filter by Shop

`GET /admin/shop-inventory`

Shows inventory for a specific shop.

**Auth:** Admin

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `email` | string | Shopkeeper email |

**Response:** HTML page filtered by shop

---

### Get Shop Inventory JSON

`GET /admin/shop-inventory-json`

Returns inventory for a shop as JSON.

**Auth:** Admin

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `email` | string | Shopkeeper email |

**Response:** JSON array

---

## Stock Transfers

### View Transfers

`GET /admin/transfers`

Shows all stock transfer requests.

**Auth:** Admin

**Response:** HTML page with transfer list

---

### Create Transfer

`POST /admin/create-transfer`

Creates a new stock transfer request.

**Auth:** Admin

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from_shop` | string | Yes | Source shop email |
| `to_shop` | string | Yes | Destination shop email |
| `medicine_name` | string | Yes | Medicine name |
| `quantity` | number | Yes | Quantity to transfer |

**Response:** Redirects to `/admin/transfers`

---

### Approve Transfer

`GET /admin/approve-transfer/:id`

Approves and executes a stock transfer.

**Auth:** Admin

**Actions:**
1. Reduces stock from source shop
2. Adds stock to destination shop
3. Sets transfer status to `approved`

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Transfer ID |

---

### Reject Transfer

`GET /admin/reject-transfer/:id`

Rejects a stock transfer (no stock movement).

**Auth:** Admin

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | Transfer ID |

---

## Account Verification

### Verify User Account

`GET /verify-account/:id`

Activates a user account after email verification.

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | number | User ID |

**Action:** Sets `status = 1` in database

**Response:** Redirects to `/login`

---

### Verify Shopkeeper

`GET /verify-shopkeeper-account/:id`

Activates a shopkeeper account.

**Auth:** Admin

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Shopkeeper email |

**Actions:**
1. Sets `status = 1`
2. Sends activation email to shopkeeper

---

### Hold Shopkeeper

`GET /hold-shopkeeper-account/:id`

Blocks or holds a shopkeeper account.

**Auth:** Admin

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Shopkeeper email |

**Actions:**
1. Sets `status = 2`
2. Sends notification email to shopkeeper

---

## Contact

### Contact Page

`GET /contact`

Returns the contact form page.

**Response:** HTML contact form

---

### Submit Contact

`POST /contact`

Submits a contact message.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Sender name |
| `email` | string | Yes | Sender email |
| `subject` | string | Yes | Message subject |
| `message` | string | Yes | Message content |

**Response:** Redirects to `/contact?success=true` or `/contact?error=true`

---

## Pages (Public)

| Endpoint | Description |
|----------|-------------|
| `GET /` | Home page |
| `GET /home` | Home page |
| `GET /about` | About page |
| `GET /offer` | Special offers page |
| `GET /booked` | User's booked services (auth: user) |

---

## Admin Pages

| Endpoint | Description |
|----------|-------------|
| `GET /user` | List all users (admin only) |
| `GET /shopkeeper` | List all shopkeepers (admin only) |

---

## Pharmacy Management (Shopkeeper)

### Dashboard

`GET /pharmacy/dashboard`

Pharmacy overview showing today's sales/profit/expenses, totals, purchase due, supplier count, low stock count, recent sales, and recent purchases.

**Auth:** Shopkeeper

**Response:** HTML page with summary cards and recent transaction tables

---

### Suppliers

`GET /pharmacy/suppliers`

Lists all suppliers for the logged-in shopkeeper.

**Auth:** Shopkeeper

**Response:** HTML page with supplier table and add/edit modals

---

`POST /pharmacy/suppliers/add`

Adds a new supplier.

**Auth:** Shopkeeper

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Supplier name |
| `company` | string | No | Company name |
| `email` | string | No | Supplier email |
| `phone` | string | No | Phone number |
| `address` | string | No | Full address |
| `city` | string | No | City |

**Response:** Redirects to `/pharmacy/suppliers?added=true`

---

`POST /pharmacy/suppliers/update/:id`

Updates an existing supplier.

**Auth:** Shopkeeper

**Request Body:** Same fields as add

**Response:** Redirects to `/pharmacy/suppliers?updated=true`

---

`GET /pharmacy/suppliers/delete/:id`

Deletes a supplier.

**Auth:** Shopkeeper

**Response:** Redirects to `/pharmacy/suppliers?deleted=true`

---

### Expenses

`GET /pharmacy/expenses`

Lists all expenses with category info for the shop.

**Auth:** Shopkeeper

**Response:** HTML page with expense table and add/edit modals, plus category management

---

`POST /pharmacy/expenses/add`

Adds a new expense.

**Auth:** Shopkeeper

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category_id` | number | Yes | Expense category ID |
| `description` | string | Yes | Description |
| `amount` | number | Yes | Amount (Taka) |
| `expense_date` | date | Yes | Date of expense |
| `payment_method` | string | No | cash / bank / mobile_banking |
| `reference_no` | string | No | Reference number |

**Response:** Redirects to `/pharmacy/expenses?added=true`

---

`POST /pharmacy/expenses/update/:id`

Updates an expense.

**Auth:** Shopkeeper

**Request Body:** Same fields as add

**Response:** Redirects to `/pharmacy/expenses?updated=true`

---

`GET /pharmacy/expenses/delete/:id`

Deletes an expense.

**Auth:** Shopkeeper

**Response:** Redirects to `/pharmacy/expenses?deleted=true`

---

`POST /pharmacy/expense-categories/add`

Adds a new expense category.

**Auth:** Shopkeeper

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Category name |
| `type` | string | No | utility / rent / salary / maintenance / marketing / other |

**Response:** Redirects to `/pharmacy/expenses?cat_added=true`

---

### Purchases

`GET /pharmacy/purchases`

Lists all purchase orders for the shop.

**Auth:** Shopkeeper

**Response:** HTML page with purchase table and status badges

---

`GET /pharmacy/purchases/add`

Shows the multi-item purchase order form.

**Auth:** Shopkeeper

**Response:** HTML form with supplier select, dynamic item rows (medicine name, batch, expiry, qty, unit price, MRP, total)

---

`POST /pharmacy/purchases/add`

Creates a new purchase order with multiple items.

**Auth:** Shopkeeper

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| `supplier_id` | number | Supplier (optional) |
| `invoice_no` | string | Purchase invoice number |
| `purchase_date` | date | Date of purchase |
| `notes` | string | Optional notes |
| `items` | JSON string | Array of `{medicine_name, batch_no, expiry_date, quantity, unit_price, mrp, total}` |

**Side Effects:** Each item's quantity is added to `shopmedicine` stock.

**Response:** Redirects to `/pharmacy/purchases?added=true`

---

`GET /pharmacy/purchases/view/:id`

Shows purchase order details with all items.

**Auth:** Shopkeeper

**Response:** HTML page with purchase header info + items table + totals

---

`GET /pharmacy/purchases/delete/:id`

Deletes a purchase order and its items.

**Auth:** Shopkeeper

**Response:** Redirects to `/pharmacy/purchases?deleted=true`

---

### Sales

`GET /pharmacy/sales`

Lists all sales transactions.

**Auth:** Shopkeeper

**Response:** HTML page with sales table (invoice, customer, type, total, profit, payment method)

---

`GET /pharmacy/sales/add`

Shows the multi-item sale form.

**Auth:** Shopkeeper

**Response:** HTML form with customer info, dynamic item rows with cost/price/profit calculation

---

`POST /pharmacy/sales/add`

Creates a new sale with multiple items.

**Auth:** Shopkeeper

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| `customer_name` | string | Customer name (optional) |
| `customer_phone` | string | Customer phone (optional) |
| `sale_date` | datetime | Date/time of sale |
| `sale_type` | string | retail / wholesale / prescription |
| `payment_method` | string | cash / card / mobile_banking |
| `items` | JSON string | Array of `{medicine_name, batch_no, quantity, unit_price, cost_price, mrp, total, profit}` |

**Side Effects:** Each item's quantity is deducted from `shopmedicine` stock.

**Response:** Redirects to `/pharmacy/sales?added=true`

---

`GET /pharmacy/sales/view/:id`

Shows sale invoice details with all items and profit breakdown.

**Auth:** Shopkeeper

**Response:** HTML page with sale header + items table + totals + profit

---

`GET /pharmacy/sales/delete/:id`

Deletes a sale and its items.

**Auth:** Shopkeeper

**Response:** Redirects to `/pharmacy/sales?deleted=true`

---

### Reports

`GET /pharmacy/reports`

Profit/loss report with date range filter.

**Auth:** Shopkeeper

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `start` | date | Start date (default: first of current month) |
| `end` | date | End date (default: today) |

**Response:** HTML page with:
- Summary cards: Total Sales, Purchases, Expenses, Net Profit
- Sales table for the period
- Purchases table for the period
- Expense breakdown by category
- Current month summary (sales, profit, expenses, transaction count)

---

## Backup Management (Admin)

`GET /admin/backups`

Lists all database backup files with stats.

**Auth:** Admin

**Response:** HTML page with:
- Total backup count, total size, last backup date
- File list with filename, size, creation date
- Download and delete buttons per file
- "Backup Now" button

---

`POST /admin/backups/trigger`

Triggers an immediate full database backup via `mysqldump | gzip`.

**Auth:** Admin

**Response:** Redirects to `/admin/backups?backup_ok=true`

**Error:** Redirects to `/admin/backups?backup_err=true` (e.g., mysqldump not installed)

---

`GET /admin/backups/download/:file`

Downloads a backup `.sql.gz` file.

**Auth:** Admin

**URL Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `file` | string | Backup filename (e.g., `emergency_medicine_2026-05-10_020000.sql.gz`) |

**Response:** File download with `Content-Disposition: attachment`

**Security:** Path traversal is blocked — only files within `BACKUP_DIR` can be downloaded.

---

`GET /admin/backups/delete/:file`

Deletes a backup file from the filesystem.

**Auth:** Admin

**Response:** Redirects to `/admin/backups?deleted=true`

---

## Data Export (Shopkeeper)

### Export Page

`GET /pharmacy/export`

Shows the data export page with format options.

**Auth:** Shopkeeper

**Response:** HTML page with download buttons for JSON and individual CSVs

---

### JSON Export

`GET /pharmacy/export/download/json`

Downloads all shop data as a single JSON file.

**Auth:** Shopkeeper

**Response:** JSON file download containing:
```json
{
  "exported_at": "2026-05-10T12:00:00.000Z",
  "shop": { "shopname": "...", "email": "...", "phone": "..." },
  "suppliers": [ ... ],
  "purchases": [ ... ],
  "purchase_items": [ { "purchase_id": 1, "items": [...] }, ... ],
  "sales": [ ... ],
  "sale_items": [ { "sale_id": 1, "items": [...] }, ... ],
  "expenses": [ ... ],
  "inventory": [ ... ]
}
```

**Filename:** `{shopname}_export_YYYY-MM-DD.json`

---

### CSV Exports

`GET /pharmacy/export/download/csv/:type`

Downloads a specific table as CSV.

**Auth:** Shopkeeper

**URL Parameters:**
| Param | Type | Valid Values |
|-------|------|-------------|
| `type` | string | `suppliers`, `purchases`, `purchase-items`, `sales`, `sale-items`, `expenses`, `inventory` |

**Response:** CSV file download with UTF-8 BOM header for Excel compatibility.

**Column Sets:**

| Type | Columns |
|------|---------|
| `suppliers` | supplier_id, name, company, email, phone, address, city, created_at |
| `purchases` | purchase_id, supplier_id, supplier_name, invoice_no, purchase_date, subtotal, discount, vat, total_amount, paid_amount, due_amount, payment_status, notes |
| `purchase-items` | item_id, purchase_id, medicine_name, batch_no, expiry_date, quantity, unit_price, mrp, total |
| `sales` | sale_id, invoice_no, sale_date, customer_name, customer_phone, subtotal, discount, vat, total_amount, paid_amount, due_amount, profit_amount, payment_method, sale_type |
| `sale-items` | item_id, sale_id, medicine_name, batch_no, quantity, unit_price, cost_price, mrp, total, profit |
| `expenses` | expense_id, category_id, category_name, description, amount, expense_date, payment_method, reference_no |
| `inventory` | id, mediname, meditype, medistrength, medigeneric, medicompany, stock, price |

---

## Error Responses

All endpoints return HTML pages on error with appropriate status codes.

| Status | Description |
|--------|-------------|
| `200` | Success |
| `302` | Redirect |
| `400` | Bad request / validation error |
| `401` | Unauthorized (redirects to login) |
| `403` | Forbidden (wrong role) |
| `500` | Server error |

---

## File Upload

All file uploads use `multer` middleware and are stored in `public/uploads/`.

**Accepted Fields:**
| Field | Description |
|-------|-------------|
| `propic` | User/shop profile photo |
| `nid1` | NID front image |
| `nid2` | NID back image |
| `ppic` | Prescription image |

**Default Images:** If no file uploaded, defaults to `default-user.png`, `default-shop.png`, `default-prescription.jpg`

---

## Response Data (JSON APIs)

### Search Medicines

```json
[
  {
    "id": 1,
    "shop_email": "haque@pharmacy.com",
    "mediname": "Napa",
    "meditype": "Tablet",
    "medistrength": "500mg",
    "medigeneric": "Paracetamol",
    "medicompany": "Beximco",
    "stock": 200,
    "price": 5.00,
    "shopname": "Haques Pharmacy",
    "phone": "01811111111"
  }
]
```

### Medicine Suggestions

```json
["Napa", "Napa Extra", "Naprosin", "Naproxen"]
```

### Shop Inventory JSON

```json
[
  {
    "id": 1,
    "shop_email": "haque@pharmacy.com",
    "mediname": "Napa",
    "meditype": "Tablet",
    "stock": 200,
    "price": 5.00
  }
]
```