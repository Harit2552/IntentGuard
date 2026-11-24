# API integration contract

This document separates confirmed implementation from proposed integration contracts. It does **not** establish endpoint URLs, backend behavior, or a final schema. Do not implement proposed shapes as if they were already supported.

## Confirmed interfaces and implementation status

| Area | Status | Confirmed implementation |
|---|---|---|
| Backend health | **IMPLEMENTED — confirmed** | `GET /api/health` is mounted under `/api` and currently returns static `{ status: 'ok' }` from [health.ts](../../apps/backend/src/routes/health.ts), via [server.ts](../../apps/backend/src/server.ts). It is not a database/readiness check. |
| Shared type | **IMPLEMENTED — confirmed, not a domain contract** | [shared `JsonValue`](../../packages/shared/src/index.ts) is exported by the shared package and used by the current health route. It does not define auth, transaction, or API DTOs. |
| Authentication/session | **NOT IMPLEMENTED** | No backend auth routes or frontend auth integration were found. |
| Wallet connection/context | **NOT IMPLEMENTED** | No wallet adapter or backend wallet-context interface was found. Wallet connection should remain a browser/provider interaction; send only context needed by an agreed backend operation, never key material. |
| Intent, policy, simulation, risk, execution, batch, history/audit | **NOT IMPLEMENTED** | No corresponding backend routes/contracts or frontend service adapters were found. |
| Smart-contract execution | **NOT IMPLEMENTED** | [IntentGuardPlaceholder.sol](../../blockchain/contracts/IntentGuardPlaceholder.sol) is an empty placeholder; there is no callable execution or batch interface to integrate. |

## Contract principles

- Backend owns authentication, policy decisions, intent processing, simulation/risk, batch verification, execution coordination, and audit records.
- Never trust a client-computed allow/deny or risk result.
- Include stable IDs, timestamps, version/context identifiers, and explicit status where needed.
- Bind policy/simulation/final batch verification to account, chain, and canonical payload. Expired or mismatched context must be rejected.
- Use pagination for history/audit; define idempotency behavior for mutations before retrying them.
- Validate unknown JSON at the client boundary with the agreed runtime schema (planned Zod); fail visibly on malformed responses.
- Use safe, non-sensitive user messages. Do not return or log secrets.

## Proposed shared shapes (not implemented or approved)

```ts
type Address = `0x${string}`;
type Hex = `0x${string}`;
type ChainId = number;

interface AuthUser {
  id: string;
  displayName?: string;
}

interface ApiError {
  code: string;
  message: string;
  requestId?: string;
  fieldErrors?: Record<string, string[]>;
  retryable?: boolean;
}

interface WalletContext {
  account: Address;
  chainId: ChainId;
  connectedAt: string;
}

interface IntentRequest {
  prompt: string;
  account: Address;
  chainId: ChainId;
}

interface IntentDraft {
  id: string;
  version: number;
  chainId: ChainId;
  account: Address;
  operation: string;
  recipient?: Address;
  asset?: Address;
  amount?: string; // Decimal/base-unit convention must be agreed; do not use JS float for token math.
  source: 'ai' | 'user';
  createdAt: string;
}

interface BatchItem {
  intentId: string;
  intentVersion: number;
  policyEvaluationId: string;
  simulationId: string;
}

interface PolicyEvaluation {
  evaluationId: string;
  intentId: string;
  decision: 'allow' | 'deny' | 'indeterminate';
  evaluatedAt: string;
  contextVersion: string;
  findings: Array<{ code: string; severity: 'info' | 'warning' | 'block'; message: string }>;
}

interface SimulationResult {
  simulationId: string;
  intentId: string;
  chainId: ChainId;
  account: Address;
  status: 'succeeded' | 'failed' | 'unknown';
  simulatedAt: string;
  expiresAt?: string;
  gasEstimate?: string;
  warnings: string[];
}

interface BatchValidation {
  validationId: string;
  batchId: string;
  payloadHash: Hex;
  chainId: ChainId;
  account: Address;
  status: 'valid' | 'invalid' | 'expired';
  validatedAt: string;
  expiresAt: string;
  findings: string[];
}

interface BatchExecutionRequest {
  validationId: string;
  payloadHash: Hex;
  account: Address;
  chainId: ChainId;
}

interface WalletTransactionRequest {
  chainId: ChainId;
  to: Address;
  data: Hex;
  value: string;
}

interface ExecutionStatus {
  executionId: string;
  status: 'awaiting_wallet' | 'submitted' | 'pending' | 'confirmed' | 'reverted' | 'unknown';
  chainId: ChainId;
  transactionHash?: Hex;
  updatedAt: string;
}

interface AuditEvent {
  id: string;
  occurredAt: string;
  category: string;
  action: string;
  status: string;
  transactionHash?: Hex;
}
```

