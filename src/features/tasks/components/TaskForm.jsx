import Button from '@components/common/Button';
import InputField from '@components/forms/InputField';
import SelectField from '@components/forms/SelectField';
import TextareaField from '@components/forms/TextareaField';

import TaskFormHeader from './TaskFormHeader';
import useTaskForm from '../hooks/useTaskForm';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '../tasks.constants';

function TaskForm({ task, loading, onSubmit, onCancel }) {
  const { formData, errors, handleChange, handleSubmit } = useTaskForm({
    task,
    loading,
    onSubmit,
  });

  const isEditing = Boolean(task);

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
        <Button type='submit' disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
        </Button>

        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
