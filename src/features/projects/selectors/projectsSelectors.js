import { createSelector } from '@reduxjs/toolkit';

import { selectCurrentUser } from '@features/auth';

const EMPTY_PROJECTS = Object.freeze([]);
const EMPTY_CLIENTS = Object.freeze([]);

const IDLE_OPERATION = Object.freeze({
  status: 'idle',
  error: null,
});

const ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

const USER_ROLE = Object.freeze({
  FREELANCER: 'freelancer',
  CLIENT: 'client',
});

function normalizeId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedId = String(value).trim();

  return normalizedId || null;
}

function idsMatch(firstId, secondId) {
  const normalizedFirstId = normalizeId(firstId);
  const normalizedSecondId = normalizeId(secondId);

  if (!normalizedFirstId || !normalizedSecondId) {
    return false;
  }

  return normalizedFirstId === normalizedSecondId;
}

const selectProjectsState = (state) => state.projects ?? {};

const selectRawProjects = (state) =>
  selectProjectsState(state).projects ?? EMPTY_PROJECTS;

const selectRawSelectedProject = (state) =>
  selectProjectsState(state).selectedProject ?? null;

const selectClientProfiles = (state) => state.clients?.clients ?? EMPTY_CLIENTS;

const selectProjectOperation = (state, operationName) =>
  selectProjectsState(state).operations?.[operationName] ?? IDLE_OPERATION;

const selectCurrentClientProfile = createSelector(
  [selectClientProfiles, selectCurrentUser],
  (clientProfiles, currentUser) => {
    if (!currentUser || currentUser.role !== USER_ROLE.CLIENT) {
      return null;
    }

    return (
      clientProfiles.find((clientProfile) =>
        idsMatch(clientProfile.userId, currentUser.id),
      ) ?? null
    );
  },
);

function canUserAccessProject(project, currentUser, currentClientProfile) {
  if (!project || !currentUser) {
    return false;
  }

  if (currentUser.role === USER_ROLE.FREELANCER) {
    return idsMatch(project.freelancerId, currentUser.id);
  }

  if (currentUser.role === USER_ROLE.CLIENT) {
    if (!currentClientProfile) {
      return false;
    }

    return idsMatch(project.clientId, currentClientProfile.id);
  }

  /*
   * Unknown or unsupported roles fail closed.
   */
  return false;
}

export const selectAllProjects = createSelector(
  [selectRawProjects, selectCurrentUser, selectCurrentClientProfile],
  (projects, currentUser, currentClientProfile) => {
    if (!currentUser) {
      return EMPTY_PROJECTS;
    }

    return projects.filter((project) =>
      canUserAccessProject(project, currentUser, currentClientProfile),
    );
  },
);

export const selectSelectedProject = createSelector(
  [selectRawSelectedProject, selectCurrentUser, selectCurrentClientProfile],
  (selectedProject, currentUser, currentClientProfile) => {
    if (!selectedProject || !currentUser) {
      return null;
    }

    return canUserAccessProject(
      selectedProject,
      currentUser,
      currentClientProfile,
    )
      ? selectedProject
      : null;
  },
);

export const selectProjectById = (state, projectId) => {
  const projects = selectAllProjects(state);

  return projects.find((project) => idsMatch(project.id, projectId)) ?? null;
};

export const selectProjectsSuccessMessage = (state) =>
  selectProjectsState(state).successMessage ?? '';

export const selectProjectsListStatus = (state) =>
  selectProjectOperation(state, 'fetchList').status;

export const selectProjectsListError = (state) =>
  selectProjectOperation(state, 'fetchList').error;

export const selectProjectDetailsStatus = (state) =>
  selectProjectOperation(state, 'fetchDetails').status;

export const selectProjectDetailsError = (state) =>
  selectProjectOperation(state, 'fetchDetails').error;

export const selectProjectCreateStatus = (state) =>
  selectProjectOperation(state, 'create').status;

export const selectProjectCreateError = (state) =>
  selectProjectOperation(state, 'create').error;

export const selectProjectUpdateStatus = (state) =>
  selectProjectOperation(state, 'update').status;

export const selectProjectUpdateError = (state) =>
  selectProjectOperation(state, 'update').error;

export const selectProjectDeleteStatus = (state) =>
  selectProjectOperation(state, 'delete').status;

export const selectProjectDeleteError = (state) =>
  selectProjectOperation(state, 'delete').error;

export const selectIsProjectsListLoading = (state) =>
  selectProjectsListStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsProjectDetailsLoading = (state) =>
  selectProjectDetailsStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsProjectCreating = (state) =>
  selectProjectCreateStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsProjectUpdating = (state) =>
  selectProjectUpdateStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsProjectDeleting = (state) =>
  selectProjectDeleteStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsProjectSaving = (state) =>
  selectIsProjectCreating(state) || selectIsProjectUpdating(state);

/*
 * Generic compatibility selector.
 *
 * Returns true whenever any Projects domain
 * async operation is currently active.
 */
export const selectProjectsLoading = (state) =>
  selectIsProjectsListLoading(state) ||
  selectIsProjectDetailsLoading(state) ||
  selectIsProjectCreating(state) ||
  selectIsProjectUpdating(state) ||
  selectIsProjectDeleting(state);

/*
 * Generic compatibility error.
 *
 * More specific pages should continue using
 * the operation-specific error selectors above.
 */
export const selectProjectsError = (state) =>
  selectProjectsListError(state) ??
  selectProjectDetailsError(state) ??
  selectProjectCreateError(state) ??
  selectProjectUpdateError(state) ??
  selectProjectDeleteError(state) ??
  null;
