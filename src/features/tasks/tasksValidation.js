import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from './tasks.constants';

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

  if (!TASK_STATUS_VALUES.includes(formData?.status)) {
    errors.status = 'Select a valid task status';
  }

  if (!TASK_PRIORITY_VALUES.includes(formData?.priority)) {
    errors.priority = 'Select a valid task priority';
  }

  return errors;
}
