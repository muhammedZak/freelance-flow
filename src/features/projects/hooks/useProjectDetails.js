import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchClients, selectAllClients } from '@features/clients';
import { fetchTasks } from '@features/tasks/tasksSlice';

import {
  selectIsProjectDeleting,
  selectIsProjectDetailsLoading,
  selectProjectDeleteError,
  selectProjectDetailsError,
  selectSelectedProject,
} from '../projectsSelectors';
import {
  clearProjectMessages,
  clearSelectedProject,
  fetchProjectById,
  removeProject,
} from '../projectsSlice';

const EMPTY_TASKS = [];

const selectCurrentUser = (state) => state.auth?.user ?? null;

const selectAllTasks = (state) => state.tasks?.tasks ?? EMPTY_TASKS;

function checkProjectAccess(user, projectId) {
  if (
    !user ||
    projectId === undefined ||
    projectId === null ||
    projectId === ''
  ) {
    return false;
  }

  if (user.role !== 'client') {
    return true;
  }

  return (user.assignedProjectIds ?? []).some(
    (assignedProjectId) => String(assignedProjectId) === String(projectId),
  );
}

function checkProjectManagementPermission(user) {
  return user?.role === 'freelancer' || user?.role === 'admin';
}

function useProjectDetails(projectId) {
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const clients = useSelector(selectAllClients);
  const tasks = useSelector(selectAllTasks);

  const selectedProject = useSelector(selectSelectedProject);

  const isDetailsLoading = useSelector(selectIsProjectDetailsLoading);

  const detailsError = useSelector(selectProjectDetailsError);

  const isDeleting = useSelector(selectIsProjectDeleting);

  const deleteError = useSelector(selectProjectDeleteError);

  const hasAccess = checkProjectAccess(user, projectId);

  const canManageProjects = checkProjectManagementPermission(user);

  const isCurrentProject = Boolean(
    selectedProject && String(selectedProject.id) === String(projectId),
  );

  const project = isCurrentProject ? selectedProject : null;

  useEffect(() => {
    dispatch(clearProjectMessages());

    if (!hasAccess) {
      dispatch(clearSelectedProject());

      return undefined;
    }

    const projectRequest = dispatch(fetchProjectById(projectId));

    dispatch(fetchClients());
    dispatch(fetchTasks());

    return () => {
      projectRequest.abort();
      dispatch(clearSelectedProject());
    };
  }, [dispatch, hasAccess, projectId]);

  const clientName = useMemo(() => {
    if (!project) {
      return 'Unknown Client';
    }

    const client = clients.find(
      (item) => String(item.id) === String(project.clientId),
    );

    return client?.name ?? 'Unknown Client';
  }, [clients, project]);

  const taskMetrics = useMemo(() => {
    const metrics = {
      totalTaskCount: 0,
      completedTaskCount: 0,
      inProgressTaskCount: 0,
      progressPercentage: 0,
    };

    if (!project) {
      return metrics;
    }

    for (const task of tasks) {
      const belongsToProject = String(task.projectId) === String(project.id);

      if (!belongsToProject) {
        continue;
      }

      metrics.totalTaskCount += 1;

      if (task.status === 'completed') {
        metrics.completedTaskCount += 1;
      }

      if (task.status === 'in-progress') {
        metrics.inProgressTaskCount += 1;
      }
    }

    if (metrics.totalTaskCount > 0) {
      metrics.progressPercentage = Math.round(
        (metrics.completedTaskCount / metrics.totalTaskCount) * 100,
      );
    }

    return metrics;
  }, [project, tasks]);

  const deleteProject = useCallback(async () => {
    if (!hasAccess) {
      throw new Error('You do not have access to this project.');
    }

    if (!canManageProjects) {
      throw new Error('You do not have permission to delete this project.');
    }

    return dispatch(removeProject(projectId)).unwrap();
  }, [canManageProjects, dispatch, hasAccess, projectId]);

  const isLoading = isDetailsLoading && !isCurrentProject;

  return {
    project,
    clientName,

    hasAccess,
    canManageProjects,
    isCurrentProject,

    totalTaskCount: taskMetrics.totalTaskCount,
    completedTaskCount: taskMetrics.completedTaskCount,
    inProgressTaskCount: taskMetrics.inProgressTaskCount,
    progressPercentage: taskMetrics.progressPercentage,

    isLoading,
    detailsError,
    isDeleting,
    deleteError,

    deleteProject,
  };
}

export default useProjectDetails;
