export const PROJECT_STATUS = Object.freeze({
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
});

export const PROJECT_STATUS_LABELS = Object.freeze({
  [PROJECT_STATUS.PLANNING]: 'Planning',
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
});

export const PROJECT_STATUS_OPTIONS = Object.freeze(
  Object.values(PROJECT_STATUS).map((status) =>
    Object.freeze({
      value: status,
      label: PROJECT_STATUS_LABELS[status],
    }),
  ),
);

export const PROJECT_SORT = Object.freeze({
  NEWEST: 'newest',
  DEADLINE: 'deadline',
  TITLE_ASCENDING: 'title-asc',
  BUDGET_HIGH: 'budget-high',
});

export const PROJECT_FILTER_PARAMS = Object.freeze({
  SEARCH: 'search',
  STATUS: 'status',
  SORT: 'sort',
});

export const PROJECT_FILTER_DEFAULTS = Object.freeze({
  search: '',
  status: 'all',
  sort: PROJECT_SORT.NEWEST,
});

export const PROJECT_FILTER_STATUS_OPTIONS = Object.freeze([
  Object.freeze({
    value: PROJECT_FILTER_DEFAULTS.status,
    label: 'All Statuses',
  }),
  ...PROJECT_STATUS_OPTIONS,
]);

export const PROJECT_SORT_OPTIONS = Object.freeze([
  Object.freeze({
    value: PROJECT_SORT.NEWEST,
    label: 'Newest First',
  }),
  Object.freeze({
    value: PROJECT_SORT.DEADLINE,
    label: 'Deadline',
  }),
  Object.freeze({
    value: PROJECT_SORT.TITLE_ASCENDING,
    label: 'Title: A to Z',
  }),
  Object.freeze({
    value: PROJECT_SORT.BUDGET_HIGH,
    label: 'Highest Budget',
  }),
]);

export const INITIAL_PROJECT_FORM_VALUES = Object.freeze({
  title: '',
  clientId: '',
  description: '',
  status: PROJECT_STATUS.PLANNING,
  startDate: '',
  deadline: '',
  budget: '',
});

export function getProjectStatusLabel(status) {
  return PROJECT_STATUS_LABELS[status] ?? status ?? 'Unknown';
}
