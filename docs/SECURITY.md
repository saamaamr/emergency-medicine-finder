# Security Guide

This document covers the security architecture, implemented protections, known vulnerabilities, and hardening recommendations for the Emergency Medicine Finder application.

---

## Overview

The application uses a **cookie-based JWT authentication** system with three roles. Understanding this architecture is essential before making any security changes.

### Auth Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Auth token | JWT (jsonwebtoken) | Stateless session, stored in HTTP-only signed cookie |
| Password hashing | bcryptjs | One-way hash, salt rounds |
| Browser identification | SHA256-hashed localStorage UUID | Single-session-per-browser enforcement |
| Session storage | MySQL `active_sessions` table | Active session tracking |
| OTP storage | MySQL `shopkeeper_otp` table (SHA256-hashed OTPs) | Shopkeeper OTP verification |
| Session cleanup | `setInterval` (10 min) | Auto-expire stale sessions |

### Auth Flow

```
Browser login form
    │
    ▼
POST /shopkeepersignup  (signup)
    │
    ├─ bcrypt.hash(password, 10)
    ├─ INSERT INTO worker (status=0, email_verified=0, phone_verified=0)
    ├─ Generate 6-digit OTP via crypto.randomInt(100000, 999999)
    ├─ Hash OTP: SHA256(otp + OTP_SECRET)
    ├─ INSERT INTO shopkeeper_otp (email, otp_hash, purpose, expires_at)
    ├─ Send OTP email via Nodemailer
    ├─ Send OTP SMS via SMS API (if configured)
    └─ Render /shopkeeper-otp-verify page
            │
            ▼
        POST /shopkeeper-verify-otp
            │
            ├─ Lookup shopkeeper_otp by email, check expiry, check attempts < 3
            ├─ Compare SHA256(entered_otp + OTP_SECRET) === stored hash
            ├─ If valid: UPDATE worker SET email_verified=1, phone_verified=1
            ├─ DELETE FROM shopkeeper_otp
            └─ Redirect to /shopkeeperlogin?verified=true
                    │
                    ▼
Browser login form  (POST /shopkeeperlogin)
    │
    ├─ Read email + password + browserKey from body
    ├─ bcrypt.compare(password, hash)
    ├─ Check email_verified=1 AND phone_verified=1
    │       │
    │       ├─ If NOT verified: send OTP → redirect /shopkeeper-otp-verify
    │       └─ If verified: continue
    ├─ Create/update active_sessions row (browser_key hash = SHA256(uuid + BROWSER_SECRET))
    ├─ If same email+role already logged in from DIFFERENT browser → reject
    ├─ If same email+role from SAME browser → delete old session, allow re-login
    └─ jwt.sign({ name, mail, role }, JWT_SECRET, { expiresIn: 3d })
           │
           ▼
      Set-Cookie: token=<jwt>
      MaxAge: 3d, HttpOnly, Signed, Path: /
      (sameSite and secure flags NOT currently set)
```

---

## Roles & Access Control

### The Three Roles

| Role | JWT `role` | Login Page | Dashboard |
|------|-----------|-----------|-----------|
| User | `user` | `/login` | `/profile` |
| Shopkeeper | `shopkeeper` | `/shopkeeperlogin` | `/shopkeeperdesh` |
| Admin | `admin` | `/admin` | `/admin` |

### Middleware Chain

```
Request
    │
    ▼
checkUser  (always runs — sets res.locals.user, res.locals.role)
    │
    ▼
router  (route-specific middleware)
    │
    ├─ GET /admin  →  redirectIfLoggedInAsRole('admin')  (login page, not protected)
    ├─ GET /profile  →  requireUser  (redirects wrong role to THEIR login page)
    ├─ GET /shopkeeperdesh  →  requireShopkeeper
    └─ GET /admin/inventory  →  requireAdmin
```

### Key Decision: Role-Aware Redirects

When a user with a wrong role tries to access a protected route, they are redirected to **their own role's login page**, not a generic page. Example: a `user` trying to access `/shopkeeperdesh` is redirected to `/login` (not `/shopkeeperlogin`).

### Cross-Role Email Uniqueness

The same email address **cannot** be registered as both a user and a shopkeeper. During registration, `checkEmailAcrossRoles()` queries all three tables:

```sql
SELECT email FROM users WHERE email = ?
UNION SELECT email FROM worker WHERE email = ?
UNION SELECT admin_uid FROM admin WHERE email = ?
```

If any match is found, registration is rejected.

---

## Session Security

### Single-Browser Enforcement

Each browser generates a UUID stored in `localStorage`. This UUID is SHA256-hashed server-side with `BROWSER_SECRET` before being stored in the `active_sessions` table.

