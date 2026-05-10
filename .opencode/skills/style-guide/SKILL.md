---
name: style-guide
description: Enforce consistent code style, formatting, and project conventions
---

## Style Enforcement

1. **Detect** the project's existing style from config files (eslint, prettier, etc.)
2. **Check** all changed files against project conventions
3. **Fix** auto-fixable issues (formatting, imports, naming)
4. **Report** non-fixable issues with specific guidance

## Common Rules

| Category | Convention |
|----------|-----------|
| Naming | camelCase for variables/functions, PascalCase for classes/components, UPPER_CASE for constants |
| Imports | Group: external → internal → relative. Sort alphabetically |
| Spacing | Consistent indentation (2 or 4 spaces per project config) |
| Quotes | Single quotes preferred, double for JSX |
| Semicolons | As configured (always/never) |
| Line length | 80-120 chars per project config |
| Comments | JSDoc for public APIs, inline comments for complex logic only |
