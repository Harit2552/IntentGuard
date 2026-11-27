# Component architecture

Components should be feature-owned when their behavior is domain-specific and promoted to shared UI only after reuse is demonstrated. Props below are conceptual, not final API contracts.

## Hierarchy and folder conventions

```text
main.tsx
└─ App providers and route tree
   ├─ PublicLayout
   │  └─ Public/auth page
   └─ ProtectedRoute
      └─ AppLayout (header + sidebar + page outlet)
         └─ Feature page
            ├─ Feature query/form hooks and service adapter
            └─ Feature components
               └─ Shared components (ui/common/layout)
```

In the current repository, `pages/` contains only `HomePage.tsx`; `components/`, `routes/`, `hooks/`, `services/`, `types/`, and `assets/` are placeholders. Keep using those existing folders for broadly shared concerns. Add feature folders or colocated feature components only when a screen has enough domain behavior to justify them. Do not create a second app or a parallel component library.

| Component | Responsibility / example props | Reuse and dependencies |
|---|---|---|
| `AppSidebar` | Navigation groups, active route, collapsed state | App-wide; router links and accessible menu behavior |
| `AppHeader` | Page title/breadcrumb, account and actions | App-wide; router, wallet status, theme |
| `ThemeSwitcher` | Set `light`, `dark`, or `system` | App-wide; preference store, accessible radio/menu |
| `WalletConnectButton` | Request connect/disconnect; status and disabled reason | Wallet feature; wallet adapter only |
| `WalletStatus` | Display connected account and connection state | Wallet/app shell; wallet adapter, copy affordance |
| `NetworkIndicator` | Display chain and wrong/unsupported state | Wallet/execution; chain metadata and wallet adapter |
| `StatCard` | Label, formatted value, delta/context | Dashboard; display-only, no fetching |
| `SecurityStatusCard` | Backend-provided status, timestamp, explanation | Dashboard/security; query data, status semantics |
| `TransactionCard` | Transaction summary, status, selection/removal callbacks | History/batch; domain DTOs, accessible actions |
| `IntentInput` | Prompt value, submit, pending, validation | Assistant; form state, service mutation |
| `IntentPreview` | Display/edit structured draft and provenance | Intent review; schema validation; never policy authority |
| `PolicyCheckResult` | Render backend result, findings and context | Intent/batch; typed policy response, freshness |
| `RiskIndicator` | Render backend risk classification plus text/evidence | Risk/simulation; no locally calculated authoritative score |
| `GasEstimateCard` | Format estimate, unit, source and timestamp | Simulation/review; chain-aware formatting |
| `SimulationResult` | Show effects, warnings, status and stale context | Simulation; backend response and query freshness |
| `BatchTransactionTable` | List/select/remove batch items | Batch feature; accessible table or responsive card alternative |
| `BatchSummary` | Totals/counts and batch context | Batch/review; display-only aggregate with explicit units |
| `FinalApprovalDialog` | Present exact reviewed payload and explicit continue/cancel | Execution only; fresh backend verification and wallet action |
| `TransactionStatus` | Submitted/pending/confirmed/reverted/unknown | Execution/history; backend or chain status |
| `AuditLogTable` | Filter and inspect audit records | Audit; paginated query and accessible table |
| `EmptyState` | Explain no data and safe next action | Shared; descriptive copy and optional action |
| `ErrorState` | Explain recoverable/nonrecoverable error and retry | Shared; sanitized message; no swallowed errors |
| `LoadingSkeleton` | Preserve layout while loading | Shared; decorative regions hidden from assistive tech |

## Component rules

- Prefer controlled props and explicit callbacks at feature boundaries; avoid components reaching into global stores without a clear need.
- Keep data fetching in route/feature query hooks, not generic display primitives.
- Represent status with text and icon/shape as well as color.
- The final approval dialog must show account, chain, destination contract, operation, amounts/assets, and batch membership as relevant. It must not be a generic “Are you sure?” wrapper.
- Wallet actions are explicit, user-triggered events. Do not auto-open the wallet from mount or retry a rejected request automatically.
- Dialogs must manage focus, escape/cancel behavior, and return focus to the trigger.
