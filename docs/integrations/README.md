# External Integrations

The Todo App supports integration with external services to enhance functionality. This document covers available and planned integrations.

## Current Integrations

### LLM Providers

#### Groq (Primary)

Free-tier cloud LLM provider with fast inference.

| Feature | Details |
|---------|---------|
| **Models** | Llama 3.1 70B, Mixtral 8x7B |
| **Rate Limit** | 14,400 tokens/min, 30 req/min |
| **Latency** | Sub-second |
| **Cost** | Free tier available |

**Setup:**
1. Create account at [console.groq.com](https://console.groq.com)
2. Generate API key
3. Add to `.env`: `GROQ_API_KEY=gsk_xxxxx`

#### Ollama (Fallback)

Local LLM provider for offline/development use.

| Feature | Details |
|---------|---------|
| **Models** | Llama 3, Mistral, CodeLlama |
| **Rate Limit** | Unlimited (local) |
| **Latency** | Hardware dependent |
| **Cost** | Free (self-hosted) |

**Setup:**
```bash
# Windows
winget install Ollama.Ollama

# macOS
brew install ollama

# Pull model
ollama pull llama3

# Start server
ollama serve
```

## Planned Integrations

### Google Calendar (Phase 2)

Sync tasks with Google Calendar for deadline management.

**Features:**
- Create calendar events from tasks with due dates
- Sync recurring tasks as recurring events
- Update task completion status from calendar
- Bi-directional sync

**Implementation:**
- OAuth 2.0 authentication
- Google Calendar API v3
- Webhook for real-time updates

### Email Notifications (Phase 2)

Send task reminders and daily digests via email.

**Features:**
- Daily task summary email
- Due date reminder notifications
- Overdue task alerts
- Weekly productivity report

**Implementation:**
- SendGrid or AWS SES
- Email templates
- User preference settings

### Slack Integration (Future)

Receive notifications and manage tasks in Slack.

**Features:**
- Task creation from Slack messages
- Due date reminders in channels
- Slash commands for quick actions
- Status updates via bot

## Integration Architecture

```
┌─────────────────────────────────────────┐
│            Todo App Backend             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       Integration Service        │   │
│  │  - Credential management         │   │
│  │  - OAuth token refresh           │   │
│  │  - Webhook handling              │   │
│  └─────────────────────────────────┘   │
│                  │                      │
│    ┌─────────────┼─────────────┐       │
│    ▼             ▼             ▼       │
│ ┌──────┐    ┌──────┐    ┌──────┐      │
│ │ LLM  │    │ Cal  │    │Email │      │
│ │ Svc  │    │ Svc  │    │ Svc  │      │
│ └──────┘    └──────┘    └──────┘      │
└────┼─────────────┼──────────┼──────────┘
     │             │          │
     ▼             ▼          ▼
  Groq/        Google      SendGrid/
  Ollama       Calendar    AWS SES
```

## Security Considerations

1. **Credential Storage**: All OAuth tokens encrypted at rest
2. **Scope Limitation**: Request only necessary permissions
3. **Token Refresh**: Automatic refresh before expiration
4. **Revocation**: Users can disconnect at any time
5. **Audit Logging**: All integration actions logged

## Adding New Integrations

1. Create service in `backend/src/services/`
2. Add OAuth endpoints if needed
3. Create database model for credentials
4. Add API endpoints for management
5. Build frontend settings UI
6. Document in this folder

## Related Documentation

- [LLM Service](../agents/README.md)
- [Google Calendar Setup](./google-calendar.md) (Coming soon)
- [Email Notifications](./email-notifications.md) (Coming soon)
