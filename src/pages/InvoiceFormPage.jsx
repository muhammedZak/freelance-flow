import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import InvoiceForm from '../features/invoices/InvoiceForm';

import { fetchClients } from '../features/clients/clientsSlice';
import { fetchProjects } from '../features/projects/projectsSlice';

import {
  addInvoice,
  clearInvoiceMessages,
} from '../features/invoices/invoicesSlice';

import { calculateInvoiceTotal } from '../utils/calculateInvoiceTotal';
import PageHeader from '../components/common/PageHeader';
import BackLink from '../components/common/BackLink';

function InvoiceFormPage() {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    projectId: '',
    hoursWorked: '',
    hourlyRate: '',
    status: 'unpaid',
    issueDate: '',
    dueDate: '',
  });

  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    clients,
    loading: clientsLoading,
    error: clientsError,
  } = useSelector((state) => state.clients);

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);

  const { loading: invoiceLoading, error: invoiceError } = useSelector(
    (state) => state.invoices,
  );

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

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === 'clientId') {
      setFormData({
        ...formData,
        clientId: value,
        projectId: '',
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateForm() {
    if (!formData.invoiceNumber.trim()) {
      return 'Invoice number is required';
    }

    if (!formData.clientId) {
      return 'Please select a client';
    }

    if (!formData.projectId) {
      return 'Please select a project';
    }

    const selectedProject = projects.find(
      (project) => String(project.id) === String(formData.projectId),
    );

    if (
      !selectedProject ||
      String(selectedProject.clientId) !== String(formData.clientId)
    ) {
      return 'The selected project does not belong to this client';
    }

    if (!formData.hoursWorked) {
      return 'Hours worked is required';
    }

    if (Number(formData.hoursWorked) <= 0) {
      return 'Hours worked must be greater than 0';
    }

    if (!formData.hourlyRate) {
      return 'Hourly rate is required';
    }

    if (Number(formData.hourlyRate) <= 0) {
      return 'Hourly rate must be greater than 0';
    }

    if (!formData.issueDate) {
      return 'Issue date is required';
    }

    if (!formData.dueDate) {
      return 'Due date is required';
    }

    if (new Date(formData.dueDate) < new Date(formData.issueDate)) {
      return 'Due date cannot be before issue date';
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

    const invoiceData = {
      invoiceNumber: formData.invoiceNumber.trim().toUpperCase(),
      clientId: String(formData.clientId),
      projectId: String(formData.projectId),
      hoursWorked: Number(formData.hoursWorked),
      hourlyRate: Number(formData.hourlyRate),
      total: invoiceTotal,
      status: formData.status,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
    };

    try {
      const savedInvoice = await dispatch(addInvoice(invoiceData)).unwrap();

      navigate(`/invoices/${savedInvoice.id}`);
    } catch (error) {
      setFormError(error);
    }
  }

  const loadingData =
    (clientsLoading && clients.length === 0) ||
    (projectsLoading && projects.length === 0);

  const dataError = clientsError || projectsError;

  if (loadingData) {
    return <Loading />;
  }

  if (dataError) {
    return <ErrorMessage message={dataError} />;
  }

  return (
    <div className='workspace-page'>
      <PageHeader
        title='Create Invoice'
        description='Create an invoice and automatically calculate its total.'>
        <BackLink to='/invoices'>Back to Invoices</BackLink>
      </PageHeader>

      {invoiceError && <ErrorMessage message={invoiceError} />}

      <div className='max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7'>
        <InvoiceForm
          formData={formData}
          formError={formError}
          loading={invoiceLoading}
          clients={clients}
          projects={clientProjects}
          invoiceTotal={invoiceTotal}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default InvoiceFormPage;
