export { default as projectsReducer } from './projectsSlice';

export { default as ProjectsPage } from './pages/ProjectsPage';
export { default as ProjectDetailsPage } from './pages/ProjectDetailsPage';
export { default as ProjectFormPage } from './pages/ProjectFormPage';

export {
  fetchProjects,
  fetchProjectById,
  addProject,
  editProject,
  removeProject,
  clearProjectMessages,
  clearSelectedProject,
} from './projectsSlice';

export {
  selectAllProjects,
  selectSelectedProject,
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
} from './projectsSelectors';
