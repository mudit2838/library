# Product Requirements Document (PRD)
## Local Library Kiosk Logging System

| Field | Value |
|---|---|
| Ticket ID | ENG-22393 |
| Epic | Core Infrastructure Overhaul |
| Priority | P1 (High) |
| Story Points | 5 |
| Assignee | Mudit Kumar [PDIT-FTE-11269] |
| Reporter | Amit Sharma (Senior Staff Engineer) |
| Tech Lead | Deepika Kumari |
| Delivery Window | 2 days |

---

## 1. Problem Statement

The client's library currently tracks kiosk activity (patron sign-ins, book/resource check-in-check-out logging, or general kiosk usage) using **paper logs and Excel sheets**. This causes:

- **Data loss** — paper gets lost/damaged, Excel files get overwritten or corrupted.
- **Operational slowdown** — staff manually cross-reference sheets, which is slow during peak hours.
- **No structured reporting** — managers can't reliably pull consistent data for decisions.

## 2. Goal

Build a **digital kiosk logging interface** that floor staff can pull up on a kiosk/browser and use to log activity quickly, reliably, and without needing IT support — even on unstable connections.

## 3. Users

| User | Need |
|---|---|
| **Floor Staff** | Fast, obvious UI to log an entry with minimal clicks; clear feedback if something goes wrong. |
| **Library Manager** | Consistent, structured data they can trust and later export/report on. |

## 4. In Scope (This Ticket)

- A single-page vanilla JS kiosk logging interface (create / view / search entries).
- Client-side state management (in-memory, no backend required for this phase — see `architecture.md` for persistence approach).
- Full "Unhappy Path" handling: empty states, loading indicators, invalid input handling.
- Accessibility compliance (100% Lighthouse a11y score).
- Simulated telemetry logging to console.
- Input sanitization against XSS.

## 5. Out of Scope (This Ticket)

- Multi-branch / multi-library federation.
- User authentication / role-based access control (assume single shared kiosk session).
- Real backend/API integration (async operations are **simulated** to demonstrate loading/error states per the "spotty internet" requirement — see `architecture.md`).
- Native mobile app.
- Real analytics vendor integration (e.g. Segment/GA) — console log only, per spec.

## 6. User Stories

### Happy Path
- As **staff**, I want a clear kiosk interface so I can log an activity in a few seconds.
- As **staff**, I want instant feedback with no long loading screens for normal actions.
- As **manager**, I want structured, consistent log data I can rely on for reporting.

### Unhappy Path
- As **staff**, if I search and there's nothing to show, I want a clear "No data found" message instead of a blank screen.
- As **staff**, if my connection is slow, I want to see a visual loading indicator so I know the system is working, not frozen.
- As **staff**, if I submit a form with missing/bad data, I want the system to block submission and highlight exactly which fields are wrong.

## 7. Functional Requirements

1. **Log Entry Form** — capture at minimum: Patron/Visitor Name, Purpose/Activity Type (dropdown), Timestamp (auto-generated), Notes (optional).
2. **Entry List / Log View** — table or card list of all logged entries, most recent first.
3. **Search / Filter** — filter entries by name or activity type.
4. **Validation** — required fields enforced; malformed input rejected with inline red-highlighted errors.
5. **Empty State** — "No data found" message when list/search returns nothing.
6. **Loading State** — visual spinner/indicator on simulated async operations (submit, search, load).
7. **Telemetry** — `console.log("[Analytics] User interacted with Local Library Kiosk Logging System")` (or similarly scoped message) fired on every primary action (e.g., successful log submission).
8. **Security** — all free-text inputs sanitized (HTML-escaped) before being stored in state or rendered back to DOM.

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Accessibility | 100% Lighthouse a11y score. ARIA labels on all interactive elements. Full keyboard navigation. |
| Performance | Perceived-instant response for local state ops; loading indicator for anything simulated as async (>300ms). |
| Design | Monochromatic corporate design system. No rogue hex colors — use a defined palette/token set. Consistent spacing on 16px/32px steps. |
| Resilience | App must not crash on bad/missing data, empty states, or simulated network failure. |
| Code Quality | Zero ESLint warnings, no unused imports, no hardcoded secrets/PII. |
| Stack | Vanilla JavaScript (ES6+) only. No React/frameworks. DOM via `innerHTML`/`createElement`. |

## 9. Success Criteria / Definition of Done

- [ ] Code compiles/runs with zero fatal errors.
- [ ] Zero ESLint warnings, no unused imports.
- [ ] All Happy + Unhappy Path acceptance criteria demonstrably met.
- [ ] No hardcoded API keys or PII in source.
- [ ] Lighthouse a11y score = 100.
- [ ] GitHub repo + live deployment link submitted.

## 10. Risks & Assumptions

- **Assumption:** No real backend is provided/expected in this ticket; "spotty internet" handling is demonstrated via simulated async delay/failure (e.g., `setTimeout` + random failure injection), documented clearly as such in the README so the client/reviewer isn't misled.
- **Risk:** 2-day timeline is tight for 100% Lighthouse a11y — mitigate by building with a11y from the start, not retrofitting (see `rules.md`).
- **Risk:** Scope creep from "kiosk" being ambiguous (visitor log vs. book checkout vs. resource booking) — default assumption is a **general-purpose visitor/activity log**, confirm with reporter if time allows, otherwise proceed with this assumption stated explicitly in README.
