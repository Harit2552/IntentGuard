# User journeys

## Journey A — registration and login

1. A new user opens registration, enters required details, and submits once.
2. The UI shows pending state and field/server validation without discarding safe input.
3. If verification is required by the agreed auth contract, show the next step; do not assume registration alone authenticates the user.
4. On authenticated session confirmation, route into the protected application. On failure, stay public and explain the recoverable action.
5. A returning user submits login; success restores the session and redirects to the intended same-origin protected route.
6. Invalid credentials, rate limiting, service outage, and expired sessions are distinct; logout/session expiry clears user-scoped client state.

## Journey B — wallet connection and network detection

1. User explicitly selects connect; the app asks the browser wallet provider for account access.
2. Display the selected account and detected chain only after provider response.
3. Compare the chain against the confirmed supported-chain list. For unsupported network, explain the issue and offer a wallet network-switch request only if supported.
4. Re-read account/chain after switching or provider events. Account changes, disconnects, and chain changes invalidate dependent transaction state.
5. Wallet unavailable, locked, rejected, and provider/network errors have explicit retry/help states; never request a private key or seed phrase.

## Journey C–H — verified transaction and batch journey

1. User authenticates and enters the protected application.
2. User connects MetaMask; the UI confirms account and supported chain.
3. User submits a natural-language instruction.
4. Backend returns a structured intent draft. The UI displays it as untrusted and editable.
5. User reviews/edits the intent and submits it for backend policy evaluation.
6. A policy denial or indeterminate result stops progression. Only an authoritative allowed result permits simulation to be requested.
7. Backend simulation and risk analysis are displayed with context and freshness.
8. User adds the individually verified transaction to the batch manager (a single-item batch is allowed only if supported by the product contract).
9. User may remove selected items. Any item change invalidates final batch verification.
10. User requests final batch validation; backend checks the exact batch and returns a versioned/context-bound result.
11. User reviews the complete batch, target account, chain, contract, value/assets, and execution limitations.
12. User explicitly initiates the supported contract operation. The wallet displays the exact transaction for approval; frontend does not sign silently.
13. UI tracks wallet rejection, submission, pending confirmation, confirmed, reverted, or unknown status and displays audit/result details.

## Journey I — transaction status and audit history

1. User opens history or audit and receives paginated, authorized records with filters and timestamps.
2. A record distinguishes wallet rejection, submitted, pending, confirmed, reverted, and unknown when those states are available.
3. Opening a record shows transaction context and audit details the backend is authorized to return. A hash alone is not confirmation.
4. Loading, no matching records, partial/unavailable data, expired cursor, and authorization errors are separate states. Filtering and page state should be preserved for safe retries.

## Alternate and failure paths

| Condition | Required behavior |
|---|---|
| AI intent invalid/unsupported | Preserve original prompt; explain which fields are missing/unsupported; allow correction or retry. Never offer an execution shortcut. |
| Policy violation | Show backend finding and applicable policy context; block simulation-to-execution progression until corrected and re-evaluated. |
| Simulation failure | Mark simulation unavailable/failed, show safe retry, invalidate downstream review; do not treat as success or permit stale result. |
| Risk service failure/unknown | Explicitly label missing risk result; follow backend/product policy for blocking, but never invent a safe score. |
| Insufficient balance | Show asset/fee requirement and current wallet context if available; refresh data and re-run relevant checks after a change. |
| Wrong chain | Explain expected versus connected chain and request wallet network switch if supported; revalidate after switch. |
| Wallet disconnect/account changes | Pause; invalidate account-bound simulation, validation and approval state; require reconnection and revalidation. |
| User rejects in wallet | Report rejection without retrying automatically; preserve review state only if still fresh and context unchanged. |
| Batch item removed/edited | Update the batch and invalidate final validation and any dependent approval payload. |
| Partial batch failure | Display per-item execution outcome and batch semantics returned by the contract/backend; do not claim atomicity unless guaranteed by the deployed contract. |
| Contract execution failure/revert | Show failed/reverted status with available reason; preserve transaction reference and allow safe follow-up only after fresh validation. |
| Hash returned but no confirmation | Show pending/unknown confirmation. A hash is submission evidence, not proof of finality. |
| Authentication/session expires | Stop protected operations, clear user-scoped client state, preserve only safe navigation intent, and require reauthentication. |
| Backend/network request fails | Preserve safe form input, identify unavailable service, and retry only idempotent operations; never silently mark a workflow step successful. |
| Wallet provider is unavailable | Explain how to connect/install a supported provider without blocking unrelated public screens. |
| Unsupported network | Prevent wallet handoff; offer a switch only for a confirmed supported chain, then re-read and revalidate context. |
| Policy permits operation | Display the authoritative backend result with context and freshness; this is permission to continue to the next check, not user approval or execution. |

## Security and consent checkpoints

- AI proposes; user reviews; backend policy decides; backend/contract simulation and execution rules remain authoritative.
- Re-check account, chain, payload, and batch immediately before wallet handoff.
- The wallet must request explicit user action. No private key or seed phrase is ever requested by the app.
- The final approval must bind to precisely the payload the user reviewed. Any material change restarts review.
- “One approval” means one supported contract call when the contract and wallet support that model; it does not mean MetaMask can sign arbitrary independent transactions as one action.

## Batch execution decision still required

The product and contract teams must decide whether batch execution is atomic or can partially succeed, how per-item failures are represented, the maximum supported batch size, how payloads are canonicalized, and what the wallet actually displays. Until confirmed, the UI must describe these as limitations/unknowns rather than promise one-signature atomic execution.
