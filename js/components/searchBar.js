import { getState, setState } from '../state.js';
import { logEvent } from '../telemetry.js';

let debounceTimer;

export function renderSearchBar(container) {
  if (!container) return;

  const state = getState();
  let searchInput = container.querySelector('#search-input');
  let searchSpinner = container.querySelector('#search-spinner');

  if (!searchInput) {
    container.innerHTML = `
      <div class="search-container">
        <label for="search-input" class="sr-only">Search logs by name or activity type</label>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Search by name or activity..." 
            autocomplete="off"
          />
          <div id="search-spinner" class="search-spinner" aria-hidden="true" style="display: none;"></div>
        </div>
      </div>
    `;
    searchInput = container.querySelector('#search-input');
    searchSpinner = container.querySelector('#search-spinner');
    
    searchInput.addEventListener('input', (e) => {
      const value = e.target.value;
      setState({ searchQuery: value, status: 'loading', statusType: 'search' });

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setState({ status: 'success', statusType: null });
        const query = value.trim().toLowerCase();
        if (query) {
          const currentState = getState();
          const filtered = (currentState.entries || []).filter((entry) => {
            const nameMatch = (entry.patronName || '').toLowerCase().includes(query);
            const typeMatch = (entry.activityType || '').toLowerCase().includes(query);
            return nameMatch || typeMatch;
          });
          if (filtered.length > 0) {
            logEvent(`Successful search: "${value.trim()}" returned ${filtered.length} match(es).`);
          }
        }
      }, 750);
    });
  }

  if (searchInput.value !== state.searchQuery) {
    searchInput.value = state.searchQuery;
  }

  if (searchSpinner) {
    searchSpinner.style.display = (state.status === 'loading' && state.statusType === 'search')
      ? 'block'
      : 'none';
  }
}
