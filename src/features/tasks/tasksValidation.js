import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from './tasks.constants';

const VALID_TASK_STATUSES = Object.freeze(
  TASK_STATUS_OPTIONS.map((option) => option.value),
);

const VALID_TASK_PRIORITIES = Object.freeze(
  TASK_PRIORITY_OPTIONS.map((option) => option.value),
);

export function validateTaskForm(formData) {
  const errors = {};

  const title =
    typeof formData?.title === 'string' ? formData.title.trim() : '';

  const description =
    typeof formData?.description === 'string'
      ? formData.description.trim()
      : '';

  const dueDate =
    typeof formData?.dueDate === 'string' ? formData.dueDate.trim() : '';

  if (!title) {
    errors.title = 'Task title is required';
  }

  if (!description) {
    errors.description = 'Task description is required';
  }

  if (!dueDate) {
    errors.dueDate = 'Due date is required';
  }

  if (!VALID_TASK_STATUSES.includes(formData?.status)) {
    errors.status = 'Select a valid task status';
  }

  if (!VALID_TASK_PRIORITIES.includes(formData?.priority)) {
    errors.priority = 'Select a valid task priority';
  }

  return errors;
}
