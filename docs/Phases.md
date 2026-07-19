# Delivery Phases
## Local Library Kiosk Logging System — ENG-22393 (2-Day Delivery Window)

Goal: ship a working, accessible, validated PR + live deploy in 2 days. Phases are sequenced so that if time runs short, everything already done is still demo-able (core logic before polish).

---

## Day 1 — Core Logic & Structure

### Phase 0: Setup (30 min)
- Init repo, folder structure per `architecture.md`.
- Set up ESLint config (matches `rules.md` §10).
- Scaffold `index.html`, empty JS modules, base `styles.css` with design tokens from `Design.md`.

### Phase 1: State + Data Layer (1–1.5 hrs)
- Build `state.js` (getState/setState/subscribe).
- Define `LogEntry` model and initial `AppState` per `architecture.md` §4.
- Build `api.js` simulated async layer (variable delay + random failure injection).
- Build `sanitize.js` (`escapeHTML`).

### Phase 2: Core Happy Path UI (2–3 hrs)
- Build log entry form (`logForm.js`): fields, labels, submit handler.
- Build log list (`logList.js`): render entries newest-first.
- Wire form submit → `api.js` → `state.js` → re-render list.
- Manual smoke test: can add an entry and see it appear.

### Phase 3: Search (1 hr)
- Build `searchBar.js`: filter entries by name/activity type.
- Wire to state's `searchQuery` + re-render filtered list.

**Day 1 exit criteria:** a user can open the page, log an entry, see it in the list, and search/filter it. This is the demoable core even if Day 2 gets cut short.

---

## Day 2 — Edge Cases, A11y, Security, Polish, Ship

### Phase 4: Unhappy Path (2 hrs)
- Empty state component + wiring for (a) zero entries at all, (b) zero search results.
- Loading indicator wired to `status === 'loading'` for form submit and search.
- Validation (`validate.js`): required-field checks, malformed-input rejection, red-highlight + inline error message + `aria-invalid`, focus-first-invalid-field.
- Error banner for simulated network failure with retry action.

### Phase 5: Security Pass (30–45 min)
- Confirm sanitize is applied at state-write time for every text field.
- Confirm no `innerHTML` usage touches user data anywhere (grep audit).
- Confirm no secrets/PII/hardcoded keys anywhere (grep audit for common patterns).

### Phase 6: Accessibility Pass (1.5–2 hrs)
- Add/verify ARIA labels, `aria-live` regions, label-for bindings.
- Keyboard-only pass: tab through entire app, confirm no dead ends, confirm visible focus states.
- Run Lighthouse, fix findings iteratively until score = 100.

### Phase 7: Telemetry (15 min)
- Add `telemetry.js`, wire `logEvent()` calls to primary actions (successful submit, successful search).
- Verify console output matches required message format.

### Phase 8: Design/Visual Polish (1 hr)
- Confirm spacing snaps to 16px/32px grid per `Design.md`.
- Confirm palette is monochromatic + single accent, no rogue hex values (grep for stray `#` hex codes outside token file).
- Responsive check for typical kiosk screen sizes (see `Design.md`).

### Phase 9: Lint, QA, DoD Verification (1 hr)
- Run ESLint, fix to zero warnings.
- Remove dead code / unused imports / stray console.logs (except telemetry).
- Walk the full DoD checklist from `rules.md` §12 line by line.
- Cross-check every acceptance criterion in `Prd.md` §7 manually.

### Phase 10: Deploy & Submit (30–45 min)
- Deploy to static host (GitHub Pages / Netlify / Vercel).
- Final smoke test on the **live URL** (not just localhost) — especially loading states and a11y.
- Write README (run instructions, simulated-API disclosure, known limitations).
- Push repo, submit GitHub URL + Live Deployment Link via the submission form.

---

## Buffer & Risk Management

- **Built-in buffer:** ~1 hr unallocated across the two days for the inevitable "this took longer than expected" (usually a11y or validation edge cases).
- **If time runs critically short:** cut in this order — (1) localStorage persistence stretch goal, (2) visual polish beyond token compliance, (3) never cut a11y, validation, or empty/loading states — those are explicit DoD/AC items, not optional.
- **Checkpoint:** end of Day 1, confirm happy path works end-to-end before touching edge cases — this de-risks the ticket even under a schedule slip.
