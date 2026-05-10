---
name: migration-planner
description: Plan safe, staged migrations for code, database, and infrastructure changes
---

## Migration Planning Process

1. **Audit** current state — code, schema, dependencies, configuration
2. **Define** target state — what needs to change and why
3. **Identify** breaking changes and backward compatibility needs
4. **Stage** the migration into reversible steps
5. **Plan** rollback strategy for each step
6. **Schedule** cutover with verification checkpoints

## Migration Types

- **Database**: Schema changes, data backfills, index optimizations
- **Code**: Dependency upgrades, framework migrations, API versioning
- **Infrastructure**: Cloud provider moves, deployment changes
- **Configuration**: Environment variable changes, feature flags

## Safety Rules

- Each step must be independently reversible
- Run migrations in staging first
- Use feature flags for gradual rollout
- Monitor metrics during and after migration
- Have a rollback script ready before executing
