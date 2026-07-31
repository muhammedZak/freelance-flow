import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  PROJECT_FILTER_DEFAULTS,
  PROJECT_FILTER_PARAMS,
  PROJECT_SORT,
} from '../projects.constants';

function useProjectFilters({ projects = [], clients = [], user }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText =
    searchParams.get(PROJECT_FILTER_PARAMS.SEARCH) ??
    PROJECT_FILTER_DEFAULTS.search;

  const statusFilter =
    searchParams.get(PROJECT_FILTER_PARAMS.STATUS) ??
    PROJECT_FILTER_DEFAULTS.status;

  const sortBy =
    searchParams.get(PROJECT_FILTER_PARAMS.SORT) ??
    PROJECT_FILTER_DEFAULTS.sort;

  const clientNamesById = useMemo(
    () => new Map(clients.map((client) => [String(client.id), client.name])),
    [clients],
  );

  const getClientName = useCallback(
    (clientId) => clientNamesById.get(String(clientId)) || 'Unknown Client',
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

        const description = String(project.description || '').toLowerCase();

        const clientName = getClientName(project.clientId).toLowerCase();

        const matchesSearch =
          title.includes(normalizedSearchText) ||
          description.includes(normalizedSearchText) ||
          clientName.includes(normalizedSearchText);

        const matchesStatus =
          statusFilter === PROJECT_FILTER_DEFAULTS.status ||
          project.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((firstProject, secondProject) => {
        if (sortBy === PROJECT_SORT.TITLE_ASCENDING) {
          return firstProject.title.localeCompare(secondProject.title);
        }

        if (sortBy === PROJECT_SORT.DEADLINE) {
          return (
            new Date(firstProject.deadline) - new Date(secondProject.deadline)
          );
        }

        if (sortBy === PROJECT_SORT.BUDGET_HIGH) {
          return Number(secondProject.budget) - Number(firstProject.budget);
        }

        return (
          new Date(secondProject.createdAt) - new Date(firstProject.createdAt)
        );
      });
  }, [getClientName, searchText, sortBy, statusFilter, visibleProjects]);

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
    (value) =>
      updateSearchParam(
        PROJECT_FILTER_PARAMS.SEARCH,
        value,
        PROJECT_FILTER_DEFAULTS.search,
      ),
    [updateSearchParam],
  );

  const setStatusFilter = useCallback(
    (value) =>
      updateSearchParam(
        PROJECT_FILTER_PARAMS.STATUS,
        value,
        PROJECT_FILTER_DEFAULTS.status,
      ),
    [updateSearchParam],
  );

  const setSortBy = useCallback(
    (value) =>
      updateSearchParam(
        PROJECT_FILTER_PARAMS.SORT,
        value,
        PROJECT_FILTER_DEFAULTS.sort,
      ),
    [updateSearchParam],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters =
    Boolean(searchText) ||
    statusFilter !== PROJECT_FILTER_DEFAULTS.status ||
    sortBy !== PROJECT_FILTER_DEFAULTS.sort;

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
