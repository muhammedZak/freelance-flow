import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import BackLink from '@components/common/BackLink';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import PageHeader from '@components/common/PageHeader';

import { fetchClients, selectAllClients } from '@features/clients';

import ProjectForm from '../components/ProjectForm';
import {
  selectIsProjectDetailsLoading,
  selectIsProjectSaving,
  selectProjectCreateError,
  selectProjectDetailsError,
  selectProjectUpdateError,
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

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    description: '',
    status: 'planning',
    startDate: '',
    deadline: '',
    budget: '',
  });
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clients = useSelector(selectAllClients);
  const selectedProject = useSelector(selectSelectedProject);
  const isDetailsLoading = useSelector(selectIsProjectDetailsLoading);
  const detailsError = useSelector(selectProjectDetailsError);
  const createError = useSelector(selectProjectCreateError);
  const updateError = useSelector(selectProjectUpdateError);
  const isSaving = useSelector(selectIsProjectSaving);

  useEffect(() => {
    dispatch(clearProjectMessages());
    dispatch(fetchClients());

    if (isEditMode) {
      dispatch(fetchProjectById(id));
    } else {
      dispatch(clearSelectedProject());
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    const isCurrentProject =
      selectedProject && String(selectedProject.id) === String(id);

    if (isEditMode && isCurrentProject) {
      setFormData({
        title: selectedProject.title || '',
        clientId: String(selectedProject.clientId || ''),
        description: selectedProject.description || '',
        status: selectedProject.status || 'planning',
        startDate: selectedProject.startDate || '',
        deadline: selectedProject.deadline || '',
        budget: String(selectedProject.budget || ''),
      });
    }
  }, [id, isEditMode, selectedProject]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!formData.title.trim()) {
      return 'Project title is required';
    }

    if (!formData.clientId) {
      return 'Please select a client';
    }

    if (!formData.description.trim()) {
      return 'Project description is required';
    }

    if (!formData.startDate) {
      return 'Start date is required';
    }

    if (!formData.deadline) {
      return 'Deadline is required';
    }

    if (new Date(formData.deadline) < new Date(formData.startDate)) {
      return 'Deadline cannot be before start date';
    }

    if (!formData.budget) {
      return 'Budget is required';
    }

    if (Number(formData.budget) <= 0) {
      return 'Budget must be greater than 0';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError('');

    const projectData = {
      title: formData.title,
      clientId: formData.clientId,
      description: formData.description,
      status: formData.status,
      startDate: formData.startDate,
      deadline: formData.deadline,
      budget: Number(formData.budget),
    };

    try {
      if (isEditMode) {
        await dispatch(editProject({ id, projectData })).unwrap();
      } else {
        await dispatch(addProject(projectData)).unwrap();
      }

      navigate('/projects');
    } catch (error) {
      setFormError(error);
    }
  }

  if (isEditMode && isDetailsLoading && !selectedProject) {
    return <Loading />;
  }

  if (isEditMode && detailsError && !selectedProject) {
    return <ErrorMessage message={detailsError} />;
  }

  const submissionError = isEditMode ? updateError : createError;

  const title = isEditMode ? 'Edit project' : 'Add Project';

  const description = isEditMode
    ? 'Update the selected project details.'
    : 'Create a new project and connect it to a client.';

  return (
    <div className='workspace-page'>
      <PageHeader title={title} description={description}>
        <BackLink to='/projects'>Back to Projects</BackLink>
      </PageHeader>

      {submissionError && <ErrorMessage message={submissionError} />}

      <div className='max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7'>
        <ProjectForm
          formData={formData}
          formError={formError}
          loading={isSaving}
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
