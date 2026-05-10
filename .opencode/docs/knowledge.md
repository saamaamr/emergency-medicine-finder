# Docs Knowledge Base

## Lessons Learned
> Read BEFORE every fix. Never repeat a recorded mistake.

| Date | Mistake | Severity | Lesson | File |
|------|---------|----------|--------|------|
| _none_ | | | | |

## Known Patterns
> Read BEFORE analysis AND before every fix.
> Captures project-specific patterns, user preferences, and constraints discovered during sessions.
> Add new entries after each session.

| Pattern | Context | Preference | Workaround |
|---------|---------|------------|------------|
| Undocumented code examples | Code blocks in docs | Always test before including — never paste untested snippets | Run example locally, verify output matches what is shown |
| Walls of text | Long explanations | Avoid — break into headers, lists, and tables | Split into sections, use bullet points, add subheadings |
| Jargon without context | Technical terms | Always define on first use | Add inline definition or link to glossary |
| Outdated screenshots | Visual docs | Avoid stale visuals — flag outdated ones to user | Re-capture or remove, never leave misleading visuals |
| Passive voice | Writing style | Avoid — use active voice and address reader directly | Rewrite: "Click the button" not "The button should be clicked" |
| Missing env variables | SMTP config not documented | Document all env vars with examples | Add SMTP variables to .env.sample and README |
| Role-based auth scattered | Three login pages (user/shopkeeper/admin) | Document auth flow per role | Create dedicated ROLES.md guide |
| Single controller file | All logic in one 758-line controller | Document structure clearly in README | Add project structure tree |

## Fixes Applied
> Log every completed fix. Read to understand what has already been done in this project.

| Date | Issue | Severity | File | Outcome |
|------|-------|----------|------|---------|
| 2026-05-10 | README incomplete — missing SMTP, roles, admin endpoints | High | README.md | Rewrote with full structure, roles, API table, sample accounts |
| 2026-05-10 | No documentation for user roles and permissions | High | docs/ROLES.md | Created new guide with auth flow and status codes |
| 2026-05-10 | No API reference document | High | docs/API.md | Created comprehensive endpoint reference |
| 2026-05-11 | No security documentation despite complex auth system | High | docs/SECURITY.md | Created security guide with auth architecture, cookie config, vulnerabilities, hardening checklist |
| 2026-05-11 | README table count said 18 tables but DB has 17 | Low | README.md | Corrected table count; removed non-existent contact_messages; added SECURITY.md to doc list |
| 2026-05-11 | Role permissions table incomplete — missing contact, requests, search, profile | Low | README.md | Expanded permissions table with 30+ rows covering all features per role |

## Project Documentation Map

| Document | Purpose | Last Updated |
|----------|---------|-------------|
| README.md | Project overview, quick start, installation | 2026-05-11 |
| docs/API.md | All 82+ endpoint references | 2026-05-10 |
| docs/ROLES.md | Role permissions, auth flows, session enforcement | 2026-05-10 |
| docs/SECURITY.md | Security architecture, vulnerabilities, hardening | 2026-05-11 |