# State management

## Ownership

| State | Owner | Examples |
|---|---|---|
| Remote/server state | TanStack Query | Profile, policies, intent API results, simulation, execution status, history, audit |
| UI preferences | Zustand or a small preference store | Theme choice, sidebar collapsed, non-sensitive display preferences |
| Ephemeral workflow state | Zustand, scoped to workflow | Draft form progress, selected batch IDs, temporary table selections |
| Wallet/provider state | wagmi/viem provider layer (planned) | Connected account, chain, connection status; wallet remains source of truth |
| Authentication state | Agreed auth provider/session adapter (not implemented) | Session bootstrap, authenticated user metadata, expiry and logout; never credentials in global UI state |
| Transaction state | Query cache plus short-lived feature workflow state | Backend intent/evaluation/simulation/execution status; client does not own authoritative decisions |
| Batch state | Backend draft/validation when supported; ephemeral local selection otherwise | Item membership/order, per-item verification IDs, final validation freshness; approval is never persisted |
| URL state | Router/search params | Filter/sort/page when shareable and non-sensitive |
| Form state | React Hook Form + Zod (planned) | Login, policy editor, prompt and intent edits |

Do not mirror query data into Zustand. Keep domain source of truth clear and invalidate queries after mutations.

There is currently no Query, Zustand, wallet, auth, or form-state integration in the frontend. The table describes target ownership, not implemented stores.

## Persistence

- Persist only low-risk preferences such as theme and possibly sidebar state.
- Theme state has three values: `light`, `dark`, and `system`; the rendered palette follows system preference only while `system` is selected.
- Do not persist private keys/seed phrases, signatures, wallet authorization requests, final-approval state, sensitive prompts, or transaction authorization payloads.
- Avoid persisting wallet account/provider data unless product/security review explicitly approves the scope and expiry behavior.
- Do not persist authenticated query cache by default. On logout, session expiry, or user change, clear user-scoped cache and in-memory workflow state.
- A batch may be recoverable from a backend draft only if the backend supports it; restored items must be revalidated and never imply prior approval remains valid.

## Invalidation rules

Invalidate intent policy, simulation, risk, final batch verification, and approval state after any relevant change to intent fields, batch membership/order, account, chain, policy version, contract target, or expiry. Account/chain changes must invalidate all dependent wallet-scoped data. A stale query result cannot authorize execution.

## Async UX

Represent loading, success, empty, error, stale, and unknown distinctly. Cancel superseded read requests where possible. Do not automatically retry non-idempotent execution/signing actions. Use idempotency keys only under an agreed backend contract.
