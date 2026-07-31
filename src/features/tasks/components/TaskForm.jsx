import { useEffect, useState } from 'react';

import {
  INITIAL_TASK_FORM_VALUES,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../tasks.constants';

function TaskForm({ task, loading, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(INITIAL_TASK_FORM_VALUES);

  const [formErrors, setFormErrors] = useState({});

  const isEditing = Boolean(task);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || INITIAL_TASK_FORM_VALUES.status,
        priority: task.priority || INITIAL_TASK_FORM_VALUES.priority,
        dueDate: task.dueDate || '',
      });
    } else {
      setFormData(INITIAL_TASK_FORM_VALUES);
    }

    setFormErrors({});
  }, [task]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must contain at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    } else if (formData.description.trim().length < 5) {
      newErrors.description =
        'Task description must contain at least 5 characters';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          className='text-sm text-slate-600 hover:text-slate-900'>
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
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='Example: Create login page'
          />

          {formErrors.title && (
            <p className='mt-1 text-sm text-red-600'>{formErrors.title}</p>
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
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='Enter a short task description'
          />

          {formErrors.description && (
            <p className='mt-1 text-sm text-red-600'>
              {formErrors.description}
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
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            {TASK_PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />

          {formErrors.dueDate && (
            <p className='mt-1 text-sm text-red-600'>{formErrors.dueDate}</p>
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
          className='rounded border border-slate-300 px-4 py-2 text-slate-700'>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
