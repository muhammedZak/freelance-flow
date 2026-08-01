import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  fetchClients,
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
} from '@features/clients';

import {
  fetchProjects,
  selectAllProjects,
  selectIsProjectsListLoading,
  selectProjectsListError,
} from '@features/projects';

import { clearInvoiceMessages } from '../slices/invoicesSlice';

import { addInvoice } from '../thunks/invoicesThunks';

import {
  selectInvoiceCreateError,
  selectIsInvoiceCreating,
} from '../selectors/invoicesSelectors';

import { INITIAL_INVOICE_FORM_VALUES } from '../constants/invoices.constants';

import { calculateInvoiceTotal } from '../utils/calculateInvoiceTotal';

import { mapInvoiceFormToPayload } from '../utils/invoiceMappers';

import { validateInvoiceForm } from '../validation/invoiceValidation';

function useInvoiceForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_INVOICE_FORM_VALUES,
  }));

  const [formErrors, setFormErrors] = useState({});

  const clients = useSelector(selectAllClients);
  const clientsLoading = useSelector(selectClientsLoading);
  const clientsError = useSelector(selectClientsError);

  const projects = useSelector(selectAllProjects);
  const projectsLoading = useSelector(selectIsProjectsListLoading);
  const projectsError = useSelector(selectProjectsListError);

  const invoiceLoading = useSelector(selectIsInvoiceCreating);
  const invoiceError = useSelector(selectInvoiceCreateError);

  useEffect(() => {
    dispatch(clearInvoiceMessages());
    dispatch(fetchClients());
    dispatch(fetchProjects());

    return () => {
      dispatch(clearInvoiceMessages());
    };
  }, [dispatch]);

  const invoiceTotal = calculateInvoiceTotal(
    formData.hoursWorked || 0,
    formData.hourlyRate || 0,
  );

  const clientProjects = projects.filter(
    (project) => String(project.clientId) === String(formData.clientId),
  );

  const loadingData =
    (clientsLoading && clients.length === 0) ||
    (projectsLoading && projects.length === 0);

  const dataError = clientsError || projectsError;

  function clearChangedFieldErrors(fieldName) {
    setFormErrors((currentErrors) => {
      const fieldsToClear = [fieldName];

      if (fieldName === 'clientId') {
        fieldsToClear.push('projectId');
      }

      if (fieldName === 'issueDate') {
        fieldsToClear.push('dueDate');
      }

      const hasErrorToClear = fieldsToClear.some((field) =>
        Boolean(currentErrors[field]),
      );

      if (!hasErrorToClear) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      fieldsToClear.forEach((field) => {
        delete nextErrors[field];
      });

      return nextErrors;
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    clearChangedFieldErrors(name);

    setFormData((currentFormData) => {
      if (name === 'clientId') {
        return {
          ...currentFormData,
          clientId: value,
          projectId: '',
        };
      }

      return {
        ...currentFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateInvoiceForm(formData, projects);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    const invoiceData = mapInvoiceFormToPayload(formData, invoiceTotal);

    try {
      const savedInvoice = await dispatch(addInvoice(invoiceData)).unwrap();

      navigate(`/invoices/${savedInvoice.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    formData,
    formErrors,

    clients,
    clientProjects,

    invoiceTotal,

    invoiceLoading,
    invoiceError,

    loadingData,
    dataError,

    handleChange,
    handleSubmit,
  };
}

export default useInvoiceForm;
