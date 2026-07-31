import { Link } from 'react-router-dom';

import ActionLink from '@components/common/ActionLink';
import Button from '@components/common/Button';

function ProjectDetailsActions({
  projectId,
  canManageProjects,
  isDeleting,
  onDelete,
}) {
  return (
    <>
      <Link
        to={`/projects/${projectId}/tasks`}
        className='rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'>
        View Tasks
      </Link>

      {canManageProjects && (
        <>
          <ActionLink
            to={`/projects/${projectId}/edit`}
            variant='success'
            className='bg-green-600 text-white hover:bg-green-500 hover:text-white'>
            Edit
          </ActionLink>

          <Button variant='danger' disabled={isDeleting} onClick={onDelete}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      )}
    </>
  );
}

export default ProjectDetailsActions;
