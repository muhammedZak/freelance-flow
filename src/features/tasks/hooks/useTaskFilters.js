import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { TASK_FILTER_DEFAULTS, TASK_FILTER_PARAMS } from '../tasks.constants';

const TASK_FILTER_PARAM_KEYS = Object.freeze(Object.values(TASK_FILTER_PARAMS));

const TASK_FILTER_DEFAULTS_BY_PARAM = Object.freeze({
  [TASK_FILTER_PARAMS.SEARCH]: TASK_FILTER_DEFAULTS.searchText,

  [TASK_FILTER_PARAMS.STATUS]: TASK_FILTER_DEFAULTS.statusFilter,

  [TASK_FILTER_PARAMS.PRIORITY]: TASK_FILTER_DEFAULTS.priorityFilter,

  [TASK_FILTER_PARAMS.SORT]: TASK_FILTER_DEFAULTS.sortBy,
});

function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText =
    searchParams.get(TASK_FILTER_PARAMS.SEARCH) ??
    TASK_FILTER_DEFAULTS.searchText;

  const statusFilter =
    searchParams.get(TASK_FILTER_PARAMS.STATUS) ??
    TASK_FILTER_DEFAULTS.statusFilter;

  const priorityFilter =
    searchParams.get(TASK_FILTER_PARAMS.PRIORITY) ??
    TASK_FILTER_DEFAULTS.priorityFilter;

  const sortBy =
    searchParams.get(TASK_FILTER_PARAMS.SORT) ?? TASK_FILTER_DEFAULTS.sortBy;

  const updateSearchParams = useCallback(
    (key, value) => {
      const isTaskFilterKey = Object.prototype.hasOwnProperty.call(
        TASK_FILTER_DEFAULTS_BY_PARAM,
        key,
      );

      if (!isTaskFilterKey) {
        return;
      }

      const normalizedValue =
        value === undefined || value === null ? '' : String(value);

      const defaultValue = TASK_FILTER_DEFAULTS_BY_PARAM[key];

      setSearchParams((currentSearchParams) => {
        const nextSearchParams = new URLSearchParams(currentSearchParams);

        if (!normalizedValue || normalizedValue === defaultValue) {
          nextSearchParams.delete(key);
        } else {
          nextSearchParams.set(key, normalizedValue);
        }

        return nextSearchParams;
      });
    },
    [setSearchParams],
  );

  const setSearchText = useCallback(
    (value) => {
      updateSearchParams(TASK_FILTER_PARAMS.SEARCH, value);
    },
    [updateSearchParams],
  );

  const setStatusFilter = useCallback(
    (value) => {
      updateSearchParams(TASK_FILTER_PARAMS.STATUS, value);
    },
    [updateSearchParams],
  );

  const setPriorityFilter = useCallback(
    (value) => {
      updateSearchParams(TASK_FILTER_PARAMS.PRIORITY, value);
    },
    [updateSearchParams],
  );

  const setSortBy = useCallback(
    (value) => {
      updateSearchParams(TASK_FILTER_PARAMS.SORT, value);
    },
    [updateSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);

      TASK_FILTER_PARAM_KEYS.forEach((key) => {
        nextSearchParams.delete(key);
      });

      return nextSearchParams;
    });
  }, [setSearchParams]);

  const hasActiveFilters =
    Boolean(searchText) ||
    statusFilter !== TASK_FILTER_DEFAULTS.statusFilter ||
    priorityFilter !== TASK_FILTER_DEFAULTS.priorityFilter ||
    sortBy !== TASK_FILTER_DEFAULTS.sortBy;

  return {
    searchText,
    statusFilter,
    priorityFilter,
    sortBy,
    hasActiveFilters,

    updateSearchParams,
    setSearchText,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    clearFilters,
  };
}

export default useTaskFilters;
