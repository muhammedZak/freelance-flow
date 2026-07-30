export const CLIENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

export const CLIENT_STATUS_OPTIONS = Object.freeze([
  {
    value: CLIENT_STATUS.ACTIVE,
    label: 'Active',
  },
  {
    value: CLIENT_STATUS.INACTIVE,
    label: 'Inactive',
  },
]);

export const CLIENT_SORT = Object.freeze({
  NEWEST: 'newest',
  OLDEST: 'oldest',
  NAME_ASCENDING: 'name-asc',
  NAME_DESCENDING: 'name-desc',
});

export const CLIENT_FILTER_PARAMS = Object.freeze({
  SEARCH: 'search',
  STATUS: 'status',
  SORT: 'sort',
});

export const CLIENT_FILTER_DEFAULTS = Object.freeze({
  search: '',
  status: 'all',
  sort: CLIENT_SORT.NEWEST,
});

export const CLIENT_FILTER_STATUS_OPTIONS = Object.freeze([
  {
    value: CLIENT_FILTER_DEFAULTS.status,
    label: 'All Statuses',
  },
  ...CLIENT_STATUS_OPTIONS,
]);

export const CLIENT_SORT_OPTIONS = Object.freeze([
  {
    value: CLIENT_SORT.NEWEST,
    label: 'Newest First',
  },
  {
    value: CLIENT_SORT.OLDEST,
    label: 'Oldest First',
  },
  {
    value: CLIENT_SORT.NAME_ASCENDING,
    label: 'Name: A to Z',
  },
  {
    value: CLIENT_SORT.NAME_DESCENDING,
    label: 'Name: Z to A',
  },
]);

export const INITIAL_CLIENT_FORM_VALUES = Object.freeze({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  status: CLIENT_STATUS.ACTIVE,
});
