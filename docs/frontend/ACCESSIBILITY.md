# Accessibility

Target WCAG 2.2 AA for supported screens, subject to formal assessment during implementation.

## Semantics and keyboard

- Use landmarks, one clear page heading, ordered heading levels, semantic buttons/links, and table headers.
- All actions—including connect, remove item, filter, theme selection, and approval—must work by keyboard with visible focus.
- Maintain logical tab order; dialogs trap focus, support appropriate escape/cancel behavior, and return focus to the trigger.
- Provide skip navigation and responsive navigation with accessible name, expanded state, and focus management.

## Content and status

- Do not use color alone for allowed/denied, risk, network, or transaction status.
- Associate labels, hints, and field errors programmatically; announce form-level errors and asynchronous completion without overwhelming users.
- Loading indicators have text or accessible status; decorative skeletons are hidden from assistive technology.
- Use clear language for irreversible or wallet actions. State whether a transaction is submitted, pending, confirmed, reverted, or unknown.
- Provide full accessible values for truncated addresses, hashes, amounts, and dates; preserve units and precision.

## Visual and motion

- Verify text, controls, focus indicators, charts, and status colors against WCAG contrast in light and dark themes.
- Support browser zoom/reflow and avoid conveying meaning only through hover.
- Respect reduced-motion preference. Do not rely on animation for status communication.
- Ensure target sizes and spacing are usable for touch, with special care around destructive and approval controls.

## Charts and testing

Recharts visualizations need a text summary or accessible data table and must not be the only way to understand a risk or balance trend. Combine automated checks with keyboard-only, screen-reader, zoom, contrast, and manual workflow testing. Include accessibility checks for loading, validation, wallet rejection, and modal states, not only the default page.
