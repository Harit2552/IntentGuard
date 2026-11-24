# UI/UX design system

## Product direction

Use a premium, restrained fintech style: dark by default, quiet surfaces, clear transaction data, subtle gradients, limited glass effects, and purposeful security status color. Avoid neon-heavy decoration, ambiguous icons, or motion that competes with transaction details.

Theme preference supports **Dark**, **Light**, and **System**. Dark is the first-visit default; System follows the operating-system preference. Persist only the preference, not wallet or authorization state. Apply the theme before first paint to reduce flashing.

## Semantic color tokens

The following are initial design values; validate contrast in implemented components and adjust pairs rather than relying on hue alone.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--background` | `#0B1020` | `#F7F9FC` | Application canvas |
| `--surface` | `#121A2B` | `#FFFFFF` | Cards and panels |
| `--surface-raised` | `#1A263A` | `#EEF2F8` | Menus and raised panels |
| `--foreground` | `#F3F6FC` | `#172033` | Primary text |
| `--muted` | `#A3AEC2` | `#58657A` | Supporting text |
| `--border` | `#2C3A50` | `#D8E0EB` | Dividers and outlines |
| `--primary` | `#8EA7FF` | `#435FDB` | Primary actions and links |
| `--primary-foreground` | `#10182B` | `#FFFFFF` | Text on primary |
| `--success` | `#54D6A0` | `#087A50` | Confirmed/success |
| `--warning` | `#F3C66D` | `#946000` | Caution/pending |
| `--danger` | `#FF858B` | `#B42332` | Denied/error/destructive |
| `--info` | `#72C7F2` | `#17658A` | Informational state |

Use semantic token names in components, not raw values. Security status must include text/icon/shape as well as color. Never use green to imply a transaction is safe solely because an API request succeeded.

## Typography

- Use a system sans-serif stack for product UI; monospace for hashes, addresses, chain IDs, and code-like payloads.
- Suggested scale: 12/16px metadata, 14/20px body compact, 16/24px body, 20/28px section title, 28/36px page title, 36/44px landing headline.
- Use tabular numerals for balances, fees, and totals. Truncate long addresses visually but provide copy and full-value accessibly.
- Keep transaction amounts, units, and destination distinguishable.

## Spacing, geometry, elevation

- Base spacing unit: 4px; common steps 4, 8, 12, 16, 24, 32, 48, 64px.
- Radius: 6px controls, 10px cards, 14px dialogs; pills only for compact labels/statuses.
- Borders are the primary surface separator. Reserve shadows for overlays; use restrained, low-opacity elevation.
- Glass treatment is limited to decorative shell areas and must retain opaque fallback and readable contrast.
- Use a consistent focus ring and minimum 44×44 CSS-pixel touch targets where practical.

## Responsive breakpoints

Treat these as initial layout thresholds, not device categories: compact/mobile below 640px; tablet/small desktop from 640px to 1023px; desktop at 1024px and above; optional wide-content refinements at 1280px. The existing Tailwind setup may provide breakpoint utilities, but validate actual component fit and avoid breakpoint-only behavior that harms zoom/reflow.

## Component states

Define `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `invalid`, and `read-only` consistently. Destructive and signing actions require distinct review states; loading must not look like approval. Disabled controls need an adjacent explanation when the reason is not obvious.

## Interaction patterns

- Use buttons for actions and links for navigation. Every destructive or transaction-authorizing action has an explicit, clearly labeled user trigger.
- Confirm destructive changes when they cannot be recovered; batch edits/removals invalidate final verification.
- Keep form errors adjacent to fields and provide a summary for multi-field failures. Preserve input on safe retries.
- Distinguish pending, stale, unavailable, denied, submitted, confirmed, reverted, and unknown states with clear text and consistent visual treatment.
- Use dialogs for focused decisions, not as a substitute for showing complete transaction details. Wallet handoff occurs only after the user reviews and explicitly continues.
- Provide hover and focus-visible parity; do not hide critical explanation or action behind hover.

## Motion

Use short, nonessential transitions for theme, menu, and status changes. Respect `prefers-reduced-motion`; do not animate balances, risk scores, or transaction payloads in ways that obscure changes.

## Theme implementation notes

Implement semantic CSS custom properties with light and dark attribute selectors. System mode should use the media query only when the explicit preference is `system`. Keep charts and status badges on semantic tokens and verify contrast in both themes. Design values above are proposals; measure WCAG contrast during implementation.
