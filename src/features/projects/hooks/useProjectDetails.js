import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectAllClients } from '@features/clients';

import {
  selectIsProjectDeleting,
  selectIsProjectDetailsLoading,
  selectProjectDeleteError,
  selectProjectDetailsError,
  selectSelectedProject,
} from '../projectsSelectors';

const EMPTY_TASKS = [];

const selectCurrentUser = (state) => state.auth?.user ?? null;

const selectAllTasks = (state) => state.tasks?.tasks ?? EMPTY_TASKS;

function checkProjectAccess(user, projectId) {
  if (!user) {
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
  };
}

export default useProjectDetails;
