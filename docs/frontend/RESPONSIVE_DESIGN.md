# Responsive design

## Breakpoint strategy

Use content-driven breakpoints rather than device names. Initial Tailwind-aligned targets may be compact below 640px, medium 640–1023px, and wide at 1024px and above; confirm against actual layouts. Test narrow phones, landscape, tablet, laptop, and large desktop.

## Layout behavior

- **Small screens:** one-column content, collapsible navigation, stacked dashboard cards, full-width primary actions, dialogs as full-height sheets where appropriate.
- **Medium screens:** compact/collapsible sidebar, two-column summaries where they remain readable, stacked review panels.
- **Wide screens:** persistent sidebar, bounded content width, multi-column dashboard and side-by-side review only when the complete transaction context remains visible.
- Keep page title, current account/network, key warnings, and next action discoverable at all sizes.

## Dense data and transaction review

- Do not shrink hash/address/amount text until it becomes unreadable. Use wrapping, truncation with accessible full value, copy action, or detail view.
- Tables may scroll horizontally with an announced affordance; provide a labeled card layout on small screens when practical.
- Batch removal, selection, and status must remain individually operable by touch and keyboard.
- Keep units and totals explicit; do not rely on alignment alone to communicate financial values.
- Final approval must expose all material payload information before wallet handoff on mobile as well as desktop. Avoid sticky controls that cover warnings or content.

## Input and overlays

Use appropriate input types and mobile keyboard hints; avoid horizontal overflow in forms. Drawers/dialogs must fit the viewport, respect safe areas, scroll internally when needed, and keep focus contained. Do not place critical confirmation controls where browser chrome or an on-screen keyboard hides them.

## Validation

Test zoom/reflow, long labels, localized number/address content, error messages, empty states, tables, dialogs, and wallet/network banners in both themes. Responsive layouts must not remove security context or secondary review details.
