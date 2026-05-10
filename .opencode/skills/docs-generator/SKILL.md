---
name: docs-generator
description: Generate and maintain project documentation including README, API docs, and guides
---

## Documentation Workflow

1. **Audit** existing documentation for gaps and outdated content
2. **Generate** README with project overview, setup, and usage
3. **Document** API endpoints with request/response schemas
4. **Create** architecture decision records (ADRs) for key decisions
5. **Write** setup/installation guide for new contributors
6. **Maintain** changelog following Keep a Changelog format

## Documentation Structure

```
project/
├── README.md              # Project overview, badges, quick start
├── CONTRIBUTING.md        # How to contribute, code of conduct
├── CHANGELOG.md           # Version history (Keep a Changelog)
├── docs/
│   ├── api/              # API reference documentation
│   ├── architecture/     # ADRs and system design docs
│   └── guides/           # Setup, deployment, troubleshooting guides
```
