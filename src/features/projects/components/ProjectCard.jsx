import { Link } from 'react-router-dom';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

function ProjectCard({
  project,
  clientName,
  canManageProjects,
  onDelete,
}) {
  return (
    <article className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70'>
      <div className='mb-3 flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
            {project.title}
          </h2>

          <p className='text-sm text-slate-500 dark:text-slate-400'>
            {clientName}
          </p>
        </div>

        <span className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
          {project.status}
        </span>
      </div>

      <p className='mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-300'>
        {project.description}
      </p>

      <div className='space-y-2 text-sm text-slate-600 dark:text-slate-300'>
        <p>
          <span className='font-medium'>Budget:</span>{' '}
          {formatCurrency(project.budget)}
        </p>

        <p>
          <span className='font-medium'>Deadline:</span>{' '}
          {formatDate(project.deadline)}
        </p>
      </div>

      <div className='mt-4 flex flex-wrap gap-3 text-sm'>
        <Link
          to={`/projects/${project.id}`}
          className='text-blue-600 dark:text-blue-400'>
          View
        </Link>

        <Link
          to={`/projects/${project.id}/tasks`}
          className='text-purple-600 dark:text-purple-400'>
          Tasks
        </Link>

        {canManageProjects && (
          <>
            <Link
              to={`/projects/${project.id}/edit`}
              className='text-green-600 dark:text-green-400'>
              Edit
            </Link>

            <button
              type='button'
              onClick={() => onDelete(project.id)}
              className='text-red-600 dark:text-red-400'>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
