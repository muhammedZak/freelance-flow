import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

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

  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks.length / projectTasks.length) * 100)
      : 0;

  return (
    <div>
      <div className='mb-6'>
        <Link to='/projects' className='text-sm text-blue-600'>
          ← Back to Projects
        </Link>

        <div className='mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>
              {selectedProject.title}
            </h1>
            <p className='text-slate-600'>
              Client: {getClientName(selectedProject.clientId)}
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Link
              to={`/projects/${selectedProject.id}/tasks`}
              className='rounded bg-purple-600 px-4 py-2 text-white'>
              View Tasks
            </Link>

            {canManageProjects && (
              <>
                <Link
                  to={`/projects/${selectedProject.id}/edit`}
                  className='rounded bg-green-600 px-4 py-2 text-white'>
                  Edit
                </Link>

                <button
                  onClick={handleDelete}
                  className='rounded bg-red-600 px-4 py-2 text-white'>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='mb-4 text-lg font-bold text-slate-900'>
            Project Details
          </h2>

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
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='mb-4 text-lg font-bold text-slate-900'>
            Project Progress
          </h2>

          <div className='mb-3 flex items-center justify-between text-sm'>
            <span className='text-slate-600'>
              {completedTasks.length} of {projectTasks.length} tasks completed
            </span>
            <span className='font-bold text-slate-900'>{progress}%</span>
          </div>

          <div className='h-3 overflow-hidden rounded bg-slate-200'>
            <div
              className='h-full bg-slate-900'
              style={{ width: `${progress}%` }}></div>
          </div>

          <div className='mt-4 grid grid-cols-3 gap-3 text-center text-sm'>
            <div className='rounded bg-slate-100 p-3'>
              <p className='font-bold text-slate-900'>{projectTasks.length}</p>
              <p className='text-slate-500'>Total</p>
            </div>

            <div className='rounded bg-slate-100 p-3'>
              <p className='font-bold text-slate-900'>
                {
                  projectTasks.filter((task) => task.status === 'in-progress')
                    .length
                }
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
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
