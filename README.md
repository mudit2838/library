# Local Library Kiosk Logging System — ENG-22393

A lightweight, accessible, framework-free single-page web application for floor staff to log kiosk activity (patron sign-ins, book check-in/out logging, resources use, etc.). Built with Vanilla JavaScript, native ES modules, and a monochromatic design system.

## Features
- **Log Entry Form:** Capture Patron Name, Activity Type (dropdown), and optional Notes.
- **Activity Log Table:** Scannable, newest-first list of logged entries.
- **Search Filtering:** Live search filtering matching Patron Name or Activity Type, with a debounced telemetry log when successful matches are returned.
- **Security & Sanitization:** Inputs are HTML-escaped (`sanitize.js`) at the moment they enter state, and DOM elements are rendered via safe properties (`textContent`) to prevent XSS.
- **Accessibility:** Semantic elements, bound labels, keyboard-navigable controls, custom focus rings, non-color status indicators, and screen-reader polite announcers (`aria-live="polite"`) for list changes, empty views, and status alerts.
- **Resilience:** Gracefully handles validation errors, empty results, loading states, and network errors.

---

## Technical Architecture

### Stack
- **Languages:** HTML5, Vanilla JavaScript (ES6+), CSS3.
- **Frameworks:** None (Vanilla implementation).
- **Modules:** Native ES Modules (`<script type="module">`).
- **Build/Packaging:** No bundler or compiler is required.

### Simulated Network Layer
> [!IMPORTANT]
> The network/database layer in this application (`js/api.js`) is **fully simulated**. 
> - **In-Memory Store:** Logs are saved in a client-side JS state store (`js/state.js`) which resets on page reload.
> - **Simulated Latency:** API submissions include a randomized delay of `400ms - 1300ms` (simulating 3G connections).
> - **Simulated Failures:** There is an artificial `8%` network error rate. If hit, the app triggers a red error banner with a **Retry** affordance that preserves the failed transaction state and allows resubmitting the entry.

---

## How to Run Locally

Because the application uses native ES modules (`import`/`export`), opening the `index.html` file directly in a browser via the `file://` protocol may trigger CORS security blocks depending on browser security configurations.

To run the application locally, serve the directory using a simple local web server:

### Option A: Using Python (Recommended)
Python is pre-installed on most systems. Run the following command in the project root:
```bash
python3 -m http.server 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

### Option B: Using Node (npx)
If you have Node.js installed, run:
```bash
npx http-server -p 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

---

## Deploying to a Live Static Host

Since the app is composed entirely of static files, it can be deployed to any static hosting provider without backend configuration:

### GitHub Pages
1. Push the repository to GitHub.
2. Go to **Settings** > **Pages** in the GitHub repository interface.
3. Select the branch (e.g., `main`) and folder (`/` root) as the source, then click **Save**.

### Netlify / Vercel
1. Drag and drop the project folder to the Netlify Drop dashboard, or import the GitHub repository to Vercel.
2. Set the build command to empty/blank and output directory to `./` (root).
3. Deploy.

---

## Known Limitations & Out-of-Scope (from PRD §10)
- **Shared Session:** No user authentication or role-based access controls are built in. Kiosk assumes a single shared staff session.
- **No Persistence:** Log entries reside in-memory. Deleting cache or refreshing the page clears custom entries and restores seed data (unless `localStorage` syncing is retrofitted).
- **Single-Kiosk Scope:** No multi-branch or centralized cloud syncing is supported in this phase.
