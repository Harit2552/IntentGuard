# IntentGuard frontend planning

This directory is the Phase 1 architecture and UI/UX plan for the IntentGuard frontend. It is documentation only: the existing React/Vite workspace remains a placeholder, and the planned dependencies and features below are not represented as implemented functionality.

## Inspected current state

- The frontend workspace is `@intentguard/frontend`. It already uses React 19, React DOM, React Router 7, TypeScript, Vite 8, and Tailwind CSS 4 through `@tailwindcss/vite`. The Vite React plugin is configured.
- The current entry point wraps the app in `StrictMode` and `BrowserRouter`. `App.tsx` has a placeholder home page and wildcard not-found content; `HomePage.tsx` renders a title/message. `styles.css` imports Tailwind.
- Existing source folders are `assets`, `components`, `hooks`, `pages`, `routes`, `services`, and `types`. Most are placeholders containing `.gitkeep`; only the home page and app bootstrap are implemented. There is no feature architecture yet.
- TypeScript is strict and uses Vite/bundler resolution. ESLint is configured at the repository root with React Hooks/Refresh rules; no frontend test runner or frontend test script is configured.
- Shared package `@intentguard/shared` currently exports only the recursive `JsonValue` type through its ESM root export. That type is not a domain/API contract.
- The backend is an Express/TypeScript workspace with only a static `GET /api/health` route. There is no authentication, transaction API, or PostgreSQL integration yet.
- Hardhat is configured locally, but the only tracked Solidity contract is an empty placeholder; there is no production execution function, deployment network, or frontend wallet integration.

## Technology decision record

| Technology | Repository status | Phase 1 recommendation |
|---|---|---|
| React, React DOM, TypeScript | Already declared/used | Keep existing stack. |
| Vite and React plugin | Already declared/configured | Keep; existing scripts build with TypeScript before Vite. |
| Tailwind CSS 4 and Vite plugin | Already declared/configured and imported by `styles.css` | Keep current integration; do not add a competing Tailwind setup. |
| React Router | Already declared/used | Keep for the planned routes. |
| TanStack Query | Not present in frontend dependencies | Evaluate/add in Phase 2 for server state, after API contracts are agreed. |
| Zustand | Not present | Conditional; use only if ephemeral client/workflow state cannot remain local to features/forms. |
| React Hook Form and Zod | Not present | Evaluate for complex forms and runtime boundary validation; avoid duplicate validation systems. |
| shadcn/ui | No setup/configuration found | Optional component-generation convention, not a required runtime dependency; verify Tailwind 4 compatibility and accessibility before adopting. |
| Lucide React | Not present | Optional icon set; use only if consistent iconography is needed. |
| Recharts | Not present | Defer until real analytics data and chart requirements exist; provide accessible data alternatives. |
| wagmi and viem | Not present | Evaluate together for EVM wallet/chain integration after supported chains and contract interfaces are confirmed. Keep signing in the wallet/client. |
| Vitest and React Testing Library | Not present; no frontend test script/config | Recommended for Phase 2 component and workflow tests; add only with the agreed test setup. |

These are inspection results, not installation instructions. Dependency selection and compatibility are Phase 2 decisions.

## Documents

1. [Frontend phase roadmap](./FRONTEND_PHASE_ROADMAP.md)
2. [Frontend architecture](./FRONTEND_ARCHITECTURE.md)
3. [UI/UX design system](./UI_UX_DESIGN_SYSTEM.md)
4. [Screen specifications](./SCREEN_SPECIFICATIONS.md)
5. [User journeys](./USER_JOURNEYS.md)
6. [Routing and navigation](./ROUTING_AND_NAVIGATION.md)
7. [Component architecture](./COMPONENT_ARCHITECTURE.md)
8. [API integration contract](./API_INTEGRATION_CONTRACT.md)
9. [State management](./STATE_MANAGEMENT.md)
10. [Responsive design](./RESPONSIVE_DESIGN.md)
11. [Accessibility](./ACCESSIBILITY.md)

Diagrams:

- [Frontend architecture](./diagrams/frontend_architecture.mmd)
- [Application navigation](./diagrams/application_navigation.mmd)
- [Transaction workflow](./diagrams/transaction_workflow.mmd)
- [Batch transaction workflow](./diagrams/batch_transaction_workflow.mmd)

## Security invariants

- AI output is untrusted input. It never grants permission to transact.
- Only the trusted backend policy service can return an authoritative policy decision.
- Simulation and risk results are advisory/backend-derived data, not a substitute for policy validation or user approval.
- Revalidate the exact batch immediately before wallet interaction. The approved payload must match the reviewed payload.
- A wallet signature authorizes only the explicitly reviewed action; do not imply that MetaMask has a generic “sign many transactions” capability.
- Never ask for, store, or transmit a private key or seed phrase.
- A submitted transaction hash is not confirmation. Show pending, confirmed, reverted, and unknown states distinctly.
- Treat chain ID, account, contract address, calldata, value, and batch membership as security-sensitive review data.

All API paths and schemas in this plan are proposals, not backend commitments. The only confirmed HTTP route is the current health check. Wallet-provider capabilities, execution functions, and batch behavior require agreement with the backend and smart-contract teams before implementation.
