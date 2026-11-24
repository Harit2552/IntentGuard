# Routing and navigation

All paths below are proposed client routes, not backend API URLs. The current app has only a placeholder home route; this document specifies the future navigation model.

## Route map

| Access | Proposed route | Screen | Shell |
|---|---|---|---|
| Public | `/` | Landing | Public |
| Public | `/login` | Login | Public/auth |
| Public | `/register` | Registration | Public/auth |
| Protected | `/app` | Dashboard | Application |
| Protected | `/app/wallets` | Wallet management | Application |
| Protected | `/app/assistant` | AI transaction assistant | Application |
| Protected | `/app/intents/:intentId` | Intent review | Application |
| Protected | `/app/policies` | Policy management | Application |
| Protected | `/app/simulations/:simulationId` | Simulation | Application |
| Protected | `/app/risk/:analysisId` | Risk analysis | Application |
| Protected | `/app/executions/:executionId` | Execution/status | Application |
| Protected | `/app/batches/:batchId` | Multi-transaction manager | Application |
| Protected | `/app/batches/:batchId/verify` | Batch verification/review | Application |
| Protected | `/app/history` | Transaction history | Application |
| Protected | `/app/audit` | Audit trail | Application |
| Protected | `/app/security` | Security monitoring | Application |
| Protected | `/app/settings` | User settings | Application |
| Public/system | `*` | Not found | Appropriate shell |
| Protected/system | `/unauthorized` | Unauthorized/access denied | Public or application shell |

IDs are opaque route identifiers, not authorization proofs. Validate route parameters before data fetching. Route paths and server endpoint paths must remain separate concerns.

## Guards and loading

- Public-only login/register routes redirect an already authenticated user to `/app`.
- Protected routes wait for session bootstrap. Show a neutral full-page loading state; do not briefly render protected data before auth resolves.
- Missing/expired authentication redirects to login with a safe same-origin return path. Clear user-scoped query data on logout/session expiry.
- Authenticated but unauthorized responses render an access-denied state; do not loop between guards.
- Route-level lazy loading uses a consistent suspense skeleton and error boundary. Failed chunks provide a reload/retry action without discarding unrelated state.
- Deep links must work after refresh and have server fallback configuration in deployment.

## Navigation hierarchy

Primary sidebar: Overview, Transactions (Assistant, Batches, History), Security (Policies, Monitoring, Audit), Wallets, Settings. Header: page title/breadcrumb, network/account state, notifications only when backed by a real service, theme switcher, profile/session actions.

Show active route using both visual emphasis and `aria-current="page"`. Keep batch workflow progress contextual; do not make transaction approval look like ordinary navigation. On small screens collapse primary navigation behind an accessible menu and retain a clear page title/back path.

## Not-found and unauthorized

Not-found pages explain the route is unknown and provide a safe route home. Unauthorized pages explain access is unavailable and offer sign-in or navigation. Neither should disclose whether another user’s resource exists.
