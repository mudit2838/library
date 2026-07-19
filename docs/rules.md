# Engineering Rules
## Local Library Kiosk Logging System — ENG-22393

Binding rules for this ticket. Anything not covered here defers to `architecture.md` (structure/design) and `Design.md` (visuals).

## 1. Stack Rules

- **No frameworks.** No React, Vue, Svelte, etc. Vanilla JS ES6+ only.
- **No bundler/build-step dependency required.** Prefer native ES modules (`<script type="module">`). If a bundler is used, it must not be a hard requirement to run the app locally (i.e., `index.html` should still be openable/servable directly).
- **No unnecessary third-party libraries.** No jQuery, no CSS frameworks that pull in unused rogue colors/utilities that could violate the design system.

## 2. DOM Rendering Rules

- **Never** put raw user input into `innerHTML`. Use `textContent` or `createElement` + property assignment for anything derived from user data.
- `innerHTML` is allowed only for static, hardcoded markup strings with zero interpolated user data.
- Re-render targeted containers, not `document.body` wholesale, for perceived performance.

## 3. State Management Rules

- All state lives in one module (`state.js`). No stray global variables holding app data.
- UI never mutates state directly — always goes through a `setState`-style function.
- State updates must be immutable-style (new array/object) where feasible, to avoid subtle stale-reference bugs.

## 4. Validation Rules

- Validate **before** calling into the (simulated) async layer — never submit known-bad data.
- Required fields: reject empty/whitespace-only strings.
- On failure: block submission entirely (no partial submit), mark each bad field with a visible red state class + `aria-invalid="true"`, and show a human-readable inline message per field (not just a top-level alert).
- Move focus to the first invalid field on failed submit.

## 5. Security Rules

- Sanitize (HTML-escape) every free-text input at the moment it enters state — not only at render time.
- No `eval`, `Function()`, `document.write`, or dynamic inline event handlers (`onclick="..."` in markup strings).
- No API keys, tokens, credentials, or real PII anywhere in the source, comments, or commit history. Use obviously-fake placeholder data for any seed/demo data (e.g., "Jane Doe", not a real name).
- Treat all kiosk input as untrusted, since it's a public-facing shared device.

## 6. Accessibility Rules (Non-Negotiable — 100% Lighthouse target)

- Every interactive element must be a native focusable element (`button`, `input`, `select`, `a[href]`) — no `<div onclick>`.
- Every form input has an associated `<label>`.
- Color is never the only signal for an error state — pair red styling with an icon and/or text message (also protects against the "no rogue hex colors" rule by forcing you to use the defined error token, not an ad hoc red).
- Maintain visible focus outlines — do not set `outline: none` without a replacement focus style.
- Status/loading/error regions use `aria-live="polite"` so screen reader users get updates without needing focus.
- Run a Lighthouse a11y audit before marking DoD complete; fix to 100 before submission, not "close enough."

## 7. Design System Rules

- Colors, spacing, and typography must come from the token set defined in `Design.md`. **No inline hardcoded hex codes** outside the token definitions.
- Spacing must snap to the 16px/32px step system (plus a documented smaller unit for tight elements, e.g. 8px, if defined in `Design.md`) — no arbitrary `13px`/`22px` margins.
- Keep the palette monochromatic (grays + one accent) as specified — do not introduce brand colors not in the token list.

## 8. Error & Edge-Case Rules

- Every list-rendering code path must handle the zero-items case explicitly — never assume a non-empty array.
- Every simulated async call must set a loading state synchronously before the async operation starts, and must clear it in both success and failure branches (no stuck spinners).
- Catch and handle rejected promises everywhere they're awaited/`.then()`-chained — no unhandled promise rejections.

## 9. Telemetry Rules

- Telemetry fires only on genuine primary actions (successful submit, successful search with results, etc.) — not on every keystroke/render, to keep console output meaningful.
- Message format must match the ticket's convention: `[Analytics] <description>`.

## 10. Code Quality / Lint Rules

- Zero ESLint warnings or errors before PR submission.
- No unused variables, imports, or dead code paths.
- Consistent naming: `camelCase` for variables/functions, `PascalCase` only if used for component-factory function names (e.g., `LogList()`), `UPPER_SNAKE_CASE` for constants.
- Every exported function gets a one-line comment describing intent if its purpose isn't obvious from the name.

## 11. Git / PR Rules

- No `console.log` debugging statements left in beyond the sanctioned telemetry log.
- No commented-out dead code blocks in the final PR.
- README must clearly state: (a) how to run locally, (b) that the async/network layer is simulated and why, (c) known limitations/out-of-scope items from `Prd.md`.
- PR description maps each DoD checklist item to where/how it's satisfied.

## 12. Definition of Done Gate (must all be true before submission)

- [ ] Runs with zero fatal errors.
- [ ] Zero ESLint warnings, no unused imports.
- [ ] All Happy + Unhappy path ACs verified manually against `Prd.md` §7.
- [ ] No secrets/PII in source.
- [ ] Lighthouse a11y = 100.
- [ ] Deployed to a live static URL; repo pushed and public/shared per team norms.
