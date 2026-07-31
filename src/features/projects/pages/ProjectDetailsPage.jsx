import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackLink from '@components/common/BackLink';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import PageHeader from '@components/common/PageHeader';

import { fetchClients } from '@features/clients';
import { fetchTasks } from '@features/tasks/tasksSlice';

import ProjectDetailsActions from '../components/ProjectDetailsActions';
import ProjectOverviewCard from '../components/ProjectOverviewCard';
import ProjectProgressCard from '../components/ProjectProgressCard';
import useProjectDetails from '../hooks/useProjectDetails';
import {
  clearProjectMessages,
  clearSelectedProject,
  fetchProjectById,
  removeProject,
} from '../projectsSlice';

function ProjectDetailsPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    project,
    clientName,

    hasAccess,
    canManageProjects,
    isCurrentProject,

    totalTaskCount,
    completedTaskCount,
    inProgressTaskCount,
    progressPercentage,

    isLoading,
    detailsError,
    isDeleting,
    deleteError,
  } = useProjectDetails(id);

  useEffect(() => {
    dispatch(clearProjectMessages());
    dispatch(fetchProjectById(id));
    dispatch(fetchClients());
    dispatch(fetchTasks());

    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch, id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(removeProject(id)).unwrap();
      navigate('/projects');
    } catch (error) {
      console.error(error);
    }
  }

  if (!hasAccess) {
    return <ErrorMessage message='You do not have access to this project.' />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (detailsError) {
    return <ErrorMessage message={detailsError} />;
  }

  if (!isCurrentProject || !project) {
    return <ErrorMessage message='Project not found' />;
  }

  return (
    <div className='workspace-page'>
      <div className='mb-4'>
        <BackLink to='/projects'>Back to Projects</BackLink>
      </div>

      <PageHeader title={project.title} description={`Client: ${clientName}`}>
        <ProjectDetailsActions
          projectId={project.id}
          canManageProjects={canManageProjects}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />
      </PageHeader>

      {deleteError && (
        <div className='mb-4'>
          <ErrorMessage message={deleteError} />
        </div>
      )}

      <div className='grid gap-4 lg:grid-cols-2'>
        <ProjectOverviewCard project={project} />

        <ProjectProgressCard
          totalTasks={totalTaskCount}
          completedTasks={completedTaskCount}
          inProgressTasks={inProgressTaskCount}
          progressPercentage={progressPercentage}
        />
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
