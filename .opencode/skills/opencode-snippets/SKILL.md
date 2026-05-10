---
name: opencode-snippets
description: Reusable code snippets, templates, and patterns for common development tasks
---

## Snippet Management

Store and retrieve reusable code snippets organized by category.

### Categories

- **auth** — Authentication/authorization patterns (JWT, OAuth, session)
- **crud** — CRUD operation templates for models/controllers
- **middleware** — Express/Koa/Fastify middleware patterns
- **config** — Configuration templates (database, env, logging)
- **deploy** — Deployment configs (Docker, CI/CD)
- **test** — Test templates (unit, integration, mock setup)
- **db** — Database patterns (migrations, queries, seeding)
- **ui** — UI component templates (forms, tables, modals)

### Usage

1. Identify the category matching the current task
2. Load the relevant snippet template
3. Adapt to the project's specific conventions
4. Integrate with existing codebase patterns

Store snippets in `.opencode/snippets/{category}/` as `.md` or template files.
