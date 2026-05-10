---
name: opencode-mem
description: Manages project memory: stores decisions, retrieves context, and filters what is worth remembering. Never stores secrets or sensitive data.
---

## Purpose
Maintain long-term project knowledge for the agent.

## Modes

### WRITE
Store important facts, decisions, fixes, patterns.

### READ
Retrieve relevant memory for current task.

### FILTER
Decide what is worth saving.

## Rules
- Do NOT store secrets (API keys, tokens, passwords)
- Avoid temporary/debug logs
- Prefer structured notes

## Output
Structured markdown entries with timestamps
