# Frontend architecture

## Goals and boundaries

The frontend is a React SPA in the existing `apps/frontend` workspace. It presents information, gathers explicit user intent, and coordinates backend and wallet interactions. It is not a policy engine, AI authority, transaction simulator, or source of truth for chain state.

The backend is currently Express with a health route only. Authentication, API contracts, database persistence, policy, AI, simulation, risk, and audit are future integrations. The Hardhat workspace is not evidence that a production execution contract exists.

## Existing implementation and technology decisions

The current frontend entry is `src/main.tsx` (`StrictMode` + `BrowserRouter`); `src/App.tsx` defines `/` and a wildcard route; `src/pages/HomePage.tsx` renders placeholder copy; and `src/styles.css` imports Tailwind. The existing `assets/`, `components/`, `hooks/`, `routes/`, `services/`, and `types/` folders contain placeholders, not feature implementations. Preserve this workspace and evolve it; do not create a second app or replace the root workspace.

React, React DOM, React Router, TypeScript, Vite, the Vite React plugin, and Tailwind 4 with its Vite plugin are already present. TanStack Query, Zustand, React Hook Form, Zod, shadcn/ui setup, Lucide React, Recharts, wagmi, viem, Vitest, and React Testing Library are not declared in the frontend package. Recommendations and conditional adoption guidance are in the [documentation index](./README.md).

Use the existing folders as the migration starting point:

| Existing folder/file | Current state | Target responsibility |
|---|---|---|
| `src/pages/` | Contains placeholder `HomePage.tsx` | Route-level screens, preferably organized by feature as the app grows. |
| `src/components/` | Placeholder only | Shared UI primitives and shell components after reuse is established. |
| `src/routes/` | Placeholder only | Route tree, access guards, and route-level loading/error boundaries. |
| `src/hooks/` | Placeholder only | Reusable stateful UI/domain hooks. |
| `src/services/` | Placeholder only | API adapters and client-side wallet/provider adapters, kept in separate boundaries. |
| `src/types/` | Placeholder only | Frontend-specific types; use shared package contracts only after intentional API/domain agreement. |
| `src/assets/` | Placeholder only | Static assets. |
| `src/styles.css` | Imports Tailwind | Keep as global style entry; add token files only when needed. |
| `src/App.tsx`, `src/main.tsx` | Placeholder route and bootstrap | Evolve in place to compose the route tree and providers. |

The `features/`, `app/`, `layouts/`, and `store/` directories below are proposed organization, not existing structure. Introduce them incrementally only when they clarify ownership; no broad restructure is required.

## Proposed feature-based structure

```text
apps/frontend/src/
  app/                 App composition, route tree, error boundaries
  app/providers/        Query, theme, wallet, and auth providers
  app/router/           Route definitions and access guards
  layouts/              Public and authenticated shells
  assets/               Local static assets
  components/
    ui/                 Accessible primitives (shadcn/ui conventions)
    common/             Empty, error, loading, status, and formatting UI
    layout/             Sidebar, header, navigation, responsive shell
  features/
    auth/               Login, registration, session views
    wallet/             Wallet connection and network context
    dashboard/          Overview and activity summaries
    ai-intent/          Prompt, generated draft, intent review
    policies/           Policy display and management
    simulation/         Simulation and risk results
    execution/          Final review, wallet handoff, execution status
    batch-transactions/ Batch editing, validation, summary, outcome
    audit/              History, audit, monitoring views
    settings/           Profile and preferences
  hooks/                Small reusable UI/domain hooks
  services/
    api/                HTTP client, endpoint adapters, DTO validation
    blockchain/         Wallet/provider adapters; no private key handling
  store/                Zustand UI and short-lived workflow state
  types/                Frontend-only types; shared contracts only when agreed
  utils/                Pure formatting and non-authoritative helpers
  constants/            Chain/display metadata that is not secret
  styles/               Theme tokens and global styles
```

This is a target layout, not a requirement to create every directory in Phase 2. Keep feature-specific code colocated and introduce abstractions only for repeated, stable behavior. Existing `App.tsx`, `main.tsx`, and `styles.css` can be migrated incrementally.

## Runtime boundaries

1. **UI layer:** routes and feature components render state and collect user input.
2. **Query layer:** TanStack Query owns server state, caching, invalidation, and request lifecycle.
3. **Service layer:** typed adapters normalize transport errors and validate untrusted API response shapes.
4. **Workflow/UI store:** Zustand holds ephemeral selections and view preferences, never authoritative policy decisions.
5. **Wallet adapter:** wagmi/viem or agreed wallet tooling requests account/chain data and user approval; wallet/provider remains the signing authority.
6. **Backend:** authoritative identity, policy, AI processing, simulation/risk, batch validation, execution coordination, and audit contracts.
7. **Chain:** smart contracts enforce on-chain constraints. Frontend display is not enforcement.

## Provider and initialization order

Compose providers at the app boundary: error boundary → theme/preferences → query client → wallet configuration → auth/session context → router/layout. Exact nesting depends on selected libraries; providers must not hide initialization errors. Query cache identity must be scoped to the authenticated user and cleared on logout/account change as appropriate.

## Data flow and trust

- Inputs and AI-generated intent are untrusted.
- Parse/validate data at service boundaries; reject malformed responses visibly.
- A client preview may derive display-only totals, but backend validation remains authoritative.
- Bind verification to the exact canonical intent/batch and relevant account, chain, and policy context. Invalidate it on any change.
- Before signing, show contract, network, account, value/assets, operation, and batch membership; request the wallet action only after explicit user confirmation.
- Treat confirmation as asynchronous chain state. A hash means submitted, not confirmed.

## Cross-cutting quality

- Feature tests cover user-visible behavior and critical failure paths.
- Use semantic HTML, keyboard support, accessible status announcements, and reduced-motion support.
- Avoid logging prompts, personal data, tokens, signatures, or authorization payloads unless explicitly approved and safely redacted.
- Prefer server pagination/filtering for history and audit data; do not assume all records fit client memory.
