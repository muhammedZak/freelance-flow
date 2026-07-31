import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import BackLink from '@components/common/BackLink';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import PageHeader from '@components/common/PageHeader';

import { fetchClients, selectAllClients } from '@features/clients';

import ProjectForm from '../components/ProjectForm';
import useProjectForm from '../hooks/useProjectForm';
import {
  selectIsProjectDetailsLoading,
  selectIsProjectSaving,
  selectProjectDetailsError,
  selectSelectedProject,
} from '../projectsSelectors';
import {
  addProject,
  clearProjectMessages,
  clearSelectedProject,
  editProject,
  fetchProjectById,
} from '../projectsSlice';

function ProjectFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clients = useSelector(selectAllClients);
  const selectedProject = useSelector(selectSelectedProject);
  const isDetailsLoading = useSelector(selectIsProjectDetailsLoading);
  const detailsError = useSelector(selectProjectDetailsError);
  const isSaving = useSelector(selectIsProjectSaving);

  const currentProject =
    selectedProject && String(selectedProject.id) === String(id)
      ? selectedProject
      : null;

  const {
    formData,
    fieldErrors,
    submissionError,
    handleChange,
    validateAndBuildProjectData,
    setSubmissionError,
  } = useProjectForm({
    project: currentProject,
    isEditMode,
  });

  useEffect(() => {
    dispatch(clearProjectMessages());
    dispatch(fetchClients());

    if (isEditMode) {
      dispatch(fetchProjectById(id));
    } else {
      dispatch(clearSelectedProject());
    }
  }, [dispatch, id, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();

    const projectData = validateAndBuildProjectData();

    if (!projectData) {
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          editProject({
            id,
            projectData,
          }),
        ).unwrap();
      } else {
        await dispatch(addProject(projectData)).unwrap();
      }

      navigate('/projects');
    } catch (error) {
      setSubmissionError(error);
    }
  }

  if (isEditMode && isDetailsLoading && !currentProject) {
    return <Loading />;
  }

  if (isEditMode && detailsError && !currentProject) {
    return <ErrorMessage message={detailsError} />;
  }

  const title = isEditMode ? 'Edit Project' : 'Add Project';

  const description = isEditMode
    ? 'Update the selected project details.'
    : 'Create a new project and connect it to a client.';

  return (
    <div className='workspace-page'>
      <PageHeader title={title} description={description}>
        <BackLink to='/projects'>Back to Projects</BackLink>
      </PageHeader>

      <div className='max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7'>
        <ProjectForm
          formData={formData}
          fieldErrors={fieldErrors}
          submissionError={submissionError}
          isSubmitting={isSaving}
          clients={clients}
          isEditMode={isEditMode}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ProjectFormPage;
