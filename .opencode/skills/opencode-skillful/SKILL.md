---
name: opencode-skillful
description: Manage, create, and configure OpenCode skills and their permissions
---

## Skill Management

### Create a New Skill

```markdown
---
name: my-skill
description: What this skill does
---

## Instructions

Detailed instructions for the skill here.
```

### Skill Directory Structure

```
.opencode/skills/{skill-name}/
└── SKILL.md
```

### Permission Configuration

In `opencode.json` or agent frontmatter:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

### Best Practices

- `name` must match directory name (lowercase, hyphens only)
- `description` should be 1-1024 characters, specific enough for agent selection
- Skills are loaded on-demand via the `skill` tool
- One relevant skill per task by default
- Use precise descriptions for accurate matching
- Keep SKILL.md focused on a single responsibility
