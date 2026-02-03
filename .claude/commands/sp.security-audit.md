---
description: Audit security compliance for the todo app, especially agent endpoints
handoffs:
  - label: Fix Security Issues
    agent: sp.implement
    prompt: Fix the identified security vulnerabilities
    send: true
---

# COMMAND: Security Audit Workflow

## CONTEXT

Use this skill to audit security compliance. This workflow verifies:
- JWT authentication on all protected endpoints
- User data isolation (user_id filtering)
- API key and secrets management
- Input validation and sanitization
- Rate limiting implementation

**User's input to record:**
$ARGUMENTS

## YOUR ROLE

You are a security engineer specializing in:
- Web application security (OWASP Top 10)
- API security best practices
- Authentication and authorization
- LLM security considerations

## OUTLINE

### Step 1: Authentication Audit

Check all protected endpoints:
```
[ ] All /api/v1/tasks/* endpoints require JWT
[ ] All /api/v1/agents/* endpoints require JWT
[ ] JWT verification uses secure algorithm (HS256+)
[ ] Token expiration is enforced
[ ] Logout properly invalidates sessions
```

### Step 2: Authorization Audit

Verify user data isolation:
```
[ ] All task queries filter by user_id
[ ] All agent logs filter by user_id
[ ] No cross-user data leakage possible
[ ] Admin endpoints properly protected (if any)
```

### Step 3: Secrets Management

Check environment variables:
```
[ ] DATABASE_URL not hardcoded
[ ] BETTER_AUTH_SECRET not in code
[ ] GROQ_API_KEY not committed
[ ] .env.example contains only placeholders
[ ] .gitignore includes .env files
```

### Step 4: Input Validation

Verify sanitization:
```
[ ] Task title/description sanitized
[ ] Agent chat input validated
[ ] SQL injection prevention (parameterized queries)
[ ] XSS prevention in frontend
[ ] File upload restrictions (if any)
```

### Step 5: Rate Limiting

Check API limits:
```
[ ] Agent endpoints rate limited (30 req/min for Groq)
[ ] Login attempts rate limited
[ ] Bulk operations limited
[ ] Error responses don't leak info
```

### Step 6: LLM-Specific Security

```
[ ] No sensitive data in LLM prompts
[ ] User input sanitized before LLM
[ ] LLM responses validated
[ ] Prompt injection prevention
```

## OUTPUT FORMAT

Generate security report:
```markdown
# Security Audit Report

## Summary
- Audit Date: YYYY-MM-DD
- Overall Status: PASS/FAIL
- Critical Issues: X
- Warnings: X

## Findings

### Critical
[List critical issues]

### Warnings
[List warnings]

### Passed Checks
[List passed checks]

## Recommendations
[List recommendations]
```

## KEY RULES

- Never skip authentication checks
- Treat all user input as untrusted
- Follow constitution.md security principles
- Document all findings with severity levels
- Provide actionable remediation steps

---

## PHR Creation

After completing this workflow:
- Stage: `refactor` or `misc`
- Route: `history/prompts/general/` or `history/prompts/<feature-name>/`
- Record audit findings and recommendations
