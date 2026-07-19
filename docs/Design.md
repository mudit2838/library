# Design System
## Local Library Kiosk Logging System — ENG-22393

A clean, monochromatic corporate design system. This is the single source of truth for color, spacing, and typography tokens — no value outside this file should be hardcoded elsewhere in the codebase (per `rules.md` §7).

## 1. Design Principles

1. **Kiosk-first clarity** — large touch/click targets, high contrast, no ambiguity about what's clickable.
2. **Calm, not decorative** — monochromatic palette keeps focus on the task, not the chrome.
3. **Predictable structure** — consistent spacing rhythm so staff build muscle memory across screens.

## 2. Color Tokens

Monochromatic gray scale + a single accent for primary actions, plus semantic tokens for states (required by the "highlight offending fields in red" requirement).

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F5F5F5` | Card/panel backgrounds |
| `--color-border` | `#D9D9D9` | Dividers, input borders |
| `--color-text-primary` | `#1A1A1A` | Headings, body text |
| `--color-text-secondary` | `#5C5C5C` | Helper text, labels, timestamps |
| `--color-text-disabled` | `#A3A3A3` | Disabled states |
| `--color-accent` | `#2B2B2B` | Primary buttons, active/focus states (dark neutral, not a "brand" color — keeps it monochromatic) |
| `--color-accent-hover` | `#000000` | Primary button hover |
| `--color-success` | `#2E7D32` | Success banner (minimal use) |
| `--color-error` | `#C62828` | Validation errors, error banner, invalid-field outline |
| `--color-error-bg` | `#FDECEA` | Error banner/field background tint |
| `--color-focus-ring` | `#2B2B2B` | Visible keyboard focus outline (also used at 40% opacity as a glow) |

**Rule:** `--color-success` and `--color-error` are the only non-gray hues permitted, reserved strictly for semantic state — never decorative use. This satisfies "no rogue hex colors" while still meeting the "highlight in red" accessibility/validation requirement.

## 3. Spacing Scale

Snaps to 16px/32px steps as required, with one smaller unit for tight internal component spacing:

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `8px` | Icon-to-text gaps, tight internal padding |
| `--space-sm` | `16px` | Default field spacing, button padding |
| `--space-md` | `32px` | Section spacing, card padding |
| `--space-lg` | `64px` | Page-level top/bottom margins |

## 4. Typography

System font stack (no external font loading required — keeps it lightweight per the vanilla-JS/no-bloat constraint):

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--font-h1` | 28px | 600 | Page title ("Kiosk Log") |
| `--font-h2` | 20px | 600 | Section headers ("New Entry", "Activity Log") |
| `--font-body` | 16px | 400 | Form labels, table content |
| `--font-small` | 14px | 400 | Timestamps, helper text |
| Line height | 1.5 | — | All body text, for readability at kiosk viewing distance |

## 5. Components

### 5.1 Buttons
- Primary: `--color-accent` background, white text, `--space-sm` vertical/horizontal padding, min touch target **44x44px** (kiosk/accessibility requirement).
- Disabled (during loading state): `--color-text-disabled` background, `cursor: not-allowed`, `aria-disabled="true"`.
- Focus: visible outline using `--color-focus-ring`, never removed.

### 5.2 Form Fields
- Label always above input (not placeholder-only — placeholders disappear on input, hurting usability/a11y).
- Default border: `--color-border`, 1px.
- Focus border: `--color-accent`, 2px + focus ring.
- Invalid state: border `--color-error`, 2px; background `--color-error-bg`; inline message below field in `--color-error` text with an error icon (not color alone).

### 5.3 Log List / Table
- Row height comfortable for scanning: min 48px.
- Zebra striping using `--color-surface` on alternate rows (subtle, still monochromatic) for scanability.
- Empty state: centered icon + `"No data found"` (or `"No results for '{query}'"` when filtered) in `--color-text-secondary`, with `--space-md` vertical padding so it doesn't look broken.

### 5.4 Loading Indicator
- Simple spinner (CSS-animated border-spin, no external asset) in `--color-accent`.
- Shown inline in the status banner region, plus disables the relevant submit button, so it's perceivable both visually and via disabled state (helps a11y too).

### 5.5 Status / Error Banner
- Fixed-position or top-of-section banner, `aria-live="polite"`.
- Error variant: `--color-error-bg` background, `--color-error` text/icon, dismiss + retry buttons.
- Success is subtle/brief (e.g., short inline confirmation near the form) — avoid intrusive success modals on a kiosk that staff use repeatedly all day.

## 6. Layout

- Single-column on narrow/kiosk-portrait screens; two-column (form left, log right) on wider landscape kiosk displays or desktop review, using CSS Grid with a breakpoint around `768px`.
- Max content width `1200px`, centered, with `--space-md` side padding on wide screens to avoid overly long line lengths.

## 7. Accessibility Notes (Design-Level)

- Minimum contrast ratio 4.5:1 for all text against its background — verify each token pairing (e.g., `--color-text-secondary` on `--color-bg`) against WCAG AA before implementation.
- Touch targets ≥ 44x44px throughout (kiosk devices are often touchscreens even if not explicitly stated).
- Never rely on placeholder text as the only label.
- Error/success states always paired with an icon + text, never color-only.

## 8. Explicit Non-Goals

- No illustrations, gradients, or decorative imagery — keeps load fast on poor connections and keeps the corporate/utilitarian tone requested.
- No custom web fonts — system font stack only, for performance and simplicity.
