const LOCAL_STORAGE_KEY = 'kiosk_log_entries';

function loadEntries() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load entries from localStorage:', error);
  }
  return [];
}

const initialState = {
  entries: loadEntries(),
  status: 'idle',
  errorMessage: null,
  searchQuery: '',
  formErrors: {},
  failedEntry: null,
  statusType: null
};

let state = { ...initialState };
const subscribers = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  let changed = false;
  for (const key in patch) {
    if (state[key] !== patch[key]) {
      changed = true;
      break;
    }
  }

  if (!changed) return;

  state = { ...state, ...patch };

  if (patch.entries) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.entries));
    } catch (error) {
      console.error('Failed to save entries to localStorage:', error);
    }
  }

  subscribers.forEach(listener => listener(state));
}

export function subscribe(listener) {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}
