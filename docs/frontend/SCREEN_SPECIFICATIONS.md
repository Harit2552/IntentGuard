# Screen specifications

All screens are planned. Backend services, authentication, and blockchain execution are not currently implemented. “Success” below means a successful UI/API outcome, not proof of on-chain confirmation.

The brief’s 14 modules are specified below with authentication split into login/registration and history split into history/audit views for clarity.

| Screen | Purpose and user actions | Layout and components | Data, API interactions, and backend dependencies |
|---|---|---|---|
| Landing | Explain value and security model; navigate to login/register; view product information. | Hero, feature/security sections, supported-chain disclaimer, CTA, footer. | Static content; no authenticated API. |
| Login | Authenticate; submit credentials; recover from invalid credentials or expired session. | Form, password visibility control, submit/loading state, field errors. | Auth session contract and CSRF/session strategy require confirmation. |
| Registration | Create account; accept required terms; handle validation and duplicate identity. | Form, password rules, terms links, submit and confirmation state. | Registration contract, verification and abuse controls require confirmation. |
| Dashboard | Summarize account/security status and recent activity; start a transaction workflow. | Stat cards, wallet/network status, recent activity, security alerts, primary CTA. | Profile, wallet context, policy summary, history, alerts; all APIs proposed. |
| Wallet Management | Connect/disconnect wallet, inspect account and supported network, change network through wallet. | Connect button, account card, network indicator, assets/permissions if supported. | Wallet provider plus backend wallet-context contract; no keys stored. |
| AI Transaction Assistant | Enter natural-language instruction and request an intent draft. | Intent input, examples, submit, progress, generated-intent preview. | Intent generation request/result; output is untrusted draft. |
| Intent Review | Inspect/edit structured intent and send it for policy evaluation. | Editable fields, source prompt reference, recipient/asset/amount summary, validation. | Intent schema and policy evaluation contract; no local authoritative decision. |
| Policy Management | View/create/edit policies and understand current limits/permissions. | Policy list, details, editor, rule explanation, save confirmation. | Policy CRUD, authorization and versioning contracts. |
| Transaction Simulation | Request and inspect expected effects before execution. | Simulation summary, affected assets, gas estimate, warnings, retry. | Backend simulation contract, chain/account/intent context. |
| Risk Analysis | Review backend findings and their evidence/limitations. | Risk indicator, finding list, severity, explanation, source/context. | Risk analysis contract; stale or unavailable findings block progression. |
| Transaction Execution | Review exact operation and explicitly invoke wallet approval; monitor status. | Final approval dialog, chain/account/contract/payload summary, wallet status, transaction status. | Backend final validation/execution contract, wallet provider, chain/contract. |
| Multi-Transaction Manager | Add individually verified items, inspect batch, remove selected items. | Batch table/cards, selection/removal controls, aggregate summary, revalidation CTA. | Per-item verification records and batch state. Any edit invalidates final verification. |
| Batch Verification | Submit exact batch for final authoritative check and review resulting payload. | Validation progress/results, item-level findings, batch summary, approval CTA. | Backend batch validation; confirmed contract limits/atomicity semantics required. |
| Transaction History | Search/filter and inspect past submissions/results. | Paginated table/list, filters, status, detail panel. | Authorized history endpoint, pagination, confirmation status and chain links. |
| Audit Trail | Inspect security-relevant changes and execution events. | Chronological log, filters, actor/action/context, event detail. | Backend audit data, retention, access control, pagination. |
| Security Monitoring | Understand current alerts and security posture; inspect/acknowledge if supported. | Alerts, severity, timeline, detail, monitoring status. | Backend monitoring/alert contract; avoid implying continuous monitoring if unavailable. |
| User Settings | Change profile and UI preferences; manage sessions if supported. | Profile form, theme switcher, notification/security preferences, session controls. | Profile/settings/session APIs; theme preference may be local only. |

## Per-screen state and layout matrix

