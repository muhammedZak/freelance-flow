import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import BackLink from '../components/common/BackLink';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import ActionLink from '../components/common/ActionLink';
import ProgressBar from '../components/common/ProgressBar';
import SectionCard from '../components/common/SectionCard';

import { fetchClients } from '../features/clients/clientsSlice';
import { fetchTasks } from '../features/tasks/tasksSlice';

import {
  clearProjectMessages,
  clearSelectedProject,
  fetchProjectById,
  removeProject,
} from '../features/projects/projectsSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';


function ProjectDetailsPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { clients } = useSelector((state) => state.clients);

  const { tasks } = useSelector((state) => state.tasks);

  const { selectedProject, loading, error } = useSelector(
    (state) => state.projects,
  );

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
    const client = clients.find(
      (client) => String(client.id) === String(clientId),
    );

    return client ? client.name : 'Unknown Client';
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?',
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeProject(id)).unwrap();
      navigate('/projects');
    } catch (error) {
      console.log(error);
    }
  }

  if (loading && !selectedProject) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
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

  const progress =
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
            <Button variant='danger' onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </PageHeader>

      <div className='grid gap-4 lg:grid-cols-2'>
        <SectionCard title='Project Details'>
          <div className='space-y-3 text-sm'>
            <p>
              <span className='font-medium text-slate-700'>Description:</span>{' '}
              {selectedProject.description}
            </p>

            <p>
              <span className='font-medium text-slate-700'>Status:</span>{' '}
              <span className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-700'>
                {selectedProject.status}
              </span>
            </p>

            <p>
              <span className='font-medium text-slate-700'>Budget:</span>{' '}
              {formatCurrency(selectedProject.budget)}
            </p>

            <p>
              <span className='font-medium text-slate-700'>Start Date:</span>{' '}
              {formatDate(selectedProject.startDate)}
            </p>

            <p>
              <span className='font-medium text-slate-700'>Deadline:</span>{' '}
              {formatDate(selectedProject.deadline)}
            </p>
          </div>
        </SectionCard>

        <SectionCard title='Project Progress'>
          <div className='mb-3 flex items-center justify-between text-sm'>
            <span className='text-slate-600'>
              {completedTasks.length} of {projectTasks.length} tasks completed
            </span>
          </div>

          <ProgressBar value={progress} height='large' showLabel />

          <div className='mt-4 grid grid-cols-3 gap-3 text-center text-sm'>
            <div className='rounded bg-slate-100 p-3'>
              <p className='font-bold text-slate-900'>{projectTasks.length}</p>

              <p className='text-slate-500'>Total</p>
            </div>

            <div className='rounded bg-slate-100 p-3'>
              <p className='font-bold text-slate-900'>
                {inProgressTasks.length}
              </p>

              <p className='text-slate-500'>Progress</p>
            </div>

            <div className='rounded bg-slate-100 p-3'>
              <p className='font-bold text-slate-900'>
                {completedTasks.length}
              </p>

              <p className='text-slate-500'>Done</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
