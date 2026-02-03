# SDD Workflow Skills

The Todo App uses Spec-Driven Development (SDD) with custom skills (slash commands) to streamline the development workflow.

## Overview

Skills are markdown-based command definitions that guide AI assistants through specific workflows. They're stored in `.claude/commands/` and invoked with the `/sp.` prefix.

## Available Skills

### Core SDD Workflow

| Skill | Purpose | Usage |
|-------|---------|-------|
| `/sp.specify` | Create feature specification | `/sp.specify "user registration"` |
| `/sp.clarify` | Resolve spec ambiguities | `/sp.clarify` |
| `/sp.plan` | Generate implementation plan | `/sp.plan` |
| `/sp.tasks` | Break plan into tasks | `/sp.tasks` |
| `/sp.implement` | Execute implementation | `/sp.implement` |

### Agent Development

| Skill | Purpose | Usage |
|-------|---------|-------|
| `/sp.agent-design` | Design new AI agents | `/sp.agent-design "reminder agent"` |
| `/sp.agent-test` | Test agent behavior | `/sp.agent-test` |

### Quality Assurance

| Skill | Purpose | Usage |
|-------|---------|-------|
| `/sp.security-audit` | Audit security compliance | `/sp.security-audit` |
| `/sp.api-coverage` | Check frontend-backend coverage | `/sp.api-coverage` |

### Documentation

| Skill | Purpose | Usage |
|-------|---------|-------|
| `/sp.adr` | Document architectural decisions | `/sp.adr "auth strategy"` |
| `/sp.phr` | Record prompt history | `/sp.phr` |

## Skill File Structure

Each skill is a markdown file with frontmatter:

```markdown
---
description: Brief description of what the skill does
handoffs:
  - label: Next Action
    agent: sp.next-skill
    prompt: Suggested prompt
    send: true
---

# COMMAND: Skill Title

## CONTEXT
[When to use this skill]

## YOUR ROLE
[AI expertise areas]

## OUTLINE
[Step-by-step workflow]

## KEY RULES
[Critical constraints]

## PHR Creation
[Prompt history recording instructions]
```

## Creating New Skills

1. Create file in `.claude/commands/sp.<skill-name>.md`
2. Define frontmatter with description and handoffs
3. Document the workflow steps
4. Specify PHR routing rules
5. Test with various inputs

### Example: New Skill Template

```markdown
---
description: [What this skill does]
handoffs:
  - label: [Next action label]
    agent: [Next skill name]
    prompt: [Suggested prompt]
---

# COMMAND: [Skill Name]

## CONTEXT
Use this skill when you need to [purpose].

**User's input to record:**
$ARGUMENTS

## YOUR ROLE
You are an expert in:
- [Domain 1]
- [Domain 2]

## OUTLINE

### Step 1: [First Step]
[Instructions]

### Step 2: [Second Step]
[Instructions]

## KEY RULES
- [Rule 1]
- [Rule 2]

---

## PHR Creation
- Stage: [stage]
- Route: [path]
```

## Skill Categories

### Generation Skills
Create new artifacts:
- `sp.specify` → spec.md
- `sp.plan` → plan.md, contracts/
- `sp.tasks` → tasks.md

### Analysis Skills
Examine existing artifacts:
- `sp.analyze` → consistency report
- `sp.api-coverage` → coverage report
- `sp.security-audit` → security report

### Workflow Skills
Orchestrate other skills:
- `sp.implement` → runs generation
- `sp.git.commit_pr` → git automation

### Record-keeping Skills
Capture metadata:
- `sp.phr` → prompt history
- `sp.adr` → architecture decisions

## PHR Routing

All skills should route PHRs (Prompt History Records) correctly:

| Stage | Route |
|-------|-------|
| constitution | `history/prompts/constitution/` |
| spec, plan, tasks | `history/prompts/<feature-name>/` |
| red, green, refactor | `history/prompts/<feature-name>/` |
| general, misc | `history/prompts/general/` |

## Best Practices

1. **Clear descriptions**: Help users understand when to use each skill
2. **Explicit steps**: Number and document each workflow step
3. **Output artifacts**: Specify what files are created/modified
4. **Error handling**: Document what to do when things fail
5. **Handoffs**: Connect skills to natural next steps

## Related Documentation

- [Creating Skills Guide](./creating-skills.md)
- [Agent Design Skill](./sp-agent-design.md)
- [Security Audit Skill](./sp-security-audit.md)
