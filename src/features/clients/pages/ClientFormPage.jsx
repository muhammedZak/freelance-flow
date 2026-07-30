import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import BackLink from '@/components/common/BackLink';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';

import ClientForm from '../components/ClientForm';
import useClientForm from '../hooks/useClientForm';

import {
  addClient,
  clearClientMessages,
  clearSelectedClient,
  editClient,
  fetchClientById,
} from '../clientsSlice';

import {
  selectClientsError,
  selectClientsLoading,
  selectSelectedClient,
} from '../clientsSelectors';

function ClientFormPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const selectedClient = useSelector(selectSelectedClient);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);

  const {
    formData,
    formError,
    handleChange,
    validateAndBuildClientData,
    setSubmissionError,
  } = useClientForm({ client: selectedClient, isEditMode });

  useEffect(() => {
    dispatch(clearClientMessages());

    if (isEditMode) {
      dispatch(fetchClientById(id));
    } else {
      dispatch(clearSelectedClient());
    }

    return () => {
      dispatch(clearClientMessages());
      dispatch(clearSelectedClient());
    };
  }, [dispatch, id, isEditMode]);

  function handleRetry() {
    dispatch(clearClientMessages());
    dispatch(fetchClientById(id));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const clientData = validateAndBuildClientData();

    if (!clientData) {
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          editClient({
            id,
            clientData,
          }),
        ).unwrap();
      } else {
        await dispatch(addClient(clientData)).unwrap();
      }

      navigate('/clients');
    } catch (error) {
      setSubmissionError(error);
    }
  }

  const isLoadingClient = isEditMode && loading && !selectedClient;

  if (isLoadingClient) {
    return <Loading message='Loading client details.' />;
  }

  if (isEditMode && error && !selectedClient) {
    return (
      <ErrorMessage
        title='Unable to load client'
        message={apiError}
        onRetry={handleRetry}
        retryText='Reload Client'
      />
    );
  }

  return (
    <div className='workspace-page'>
      <div className='mb-4'>
        <BackLink to='/clients'>Back to Clients</BackLink>
      </div>

      <PageHeader
        title={isEditMode ? 'Edit Client' : 'Add Client'}
        description={
          isEditMode
            ? 'Update the selected client information.'
            : 'Enter the details of your new client.'
        }
      />

      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6'>
        <ClientForm
          formData={formData}
          formError={formError}
          loading={loading}
          isEditMode={isEditMode}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ClientFormPage;
