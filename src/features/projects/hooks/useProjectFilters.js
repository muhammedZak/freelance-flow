import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_STATUS_FILTER = 'all';
const DEFAULT_SORT = 'newest';

function useProjectFilters({ projects = [], clients = [], user }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || '';
  const statusFilter =
    searchParams.get('status') || DEFAULT_STATUS_FILTER;
  const sortBy = searchParams.get('sort') || DEFAULT_SORT;

  const clientNamesById = useMemo(
    () =>
      new Map(
        clients.map((client) => [String(client.id), client.name]),
      ),
    [clients],
  );

  const getClientName = useCallback(
    (clientId) =>
      clientNamesById.get(String(clientId)) || 'Unknown Client',
    [clientNamesById],
  );

  const visibleProjects = useMemo(() => {
    if (user?.role !== 'client') {
      return projects;
    }

    const assignedProjectIds = new Set(
      (user.assignedProjectIds || []).map((id) => String(id)),
    );

    return projects.filter((project) =>
      assignedProjectIds.has(String(project.id)),
    );
  }, [projects, user]);

  const filteredProjects = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    return visibleProjects
      .filter((project) => {
        const title = String(project.title || '').toLowerCase();
        const description = String(
          project.description || '',
        ).toLowerCase();
        const clientName = getClientName(
          project.clientId,
        ).toLowerCase();

        const matchesSearch =
          title.includes(normalizedSearchText) ||
          description.includes(normalizedSearchText) ||
          clientName.includes(normalizedSearchText);

        const matchesStatus =
          statusFilter === DEFAULT_STATUS_FILTER ||
          project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((firstProject, secondProject) => {
        if (sortBy === 'title-asc') {
          return firstProject.title.localeCompare(
            secondProject.title,
          );
        }

        if (sortBy === 'deadline') {
          return (
            new Date(firstProject.deadline) -
            new Date(secondProject.deadline)
          );
        }

        if (sortBy === 'budget-high') {
          return (
            Number(secondProject.budget) -
            Number(firstProject.budget)
          );
        }

        return (
          new Date(secondProject.createdAt) -
          new Date(firstProject.createdAt)
        );
      });
  }, [
    getClientName,
    searchText,
    sortBy,
    statusFilter,
    visibleProjects,
  ]);

  const updateSearchParam = useCallback(
    (key, value, defaultValue = '') => {
      const nextSearchParams = new URLSearchParams(searchParams);

      if (!value || value === defaultValue) {
        nextSearchParams.delete(key);
      } else {
        nextSearchParams.set(key, value);
      }

      setSearchParams(nextSearchParams);
    },
    [searchParams, setSearchParams],
  );

  const setSearchText = useCallback(
    (value) => updateSearchParam('search', value),
    [updateSearchParam],
  );

  const setStatusFilter = useCallback(
    (value) =>
      updateSearchParam(
        'status',
        value,
        DEFAULT_STATUS_FILTER,
      ),
    [updateSearchParam],
  );

  const setSortBy = useCallback(
    (value) =>
      updateSearchParam('sort', value, DEFAULT_SORT),
    [updateSearchParam],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters =
    Boolean(searchText) ||
    statusFilter !== DEFAULT_STATUS_FILTER ||
    sortBy !== DEFAULT_SORT;

  return {
    searchText,
    statusFilter,
    sortBy,
    filteredProjects,
    totalVisibleProjects: visibleProjects.length,
    hasActiveFilters,
    getClientName,
    setSearchText,
    setStatusFilter,
    setSortBy,
    clearFilters,
  };
}

export default useProjectFilters;
