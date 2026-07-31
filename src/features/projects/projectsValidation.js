import { PROJECT_STATUS } from './projects.constants';

const VALID_PROJECT_STATUSES = Object.freeze(Object.values(PROJECT_STATUS));

function normalizeText(value) {
  return String(value ?? '').trim();
}

function createDateParts(value) {
  const normalizedValue = normalizeText(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalizedValue);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(Date.UTC(year, month - 1, day));

  const isValidDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValidDate) {
    return null;
  }

  return {
    normalizedValue,
    timestamp: date.getTime(),
  };
}

export function validateProjectTitle(title) {
  if (!normalizeText(title)) {
    return 'Project title is required.';
  }

  return '';
}

export function validateProjectClientId(clientId) {
  if (!normalizeText(clientId)) {
    return 'Please select a client.';
  }

  return '';
}

export function validateProjectDescription(description) {
  if (!normalizeText(description)) {
    return 'Project description is required.';
  }

  return '';
}

export function validateProjectStatus(status) {
  if (!VALID_PROJECT_STATUSES.includes(status)) {
    return 'Select a valid project status.';
  }

  return '';
}

export function validateProjectStartDate(startDate) {
  if (!normalizeText(startDate)) {
    return 'Start date is required.';
  }

  if (!createDateParts(startDate)) {
    return 'Enter a valid start date.';
  }

  return '';
}

export function validateProjectDeadline(deadline, startDate) {
  if (!normalizeText(deadline)) {
    return 'Deadline is required.';
  }

  const deadlineParts = createDateParts(deadline);

  if (!deadlineParts) {
    return 'Enter a valid deadline.';
  }

  const startDateParts = createDateParts(startDate);

  if (startDateParts && deadlineParts.timestamp < startDateParts.timestamp) {
    return 'Deadline cannot be before start date.';
  }

  return '';
}

export function validateProjectBudget(budget) {
  if (!normalizeText(budget)) {
    return 'Budget is required.';
  }

  const numericBudget = Number(budget);

  if (!Number.isFinite(numericBudget)) {
    return 'Budget must be a valid number.';
  }

  if (numericBudget <= 0) {
    return 'Budget must be greater than 0.';
  }

  return '';
}

export function validateProjectForm(formData = {}) {
  const errors = {
    title: validateProjectTitle(formData.title),
    clientId: validateProjectClientId(formData.clientId),
    description: validateProjectDescription(formData.description),
    status: validateProjectStatus(formData.status),
    startDate: validateProjectStartDate(formData.startDate),
    deadline: validateProjectDeadline(formData.deadline, formData.startDate),
    budget: validateProjectBudget(formData.budget),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, error]) => Boolean(error)),
  );
}

export function hasProjectValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
