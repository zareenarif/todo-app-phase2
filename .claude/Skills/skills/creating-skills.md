# Creating New Skills

This guide explains how to create custom SDD workflow skills for the Todo App.

## Prerequisites

- Understanding of markdown syntax
- Familiarity with SDD workflow
- Knowledge of the domain you're creating the skill for

## Step-by-Step Guide

### 1. Identify the Need

Before creating a skill, answer:
- What specific workflow does this automate?
- Who will use this skill?
- What inputs does it need?
- What outputs does it produce?

### 2. Choose a Name

Skill naming conventions:
- Prefix: `sp.` (for spec-driven)
- Format: `sp.<domain>-<action>.md`
- Examples: `sp.agent-design.md`, `sp.security-audit.md`

### 3. Create the File

Location: `.claude/commands/sp.<name>.md`

### 4. Write the Frontmatter

```yaml
---
description: One-line description of what the skill does
handoffs:
  - label: Display text for next action
    agent: sp.next-skill-name
    prompt: Suggested prompt for next skill
    send: true  # Auto-send or just suggest
---
```

### 5. Document the Workflow

#### CONTEXT Section
Explain when and why to use this skill.

```markdown
## CONTEXT

Use this skill when you need to [specific situation].
This workflow helps with [benefits].

**User's input to record:**
$ARGUMENTS
```

#### YOUR ROLE Section
Define the AI's expertise areas.

```markdown
## YOUR ROLE

You are an expert in:
- [Domain expertise 1]
- [Domain expertise 2]
- [Relevant technology]
```

#### OUTLINE Section
Step-by-step workflow instructions.

```markdown
## OUTLINE

### Step 1: [First Step Name]
[Detailed instructions for this step]

### Step 2: [Second Step Name]
[Detailed instructions for this step]
```

### 6. Define Key Rules

```markdown
## KEY RULES

- [Critical constraint 1]
- [Critical constraint 2]
- [Error handling rule]
- [Output format rule]
```

### 7. Specify PHR Creation

```markdown
---

## PHR Creation

After completing this workflow:
- Stage: [constitution|spec|plan|tasks|red|green|refactor|misc|general]
- Route: [history/prompts/<location>/]
- Record [what to capture]
```

## Complete Template

```markdown
---
description: [Brief description]
handoffs:
  - label: [Next Action]
    agent: sp.[next-skill]
    prompt: [Suggested prompt]
    send: true
---

# COMMAND: [Skill Title]

## CONTEXT

Use this skill when you need to [purpose].

**User's input to record:**
$ARGUMENTS

## YOUR ROLE

You are an expert in:
- [Expertise 1]
- [Expertise 2]

## OUTLINE

### Step 1: [Analysis/Research]
[Instructions]

### Step 2: [Planning/Design]
[Instructions]

### Step 3: [Execution/Output]
[Instructions]

## OUTPUT FORMAT

Generate:
1. [File/artifact 1]
2. [File/artifact 2]

## KEY RULES

- [Rule 1]
- [Rule 2]
- [Rule 3]

---

## PHR Creation

After completing this workflow:
- Stage: [stage]
- Route: `history/prompts/[location]/`
- Record [details]
```

## Example: Database Migration Skill

```markdown
---
description: Create and manage database migrations for schema changes
handoffs:
  - label: Run Migration
    agent: sp.implement
    prompt: Run the migration
    send: false
---

# COMMAND: Database Migration Workflow

## CONTEXT

Use this skill when you need to create database schema changes.
This ensures proper migration files and rollback capability.

**User's input to record:**
$ARGUMENTS

## YOUR ROLE

You are a database engineer specializing in:
- PostgreSQL schema design
- Alembic migrations
- SQLModel ORM patterns

## OUTLINE

### Step 1: Analyze Schema Changes
1. Review current models in `backend/src/models/`
2. Identify new fields, tables, or constraints
3. Check for data migration needs

### Step 2: Create Migration
```bash
cd backend
alembic revision --autogenerate -m "description"
```

### Step 3: Review Migration
1. Open generated migration file
2. Verify upgrade() and downgrade() functions
3. Add any data migrations if needed

### Step 4: Test Migration
```bash
alembic upgrade head
alembic downgrade -1
alembic upgrade head
```

## KEY RULES

- Always create both upgrade and downgrade paths
- Test migrations before committing
- Never modify existing migrations after deployment
- Use descriptive migration messages

---

## PHR Creation

- Stage: `green`
- Route: `history/prompts/<feature-name>/`
- Record: Migration name, tables affected, rollback tested
```

## Testing Your Skill

1. Invoke the skill: `/sp.<your-skill>`
2. Verify it guides through the workflow
3. Check output artifacts are correct
4. Ensure PHR is created properly
5. Test handoffs to next skills

## Best Practices

1. **Be specific**: Vague instructions lead to inconsistent results
2. **Include examples**: Show expected formats and outputs
3. **Handle errors**: Document what to do when things fail
4. **Chain skills**: Use handoffs to create smooth workflows
5. **Update regularly**: Keep skills aligned with codebase changes
