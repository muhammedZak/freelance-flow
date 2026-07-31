import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ActionLink from '@components/common/ActionLink';
import BackLink from '@components/common/BackLink';
import Button from '@components/common/Button';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import PageHeader from '@components/common/PageHeader';

import { fetchClients } from '@features/clients';
import { fetchTasks } from '@features/tasks/tasksSlice';

import ProjectOverviewCard from '../components/ProjectOverviewCard';
import ProjectProgressCard from '../components/ProjectProgressCard';
import {
  selectIsProjectDeleting,
  selectIsProjectDetailsLoading,
  selectProjectDeleteError,
  selectProjectDetailsError,
  selectSelectedProject,
} from '../projectsSelectors';
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

  const { user } = useSelector((state) => state.auth);
  const { clients } = useSelector((state) => state.clients);
  const { tasks } = useSelector((state) => state.tasks);

  const selectedProject = useSelector(selectSelectedProject);
  const isDetailsLoading = useSelector(selectIsProjectDetailsLoading);
  const detailsError = useSelector(selectProjectDetailsError);
  const isDeleting = useSelector(selectIsProjectDeleting);
  const deleteError = useSelector(selectProjectDeleteError);

  const canManageProjects =
    user?.role === 'freelancer' || user?.role === 'admin';

  useEffect(() => {
    dispatch(clearProjectMessages());
    dispatch(fetchProjectById(id));
    dispatch(fetchClients());
    dispatch(fetchTasks());

    return () => {
      dispatch(clearSelectedProject());
    };
  }, [dispatch, id]);

  function getClientName(clientId) {
    const client = clients.find((item) => String(item.id) === String(clientId));

    return client ? client.name : 'Unknown Client';
  }

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

  if (isDetailsLoading && !selectedProject) {
    return <Loading />;
  }

  if (detailsError) {
    return <ErrorMessage message={detailsError} />;
  }

  if (!selectedProject) {
    return <ErrorMessage message='Project not found' />;
  }

  const projectTasks = tasks.filter(
    (task) => String(task.projectId) === String(selectedProject.id),
  );

  const completedTasks = projectTasks.filter(
    (task) => task.status === 'completed',
  );

  const inProgressTasks = projectTasks.filter(
    (task) => task.status === 'in-progress',
  );

  const progressPercentage =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : 0;

  return (
    <div className='workspace-page'>
      <div className='mb-4'>
        <BackLink to='/projects'>Back to Projects</BackLink>
      </div>

      <PageHeader
        title={selectedProject.title}
        description={`Client: ${getClientName(selectedProject.clientId)}`}>
        <Link
          to={`/projects/${selectedProject.id}/tasks`}
          className='rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500'>
          View Tasks
        </Link>

        {canManageProjects && (
          <>
            <ActionLink
              to={`/projects/${selectedProject.id}/edit`}
              variant='success'
              className='bg-green-600 text-white hover:bg-green-500 hover:text-white'>
              Edit
            </ActionLink>

            <Button
              variant='danger'
              disabled={isDeleting}
              onClick={handleDelete}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        )}
      </PageHeader>

      {deleteError && (
        <div className='mb-4'>
          <ErrorMessage message={deleteError} />
        </div>
      )}

      <div className='grid gap-4 lg:grid-cols-2'>
        <ProjectOverviewCard project={selectedProject} />

        <ProjectProgressCard
          totalTasks={projectTasks.length}
          completedTasks={completedTasks.length}
          inProgressTasks={inProgressTasks.length}
          progressPercentage={progressPercentage}
        />
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