```
Browser A logs in as shop@test.com  →  active_sessions: (shop@test.com, shopkeeper, hash("browser-a-uuid"))
Browser B tries to log in as shop@test.com  →  active_sessions: (shop@test.com, shopkeeper, hash("browser-b-uuid"))
    ✗ BLOCKED — existing session found with different browser_key hash
```

### Session Table Schema

```sql
CREATE TABLE active_sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_role ENUM('user','shopkeeper','admin') NOT NULL,
  browser_key VARCHAR(255) NOT NULL,
  device_info VARCHAR(500),
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email_role (user_email, user_role),
  INDEX idx_browser_key (browser_key),
  INDEX idx_expires (expires_at)
);
```

### OTP Table Schema

```sql
CREATE TABLE shopkeeper_otp (
  otp_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,      -- SHA256(otp + OTP_SECRET)
  purpose ENUM('signup', 'login') NOT NULL,
  attempts INT DEFAULT 0,              -- Track failed attempts (max 3)
  expires_at TIMESTAMP NOT NULL,        -- 10 minutes from creation
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_expires (expires_at)
);
```

### Session Expiry

| Setting | Default | Config Variable |
|---------|---------|----------------|
| JWT token cookie (user) | 3 hours | `USER_SESSION_HOURS` env var |
| JWT token cookie (shopkeeper) | 24 hours | `SHOPKEEPER_SESSION_HOURS` env var |
| JWT token cookie (admin) | 8 hours | `ADMIN_SESSION_HOURS` env var |
| DB session row | 8 hours | `SESSION_EXPIRY_HOURS` env var |
| Session cleanup interval | 10 minutes | `setInterval(10 * 60 * 1000)` in `app.js` |

### Logout Behavior

| Role | Action |
|------|--------|
| User | `DELETE FROM active_sessions WHERE email = ? AND role = 'user'`, clear cookie, redirect `/` |
| Shopkeeper | `DELETE ... role = 'shopkeeper'`, clear cookie, redirect `/shopkeeperlogin` |
| Admin | `DELETE ... role = 'admin'`, clear cookie, redirect `/admin` |

---

## Data Protection

### SQL Injection Prevention

**All 86+ SQL queries use parameterized `?` placeholders** via `dbConnect.promise().execute(sql, values)`. No string interpolation in SQL.

```javascript
// ✅ SAFE — parameterised
await dbConnect.promise().execute(
  'SELECT * FROM users WHERE email = ? AND pass = ?',
  [email, hashedPass]
);

// ✅ SAFE — LIKE with parameterized value
await dbConnect.promise().execute(
  'SELECT * FROM medicines WHERE mediname LIKE ?',
  [`%${mname}%`]    // mname is escaped by MySQL, not interpolated
);
```

### XSS Prevention

All EJS templates use `<%= %>` which auto-escapes HTML output. No `<%- %>` (raw unescaped output) was found in any template.

```html
<!-- ✅ SAFE — auto-escaped -->
<p><%= user.email %></p>

<!-- ❌ NEVER USED in this codebase -->
<p><%- user.email %></p>
```

### Shopkeeper Data Isolation

All pharmacy and export queries are scoped by `shop_email`:

```sql
SELECT * FROM suppliers WHERE shop_email = ? ORDER BY name
SELECT p.*, s.name FROM purchases p WHERE p.shop_email = ?
SELECT * FROM sales WHERE shop_email = ? ORDER BY sale_date DESC
```

Shopkeepers can **never** see another shop's data. The `shopkeeperExportJson()` function in `cron/backup.js` queries only the logged-in shopkeeper's email from `req.user.mail`.

### Path Traversal Protection (Backups)

```javascript
// BackupController.js — download
const safePath = path.resolve(backup.backupDir, path.basename(file));
if (!safePath.startsWith(path.resolve(backup.backupDir))) {
  return res.status(403).send('Invalid path');  // Reject directory traversal
}
res.download(safePath);

// BackupController.js — delete
backup.deleteBackup(path.basename(file));  // Always strip directories
```

### File Upload Security

- Profile pictures uploaded via `multer` to `public/uploads/`
- NID images for shopkeeper registration uploaded to same directory
- No executable file types (`.exe`, `.sh`, `.php`, `.jsp`) are blocked — this is a gap (see vulnerabilities below)

---

## Cookie Security

### Current Configuration

```javascript
res.cookie(process.env.COOKIE_NAME, token, {
  maxAge,             // 3 days in ms
  httpOnly: true,     // ✅ JavaScript cannot read cookie
  signed: true,       // ✅ Cookie signature prevents tampering
  encode: String,     // ✅ URL encoding
  path: '/'           // ✅ Available on all paths
});
```

### Missing Flags

