---
name: code-review
description: Multi-agent code review with quality checks, bug detection, and improvement suggestions
---

## Code Review Process

1. **Analyze** the changed code for correctness, performance, and security
2. **Check** adherence to project conventions (naming, structure, patterns)
3. **Identify** bugs, anti-patterns, and potential regressions
4. **Suggest** improvements with specific code examples
5. **Verify** test coverage and edge case handling

## Checklist

- [ ] Logic is correct for all inputs
- [ ] No security vulnerabilities (XSS, injection, auth bypass)
- [ ] Error handling is robust
- [ ] Performance is reasonable (no N+1 queries, unnecessary re-renders)
- [ ] Follows project code style
- [ ] Has adequate test coverage
- [ ] No dead code or commented-out code
- [ ] API changes are backward compatible or have migration path
