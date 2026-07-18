import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ProjectForm from '../features/projects/ProjectForm';

import { fetchClients } from '../features/clients/clientsSlice';

import {
  addProject,
  clearProjectMessages,
  clearSelectedProject,
  editProject,
  fetchProjectById,
} from '../features/projects/projectsSlice';

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

  const { clients } = useSelector((state) => state.clients);

  const { selectedProject, loading, error } = useSelector(
    (state) => state.projects,
  );

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
    if (isEditMode && selectedProject) {
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
  }, [isEditMode, selectedProject]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
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

  if (loading && isEditMode && !selectedProject) {
    return <Loading />;
  }

  if (error && isEditMode && !selectedProject) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='workspace-page'>
      <div className='page-header'>
        <Link to='/projects' className='text-sm text-blue-600'>
          ← Back to Projects
        </Link>

        <h1 className='mt-2 text-2xl font-bold text-slate-900'>
          {isEditMode ? 'Edit Project' : 'Add Project'}
        </h1>

        <p className='text-slate-600'>
          {isEditMode
            ? 'Update the selected project details.'
            : 'Create a new project and connect it to a client.'}
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className='max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7'>
        <ProjectForm
          formData={formData}
          formError={formError}
          loading={loading}
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
