import { useEffect, useState } from 'react';

import {
  INITIAL_TASK_FORM_VALUES,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../tasks.constants';
import { validateTaskForm } from '../tasksValidation';

const VALID_TASK_STATUSES = Object.freeze(
  TASK_STATUS_OPTIONS.map((option) => option.value),
);

const VALID_TASK_PRIORITIES = Object.freeze(
  TASK_PRIORITY_OPTIONS.map((option) => option.value),
);

function createInitialFormValues() {
  return {
    ...INITIAL_TASK_FORM_VALUES,
  };
}

function mapTaskToFormValues(task) {
  if (!task) {
    return createInitialFormValues();
  }

  const normalizedStatus = VALID_TASK_STATUSES.includes(task.status)
    ? task.status
    : INITIAL_TASK_FORM_VALUES.status;

  const normalizedPriority = VALID_TASK_PRIORITIES.includes(task.priority)
    ? task.priority
    : INITIAL_TASK_FORM_VALUES.priority;

  return {
    title: typeof task.title === 'string' ? task.title : '',

    description: typeof task.description === 'string' ? task.description : '',

    status: normalizedStatus,

    priority: normalizedPriority,

    dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
  };
}

function prepareTaskFormData(formData) {
  return {
    ...formData,
    title: formData.title.trim(),
    description: formData.description.trim(),
  };
}

function TaskForm({ task, loading, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => mapTaskToFormValues(task));

  const [errors, setErrors] = useState({});

  const isEditing = Boolean(task);

  useEffect(() => {
    setFormData(mapTaskToFormValues(task));

    setErrors({});
  }, [task]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[name];

      return nextErrors;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateTaskForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const preparedFormData = prepareTaskFormData(formData);

    await onSubmit(preparedFormData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className='mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='mb-5 flex items-center justify-between gap-3'>
        <div>
          <h2 className='text-lg font-bold text-slate-900'>
            {isEditing ? 'Edit Task' : 'Add Task'}
          </h2>

          <p className='text-sm text-slate-500'>
            {isEditing
              ? 'Update the selected task details.'
              : 'Create a new task for this project.'}
          </p>
        </div>

        <button
          type='button'
          onClick={onCancel}
          disabled={loading}
          className='text-sm text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60'>
          Close
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='md:col-span-2'>
          <label
            htmlFor='title'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Task Title
          </label>

          <input
            id='title'
            name='title'
            type='text'
            value={formData.title}
            onChange={handleChange}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='Example: Create login page'
          />

          {errors.title && (
            <p
              id='title-error'
              role='alert'
              className='mt-1 text-sm text-red-600'>
              {errors.title}
            </p>
          )}
        </div>

        <div className='md:col-span-2'>
          <label
            htmlFor='description'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Description
          </label>

          <textarea
            id='description'
            name='description'
            rows='3'
            value={formData.description}
            onChange={handleChange}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? 'description-error' : undefined
            }
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='Enter a short task description'
          />

          {errors.description && (
            <p
              id='description-error'
              role='alert'
              className='mt-1 text-sm text-red-600'>
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='status'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Status
          </label>

          <select
            id='status'
            name='status'
            value={formData.status}
            onChange={handleChange}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? 'status-error' : undefined}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.status && (
            <p
              id='status-error'
              role='alert'
              className='mt-1 text-sm text-red-600'>
              {errors.status}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='priority'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Priority
          </label>

          <select
            id='priority'
            name='priority'
            value={formData.priority}
            onChange={handleChange}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={errors.priority ? 'priority-error' : undefined}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            {TASK_PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.priority && (
            <p
              id='priority-error'
              role='alert'
              className='mt-1 text-sm text-red-600'>
              {errors.priority}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='dueDate'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Due Date
          </label>

          <input
            id='dueDate'
            name='dueDate'
            type='date'
            value={formData.dueDate}
            onChange={handleChange}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? 'due-date-error' : undefined}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />

          {errors.dueDate && (
            <p
              id='due-date-error'
              role='alert'
              className='mt-1 text-sm text-red-600'>
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      <div className='mt-5 flex gap-3'>
        <button
          type='submit'
          disabled={loading}
          className='rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60'>
          {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
        </button>

        <button
          type='button'
          onClick={onCancel}
          disabled={loading}
          className='rounded border border-slate-300 px-4 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-60'>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