| Screen | Loading | Empty | Error | Success | Responsive behavior | Accessibility considerations |
|---|---|---|---|---|---|---|
| Landing | No data load required; defer noncritical assets. | Not applicable. | Use text/layout fallback if an asset fails. | Public content and navigation available. | Stack sections and CTAs; avoid oversized hero overflow. | Semantic headings/landmarks; keyboard-operable navigation and visible focus. |
| Login | Show session-bootstrap or submit progress. | Not applicable. | Inline field/auth error; preserve safe form input. | Redirect to the protected destination. | Single-column form with full-width controls. | Persistent labels, password visibility name/state, associated field errors, focus announcement. |
| Registration | Show submit and verification progress. | Not applicable. | Field, duplicate-account, or service error. | Confirmation/next-step message without assuming verification is complete. | Single-column form; keep terms and errors readable. | Label every control; explain password rules and terms; announce form errors. |
| Dashboard | Stable card skeletons; identify stale data. | Explain first-use state and offer safe setup/transaction actions. | Per-section retry; retain usable sections. | Timestamped overview and recent activity. | Stack cards; prioritize alerts and primary action. | Logical heading order; status text not color-only; charts need text alternatives. |
| Wallet Management | Show wallet connection/network-switch progress. | Explain disconnected/no supported wallet state. | Provider rejection, unsupported chain, or backend-context error. | Show account, chain, and connection status. | Stack wallet details; retain full-address access. | Announce connection/chain changes; accessible full address and named copy action. |
| AI Transaction Assistant | Disable duplicate submit and announce draft generation. | Explain prompt entry and safe examples. | Preserve prompt; describe timeout/invalid output and retry. | Display an explicitly untrusted draft. | Stack prompt and preview; keep submit reachable. | Label prompt; announce request/result; do not rely on color for draft/decision state. |
| Intent Review | Load draft and evaluation status separately. | Explain missing/expired intent and safe return path. | Field/schema errors or policy denial; block progression. | Show current draft/evaluation; make clear it is not approved execution. | One-column editable review; do not hide key fields. | Programmatic field errors; keyboard order follows review flow; status/findings announced. |
| Policy Management | Skeleton list/details; distinguish refresh. | Explain that no policies are configured and whether setup is allowed. | Authorization, load, or validation error with safe retry. | Show saved/current version and timestamp. | Convert dense policy rows to cards/details. | Table headers or card labels; expose rule/state meaning in text; keyboard-accessible editor. |
| Transaction Simulation | Show request progress and context. | Explain that no simulation exists yet. | Display failed/unavailable result; invalidate dependent review. | Show effects, estimate, warnings, and timestamp. | Stack summary and details; retain units and warnings. | Associate amounts with units; announce simulation completion and warnings. |
| Risk Analysis | Show analysis progress tied to simulation ID. | State explicitly that no findings were returned; do not imply “safe.” | Show unavailable/unknown state and block according to product policy. | Display findings, evidence, and analysis time. | Stack findings; keep severity and explanation together. | Severity is text/icon plus color; provide evidence in readable text/table form. |
| Transaction Execution | Show wallet request or chain-status progress. | Show review state before execution; do not imply prior approval. | Distinguish rejected, reverted, failed, and unknown. | Show submitted/pending/confirmed separately with transaction reference. | Full-width review dialog/sheet; preserve complete payload visibility. | Dialog focus management; exact action labels; announce wallet/status transitions; no color-only status. |
| Multi-Transaction Manager | Load batch and item verification states. | Explain how to add a verified item. | Show item-level failures; prevent stale batch continuation. | Show membership, order, and display-only totals. | Replace table with labeled cards or accessible horizontal table. | Row/column headers or labeled cards; each select/remove control has item-specific name. |
| Batch Verification | Show server validation progress for exact batch version. | Block empty batch and explain required action. | Identify invalid item/context; permit correction and fresh validation. | Show validation expiry, payload identity, and review summary. | Stack item findings and summary without hiding the CTA context. | Announce validation result; keep findings and exact review content keyboard accessible. |
| Transaction History | Show paginated skeleton and active filters. | Explain no matching activity and offer clear-filter action. | Keep filters and report retryable/unavailable state. | Show records with their confirmation status and timestamps. | Use cards or scrollable table; keep status labels visible. | Table semantics, filter labels, pagination announcements, and explicit status text. |
| Audit Trail | Show page/filter progress. | Explain no accessible records for selected scope/time. | Show access/service error without disclosing other users’ records. | Show ordered, timestamped records and event details. | Stack event details; use accessible row/card actions. | Semantic table/list and headings; expose timestamp and event context to screen readers. |
| Security Monitoring | Show monitoring-data freshness and load progress. | Say no current alerts were returned, not that the account is guaranteed safe. | Explain unavailable/stale monitoring data. | Show backend-provided alerts and timestamps. | Stack alert cards; preserve severity text and action labels. | Severity and freshness announced in text; alerts do not rely on color or motion. |
| User Settings | Load profile and preferences independently. | Explain unavailable optional profile/settings sections. | Inline validation or save/session error; preserve edits. | Confirm saved preference/profile state. | Single-column sections; keep labels and controls paired. | Group related settings; expose theme selection and saved state to assistive technology. |

## State requirements

Every data-backed screen must explicitly distinguish:

- **Initial/loading:** skeleton or progress with stable layout; prevent duplicate submissions where appropriate.
- **Empty:** explain why no data exists and offer a safe next action; do not show as an error.
- **Error:** useful, non-sensitive explanation, retry where safe, preserve user input when possible.
- **Success:** confirm the operation/result and next step; for transaction submission, show `submitted/pending` until chain confirmation.
- **Stale/unknown:** identify context mismatch, expired validation, unavailable provider, or unconfirmed status; never silently reuse stale approval.

For wallet- or transaction-dependent screens, add explicit disconnected-wallet, wrong-network, account-changed, insufficient-balance, user-rejected, simulation-failed, policy-denied, backend-unavailable, and contract-failure states where applicable.

## Responsive behavior

On narrow screens, prioritize one-column review flows, stack summaries, preserve amount/address readability, and replace dense tables with labeled cards or horizontally scrollable tables with clear affordance. Keep final payload and authorization actions visible without hiding warnings. See [responsive design](./RESPONSIVE_DESIGN.md).
