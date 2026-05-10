# Patterns

## Professional Coding Standards (ALWAYS FOLLOW)

### 1. Architecture (MVC)
- **Models** (`models/`): Pure data access. SQL queries only. Return rows/arrays. No req/res.
- **Controllers** (`controllers/`): Request handling. Validate input → call model → render/redirect. One file per domain (UserController, AdminController, etc.).
- **Routers** (`routers/`): Route definitions only. Chain middleware: `router.get('/path', middleware1, middleware2, controller.method)`.
- **Middleware** (`middleware/`): Single-responsibility functions. Auth, validation, response decoration.
- **Utils** (`utils/`): Stateless helper functions (email, formatting, etc.).
- **Config** (`config/`): Database connection, app config. No business logic.

### 2. Error Handling
- **No raw `res.send('Wrong')`** — use structured error responses.
- Controller pattern:
```js
try {
  const data = await Model.method(params);
  if (!data || data.length === 0) {
    return res.render('page', { error: 'Not found' });
  }
  res.render('page', { data });
} catch (err) {
  console.error('ControllerName.methodName:', err.message);
  res.render('page', { error: 'Something went wrong. Please try again.' });
}
```
- **Never swallow errors** with empty catches. Always log (console.error) and respond.
- Use `return res.render(...)` or `return res.redirect(...)` after error responses to stop execution.

### 3. Naming Conventions
- **Files**: PascalCase for controllers/models (`UserController.js`), camelCase for utilities/middleware (`authMiddleware.js`).
- **Variables/Functions**: camelCase.
- **SQL keywords**: UPPERCASE (`SELECT`, `INSERT`, `WHERE`).
- **Constants**: UPPERCASE_SNAKE_CASE (`const MAX_AGE = 3 * 24 * 60 * 60 * 1000`).
- **Route paths**: lowercase with hyphens (`/verify-account/:id`).

### 4. Controller Standards
- Export as a single object literal with named methods.
- Every method is `async (req, res) => { ... }`.
- Extract `req.body` / `req.params` / `req.query` at the top via destructuring.
- Validate early with `validationResult(req)` — return immediately on failure.
- Single source of truth: check `req.user` once, store in variable.
- No duplicate method definitions (check for overrides before adding).

### 5. Model Standards
- Export as a single object literal with named methods.
- Every method is `async (...params) => { ... }`.
- Use parameterized queries (`?` placeholders), NEVER string interpolation in SQL.
- Try/catch every query, return `err` from catch (controllers handle it).
- `const [rows] = await dbConnect.promise().execute(sql, values)` pattern.
- One method = one query. No chained logic.

### 6. Route Standards
- `const router = require('express').Router()` at top.
- Group routes: GET first, then POST.
- Apply middleware per-route: `requireUser`, `requireAdmin`, `requireShopkeeper`.
- Validation middleware before controller: `validator, controller.method`.

### 7. Security
- **No secrets in code** — only `process.env.*`.
- All SQL queries are parameterized.
- Passwords hashed with bcrypt (salt rounds 10+).
- JWT tokens: httpOnly + signed cookies.
- File uploads: always provide default fallback filename.
- Validate all user input with express-validator.
- **Every route needs middleware** — never leave data-modifying routes unprotected.
- **Never trust `req.body` for identity** — always use `req.user` from JWT token for user identification.
- **Ownership checks required** — before deleting/updating a resource by ID, verify it belongs to the authenticated user.
- **Role enforcement per route** — `requireUser`, `requireShopkeeper`, `requireAdmin` on every protected route.
- Admin operations (verify/hold accounts) must always use `requireAdmin`.

### 8. Code Quality
- **No console.log in production** — use `console.error` for errors only.
- **No dead code** — remove backup files (`_clean.js`, `_fixed.js`, `.backup`).
- **No duplicate functions** — check file before adding.
- **Semicolons**: Follow project ESLint (airbnb-base, semi: off — no semicolons).
- Indentation: 2 spaces.
- `require('dotenv').config()` only in `app.js`, not in every file.

### 9. File Uploads (Multer)
- Dest: `public/uploads/`.
- Always provide fallback filename: `images.propic && images.propic[0] ? images.propic[0].filename : 'default.png'`.
- Use `upload.fields([{ name: 'fieldName' }])` for named fields.

### 10. Testing (Jest + Supertest)
- Files: `tests/*.test.js`.
- Use `supertest(app)` for integration tests.
- Mock DB calls where possible.

### 11. Git
- No backup/duplicate files committed.
- Clean up before committing (remove `_clean`, `_fixed`, `.backup` files).
