import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearProjectMessages,
  clearSelectedProject,
  fetchProjectById,
  selectIsProjectDetailsLoading,
  selectProjectDetailsError,
  selectProjectDetailsStatus,
  selectSelectedProject,
} from '@features/projects';

import {
  selectFilteredAndSortedTasks,
  selectProjectTasks,
  selectTaskProgressStats,
  selectTasksState,
} from '../tasksSelectors';
import {
  addTask,
  clearTaskMessages,
  editTask,
  fetchTasksByProject,
  removeTask,
} from '../tasksSlice';

const DEFAULT_FILTERS = Object.freeze({
  searchText: '',
  statusFilter: 'all',
  priorityFilter: 'all',
  sortBy: 'due-date',
});

const selectCurrentUser = (state) => state.auth?.user ?? null;

function hasValidProjectId(projectId) {
  return projectId !== undefined && projectId !== null && projectId !== '';
}

function checkClientProjectAccess(user, projectId) {
  if (!user || !hasValidProjectId(projectId)) {
    return false;
  }

  if (user.role !== 'client') {
    return true;
  }

  return (user.assignedProjectIds ?? []).some(
    (assignedProjectId) => String(assignedProjectId) === String(projectId),
  );
}

function checkTaskManagementPermission(user) {
  return user?.role === 'freelancer' || user?.role === 'admin';
}

function taskBelongsToProject(task, projectId) {
  return task && String(task.projectId) === String(projectId);
}

function useProjectTasks(
  projectId,
  {
    searchText = DEFAULT_FILTERS.searchText,
    statusFilter = DEFAULT_FILTERS.statusFilter,
    priorityFilter = DEFAULT_FILTERS.priorityFilter,
    sortBy = DEFAULT_FILTERS.sortBy,
  } = DEFAULT_FILTERS,
) {
  const dispatch = useDispatch();

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const user = useSelector(selectCurrentUser);

  const selectedProject = useSelector(selectSelectedProject);

  const projectDetailsStatus = useSelector(selectProjectDetailsStatus);

  const projectLoading = useSelector(selectIsProjectDetailsLoading);

  const projectError = useSelector(selectProjectDetailsError);

  const {
    loading: taskLoading,
    mutationLoading: taskMutationLoading,
    error: taskError,
    successMessage,
  } = useSelector(selectTasksState);

  const projectTasks = useSelector((state) =>
    selectProjectTasks(state, projectId),
  );

  const filteredTasks = useSelector((state) =>
    selectFilteredAndSortedTasks(
      state,
      projectId,
      searchText,
      statusFilter,
      priorityFilter,
      sortBy,
    ),
  );

  const {
    total: totalTasks,
    todo: todoTasks,
    inProgress: inProgressTasks,
    completed: completedTasks,
    progressPercentage,
  } = useSelector((state) => selectTaskProgressStats(state, projectId));

  const canManageTasks = checkTaskManagementPermission(user);

  const clientHasAccess = checkClientProjectAccess(user, projectId);

  const selectedProjectMatchesRoute = Boolean(
    selectedProject && String(selectedProject.id) === String(projectId),
  );

  const project = selectedProjectMatchesRoute ? selectedProject : null;

  const hasStaleSelectedProject = Boolean(
    selectedProject && !selectedProjectMatchesRoute,
  );

  const isProjectLoading =
    clientHasAccess &&
    !project &&
    !projectError &&
    (projectLoading ||
      projectDetailsStatus === 'idle' ||
      projectDetailsStatus === 'loading' ||
      hasStaleSelectedProject);

  const isProjectNotFound =
    clientHasAccess && !project && !projectError && !isProjectLoading;

  const isInitialTaskLoading = taskLoading && projectTasks.length === 0;

  useEffect(() => {
    dispatch(clearTaskMessages());
    dispatch(clearProjectMessages());

    setShowTaskForm(false);
    setEditingTask(null);

    if (!clientHasAccess) {
      dispatch(clearSelectedProject());

      return undefined;
    }

    const projectRequest = dispatch(fetchProjectById(projectId));

    const tasksRequest = dispatch(fetchTasksByProject(projectId));

    return () => {
      projectRequest.abort();
      tasksRequest.abort();

      dispatch(clearTaskMessages());
      dispatch(clearSelectedProject());
    };
  }, [clientHasAccess, dispatch, projectId]);

  const closeTaskForm = useCallback(() => {
    setEditingTask(null);
    setShowTaskForm(false);
  }, []);

  const openAddTaskForm = useCallback(() => {
    if (!canManageTasks) {
      return;
    }

    dispatch(clearTaskMessages());

    setEditingTask(null);
    setShowTaskForm(true);
  }, [canManageTasks, dispatch]);

  const openEditTaskForm = useCallback(
    (task) => {
      if (!canManageTasks || !taskBelongsToProject(task, projectId)) {
        return;
      }

      dispatch(clearTaskMessages());

      setEditingTask(task);
      setShowTaskForm(true);
    },
    [canManageTasks, dispatch, projectId],
  );

  const saveTask = useCallback(
    async (formData) => {
      if (!canManageTasks || !hasValidProjectId(projectId)) {
        return false;
      }

      try {
        if (editingTask) {
          await dispatch(
            editTask({
              id: String(editingTask.id),

              taskData: {
                ...formData,
                projectId: String(projectId),
              },
            }),
          ).unwrap();
        } else {
          await dispatch(
            addTask({
              ...formData,
              projectId: String(projectId),
            }),
          ).unwrap();
        }

        closeTaskForm();

        return true;
      } catch {
        /*
         * The rejected operation stores its
         * normalized error in the Tasks slice.
         */
        return false;
      }
    },
    [canManageTasks, closeTaskForm, dispatch, editingTask, projectId],
  );

  const changeTaskStatus = useCallback(
    async (task, newStatus) => {
      if (!canManageTasks || !taskBelongsToProject(task, projectId)) {
        return false;
      }

      try {
        await dispatch(
          editTask({
            id: String(task.id),

            taskData: {
              status: newStatus,
            },
          }),
        ).unwrap();

        return true;
      } catch {
        /*
         * The rejected update error is
         * available through taskError.
         */
        return false;
      }
    },
    [canManageTasks, dispatch, projectId],
  );

  const deleteTask = useCallback(
    async (task) => {
      if (!canManageTasks || !taskBelongsToProject(task, projectId)) {
        return false;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete "${task.title}"?`,
      );

      if (!confirmed) {
        return false;
      }

      try {
        await dispatch(removeTask(String(task.id))).unwrap();

        if (editingTask && String(editingTask.id) === String(task.id)) {
          closeTaskForm();
        }

        return true;
      } catch {
        /*
         * The rejected delete error is
         * available through taskError.
         */
        return false;
      }
    },
    [canManageTasks, closeTaskForm, dispatch, editingTask, projectId],
  );

  return {
    project,

    clientHasAccess,
    canManageTasks,

    isProjectLoading,
    isProjectNotFound,
    projectError,

    taskLoading,
    taskMutationLoading,
    isInitialTaskLoading,
    taskError,
    successMessage,

    projectTasks,
    filteredTasks,

    totalTasks,
    todoTasks,
    inProgressTasks,
    completedTasks,
    progressPercentage,

    showTaskForm,
    editingTask,

    openAddTaskForm,
    openEditTaskForm,
    closeTaskForm,

    saveTask,
    changeTaskStatus,
    deleteTask,
  };
}

export default useProjectTasks;
