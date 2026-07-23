import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import ActionLink from '../components/common/ActionLink';
import SearchInput from '../components/forms/SearchInput';
import FilterSelect from '../components/forms/FilterSelect';

import { fetchClients } from '../features/clients/clientsSlice';

import {
  clearProjectMessages,
  fetchProjects,
  removeProject,
} from '../features/projects/projectsSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/common/Button';

const projectStatusOptions = [
  {
    value: 'all',
    label: 'All Statuses',
  },
  {
    value: 'planning',
    label: 'Planning',
  },
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'on-hold',
    label: 'On Hold',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
];

const projectSortOptions = [
  {
    value: 'newest',
    label: 'Newest First',
  },
  {
    value: 'deadline',
    label: 'Deadline',
  },
  {
    value: 'title-asc',
    label: 'Title: A to Z',
  },
  {
    value: 'budget-high',
    label: 'Highest Budget',
  },
];

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

  function clearFilters() {
    setSearchParams({});
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
    .sort((firstProject, secondProject) => {
      if (sortBy === 'title') {
        return firstProject.title.localeCompare(secondProject.title);
      }

      if (sortBy === 'deadline') {
        return (
          new Date(firstProject.deadline) - new Date(secondProject.deadline)
        );
      }

      if (sortBy === 'budget-high') {
        return Number(secondProject.budget) - Number(firstProject.budget);
      }

      if (sortBy === 'budget-low') {
        return Number(firstProject.budget) - Number(secondProject.budget);
      }

      return (
        new Date(secondProject.createdAt) - new Date(firstProject.createdAt)
      );
    });

  const hasActiveFilters =
    searchText || statusFilter !== 'all' || sortBy !== 'newest';

  if (loading && projects.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='workspace-page'>
      <PageHeader
        title='Projects'
        description='Manage your freelance projects and deadlines.'>
        {canManageProjects && (
          <ActionLink to='/projects/new'>Add Project</ActionLink>
        )}
      </PageHeader>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='sm:col-span-2'>
          <SearchInput
            value={searchText}
            onChange={(event) =>
              updateSearchParams('search', event.target.value)
            }
            placeholder='Search projects or clients'
            ariaLabel='Search projects'
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(event) => updateSearchParams('status', event.target.value)}
          options={projectStatusOptions}
          ariaLabel='Filter projects by status'
        />

        <FilterSelect
          value={sortBy}
          onChange={(event) => updateSearchParams('sort', event.target.value)}
          options={projectSortOptions}
          ariaLabel='Sort projects'
        />
      </div>

      <div className='mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500 dark:text-slate-400'>
          Showing {filteredProjects.length} of {projects.length} clients
        </p>

        {hasActiveFilters && (
          <Button
            variant='text'
            size='small'
            onClick={clearFilters}
            className='self-start sm:self-auto'>
            Clear Filters
          </Button>
        )}
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
                      type='button'
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
