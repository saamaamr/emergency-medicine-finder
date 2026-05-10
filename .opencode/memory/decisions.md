# Decisions

- 2026-05-10: Skill routing switched from keyword rules → LLM router
- 2026-05-10: Adopted professional coding standards (see patterns.md) — MVC structure, structured error handling, parameterized SQL, no console.log in production, no dead/backup files, consistent naming
- 2026-05-10: Security audit and fixes — added role middleware to 9 unprotected routes, enforced identity from JWT token (not req.body), added ownership checks on delete, fixed duplicates
