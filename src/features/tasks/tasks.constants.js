export const TASK_STATUS = Object.freeze({
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
});

export const TASK_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

export const TASK_STATUS_VALUES = Object.freeze(Object.values(TASK_STATUS));

export const TASK_PRIORITY_VALUES = Object.freeze(Object.values(TASK_PRIORITY));

export const TASK_SORT = Object.freeze({
  DUE_DATE: 'due-date',
  NEWEST: 'newest',
  TITLE: 'title',
  PRIORITY: 'priority',
});

export const TASK_FILTER_ALL = 'all';

export const TASK_FILTER_PARAMS = Object.freeze({
  SEARCH: 'search',
  STATUS: 'status',
  PRIORITY: 'priority',
  SORT: 'sort',
});

export const TASK_FILTER_DEFAULTS = Object.freeze({
  searchText: '',
  statusFilter: TASK_FILTER_ALL,
  priorityFilter: TASK_FILTER_ALL,
  sortBy: TASK_SORT.DUE_DATE,
});

export const TASK_STATUS_OPTIONS = Object.freeze([
  Object.freeze({
    value: TASK_STATUS.TODO,
    label: 'To Do',
  }),

  Object.freeze({
    value: TASK_STATUS.IN_PROGRESS,
    label: 'In Progress',
  }),

  Object.freeze({
    value: TASK_STATUS.COMPLETED,
    label: 'Completed',
  }),
]);

export const TASK_PRIORITY_OPTIONS = Object.freeze([
  Object.freeze({
    value: TASK_PRIORITY.LOW,
    label: 'Low',
  }),

  Object.freeze({
    value: TASK_PRIORITY.MEDIUM,
    label: 'Medium',
  }),

  Object.freeze({
    value: TASK_PRIORITY.HIGH,
    label: 'High',
  }),
]);

export const TASK_STATUS_FILTER_OPTIONS = Object.freeze([
  Object.freeze({
    value: TASK_FILTER_ALL,
    label: 'All Statuses',
  }),
  ...TASK_STATUS_OPTIONS,
]);

export const TASK_PRIORITY_FILTER_OPTIONS = Object.freeze([
  Object.freeze({
    value: TASK_FILTER_ALL,
    label: 'All Priorities',
  }),
  ...TASK_PRIORITY_OPTIONS,
]);

export const TASK_SORT_OPTIONS = Object.freeze([
  Object.freeze({
    value: TASK_SORT.DUE_DATE,
    label: 'Due Date',
  }),

  Object.freeze({
    value: TASK_SORT.NEWEST,
    label: 'Newest First',
  }),

  Object.freeze({
    value: TASK_SORT.TITLE,
    label: 'Title A-Z',
  }),

  Object.freeze({
    value: TASK_SORT.PRIORITY,
    label: 'Priority High to Low',
  }),
]);

export const INITIAL_TASK_FORM_VALUES = Object.freeze({
  title: '',
  description: '',
  status: TASK_STATUS.TODO,
  priority: TASK_PRIORITY.MEDIUM,
  dueDate: '',
});

export const TASK_STATUS_LABELS = Object.freeze({
  [TASK_STATUS.TODO]: 'To Do',

  [TASK_STATUS.IN_PROGRESS]: 'In Progress',

  [TASK_STATUS.COMPLETED]: 'Completed',
});

export const TASK_STATUS_CLASSES = Object.freeze({
  [TASK_STATUS.TODO]: 'bg-slate-100 text-slate-700',

  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-700',

  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
});

export const TASK_PRIORITY_CLASSES = Object.freeze({
  [TASK_PRIORITY.LOW]: 'bg-green-100 text-green-700',

  [TASK_PRIORITY.MEDIUM]: 'bg-yellow-100 text-yellow-700',

  [TASK_PRIORITY.HIGH]: 'bg-red-100 text-red-700',
});

export function getTaskStatusLabel(status) {
  return TASK_STATUS_LABELS[status] ?? TASK_STATUS_LABELS[TASK_STATUS.TODO];
}

export function getTaskStatusClasses(status) {
  return TASK_STATUS_CLASSES[status] ?? TASK_STATUS_CLASSES[TASK_STATUS.TODO];
}

export function getTaskPriorityClasses(priority) {
  return (
    TASK_PRIORITY_CLASSES[priority] ?? TASK_PRIORITY_CLASSES[TASK_PRIORITY.LOW]
  );
}
