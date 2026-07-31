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
  selectAllProjects,
  selectIsProjectDeleting,
  selectIsProjectsListLoading,
  selectProjectDeleteError,
  selectProjectsListError,
  selectProjectsSuccessMessage,
} from '../projectsSelectors';
import {
  clearProjectMessages,
  fetchProjects,
  removeProject,
} from '../projectsSlice';

function ProjectsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const projects = useSelector(selectAllProjects);
  const isListLoading = useSelector(selectIsProjectsListLoading);
  const listError = useSelector(selectProjectsListError);
  const isDeleting = useSelector(selectIsProjectDeleting);
  const deleteError = useSelector(selectProjectDeleteError);
  const successMessage = useSelector(selectProjectsSuccessMessage);
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

  if (isListLoading && projects.length === 0) {
    return <Loading />;
  }

  if (listError) {
    return <ErrorMessage message={listError} />;
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

      {deleteError && (
        <div className='mb-4'>
          <ErrorMessage message={deleteError} />
        </div>
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
        isUpdating={isDeleting}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ProjectsPage;
