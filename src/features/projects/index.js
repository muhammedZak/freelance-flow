// Redux reducer
export { default as projectsReducer } from './projectsSlice';

// Route pages
export { default as ProjectsPage } from './pages/ProjectsPage';
export { default as ProjectDetailsPage } from './pages/ProjectDetailsPage';
export { default as ProjectFormPage } from './pages/ProjectFormPage';

// Redux async thunks and synchronous actions
export {
  fetchProjects,
  fetchProjectById,
  addProject,
  editProject,
  removeProject,
  clearProjectMessages,
  clearSelectedProject,
} from './projectsSlice';

// Selectors
export {
  selectAllProjects,
  selectSelectedProject,
  selectProjectById,
  selectProjectsSuccessMessage,
  selectProjectsListStatus,
  selectProjectsListError,
  selectProjectDetailsStatus,
  selectProjectDetailsError,
  selectProjectCreateStatus,
  selectProjectCreateError,
  selectProjectUpdateStatus,
  selectProjectUpdateError,
  selectProjectDeleteStatus,
  selectProjectDeleteError,
  selectIsProjectsListLoading,
  selectIsProjectDetailsLoading,
  selectIsProjectCreating,
  selectIsProjectUpdating,
  selectIsProjectDeleting,
  selectIsProjectSaving,
  selectProjectsLoading,
  selectProjectsError,
} from './selectors/projectsSelectors';
