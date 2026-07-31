import { formatDate } from '@/utils/formatDate';

import Button from '@components/common/Button';
import SectionCard from '@components/common/SectionCard';
import FilterSelect from '@components/forms/FilterSelect';

import {
  getTaskPriorityClasses,
  getTaskStatusClasses,
  getTaskStatusLabel,
  TASK_STATUS_OPTIONS,
} from '../tasks.constants';

function TaskCard({
  task,
  canManageTasks,
  isUpdating,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <SectionCard>
      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
        <div className='flex-1'>
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            <h3 className='text-lg font-bold text-slate-900'>{task.title}</h3>

            <span
              className={`rounded px-2 py-1 text-xs ${getTaskStatusClasses(
                task.status,
              )}`}>
              {getTaskStatusLabel(task.status)}
            </span>

            <span
              className={`rounded px-2 py-1 text-xs capitalize ${getTaskPriorityClasses(
                task.priority,
              )}`}>
              {task.priority} priority
            </span>
          </div>

          <p className='mb-3 text-sm text-slate-600'>{task.description}</p>

          <div className='flex flex-wrap gap-4 text-sm text-slate-500'>
            <p>
              <span className='font-medium text-slate-700'>Due:</span>{' '}
              {formatDate(task.dueDate)}
            </p>

            <p>
              <span className='font-medium text-slate-700'>Created:</span>{' '}
              {formatDate(task.createdAt)}
            </p>
          </div>
        </div>

        {canManageTasks && (
          <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:w-48 md:flex-col'>
            <FilterSelect
              value={task.status}
              onChange={(event) => onStatusChange(task, event.target.value)}
              options={TASK_STATUS_OPTIONS}
              ariaLabel={`Change status for ${task.title}`}
              disabled={isUpdating}
            />

            <div className='flex gap-3'>
              <Button
                type='button'
                variant='success'
                size='small'
                onClick={() => onEdit(task)}
                disabled={isUpdating}>
                Edit
              </Button>

              <Button
                type='button'
                variant='danger'
                size='small'
                onClick={() => onDelete(task)}
                disabled={isUpdating}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default TaskCard;
