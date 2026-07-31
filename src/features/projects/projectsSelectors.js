const EMPTY_PROJECTS = [];
const IDLE_OPERATION = Object.freeze({
  status: 'idle',
  error: null,
});

const selectProjectsState = (state) => state.projects ?? {};

const selectProjectOperation = (state, operationName) =>
  selectProjectsState(state).operations?.[operationName] ?? IDLE_OPERATION;

export const selectAllProjects = (state) =>
  selectProjectsState(state).projects ?? EMPTY_PROJECTS;

export const selectSelectedProject = (state) =>
  selectProjectsState(state).selectedProject ?? null;

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
  selectProjectsListStatus(state) === 'loading';

export const selectIsProjectDetailsLoading = (state) =>
  selectProjectDetailsStatus(state) === 'loading';

export const selectIsProjectCreating = (state) =>
  selectProjectCreateStatus(state) === 'loading';

export const selectIsProjectUpdating = (state) =>
  selectProjectUpdateStatus(state) === 'loading';

export const selectIsProjectDeleting = (state) =>
  selectProjectDeleteStatus(state) === 'loading';

export const selectIsProjectSaving = (state) =>
  selectIsProjectCreating(state) || selectIsProjectUpdating(state);
