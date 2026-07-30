import { useEffect, useState } from 'react';

import { INITIAL_CLIENT_FORM_VALUES } from '../clients.constants';

import {
  getFirstValidationError,
  hasValidationErrors,
  validateClientForm,
} from '../clientsValidation';

function createInitialFormData() {
  return {
    ...INITIAL_CLIENT_FORM_VALUES,
  };
}

function createFormDataFromClient(client) {
  return {
    ...INITIAL_CLIENT_FORM_VALUES,

    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    company: client?.company ?? '',
    address: client?.address ?? '',

    status: client?.status ?? INITIAL_CLIENT_FORM_VALUES.status,
  };
}

function createClientPayload(formData) {
  return {
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: formData.phone.trim(),
    company: formData.company.trim(),
    address: formData.address.trim(),
    status: formData.status,
  };
}

function getSubmissionErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Unable to save the client.';
}

function useClientForm({ client = null, isEditMode = false } = {}) {
  const [formData, setFormData] = useState(createInitialFormData);

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isEditMode && client) {
      setFormData(createFormDataFromClient(client));

      setFormError('');

      return;
    }

    if (!isEditMode) {
      setFormData(createInitialFormData());

      setFormError('');
    }
  }, [client, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (formError) {
      setFormError('');
    }
  }

  function validateAndBuildClientData() {
    const validationErrors = validateClientForm(formData);

    if (hasValidationErrors(validationErrors)) {
      setFormError(getFirstValidationError(validationErrors));
      return null;
    }

    setFormError('');

    return createClientPayload(formData);
  }

  function setSubmissionError(error) {
    setFormError(getSubmissionErrorMessage(error));
  }

  function clearFormError() {
    setFormError('');
  }

  function resetForm() {
    setFormData(createInitialFormData());

    setFormError('');
  }

  return {
    formData,
    formError,

    handleChange,
    validateAndBuildClientData,
    setSubmissionError,
    clearFormError,
    resetForm,
  };
}

export default useClientForm;
