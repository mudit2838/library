import { getState, setState } from '../state.js';
import { submitEntry } from '../api.js';
import { escapeHTML } from '../sanitize.js';
import { validateEntry } from '../validate.js';
import { logEvent } from '../telemetry.js';

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const patronName = (formData.get('patronName') || '').trim();
  const activityType = formData.get('activityType') || '';
  const notes = (formData.get('notes') || '').trim();

  const errors = validateEntry({ patronName, activityType });

  if (Object.keys(errors).length > 0) {
    setState({ formErrors: errors });
    if (errors.patronName) {
      form.querySelector('#patron-name').focus();
    } else if (errors.activityType) {
      form.querySelector('#activity-type').focus();
    }
    return;
  }

  setState({ formErrors: {}, status: 'loading', statusType: 'submit', errorMessage: null });

  const entry = {
    patronName: escapeHTML(patronName),
    activityType: activityType,
    notes: escapeHTML(notes)
  };

  submitEntry(entry)
    .then((newEntry) => {
      const state = getState();
      setState({
        entries: [newEntry, ...state.entries],
        status: 'success',
        statusType: null,
        errorMessage: null,
        failedEntry: null
      });
      logEvent(`Successful entry submission: Patron: ${newEntry.patronName}, Activity: ${newEntry.activityType}`);
      form.reset();
    })
    .catch((error) => {
      setState({
        status: 'error',
        statusType: null,
        errorMessage: error.message,
        failedEntry: entry
      });
    });
}

export function renderLogForm(container) {
  if (!container) return;

  const state = getState();
  let form = container.querySelector('form');

  if (!form) {
    form = document.createElement('form');
    form.id = 'kiosk-log-form';
    form.noValidate = true;

    form.innerHTML = `
      <div class="form-group">
        <label for="patron-name">Patron Name <span class="required" aria-hidden="true">*</span></label>
        <input type="text" id="patron-name" name="patronName" required aria-required="true" autocomplete="off" />
        <span id="patron-name-error" class="error-message" role="alert" aria-live="polite"></span>
      </div>

      <div class="form-group">
        <label for="activity-type">Activity Type <span class="required" aria-hidden="true">*</span></label>
        <select id="activity-type" name="activityType" required aria-required="true">
          <option value="" disabled selected>Select an activity...</option>
          <option value="Check-in">Check-in</option>
          <option value="Check-out">Check-out</option>
          <option value="Inquiry">Inquiry</option>
          <option value="Computer Use">Computer Use</option>
          <option value="Other">Other</option>
        </select>
        <span id="activity-type-error" class="error-message" role="alert" aria-live="polite"></span>
      </div>

      <div class="form-group">
        <label for="notes">Notes (Optional)</label>
        <textarea id="notes" name="notes" rows="4" autocomplete="off"></textarea>
        <span id="notes-error" class="error-message" role="alert" aria-live="polite"></span>
      </div>

      <button type="submit" id="submit-btn">Submit Log Entry</button>
      <span id="form-success" class="success-message" role="status" aria-live="polite"></span>
    `;

    form.addEventListener('submit', handleFormSubmit);
    container.innerHTML = '';
    container.appendChild(form);
  }

  const submitBtn = form.querySelector('#submit-btn');
  const nameInput = form.querySelector('#patron-name');
  const typeSelect = form.querySelector('#activity-type');
  const notesTextarea = form.querySelector('#notes');

  const isLoading = state.status === 'loading';
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.setAttribute('aria-disabled', 'true');
    nameInput.disabled = true;
    typeSelect.disabled = true;
    notesTextarea.disabled = true;
  } else {
    submitBtn.removeAttribute('aria-disabled');
    nameInput.disabled = false;
    typeSelect.disabled = false;
    notesTextarea.disabled = false;
  }

  const errors = state.formErrors || {};

  const nameError = form.querySelector('#patron-name-error');
  if (errors.patronName) {
    nameInput.classList.add('is-invalid');
    nameInput.setAttribute('aria-invalid', 'true');
    nameError.textContent = '⚠️ ' + errors.patronName;
  } else {
    nameInput.classList.remove('is-invalid');
    nameInput.removeAttribute('aria-invalid');
    nameError.textContent = '';
  }

  const typeError = form.querySelector('#activity-type-error');
  if (errors.activityType) {
    typeSelect.classList.add('is-invalid');
    typeSelect.setAttribute('aria-invalid', 'true');
    typeError.textContent = '⚠️ ' + errors.activityType;
  } else {
    typeSelect.classList.remove('is-invalid');
    typeSelect.removeAttribute('aria-invalid');
    typeError.textContent = '';
  }

  const successMsg = form.querySelector('#form-success');
  if (state.status === 'success' && !state.errorMessage && Object.keys(errors).length === 0) {
    successMsg.textContent = '✔️ Log entry submitted successfully.';
    clearTimeout(form.successTimeout);
    form.successTimeout = setTimeout(() => {
      successMsg.textContent = '';
    }, 3000);
  } else {
    successMsg.textContent = '';
  }
}
