import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const TASK_FILTER_PARAMS = Object.freeze({
  SEARCH: 'search',
  STATUS: 'status',
  PRIORITY: 'priority',
  SORT: 'sort',
});

const TASK_FILTER_DEFAULTS = Object.freeze({
  [TASK_FILTER_PARAMS.SEARCH]: '',
  [TASK_FILTER_PARAMS.STATUS]: 'all',
  [TASK_FILTER_PARAMS.PRIORITY]: 'all',
  [TASK_FILTER_PARAMS.SORT]: 'due-date',
});

const TASK_FILTER_PARAM_KEYS = Object.freeze(Object.values(TASK_FILTER_PARAMS));

function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText =
    searchParams.get(TASK_FILTER_PARAMS.SEARCH) ??
    TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.SEARCH];

  const statusFilter =
    searchParams.get(TASK_FILTER_PARAMS.STATUS) ??
    TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.STATUS];

  const priorityFilter =
    searchParams.get(TASK_FILTER_PARAMS.PRIORITY) ??
    TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.PRIORITY];

  const sortBy =
    searchParams.get(TASK_FILTER_PARAMS.SORT) ??
    TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.SORT];

  const updateSearchParams = useCallback(
    (key, value) => {
      const isTaskFilterKey = Object.prototype.hasOwnProperty.call(
        TASK_FILTER_DEFAULTS,
        key,
      );

      if (!isTaskFilterKey) {
        return;
      }

      const normalizedValue =
        value === undefined || value === null ? '' : String(value);

      const defaultValue = TASK_FILTER_DEFAULTS[key];

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
    statusFilter !== TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.STATUS] ||
    priorityFilter !== TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.PRIORITY] ||
    sortBy !== TASK_FILTER_DEFAULTS[TASK_FILTER_PARAMS.SORT];

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
