# HelpDesk Lite — Internal Support Console

> A lightweight internal support ticketing workspace for submitting, assigning, tracking, and resolving support requests through a centralized operational workflow.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10-8884D8)](https://recharts.org/)

**Live Demo:** https://help-desk-lite-five.vercel.app/

---

## Overview

HelpDesk Lite is an internal support ticketing workspace designed around a simple operational workflow:

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

**Important:** This is a demo authentication flow, not a production authentication system. User accounts, sessions, and credentials are stored locally in the browser. The current implementation is intended only for demonstrating the application workflow and should be replaced with secure server-side authentication or a trusted identity provider in production.

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

## Product-to-Engineering Approach

The workflow followed:

```text
Problem Definition
        ↓
PRD / Requirements
        ↓
V1 Scope & Out of scope
        ↓
Planning-Ready Breakdown
        ↓
Execution Planning
        ↓
Implementation
        ↓
Review & Iteration
        ↓
Final Demo & Delivery
```

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

## Project Development Timeline

HelpDesk Lite was developed through a six-day product-to-engineering workflow, combining requirements analysis, delivery planning, AI-assisted development, engineering collaboration, technical communication, and final project delivery.

### Day 1 — PRD → Engineering Action Plan

**Focus:** Translating product requirements into an actionable engineering plan.

- Requirements analysis
- V1 scope definition
- Non-goals and dependencies
- Engineering action plan
- Agile SDLC planning
- Sprint planning

**Outcome:** A planning-ready foundation that translated the PRD into clear implementation work.

### Day 2 — Jira Delivery Operations

**Focus:** Turning the engineering plan into trackable delivery work.

- Jira workspace setup
- Product backlog
- Sprint backlog
- Board workflow
- Task breakdown
- Work tracking and prioritization

**Outcome:** A structured delivery board connecting product requirements with implementation tasks.

### Day 3 — AI Development Stack & Output Engineering

- AI-assisted task mapping
- Context and access planning
- AI coding workflow
- MCP / AI development workflow
- Debugging and verification
- UI/UX prototyping
- Reviewing and validating AI-generated output

**Outcome:** A practical AI-assisted development workflow with explicit context, verification, and human review.

### Day 4 — Engineering Collaboration

**Focus:** Applying collaborative software engineering practices.

- Git & GitHub workflow
- Branch strategy
- Commit organization
- Pull request workflow
- Code review
- Merge strategy
- Release readiness

**Outcome:** A structured collaboration and version-control workflow supporting reviewable and traceable changes.

### Day 5 — Debugging & Requirements Clarification

**Focus:** Communicating technical progress and decisions clearly to stakeholders.

- Stakeholder status update
- AI-assisted communication workflow
- Prompt design
- AI output review
- Requirements clarification
- Communication improvement
- Final stakeholder deliverable

**Outcome:** Clearer, more decision-ready technical communication through structured drafting and review.

### Day 6 — Capstone: Build & Defend the Project

**Focus:** Packaging, presenting, and defending the completed technical project.

- Project demo structure
- Project packaging
- Demo script
- Final deliverable preparation
- One iteration improvement
- Project walkthrough
- Technical project presentation

**Outcome:** A demo-ready project with a clear technical narrative, implementation walkthrough, and final deliverable.

---

## Learning Outcomes

Through the development of HelpDesk Lite, the project demonstrates practical understanding of:

### Product & Agile Delivery

- Requirements analysis
- PRD-to-engineering translation
- V1 scope definition
- Non-goal definition
- Agile project management
- Sprint planning
- Backlog organization
- Task breakdown
- Dependency identification
- Jira project organization
- Product backlog management
- Sprint backlog management
- Board workflow

### Engineering Workflow

- Software engineering lifecycle
- Frontend application architecture
- Implementation planning
- Debugging and verification
- Release readiness
- Documentation practices

### AI-Assisted Development

- AI-assisted engineering workflows
- AI task mapping
- Context and access planning
- Prompt design for technical tasks
- AI-assisted coding
- AI-assisted debugging
- Reviewing and validating AI-generated output
- Human-in-the-loop development

### Engineering Collaboration

- Git branching strategies
- Commit organization
- GitHub workflows
- Pull requests
- Code review
- Merge strategies
- Collaborative development practices

### Project & Stakeholder Communication

- Technical status reporting
- Requirements clarification
- Stakeholder communication
- Technical documentation
- AI-assisted communication
- Reviewing and improving AI-generated communication
- Demo and presentation planning

---

## License

This project was developed for educational and product-development practice purposes.
