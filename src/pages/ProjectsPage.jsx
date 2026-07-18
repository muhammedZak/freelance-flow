import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import { fetchClients } from '../features/clients/clientsSlice';
import {
  clearProjectMessages,
  fetchProjects,
  removeProject,
} from '../features/projects/projectsSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

function ProjectsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const { user } = useSelector((state) => state.auth);

  const { projects, loading, error, successMessage } = useSelector(
    (state) => state.projects,
  );

  const { clients } = useSelector((state) => state.clients);

  const canManageProjects =
    user?.role === 'freelancer' || user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchClients());

    return () => {
      dispatch(clearProjectMessages());
    };
  }, [dispatch]);

  function updateSearchParams(key, value) {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value === 'all' || value === 'newest') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?',
    );

    if (confirmDelete) {
      dispatch(removeProject(id));
    }
  }

  function getClientName(clientId) {
    const client = clients.find(
      (client) => String(client.id) === String(clientId),
    );

    return client ? client.name : 'Unknown Client';
  }

  const visibleProjects =
    user?.role === 'client'
      ? projects.filter((project) =>
          user?.assignedProjectIds
            ?.map((id) => String(id))
            .includes(String(project.id)),
        )
      : projects;

  const filteredProjects = visibleProjects
    .filter((project) => {
      const searchValue = searchText.toLowerCase();
      const clientName = getClientName(project.clientId).toLowerCase();

      const matchesSearch =
        project.title.toLowerCase().includes(searchValue) ||
        project.description.toLowerCase().includes(searchValue) ||
        clientName.includes(searchValue);

      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }

      if (sortBy === 'budget-high') {
        return Number(b.budget) - Number(a.budget);
      }

      if (sortBy === 'budget-low') {
        return Number(a.budget) - Number(b.budget);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading && projects.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='workspace-page'>
      <div className='page-header'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Projects</h1>
          <p className='text-slate-600'>
            Manage your freelance projects and deadlines.
          </p>
        </div>

        {canManageProjects && (
          <Link
            to='/projects/new'
            className='rounded bg-slate-900 px-4 py-2 text-center text-white'>
            Add Project
          </Link>
        )}
      </div>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      <div className='mb-4 grid gap-3 md:grid-cols-3'>
        <input
          type='text'
          value={searchText}
          onChange={(event) => updateSearchParams('search', event.target.value)}
          className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Search projects or clients'
        />

        <select
          value={statusFilter}
          onChange={(event) => updateSearchParams('status', event.target.value)}
          className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
          <option value='all'>All Status</option>
          <option value='planning'>Planning</option>
          <option value='active'>Active</option>
          <option value='completed'>Completed</option>
          <option value='on-hold'>On Hold</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => updateSearchParams('sort', event.target.value)}
          className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
          <option value='newest'>Newest First</option>
          <option value='title'>Title A-Z</option>
          <option value='deadline'>Deadline</option>
          <option value='budget-high'>Budget High to Low</option>
          <option value='budget-low'>Budget Low to High</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState message='No projects found.' />
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='mb-3 flex items-start justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-bold text-slate-900'>
                    {project.title}
                  </h2>
                  <p className='text-sm text-slate-500'>
                    {getClientName(project.clientId)}
                  </p>
                </div>

                <span className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-700'>
                  {project.status}
                </span>
              </div>

              <p className='mb-4 line-clamp-2 text-sm text-slate-600'>
                {project.description}
              </p>

              <div className='space-y-2 text-sm text-slate-600'>
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
                <Link to={`/projects/${project.id}`} className='text-blue-600'>
                  View
                </Link>

                <Link
                  to={`/projects/${project.id}/tasks`}
                  className='text-purple-600'>
                  Tasks
                </Link>

                {canManageProjects && (
                  <>
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className='text-green-600'>
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className='text-red-600'>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <p className='text-sm text-slate-500'>Updating projects...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