| Flag | Current | Recommended | Priority |
|------|---------|-------------|---------|
| `sameSite: 'lax'` | ❌ Missing | `'lax'` | High |
| `secure: true` | ❌ Missing | `true` (in production) | High |

**Impact of missing `sameSite`:** Cross-site POST requests can send the cookie. An attacker can lure an authenticated user into submitting forms (supplier add, expense, sale, etc.).

---

## Environment Variables

All secrets are managed via `.env`. The `.env` file is **gitignored** and must never be committed.

| Variable | Purpose | Default | Change in Production |
|----------|---------|---------|-------------------|
| `JWT_SECRET` | Signs JWT tokens | `emf_jwt_secret_key_2024_change_me` | **REQUIRED** — use 256-bit random |
| `COOKIE_SECRET` | Signs cookie | `emf_cookie_secret_2024_change_me` | **REQUIRED** |
| `BROWSER_SECRET` | Hashed with browser UUID | `emf_browser_secret_key_2024_change_me_very_long_string_for_security` | **REQUIRED** |
| `DB_PASS` | MySQL password | _(empty)_ | **REQUIRED** |
| `SMTP_PASS` | Email service password | _(empty)_ | If email is used |
| `OTP_SECRET` | Hashes OTP codes before DB storage | _(empty)_ | **REQUIRED** — must be set |
| `SMS_API_KEY` | SMS OTP API authentication | _(empty)_ | If SMS OTP is used |
| `SESSION_EXPIRY_HOURS` | Session lifetime | `8` | Optional |
| `BACKUP_DIR` | Backup storage path | `./backups` | Optional |
| `BACKUP_SCHEDULE` | Cron schedule | `0 2 * * *` | Optional |
| `BACKUP_RETENTION_DAYS` | Days to keep backups | `30` | Optional |

**⚠ WARNING:** The defaults for `JWT_SECRET`, `COOKIE_SECRET`, and `BROWSER_SECRET` are weak and publicly visible in the `.env.sample` template. **These must be replaced with strong random values before any deployment.**

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Known Vulnerabilities

### Critical

| # | Vulnerability | Impact | Status |
|---|--------------|--------|--------|
| K1 | **No CSRF protection** — No anti-CSRF tokens on any POST form | Authenticated users can be tricked into performing actions (add supplier, expense, sale, stock transfer) via malicious site | ⚠ Unmitigated — all POST routes are vulnerable |
| K2 | **No rate limiting on auth endpoints** — `POST /login`, `POST /shopkeeperlogin`, `POST /alogin`, `POST /shopkeeper-verify-otp` allow unlimited attempts | Brute force password cracking and OTP guessing possible | ⚠ Unmitigated |

### High

| # | Vulnerability | Impact | Status |
|---|--------------|--------|--------|
| K3 | **No security headers** — No helmet, CSP, X-Frame-Options, HSTS | XSS injection, clickjacking, MIME sniffing possible | ⚠ Unmitigated |
| K4 | **Weak default secrets in `.env`** — `JWT_SECRET` and `COOKIE_SECRET` use predictable defaults | If not changed, JWT tokens can be forged by attackers | ⚠ Unmitigated |

### Medium

| # | Vulnerability | Impact | Status |
|---|--------------|--------|--------|
| K5 | **Cookie missing `sameSite` and `secure` flags** | CSRF risk increased; cookie sent on HTTP in production | ⚠ Unmitigated |
| K6 | **No input validation on many POST routes** — `update-stock`, `contact`, `create-stock-transfer`, `shopprofile` accept raw body data | Invalid or malicious data can enter the database | ⚠ Unmitigated — only `login` and `signup` use `express-validator` |
| K7 | **Verbose error messages in production logs** — `console.error(err.stack)` in error handler | Internal stack traces visible in server logs | ⚠ Unmitigated |
| K8 | **Potential command injection in backup script** — `cron/backup.js` uses `exec()` with string interpolation for `mysqldump` command | If any env variable (`DB_PASS`, `DB_USER`) contains shell metacharacters, command injection is possible | ⚠ Low risk (env vars are admin-controlled) |
| K14 | **OTP sent via email only (no SMS API)** — If SMS credentials not configured, phone verification is not enforced | Phone number not actually verified until SMS is configured | ⚠ Unmitigated — `sendSMSOTP()` returns true when SMS is not configured |

### Low

