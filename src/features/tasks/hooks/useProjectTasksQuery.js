import { useEffect } from 'react';
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

import { TASK_FILTER_DEFAULTS } from '../tasks.constants';
import {
  selectFilteredAndSortedTasks,
  selectProjectTasks,
  selectTaskProgressStats,
  selectTasksState,
} from '../tasksSelectors';
import { clearTaskMessages } from '../tasksSlice';
import { fetchTasksByProject } from '../tasksThunks';

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

function useProjectTasksQuery(projectId, filters = TASK_FILTER_DEFAULTS) {
  const dispatch = useDispatch();

  const {
    searchText = TASK_FILTER_DEFAULTS.searchText,

    statusFilter = TASK_FILTER_DEFAULTS.statusFilter,

    priorityFilter = TASK_FILTER_DEFAULTS.priorityFilter,

    sortBy = TASK_FILTER_DEFAULTS.sortBy,
  } = filters ?? TASK_FILTER_DEFAULTS;

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
  };
}

export default useProjectTasksQuery;
