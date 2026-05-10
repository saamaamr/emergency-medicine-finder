---
name: testing-strategy
description: Plan and generate comprehensive test suites covering unit, integration, and E2E testing
---

## Testing Strategy Workflow

1. **Analyze** the module/feature to identify test surfaces
2. **Plan** test hierarchy: unit → integration → E2E
3. **Generate** unit tests for pure functions and utilities
4. **Generate** integration tests for API routes and DB interactions
5. **Generate** E2E tests for critical user flows
6. **Cover** edge cases: empty states, error states, loading states

## Coverage Goals

- Unit tests: 90%+ for business logic
- Integration tests: All API endpoints
- E2E tests: Core user journeys
- Edge cases: Boundary values, null/undefined, network failures

## Tools

- Use the project's existing test framework (Jest, Vitest, Mocha, etc.)
- Mock external dependencies (DB, APIs, file system)
- Prefer dependency injection for testability
