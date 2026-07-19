import { renderLogForm } from './components/logForm.js';
import { renderLogList } from './components/logList.js';
import { renderSearchBar } from './components/searchBar.js';
import { getState, setState } from './state.js';
import { submitEntry } from './api.js';
import { logEvent } from './telemetry.js';

let formContainer;
let listContainer;
let searchContainer;
let statusContainer;

export function renderApp() {
  if (!formContainer) formContainer = document.getElementById('log-form');
  if (!listContainer) listContainer = document.getElementById('log-list');
  if (!searchContainer) searchContainer = document.getElementById('search-bar');
  if (!statusContainer) statusContainer = document.getElementById('status-banner');

  renderLogForm(formContainer);
  renderLogList(listContainer);
  renderSearchBar(searchContainer);

  if (statusContainer) {
    const state = getState();
    if (state.status === 'loading' && (state.statusType === 'submit' || state.statusType === 'load')) {
      statusContainer.className = 'status-banner loading';
      statusContainer.innerHTML = state.statusType === 'load'
        ? '<div class="spinner" aria-hidden="true"></div> <span>Initializing kiosk database...</span>'
        : '<div class="spinner" aria-hidden="true"></div> <span>Saving entry...</span>';
      statusContainer.style.display = 'flex';
    } else if (state.status === 'error') {
      statusContainer.className = 'status-banner error';
      statusContainer.innerHTML = '';
      
      const errorText = document.createElement('span');
      errorText.textContent = '⚠️ ' + (state.errorMessage || 'Simulated connection error.');
      statusContainer.appendChild(errorText);

      if (state.failedEntry) {
        const retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.className = 'retry-btn';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', () => {
          const entryToSubmit = state.failedEntry;
          setState({ status: 'loading', statusType: 'submit', errorMessage: null, failedEntry: null });
          submitEntry(entryToSubmit)
            .then((newEntry) => {
              const currentState = getState();
              setState({
                entries: [newEntry, ...currentState.entries],
                status: 'success',
                statusType: null,
                errorMessage: null
              });
              logEvent(`Successful entry submission via retry: Patron: ${newEntry.patronName}, Activity: ${newEntry.activityType}`);
              const form = document.getElementById('kiosk-log-form');
              if (form) form.reset();
            })
            .catch((error) => {
              setState({
                status: 'error',
                statusType: null,
                errorMessage: error.message,
                failedEntry: entryToSubmit
              });
            });
        });
        statusContainer.appendChild(retryBtn);
      }

      const dismissBtn = document.createElement('button');
      dismissBtn.type = 'button';
      dismissBtn.className = 'dismiss-btn';
      dismissBtn.textContent = 'Dismiss';
      dismissBtn.addEventListener('click', () => {
        setState({ status: 'idle', errorMessage: null });
      });
      statusContainer.appendChild(dismissBtn);

      statusContainer.style.display = 'flex';
    } else {
      statusContainer.className = 'status-banner';
      statusContainer.innerHTML = '';
      statusContainer.style.display = 'none';
    }
  }
}
