const VALID_TYPES = new Set(['Check-in', 'Check-out', 'Inquiry', 'Computer Use', 'Other']);

export function validateEntry(data) {
  const errors = {};
  const patronName = (data.patronName || '').trim();
  const activityType = data.activityType || '';

  if (!patronName) {
    errors.patronName = 'Patron Name is required.';
  } else if (patronName.length < 2) {
    errors.patronName = 'Patron Name must be at least 2 characters.';
  } else if (/[<>&"']/.test(patronName)) {
    errors.patronName = 'Patron Name contains invalid characters.';
  }

  if (!activityType) {
    errors.activityType = 'Activity Type is required.';
  } else if (!VALID_TYPES.has(activityType)) {
    errors.activityType = 'Invalid Activity Type selected.';
  }

  return errors;
}
