# Security Knowledge Base

## Lessons Learned
> Read BEFORE every fix. Never repeat a recorded mistake.

| Date | Mistake | Severity | Lesson | File |
|------|---------|----------|--------|------|
| 2026-05-10 | Routes without auth middleware allow unauthenticated data access | CRITICAL | Every data-modifying route MUST have a role middleware (`requireUser`/`requireShopkeeper`/`requireAdmin`). Never rely on frontend-only protection. | routes.js |
| 2026-05-10 | User identity from `req.body` is trivially forgeable | HIGH | Always derive `userMail`/`userId` from `req.user` (JWT token), never from form body. Add server-side ownership checks. | UserController.js |
| 2026-05-10 | Missing ownership check on delete-by-ID endpoint | HIGH | Any operation on a resource by ID must verify the resource belongs to the authenticated user before mutating. | UserController.js |

## Known Patterns
> Read BEFORE analysis AND before every fix.
> Captures project-specific patterns, user preferences, and constraints discovered during sessions.
> Add new entries after each session.

| Pattern | Context | Preference | Workaround |
|---------|---------|------------|------------|
| `publicProcedure` for user data | tRPC auth | Never use for private/user-specific data | Switch to `protectedProcedure` — always verify ctx.user |
| Raw error messages exposed | Error handling | Never expose internal stack traces or DB errors to client | Use generic messages: "An unexpected error occurred" |
| Hardcoded secrets | Credentials in code | Never commit secrets or API keys | Move to environment variables, add to `.env.example` |
| Missing input validation | API endpoints | Always validate with Zod — never trust client input | Add `.input(z.object({...}))` with proper constraints |
| Logging sensitive data | Console/logger calls | Never log passwords, tokens, or PII | Strip sensitive fields before logging |

## Fixes Applied
> Log every completed fix. Read to understand what has already been done in this project.

| Date | Issue | Severity | File | Outcome |
|------|-------|----------|------|---------|
| 2026-05-10 | `POST /add-medicine` — no auth, shopemail from body | CRITICAL | routes.js, UserController.js | Added `requireShopkeeper` middleware. Enforced `shopemail = req.user.mail` instead of body. |
| 2026-05-10 | `POST /add-medi` — no auth | CRITICAL | routes.js | Added `requireAdmin` middleware. |
| 2026-05-10 | `GET /delete-medicine-request/:id` — no auth, no ownership check | HIGH | routes.js, UserController.js, UserModels.js | Added `requireUser` + `getMedicineRequestById` model method + ownership check. |
| 2026-05-10 | `GET /verify-medicine-request/:id` & `/hold-medicine-request/:id` — no auth | HIGH | routes.js | Added `requireShopkeeper` middleware. |
| 2026-05-10 | `GET /verify-shopkeeper-account/:id` & `/hold-shopkeeper-account/:id` — no auth | HIGH | routes.js | Added `requireAdmin` middleware. |
| 2026-05-10 | `POST /request` — no auth, userMail from body | HIGH | routes.js, UserController.js | Added `requireUser`. Enforced `userMail = req.user.mail`. Look up userId from DB. |
| 2026-05-10 | `POST /userupdate` — no auth, no ownership check | HIGH | routes.js, UserController.js | Added `requireUser`. Verified `email === req.user.mail`. Look up userId from DB. |
| 2026-05-10 | `/logout`, `/shopkeeperlogout`, `/adminlogout` — no auth | MEDIUM | routes.js | Initially added auth middleware but reverted — logout is idempotent (just clears cookies) and should work for everyone, including users with expired tokens. |
| 2026-05-10 | `POST /book-service` — no auth | MEDIUM | routes.js | Added `requireUser` middleware. |

## Pending Findings
> All issues identified in Phase 1 have been fixed. See Fixes Applied table above.
