# HelpDesk Lite — Internal Support Console

A lightweight internal helpdesk workspace for submitting, assigning, and tracking
support requests — built as a "dispatch console" for a small IT/support team.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (custom design-token theme, dark/light)
- React Router
- Recharts (workload + category charts)
- Local component state + Context, persisted to `localStorage` (no backend required)

## Features

- **Dispatch dashboard** — live queue-health meter, SLA-breach count, workload-by-owner
  and requests-by-category charts, recent activity feed.
- **All Tickets** — status tabs, category/priority filters, keyword search, sortable
  list, pagination, CSV export.
- **Ticket detail** — status stepper, priority + owner controls, SLA countdown pill,
  full activity timeline, and threaded update notes.
- **Assigned to Me** — a personal open/closed queue for the signed-in agent.
- **Categories** — volume and open-load breakdown per request category.
- **New Ticket** — structured intake form with required-field validation.
- **SLA tracking** — each priority has an SLA budget (Urgent 4h, High 8h, Normal 24h,
  Low 72h); tickets flip to "at risk" and "breached" states automatically.
- **Dark / light theme toggle**, responsive layout down to mobile, keyboard-visible
  focus states, toast notifications for every state change.
- Ships with realistic seed data; state persists locally per browser and can be reset.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # production build to /dist
npm run preview    # preview the production build
```

## Project structure

```
src/
  components/   Shared UI: sidebar, topbar, badges, table, charts, toasts
  lib/           Types, seed data, ticket store (context+reducer), utils
  pages/         Route-level screens (Dashboard, Tickets, TicketDetail, ...)
```

## Notes

This is a front-end-only demo: all data lives in the browser (`localStorage`).
Swap `src/lib/store.tsx` for API calls to connect it to a real backend.
