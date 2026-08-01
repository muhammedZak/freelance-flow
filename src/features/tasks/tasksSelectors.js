import { createSelector } from '@reduxjs/toolkit';

import {
  TASK_FILTER_ALL,
  TASK_FILTER_DEFAULTS,
  TASK_PRIORITY,
  TASK_SORT,
  TASK_STATUS,
} from './tasks.constants';

const EMPTY_TASKS = Object.freeze([]);

const EMPTY_TASKS_STATE = Object.freeze({
  tasks: EMPTY_TASKS,
  loading: false,
  error: null,
  successMessage: '',
});

const TASK_PRIORITY_SORT_ORDER = Object.freeze({
  [TASK_PRIORITY.HIGH]: 1,
  [TASK_PRIORITY.MEDIUM]: 2,
  [TASK_PRIORITY.LOW]: 3,
});

export const selectTasksState = (state) => state.tasks ?? EMPTY_TASKS_STATE;

const selectAllTasks = createSelector([selectTasksState], (tasksState) =>
  Array.isArray(tasksState.tasks) ? tasksState.tasks : EMPTY_TASKS,
);

const selectProjectId = (_state, projectId) => projectId;

const selectSearchText = (
  _state,
  _projectId,
  searchText = TASK_FILTER_DEFAULTS.searchText,
) => searchText;

const selectStatusFilter = (
  _state,
  _projectId,
  _searchText,
  statusFilter = TASK_FILTER_DEFAULTS.statusFilter,
) => statusFilter;

const selectPriorityFilter = (
  _state,
  _projectId,
  _searchText,
  _statusFilter,
  priorityFilter = TASK_FILTER_DEFAULTS.priorityFilter,
) => priorityFilter;

const selectSortBy = (
  _state,
  _projectId,
  _searchText,
  _statusFilter,
  _priorityFilter,
  sortBy = TASK_FILTER_DEFAULTS.sortBy,
) => sortBy;

export const selectProjectTasks = createSelector(
  [selectAllTasks, selectProjectId],
  (tasks, projectId) => {
    if (projectId === undefined || projectId === null || projectId === '') {
      return EMPTY_TASKS;
    }

    const normalizedProjectId = String(projectId);

    return tasks.filter(
      (task) => String(task.projectId) === normalizedProjectId,
    );
  },
);

export const selectFilteredAndSortedTasks = createSelector(
  [
    selectProjectTasks,
    selectSearchText,
    selectStatusFilter,
    selectPriorityFilter,
    selectSortBy,
  ],
  (projectTasks, searchText, statusFilter, priorityFilter, sortBy) => {
    const normalizedSearchText = String(searchText ?? '').toLowerCase();

    const filteredTasks = projectTasks.filter((task) => {
      const taskTitle = String(task.title ?? '').toLowerCase();

      const taskDescription = String(task.description ?? '').toLowerCase();

      const matchesSearch =
        taskTitle.includes(normalizedSearchText) ||
        taskDescription.includes(normalizedSearchText);

      const matchesStatus =
        statusFilter === TASK_FILTER_ALL || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === TASK_FILTER_ALL || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return [...filteredTasks].sort((firstTask, secondTask) => {
      if (sortBy === TASK_SORT.NEWEST) {
        return new Date(secondTask.createdAt) - new Date(firstTask.createdAt);
      }

      if (sortBy === TASK_SORT.TITLE) {
        return String(firstTask.title ?? '').localeCompare(
          String(secondTask.title ?? ''),
        );
      }

      if (sortBy === TASK_SORT.PRIORITY) {
        const firstPriorityOrder =
          TASK_PRIORITY_SORT_ORDER[firstTask.priority] ??
          Number.MAX_SAFE_INTEGER;

        const secondPriorityOrder =
          TASK_PRIORITY_SORT_ORDER[secondTask.priority] ??
          Number.MAX_SAFE_INTEGER;

        return firstPriorityOrder - secondPriorityOrder;
      }

      return new Date(firstTask.dueDate) - new Date(secondTask.dueDate);
    });
  },
);

export const selectTaskProgressStats = createSelector(
  [selectProjectTasks],
  (projectTasks) => {
    const stats = {
      total: projectTasks.length,
      todo: 0,
      inProgress: 0,
      completed: 0,
      progressPercentage: 0,
    };

    for (const task of projectTasks) {
      if (task.status === TASK_STATUS.TODO) {
        stats.todo += 1;
      }

      if (task.status === TASK_STATUS.IN_PROGRESS) {
        stats.inProgress += 1;
      }

      if (task.status === TASK_STATUS.COMPLETED) {
        stats.completed += 1;
      }
    }

    if (stats.total > 0) {
      stats.progressPercentage = Math.round(
        (stats.completed / stats.total) * 100,
      );
    }

    return stats;
  },
);
