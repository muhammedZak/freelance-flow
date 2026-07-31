import Button from '@components/common/Button';

function TaskFormHeader({ isEditing, loading, onCancel }) {
  return (
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

      <Button
        type='button'
        variant='text'
        size='small'
        onClick={onCancel}
        disabled={loading}>
        Close
      </Button>
    </div>
  );
}

export default TaskFormHeader;
