import { formatDate } from '@/utils/formatDate';

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
    <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
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
          <div className='flex flex-col gap-3 sm:flex-row md:flex-col'>
            <select
              value={task.status}
              onChange={(event) => onStatusChange(task, event.target.value)}
              disabled={isUpdating}
              className='rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:opacity-60'>
              {TASK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className='flex gap-3'>
              <button
                type='button'
                onClick={() => onEdit(task)}
                className='text-sm text-green-600'>
                Edit
              </button>

              <button
                type='button'
                onClick={() => onDelete(task)}
                className='text-sm text-red-600'>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
