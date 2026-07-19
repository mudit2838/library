import { getState } from '../state.js';

export function renderLogList(container) {
  if (!container) return;

  const state = getState();
  const entries = state.entries || [];
  const query = (state.searchQuery || '').trim().toLowerCase();

  let filtered = entries;
  if (query) {
    filtered = entries.filter((entry) => {
      const nameMatch = (entry.patronName || '').toLowerCase().includes(query);
      const typeMatch = (entry.activityType || '').toLowerCase().includes(query);
      return nameMatch || typeMatch;
    });
  }

  if (filtered.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    emptyDiv.setAttribute('aria-live', 'polite');
    emptyDiv.textContent = query ? `No results found for "${query}"` : 'No data found';
    
    container.innerHTML = '';
    container.appendChild(emptyDiv);
    return;
  }

  const countHeader = document.createElement('div');
  countHeader.className = 'log-count';
  countHeader.setAttribute('aria-live', 'polite');
  countHeader.textContent = query
    ? `Found ${filtered.length} matching result${filtered.length === 1 ? '' : 's'} for "${query}"`
    : `Showing ${filtered.length} entry${filtered.length === 1 ? '' : 'ies'}`;

  const table = document.createElement('table');
  table.className = 'log-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Patron Name</th>
        <th scope="col">Activity Type</th>
        <th scope="col">Notes</th>
        <th scope="col">Timestamp</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  const fragment = document.createDocumentFragment();

  filtered.forEach((entry) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = entry.patronName;

    const tdType = document.createElement('td');
    tdType.textContent = entry.activityType;

    const tdNotes = document.createElement('td');
    tdNotes.textContent = entry.notes || '—';

    const tdTime = document.createElement('td');
    try {
      const date = new Date(entry.timestamp);
      tdTime.textContent = date.toLocaleString();
    } catch {
      tdTime.textContent = entry.timestamp || '—';
    }

    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdNotes);
    tr.appendChild(tdTime);

    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);

  container.innerHTML = '';
  container.appendChild(countHeader);
  container.appendChild(table);
}
