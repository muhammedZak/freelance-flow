import { useEffect, useState } from 'react';

import getApiErrorMessage from '@/shared/api/getApiErrorMessage';

import { INITIAL_PROJECT_FORM_VALUES } from '../projects.constants';
import {
  hasProjectValidationErrors,
  validateProjectForm,
} from '../projectsValidation';

function createInitialFormData() {
  return {
    ...INITIAL_PROJECT_FORM_VALUES,
  };
}

export function createProjectFormData(project) {
  return {
    ...INITIAL_PROJECT_FORM_VALUES,

    title: project?.title ?? '',
    clientId: String(project?.clientId ?? ''),
    description: project?.description ?? '',
    status: project?.status ?? INITIAL_PROJECT_FORM_VALUES.status,
    startDate: project?.startDate ?? '',
    deadline: project?.deadline ?? '',
    budget:
      project?.budget === null || project?.budget === undefined
        ? ''
        : String(project.budget),
  };
}

export function createProjectPayload(formData) {
  return {
    title: formData.title.trim(),
    clientId: String(formData.clientId),
    description: formData.description.trim(),
    status: formData.status,
    startDate: formData.startDate,
    deadline: formData.deadline,
    budget: Number(formData.budget),
  };
}

function useProjectForm({ project = null, isEditMode = false } = {}) {
  const [formData, setFormData] = useState(createInitialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submissionError, setSubmissionErrorMessage] = useState('');

  useEffect(() => {
    if (isEditMode && project) {
      setFormData(createProjectFormData(project));
      setFieldErrors({});
      setSubmissionErrorMessage('');
      return;
    }

    if (!isEditMode) {
      setFormData(createInitialFormData());
      setFieldErrors({});
      setSubmissionErrorMessage('');
    }
  }, [isEditMode, project]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (
        !currentErrors[name] &&
        !(name === 'startDate' && currentErrors.deadline)
      ) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[name];

      if (name === 'startDate') {
        delete nextErrors.deadline;
      }

      return nextErrors;
    });

    if (submissionError) {
      setSubmissionErrorMessage('');
    }
  }

  function validateAndBuildProjectData() {
    const validationErrors = validateProjectForm(formData);

    setFieldErrors(validationErrors);

    if (hasProjectValidationErrors(validationErrors)) {
      return null;
    }

    setSubmissionErrorMessage('');

    return createProjectPayload(formData);
  }

  function setSubmissionError(error) {
    setSubmissionErrorMessage(
      getApiErrorMessage(error, 'Unable to save the project.'),
    );
  }

  function clearSubmissionError() {
    setSubmissionErrorMessage('');
  }

  function resetForm() {
    setFormData(createInitialFormData());
    setFieldErrors({});
    setSubmissionErrorMessage('');
  }

  return {
    formData,
    fieldErrors,
    submissionError,

    handleChange,
    validateAndBuildProjectData,
    setSubmissionError,
    clearSubmissionError,
    resetForm,
  };
}

export default useProjectForm;
