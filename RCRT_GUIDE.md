# rcrt-template-support

> Agent-facing guide. Read this before editing any file in this template.

## What This Template Does

A support portal with ticket submission, ticket tracking, knowledge base search, and AI-assisted chat powered by an RCRT support agent. Tickets are RCRT breadcrumbs. Use for: customer support centres, IT helpdesks, internal service requests, ticketing systems.

## Rules
- Ticket management is pre-built — use TicketList and TicketDetail components
- Knowledge base search is pre-built — use KnowledgeSearch component
- The support agent is pre-defined — connect to it via agentId in ChatInterface

## Pre-Built — Do Not Reimplement

| What | Import | Usage |
|---|---|---|
| TicketList | src/components/support/TicketList.tsx | `<TicketList status="open" onSelect={setTicket} />` |
| TicketDetail | src/components/support/TicketDetail.tsx | `<TicketDetail ticketId={id} />` |
| TicketForm | src/components/support/TicketForm.tsx | `<TicketForm onSubmit={createTicket} />` |
| KnowledgeSearch | src/components/support/KnowledgeSearch.tsx | `<KnowledgeSearch tags={['type:kb-article']} />` |
| ChatInterface | src/components/chat/ChatInterface.tsx | `<ChatInterface agentId="support-agent" />` |
| SupportLayout | src/components/layout/SupportLayout.tsx | Wraps all support pages |

## File Structure

```
src/
  App.tsx
  pages/
    TicketsPage.tsx     ← TOUCH: ticket list view
    TicketPage.tsx      ← TOUCH: single ticket + chat
    KnowledgePage.tsx   ← TOUCH: knowledge base browser
    NewTicketPage.tsx   ← TOUCH: ticket creation form
  components/
    support/            ← LEAVE: TicketList, TicketDetail, etc.
    chat/               ← LEAVE: ChatInterface, hooks
    layout/
      SupportLayout.tsx ← LEAVE: nav, sidebar
  lib/
    auth.tsx            ← LEAVE: DO NOT MODIFY
```

## Ticket Data Pattern

Tickets are RCRT breadcrumbs with tag `type:support-ticket`:
```typescript
// Creating a ticket
const ticket = await client.createBreadcrumb({
  name: 'ticket-' + Date.now(),
  tags: ['type:support-ticket', 'status:open'],
  content: { subject, description, priority, submittedBy }
});

// Querying tickets
const openTickets = await client.queryBreadcrumbs(['type:support-ticket', 'status:open'], 50);
```

## Knowledge Base

KB articles are breadcrumbs with tag `type:kb-article`. KnowledgeSearch queries them with semantic search.

## Support Agent

Create an RCRT agent breadcrumb named `support-agent` with access to:
- `sample-data` (to query ticket history)
- `knowledge` CRUD (to create KB articles from resolved tickets)
- The ticket CRUD tool you define for the project
