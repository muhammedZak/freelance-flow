import { useEffect, useState } from 'react';

import InputField from '@components/forms/InputField';
import SelectField from '@components/forms/SelectField';
import TextareaField from '@components/forms/TextareaField';

import TaskFormHeader from './TaskFormHeader';
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
      <TaskFormHeader
        isEditing={isEditing}
        loading={loading}
        onCancel={onCancel}
      />

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='md:col-span-2'>
          <InputField
            label='Task Title'
            id='title'
            name='title'
            type='text'
            value={formData.title}
            onChange={handleChange}
            placeholder='Example: Create login page'
            required
            error={errors.title}
          />
        </div>

        <div className='md:col-span-2'>
          <TextareaField
            label='Description'
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Enter a short task description'
            rows={3}
            required
            error={errors.description}
          />
        </div>

        <SelectField
          label='Status'
          id='status'
          name='status'
          value={formData.status}
          onChange={handleChange}
          options={TASK_STATUS_OPTIONS}
          required
          error={errors.status}
        />

        <SelectField
          label='Priority'
          id='priority'
          name='priority'
          value={formData.priority}
          onChange={handleChange}
          options={TASK_PRIORITY_OPTIONS}
          required
          error={errors.priority}
        />

        <InputField
          label='Due Date'
          id='dueDate'
          name='dueDate'
          type='date'
          value={formData.dueDate}
          onChange={handleChange}
          required
          error={errors.dueDate}
        />
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
