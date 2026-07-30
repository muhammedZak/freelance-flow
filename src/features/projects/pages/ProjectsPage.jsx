import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActionLink from '@components/common/ActionLink';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import PageHeader from '@components/common/PageHeader';

import { fetchClients } from '@features/clients';

import ProjectFilters from '../components/ProjectFilters';
import ProjectsGrid from '../components/ProjectsGrid';
import useProjectFilters from '../hooks/useProjectFilters';
import {
  clearProjectMessages,
  fetchProjects,
  removeProject,
} from '../projectsSlice';

function ProjectsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { projects, loading, error, successMessage } =
    useSelector((state) => state.projects);

  const { clients } = useSelector((state) => state.clients);

  const canManageProjects =
    user?.role === 'freelancer' || user?.role === 'admin';

  const {
    searchText,
    statusFilter,
    sortBy,
    filteredProjects,
    totalVisibleProjects,
    hasActiveFilters,
    getClientName,
    setSearchText,
    setStatusFilter,
    setSortBy,
    clearFilters,
  } = useProjectFilters({
    projects,
    clients,
    user,
  });

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchClients());

    return () => {
      dispatch(clearProjectMessages());
    };
  }, [dispatch]);

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?',
    );

    if (confirmed) {
      dispatch(removeProject(id));
    }
  }

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

      <ProjectFilters
        searchText={searchText}
        statusFilter={statusFilter}
        sortBy={sortBy}
        filteredCount={filteredProjects.length}
        totalCount={totalVisibleProjects}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchText}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
        onClear={clearFilters}
      />

      <ProjectsGrid
        projects={filteredProjects}
        getClientName={getClientName}
        canManageProjects={canManageProjects}
        isUpdating={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ProjectsPage;
