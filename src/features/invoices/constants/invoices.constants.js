export const INVOICE_STATUS = Object.freeze({
  UNPAID: 'unpaid',
  PAID: 'paid',
  OVERDUE: 'overdue',
});

export const INVOICE_STATUS_OPTIONS = Object.freeze([
  {
    value: INVOICE_STATUS.UNPAID,
    label: 'Unpaid',
  },
  {
    value: INVOICE_STATUS.PAID,
    label: 'Paid',
  },
  {
    value: INVOICE_STATUS.OVERDUE,
    label: 'Overdue',
  },
]);

export const INVOICE_SORT = Object.freeze({
  NEWEST: 'newest',
  OLDEST: 'oldest',
  AMOUNT_HIGH: 'amount-high',
  AMOUNT_LOW: 'amount-low',
  DUE_DATE: 'due-date',
});

export const INVOICE_FILTER_PARAMS = Object.freeze({
  SEARCH: 'search',
  STATUS: 'status',
  SORT: 'sort',
});

export const INVOICE_FILTER_DEFAULTS = Object.freeze({
  search: '',
  status: 'all',
  sort: INVOICE_SORT.NEWEST,
});

export const INVOICE_FILTER_STATUS_OPTIONS = Object.freeze([
  {
    value: INVOICE_FILTER_DEFAULTS.status,
    label: 'All Statuses',
  },
  ...INVOICE_STATUS_OPTIONS,
]);

export const INVOICE_SORT_OPTIONS = Object.freeze([
  {
    value: INVOICE_SORT.NEWEST,
    label: 'Newest First',
  },
  {
    value: INVOICE_SORT.OLDEST,
    label: 'Oldest First',
  },
  {
    value: INVOICE_SORT.AMOUNT_HIGH,
    label: 'Amount: High to Low',
  },
  {
    value: INVOICE_SORT.AMOUNT_LOW,
    label: 'Amount: Low to High',
  },
  {
    value: INVOICE_SORT.DUE_DATE,
    label: 'Due Date',
  },
]);

export const INITIAL_INVOICE_FORM_VALUES = Object.freeze({
  invoiceNumber: '',
  clientId: '',
  projectId: '',
  hoursWorked: '',
  hourlyRate: '',
  status: INVOICE_STATUS.UNPAID,
  issueDate: '',
  dueDate: '',
});