| # | Vulnerability | Impact | Status |
|---|--------------|--------|--------|
| K9 | **No file type validation on uploads** — `multer` accepts all file types including executables | Malicious files could be uploaded to `public/uploads/` | ⚠ Unmitigated |
| K10 | **N+1 queries in export** — `shopkeeperExportJson()` runs individual queries per purchase/sale to fetch items | Performance degradation for shops with large history | ⚠ Unmitigated |
| K11 | **Stale backup files in repository** — `UserController_clean.js`, `UserController_fixed.js`, `UserController_git.js`, `UserController_test.js`, `debug_test.js` | Code clutter; could confuse security scanning tools | ⚠ Unmitigated |
| K12 | **Orphaned middleware file** — `middleware/decoratorHtmlResponse.js` (misspelled, never imported) | Risk of accidental import causing silent `res.locals` bugs | ⚠ Unmitigated |
| K13 | **`loggedInUser` initialized as `{}` instead of `null`** — `decorateHtmlResponse.js` line 5 | `if (loggedInUser)` would be truthy for empty object | ⚠ Unmitigated |

---

## Verified Secure

The following were confirmed safe during the security audit (2026-05-11):

| Category | Finding | Evidence |
|----------|---------|---------|
| SQL Injection | All 86+ queries use `?` parameterized placeholders | `grep` of `models/UserModels.js` |
| XSS | All EJS uses `<%= %>` (auto-escaped), no `<%- %>` | `grep` of `views/**/*.ejs` |
| Path Traversal | Backup download uses `path.basename()` + `path.resolve()` boundary check | `controllers/BackupController.js` |
| Password Storage | `bcryptjs.compare()` for verification | `controllers/UserController.js` |
| Cookie Flags | `httpOnly: true, signed: true` on JWT cookie | `controllers/UserController.js` |
| Access Control | All 88 routes use appropriate role middleware | `routers/routes.js` |
| Cross-Role Email | `checkEmailAcrossRoles()` in both user and shopkeeper registration | `models/UserModels.js` |
| Shop Data Isolation | All pharmacy queries scoped by `shop_email` | `models/UserModels.js` |
| Sensitive Logging | No password, JWT, or secret logging found | `grep` of `controllers/` |
| Command Injection | Most `exec()` usage is safe (env-only args) | `cron/backup.js` uses env vars |

---

## Hardening Checklist

Before deploying to production, complete all items marked **REQUIRED**:

- [ ] **REQUIRED** — Generate and set strong values for `JWT_SECRET`, `COOKIE_SECRET`, `BROWSER_SECRET`, `OTP_SECRET`
- [ ] **REQUIRED** — Set `DB_PASS` for MySQL
- [ ] **REQUIRED** — Add CSRF protection (anti-csrf package or custom token middleware)
- [ ] **REQUIRED** — Install and configure `helmet` middleware in `app.js`
- [ ] **REQUIRED** — Add rate limiting on `POST /login`, `POST /shopkeeperlogin`, `POST /alogin`
- [ ] **REQUIRED** — Add `sameSite: 'lax'` to all cookie configurations in `UserController.js`
- [ ] **REQUIRED** — Add `secure: true` to cookie config (HTTPS environments)
- [ ] RECOMMENDED — Add input validation to all unprotected POST routes
- [ ] RECOMMENDED — Add file type validation to `multer` upload config
- [ ] RECOMMENDED — Replace `exec()` with `execFile()` in `cron/backup.js`
- [ ] RECOMMENDED — Replace `console.error(err.stack)` with structured logging
- [ ] OPTIONAL — Delete stale controller backup files
- [ ] OPTIONAL — Delete orphaned `decoratorHtmlResponse.js`
- [ ] OPTIONAL — Fix `loggedInUser` initialization to `null`

---

## Security Architecture Diagram

```
                        ┌─────────────────────────────────────────────────────┐
                        │                    Browser                         │
                        │   localStorage: UUID (browser identifier)         │
                        │   Cookie: token=<signed-jwt>; HttpOnly             │
                        └──────────────────────┬──────────────────────────────┘
                                               │ HTTP Request
                                               ▼
                        ┌─────────────────────────────────────────────────────┐
                        │               Express.js (app.js)                  │
                        │  cookieParser ──► checkUser ──► router             │
                        │                    │                   │              │
                        │              Sets res.locals   Role middleware        │
                        │               user, role           │              │
                        │                                 ┌────▼────┐          │
                        │                                 │ Routes │          │
                        │                                 └────────┘          │
                        └─────────────────────────────────────────────────────┘
                                               │
                         ┌────────────────────┼────────────────────┐
                         │                    │                    │
                         ▼                    ▼                    ▼
              ┌──────────────────┐  ┌───────────────┐  ┌──────────────────┐
│     MySQL        │  │   Node.js     │  │   Cron Jobs      │
               │                  │  │   (JWT sign)  │  │                  │
               │ active_sessions │  │  (bcryptjs)   │  │ backup.js        │
               │ shopkeeper_otp │  │  (SHA256)     │  │ (mysqldump+gzip) │
              │                  │  │               │  │                  │
              │ shop_email scope │  │               │  │                  │
              └──────────────────┘  └───────────────┘  └──────────────────┘
```
