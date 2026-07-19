# Architecture Document
## Local Library Kiosk Logging System — ENG-22393

## 1. Overview

A single-page, framework-free (Vanilla JS ES6+) web application. No backend service is built for this ticket; the app runs entirely client-side with an **in-memory state store** and a **simulated async layer** to satisfy the "spotty connection" requirement. Architecture is intentionally layered so a real backend can be swapped in later without a rewrite.

```
index.html
├── /css
│   └── styles.css          (design tokens + component styles)
├── /js
│   ├── main.js              (app bootstrap/init)
│   ├── state.js             (single source of truth + pub-sub)
│   ├── api.js                (simulated async layer — swappable for real fetch later)
│   ├── sanitize.js         (XSS-safe input handling)
│   ├── validate.js          (form validation rules)
│   ├── render.js            (DOM rendering functions)
│   ├── telemetry.js         (analytics simulation)
│   └── components/
│       ├── logForm.js
│       ├── logList.js
│       └── searchBar.js
└── README.md
```

## 2. Core Architectural Pattern

**Simple unidirectional state → render loop** (a lightweight, hand-rolled Flux-ish pattern), since React is off the table:

```
User Action → Handler → state.js (update) → notify subscribers → render.js (re-render affected DOM node)
```

- `state.js` holds the single app state object (`{ entries: [], status: 'idle'|'loading'|'error', filter: '' }`) and exposes `getState()`, `setState(patch)`, and `subscribe(fn)`.
- Every UI update goes through `setState`, never direct DOM mutation from business logic — this keeps state and DOM in sync and makes the app predictable and testable.
- `render.js` re-renders only the relevant section (log list vs. form vs. status banner) rather than the whole page, to keep it feeling instant.

## 3. Handling the "Spotty Connection" Requirement

Since there's no real backend, `api.js` simulates network behavior so the loading/error UX is real and demonstrable:

```js
// api.js (conceptual)
export function submitEntry(entry) {
  return new Promise((resolve, reject) => {
    const delay = 400 + Math.random() * 900; // simulate variable 3G latency
    setTimeout(() => {
      if (Math.random() < 0.08) return reject(new Error('Network error, please retry'));
      resolve({ ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() });
    }, delay);
  });
}
```

- All calls into `api.js` set `state.status = 'loading'` immediately, then `'success'`/`'error'` on resolve/reject.
- `render.js` reacts to `status` to show/hide the loading spinner and error banner.
- This is documented clearly in the README as a **simulation layer** standing in for a real API, per the ticket's brief (no backend was specified/provided).

## 4. Data Model

```ts
LogEntry {
  id: string            // generated (crypto.randomUUID())
  patronName: string     // sanitized, required
  activityType: string   // enum: 'Check-in' | 'Check-out' | 'Inquiry' | 'Computer Use' | 'Other'
  notes: string           // sanitized, optional
  timestamp: string      // ISO 8601, system-generated (not user-editable)
}
```

State shape:
```ts
AppState {
  entries: LogEntry[]
  status: 'idle' | 'loading' | 'success' | 'error'
  errorMessage: string | null
  searchQuery: string
  formErrors: { [fieldName: string]: string }
}
```

## 5. Persistence

- **Primary:** in-memory JS state (resets on page reload) — sufficient to demonstrate core logic per the ticket ("focus on getting the core logic working first").
- **Enhancement (if time permits within the 2-day window):** mirror `entries` to `localStorage` on every state change, and hydrate from it on load, so a kiosk browser refresh doesn't lose the day's log. This is additive and doesn't change the architecture — treated as a stretch goal, not a blocker for DoD.

## 6. Rendering Strategy

- DOM built via `createElement` + `textContent` for anything containing user data (never `innerHTML` with raw user input — see Security below).
- `innerHTML` is permitted only for **static, developer-authored markup** (e.g., building a table skeleton), never for interpolating user-supplied strings.
- Re-render granularity: three independent render targets — `#log-form`, `#log-list`, `#status-banner` — so typing in the search box doesn't re-render the whole form.

## 7. Security Architecture (XSS)

- `sanitize.js` provides `escapeHTML(str)` (encodes `< > & " '`) applied to every field at the point of **storage into state**, not just at render — defense in depth.
- Because rendering uses `textContent`/`createElement` for user data (not `innerHTML`), XSS is blocked at two independent layers: input sanitization + safe DOM APIs.
- No `eval`, no `Function()` constructor, no dynamic script injection anywhere in the codebase.

## 8. Accessibility Architecture

- Semantic HTML first (`<form>`, `<label>`, `<table>`, `<button>`) — ARIA is a supplement, not a replacement.
- Every form control has a bound `<label for="">`.
- Live regions (`aria-live="polite"`) on the status banner and search-result count so screen readers announce loading/empty/error states.
- Focus management: on validation error, focus moves to the first invalid field.
- Full keyboard operability: no click-only handlers; all interactive elements are natively focusable (`<button>`, `<input>`) rather than `<div onclick>`.

## 9. Telemetry

- `telemetry.js` exposes `logEvent(eventName)` → `console.log(`[Analytics] ${eventName}`)`.
- Called on: successful entry submission, successful search, (optionally) entry deletion — i.e., "primary actions," not every keystroke.

## 10. Error/Edge-Case Flow

| Condition | Architectural Handling |
|---|---|
| Empty entries list | `render.js` checks `state.entries.length === 0` → renders `EmptyState` component instead of table. |
| Search yields nothing | Same `EmptyState` component, parameterized with a "no results for '{query}'" message. |
| Async in flight | `status === 'loading'` → spinner component rendered in `#status-banner`, submit button `disabled`. |
| Async fails | `status === 'error'` → dismissible error banner with retry affordance; state.entries left untouched (no partial/corrupt writes). |
| Invalid form input | `validate.js` runs before any `api.js` call; on failure, nothing is submitted, `formErrors` populated, fields get `aria-invalid="true"` + red outline class. |

## 11. Build/Deploy

- No bundler required (plain ES modules via `<script type="module">`), keeping this genuinely lightweight per the ticket constraint.
- Deployable as static files to any static host (GitHub Pages, Netlify, Vercel static) — chosen for the fastest path to a "Live Deployment Link" within the 2-day window.

## 12. Future Extension Points (Not This Ticket)

- Swap `api.js` internals for real `fetch()` calls against a backend — rest of the app is unaffected since it only knows about Promises.
- Add auth layer without touching render/state core.
- Swap in real analytics SDK by replacing `telemetry.js` internals only.
