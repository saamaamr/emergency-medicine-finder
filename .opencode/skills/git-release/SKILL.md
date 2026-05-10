---
name: git-release
description: Create consistent releases with semantic versioning, changelogs, and git tags
---

## Release Process

1. **Determine** version bump (major/minor/patch) based on changes
2. **Update** changelog with new version and release notes
3. **Update** version constants in code (package.json, etc.)
4. **Create** git commit with version bump
5. **Tag** release with `v{version}` format
6. **Push** commit and tag to remote

## Version Rules

- **Major**: Breaking API/incompatible changes
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, performance improvements
- **Pre-release**: `-alpha.X`, `-beta.X`, `-rc.X`

## Changelog Format (Keep a Changelog)

```markdown
## [1.2.3] - 2026-05-10

### Added
- New feature description

### Changed
- Behavior change description

### Fixed
- Bug fix description

### Security
- Vulnerability fix description
```
