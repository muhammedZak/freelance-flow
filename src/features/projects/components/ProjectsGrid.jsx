import EmptyState from '@components/common/EmptyState';

import ProjectCard from './ProjectCard';

function ProjectsGrid({
  projects,
  getClientName,
  canManageProjects,
  isUpdating,
  onDelete,
}) {
  if (projects.length === 0) {
    return <EmptyState message='No projects found.' />;
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          clientName={getClientName(project.clientId)}
          canManageProjects={canManageProjects}
          onDelete={onDelete}
        />
      ))}

      {isUpdating && (
        <p
          role='status'
          className='text-sm text-slate-500 dark:text-slate-400'>
          Updating projects...
        </p>
      )}
    </div>
  );
}

export default ProjectsGrid;