Every type in this section is **PROPOSED**. `WalletContext` and `WalletTransactionRequest` are conceptual data shapes, not a claim that the backend should receive wallet secrets or that a specific wallet method is supported. `amount` representation, operation schema, address casing, payload hash algorithm, expiry rules, batch atomicity, and status transitions require backend/contract agreement before implementation.

## Service boundaries and proposed request/response examples

Examples are transport-neutral contracts; no endpoint path is implied.

| Service | Status | Proposed request | Proposed response | Errors/loading |
|---|---|---|---|---|
| Authentication | **PROPOSED; not implemented** | Credentials/session action; exact fields and transport TBD | `AuthUser` plus session state; no wallet secret | Invalid credentials, expired session, rate limit; pending and field errors |
| Wallet connection/context | **Client wallet integration not implemented; backend context TBD** | Browser provider connects account/chain. Backend context request only if needed: `WalletContext` | Provider account/chain state; optional backend context contract TBD | Unsupported chain/account mismatch; invalidate dependent queries |
| AI intent | **PROPOSED; not implemented** | `IntentRequest` | `{ draft: IntentDraft, notices: string[] }` | Invalid/unsupported/timeout; draft stays non-executable |
| Policy evaluation | **PROPOSED; not implemented** | `{ intent, intentVersion, account, chainId }` | `PolicyEvaluation` | Deny/indeterminate/stale context; block next step |
| Simulation | **PROPOSED; not implemented** | `{ intentId, evaluationId, account, chainId }` | `SimulationResult` plus effects schema TBD | Revert, timeout, unavailable; invalidate dependent review |
| Risk analysis | **PROPOSED; not implemented** | `{ simulationId, intentId, contextVersion }` | Findings and timestamped classification, schema TBD | Unknown/unavailable; do not synthesize a low-risk result |
| Batch validation | **PROPOSED; not implemented** | Ordered `BatchItem`s plus account/chain context | `BatchValidation` and exact payload summary | Any item stale/denied/unsupported; no wallet call |
| Batch execution | **PROPOSED; contract interface absent** | `BatchExecutionRequest` | Execution status plus contract-supported wallet transaction request, if agreed | Expired validation, unsupported batch, rejected/failed; never retry signing automatically |
| Single execution | **PROPOSED; contract interface absent** | Validated intent/context; exact shape TBD | `ExecutionStatus` and wallet request shape TBD | Expired validation, wrong chain/account, rejected/failed |
| Audit/history | **PROPOSED; not implemented** | Filters, cursor/page, date range | Page of authorized `AuditEvent`/transaction records and next cursor | Unauthorized, expired cursor, partial/unavailable; preserve filters |

## Illustrative safe response handling

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

// Example only: service adapters should validate unknown JSON before returning typed data.
async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<Result<T>> {
  const response = await fetch(input, { ...init, credentials: 'include' });
  const body: unknown = await response.json();
  // Parse body with the agreed runtime schema; map non-2xx errors explicitly.
  // Do not cast unvalidated JSON to T.
  return mapAndValidateResponse<T>(response, body);
}
```

`mapAndValidateResponse` is illustrative and not implemented. Cookie/session behavior, CSRF, CORS, content-type, error envelope, request IDs, timeout, and cancellation policy are open backend integration decisions.

## Example response (mock)

```json
{
  "evaluationId": "eval_example",
  "intentId": "intent_example",
  "decision": "deny",
  "evaluatedAt": "2026-01-01T00:00:00.000Z",
  "contextVersion": "policy-version-example",
  "findings": [
    {
      "code": "LIMIT_EXCEEDED",
      "severity": "block",
      "message": "This request exceeds the configured limit."
    }
  ]
}
```

This is fabricated documentation data, not a real API response or project record.

## Decisions requiring backend agreement

Authentication model and session transport; service ownership; request/response schemas; endpoint paths and versioning; idempotency; pagination; rate limits; decimal units; policy/evaluation freshness; simulation semantics; risk taxonomy; batch atomicity/partial failure and max size; actual contract function/calldata; wallet transaction handoff; transaction confirmation/finality; audit retention and privacy.
