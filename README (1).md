# HelpDesk Lite — Internal Support Console

> A lightweight internal support ticketing workspace for submitting, assigning, tracking, and resolving support requests through a centralized operational workflow.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10-8884D8)](https://recharts.org/)

**Repository:** https://github.com/Hebaadelali/HelpDesk-Lite  
**Live Demo:** https://help-desk-lite-five.vercel.app/

---

## Overview

HelpDesk Lite is a frontend-only internal support ticketing workspace designed around a simple operational workflow:

**Submit → Assign → Handle → Track → Resolve**

The project addresses a common internal support problem: requests can become difficult to manage when they are spread across email, chat, and informal follow-ups. This can make ownership unclear, progress difficult to track, and SLA risks harder to identify.

HelpDesk Lite provides a centralized console for:

- Capturing structured support requests
- Assigning request ownership
- Tracking ticket status and activity
- Monitoring SLA risk
- Reviewing workload by owner and category
- Searching, filtering, sorting, and exporting tickets
- Keeping demo data persistent in the browser

The current release intentionally focuses on validating the workflow and user experience before introducing a production backend.

---

## Product Goal

The V1 is designed to improve five operational areas:

1. **Request intake** — capture the information needed to handle a request.
2. **Ownership** — make it clear who is responsible for each ticket.
3. **Progress visibility** — provide a consistent status and activity history.
4. **SLA awareness** — surface tickets that are approaching or exceeding their SLA target.
5. **Workload visibility** — help support staff and managers understand open demand.

---

## Core Workflow

```text
Employee / Requester
        │
        ▼
   Create Ticket
        │
        ▼
 Structured Intake
        │
        ▼
 Central Ticket Queue
        │
        ├──────────────► Assign Owner
        │
        ▼
   Work the Ticket
        │
        ├──────────────► Update Status
        ├──────────────► Change Priority
        └──────────────► Add Notes
        │
        ▼
   Monitor SLA Risk
        │
        ▼
 Resolved / Closed
        │
        ▼
 Workload & Category Visibility
```

---

## Features

### 1. Dispatch Dashboard

A centralized operational overview of the current support queue.

- Open ticket count
- Unassigned ticket count
- SLA-breached ticket count
- Resolved / closed count
- Queue health meter
- Open workload by owner
- Requests by category
- Recent ticket activity

---

### 2. All Tickets

A searchable and filterable workspace for managing the complete ticket queue.

- Status tabs
- Category filtering
- Priority filtering
- Keyword search
- Sorting
- Pagination
- CSV export
- Clear status and priority indicators

---

### 3. Ticket Details

A dedicated view for handling an individual ticket.

- Status stepper
- Priority controls
- Owner assignment
- SLA countdown
- Activity timeline
- Threaded update notes
- Request details and history

Ticket changes are recorded in the local activity history so the workflow remains visible during the demo.

---

### 4. Assigned to Me

A personal queue for the currently authenticated demo user.

- Open assigned tickets
- Resolved / closed tickets
- Separation between personal workload and the wider queue

---

### 5. Categories

A category-level view of support demand.

The current categories include:

- Technical / Network
- Hardware / IT Support
- Permissions / Access
- Software / Accounts
- Facilities
- HR / People

The view helps identify where support demand is concentrated.

---

### 6. Structured Ticket Intake

The New Ticket flow provides a consistent way to submit requests.

- Required-field validation
- Subject and description
- Category selection
- Priority selection
- Requester information
- Optional owner assignment
- Automatic ticket creation
- Initial activity history

---

### 7. SLA Tracking

Each ticket priority has a defined SLA budget:

| Priority | SLA Budget |
|---|---:|
| Urgent | 4 hours |
| High | 8 hours |
| Normal | 24 hours |
| Low | 72 hours |

Tickets are evaluated against their SLA budget and can move between:

**Within SLA → At Risk → Breached**

The current implementation considers a ticket **At Risk** when less than 25% of its SLA budget remains.

Resolved and closed tickets are treated as completed for SLA display.

---

### 8. Authentication & Demo Accounts

The application includes a lightweight browser-based authentication flow for the demo:

- Sign up
- Log in
- Log out
- Protected application routes
- Session persistence in `localStorage`
- Staff profile creation for new demo users

**Important:** this is demo authentication, not production authentication. User accounts, sessions, and credentials are stored locally in the browser, and the password hash used by the demo is intentionally not cryptographically secure. A production release should use a real authentication provider or server-side authentication with secure password hashing.

---

### 9. Responsive & Accessible UI

The interface includes:

- Dark / light theme
- Responsive layouts down to mobile
- Visible keyboard focus states
- Toast notifications for state changes
- Reusable UI components
- Custom design tokens
- Consistent visual language

---

## Scope

### V1 Includes

- Structured ticket intake
- Ticket organization
- Ownership management
- Status and progress tracking
- Priority management
- SLA monitoring
- Dashboard visibility
- Category-level visibility
- Personal assigned queue
- Search and filtering
- Sorting and pagination
- CSV export
- Activity history
- Demo authentication
- Local persistence
- Responsive UI

### Intentionally Out of Scope

The current release does not attempt to provide:

- Production-grade backend infrastructure
- Production authentication / authorization
- Server-side database persistence
- Real-time multi-user synchronization
- Enterprise-scale ITSM functionality
- Multi-tenant architecture
- Complex workflow automation
- External service integrations
- AI-powered ticket classification
- AI chatbot functionality
- Advanced knowledge-base / self-service capabilities

These are candidates for future iterations rather than requirements for the current V1.

---

## Architecture

HelpDesk Lite is currently a **frontend-only application**.

```text
┌──────────────────────────────────────────┐
│                  Browser                 │
│                                          │
│       React + TypeScript + Vite          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Route-level Screens                │  │
│  │                                    │  │
│  │ Dashboard                          │  │
│  │ All Tickets                        │  │
│  │ Ticket Details                     │  │
│  │ Assigned to Me                     │  │
│  │ Categories                         │  │
│  │ New Ticket                         │  │
│  │ Login / Signup                     │  │
│  └─────────────────┬──────────────────┘  │
│                    │                     │
│                    ▼                     │
│        React Context + Reducer           │
│                    │                     │
│                    ├── Auth state        │
│                    ├── Staff state       │
│                    └── Ticket state      │
│                    │                     │
│                    ▼                     │
│               localStorage               │
└──────────────────────────────────────────┘
```

### State Management

Ticket state is managed through:

- React Context
- A reducer-based ticket store
- Local browser persistence

Ticket actions include:

- Create ticket
- Change status
- Assign / unassign owner
- Change priority
- Add activity notes
- Reset demo data

The ticket store is intentionally isolated so that it can later be replaced or adapted to API-based data access.

---

## Data Model

The core ticket model contains:

```text
Ticket
├── id
├── reference
├── subject
├── description
├── category
├── priority
├── status
├── assignee
├── requester
├── createdAt
├── updatedAt
├── resolvedAt
└── history[]
    ├── timestamp
    ├── actor
    ├── text
    └── event type
```

Supported statuses:

```text
New
  ↓
In Progress
  ↓
Pending
  ↓
Resolved
  ↓
Closed
```

The workflow supports status changes from the ticket detail experience rather than enforcing a production-grade state machine.

---

## Technology Stack

### Frontend

- React 19
- TypeScript 6
- Vite 8
- React Router 7
- Tailwind CSS 3.4
- Recharts 3.10

### State & Persistence

- React Context
- `useReducer`
- Browser `localStorage`

### Development & Quality

- TypeScript
- Vite
- Oxlint

### Deployment

- Vercel

---

## Project Structure

```text
HelpDesk-Lite/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Shared UI components
│   │   ├── Tables
│   │   ├── Charts
│   │   ├── Navigation
│   │   ├── Toasts
│   │   └── Protected routes
│   │
│   ├── lib/
│   │   ├── types.ts
│   │   ├── seed.ts
│   │   ├── store.tsx
│   │   ├── auth.tsx
│   │   ├── staff.tsx
│   │   ├── theme.tsx
│   │   ├── toast.tsx
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── Dashboard
│   │   ├── Tickets
│   │   ├── TicketDetail
│   │   ├── Assigned
│   │   ├── Categories
│   │   ├── NewTicket
│   │   ├── Login
│   │   └── Signup
│   │
│   └── App.tsx
│
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/Hebaadelali/HelpDesk-Lite.git
cd HelpDesk-Lite
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open the local development URL shown by Vite.

### Run a Production Build

```bash
npm run build
```

The production output is generated in:

```text
dist/
```

### Preview the Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

---

## Demo Data & Browser Persistence

The project includes realistic seed data so the dashboard and ticket workflow can be explored immediately.

Because the application is frontend-only:

- Ticket data is stored in the browser.
- User accounts and sessions are stored in the browser.
- Changes persist between sessions on the same browser.
- Different browsers or devices do not share state.
- Clearing browser storage removes the local demo state.
- The application provides a reset option for returning to the initial ticket dataset.

No backend database is required to run the current demo.

---

## Product-to-Engineering Approach

HelpDesk Lite was developed as a product-to-delivery exercise rather than starting directly from UI implementation.

The workflow followed:

```text
Problem Definition
        ↓
Requirements / PRD
        ↓
V1 Scope & Non-Goals
        ↓
Planning-Ready Breakdown
        ↓
Execution Planning
        ↓
Frontend Implementation
        ↓
Review & Iteration
        ↓
Future Backend Integration
```

The product planning focused on five major areas:

1. Request Intake & Organization
2. Request Ownership
3. Request Progress & Workflow
4. Manager / Workload Visibility
5. V1 Scope & Self-Service Boundaries

This helped keep the implementation focused on the operational workflow instead of adding features before the core problem was clearly defined.

---

## Execution Approach

The implementation was organized around four execution lanes:

| Lane | Purpose |
|---|---|
| **Move Now** | Work that can start without blocking decisions |
| **Resolve** | Product decisions that need clarification |
| **Prepare** | Engineering work that can be prepared while decisions are resolved |
| **Hold** | Work that should wait for key dependencies |

This approach reduces premature implementation and keeps product decisions visible during delivery.

---

## Why Frontend-Only?

The current architecture is intentional.

The V1 first validates:

- Request intake
- Information architecture
- Ticket ownership
- Status and progress visibility
- SLA visibility
- Dashboard usefulness
- Workload visibility
- Overall workflow

Once these behaviors are validated, a backend can be introduced around an already-defined workflow.

This avoids building database, API, and authentication infrastructure before the core product behavior has been demonstrated.

---

## Current Limitations

### Persistence

Ticket data is local to the browser through `localStorage`.

There is currently:

- No server-side database
- No REST / GraphQL API
- No real-time synchronization
- No cross-device persistence

### Authentication

Authentication exists only as a browser-based demo flow.

It is not suitable for production because:

- User accounts are stored locally.
- Sessions are stored locally.
- Password hashing is intentionally not cryptographically secure.
- There is no server-side identity verification.
- There are no production authorization policies.

### Multi-user Collaboration

The application can demonstrate different local users, but it does not currently provide true multi-user collaboration because there is no shared backend state.

---

## Future Roadmap

### Phase 1 — Backend Foundation

- REST API
- PostgreSQL / Supabase persistence
- Server-side ticket model
- Secure authentication
- Authorization and roles
- API validation

### Phase 2 — Workflow

- Explicit status-transition rules
- Configurable SLA policies
- Automated assignment
- SLA escalation
- Audit logging
- Role-based permissions

### Phase 3 — Notifications & Integrations

- Email notifications
- Slack integration
- Microsoft Teams integration
- Assignment notifications
- SLA escalation notifications

### Phase 4 — Self-Service

- Internal knowledge base
- FAQs
- Suggested help articles
- Self-service resolution guidance

### Phase 5 — AI & Automation

- Automatic ticket categorization
- Priority recommendation
- Intent detection
- Duplicate-ticket detection
- AI-assisted triage
- Support assistant / chatbot

### Phase 6 — Analytics

- Historical SLA performance
- Resolution-time analytics
- Workload trends
- Category trends
- Team performance insights

---

## What This Project Demonstrates

HelpDesk Lite was built to practice and demonstrate both product thinking and frontend engineering.

### Product & Delivery

- Problem definition
- Requirements analysis
- PRD thinking
- V1 scope definition
- Non-goal definition
- Dependency identification
- Execution planning
- Product-to-engineering handoff
- Review and iteration

### Frontend Engineering

- React application architecture
- TypeScript
- React Router
- Context + reducer state management
- Protected routes
- Local persistence
- Reusable components
- Responsive UI
- Theme systems
- Form validation
- Data visualization
- CSV export
- Client-side authentication flows

### Operational Workflow Design

- Ticket lifecycle
- Ownership
- Priority
- SLA monitoring
- Activity history
- Queue management
- Workload visibility
- Category analysis

---

## Project Status

**Status: V1 frontend prototype / demo-ready**

### Implemented

- Core ticket workflow
- Structured ticket intake
- Demo authentication
- Ticket organization
- Ownership controls
- Status / priority management
- Activity history
- SLA tracking
- Dispatch dashboard
- Workload visualization
- Category visualization
- Assigned-to-me queue
- Search and filtering
- Sorting and pagination
- CSV export
- Responsive UI
- Dark / light theme
- Local persistence
- Seed/demo data

### Next Major Stage

**Backend integration → persistent data → secure authentication → authorization → multi-user workflow**

---

## Live Demo

**HelpDesk Lite:**  
https://help-desk-lite-five.vercel.app/

The deployed demo uses seeded data and browser-local persistence, so changes made during a session are local to the browser.

---

## Repository

**GitHub:**  
https://github.com/Hebaadelali/HelpDesk-Lite

---

## Author

**Heba Adel Ali**

GitHub: https://github.com/Hebaadelali

---

## License

This project was developed for educational, portfolio, and product-development practice purposes.
