# RCRT Template: Support

Support desk with ticket management and knowledge base. Use this template for customer support portals, helpdesks, or internal IT support tools.

## What's Included

- React 18 + Vite + TypeScript + Tailwind CSS
- `@rcrt/api` client pre-configured
- Firebase authentication (Google sign-in)
- Sidebar layout with icon navigation
- Ticket list with status filters (open/pending/resolved)
- Ticket detail page with conversation thread + reply input
- New ticket form with subject, description, and priority
- Knowledge base with search
- Settings page with sign-out
- Dockerfile + Cloud Build config for Cloud Run deploy

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your RCRT API URL and Firebase config

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your RCRT API Gateway URL |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_RCRT_PREVIEW_TOKEN` | Preview token (for WebContainer preview) |

## Data Model

Tickets and messages are stored as breadcrumbs:

- **Tickets**: `type:ticket` + `status:open|pending|resolved` + `priority:low|medium|high|urgent`
- **Messages**: `type:message` + `ticket:{ticket_id}` (linked to parent ticket)
- **Knowledge articles**: `interpret:knowledge` (searchable KB entries)

## Project Structure

```
src/
  App.tsx                    — Routing + auth wrapper
  main.tsx                   — Entry point
  index.css                  — Tailwind + design tokens
  pages/
    TicketsPage.tsx          — Ticket list with filters
    TicketDetailPage.tsx     — Ticket info + conversation thread
    NewTicketPage.tsx        — Create ticket form
    KnowledgeBasePage.tsx    — Searchable knowledge base
    SettingsPage.tsx         — Account settings
  components/
    layout/
      AppLayout.tsx          — Sidebar + bottom nav shell
  lib/
    api-client.ts            — RcrtClient singleton
    auth.tsx                 — Firebase auth gate
    store.ts                 — Zustand state (ticket filter)
    utils.ts                 — cn() helper
```

## Customizing

- **Add a page**: Create `src/pages/MyPage.tsx` → add Route in `App.tsx` → add nav item in `AppLayout.tsx`
- **Change theme**: Edit CSS variables in `src/index.css`
- **Ticket statuses**: Edit the `filterOptions` in `TicketsPage.tsx` and status colors in `StatusBadge`
- **Auto-assignment**: Connect an RCRT agent to automatically triage and respond to tickets

## Deploy

Push to main triggers Cloud Build → Cloud Run (if `cloudbuild.yaml` is configured).

## Built with RCRT

This template is designed for [RCRT Code Studio](https://github.com/possibl-ai/rcrt-v2). RCRT is the backend — all state lives in breadcrumbs, all AI runs through agents, all external APIs connect through services.
