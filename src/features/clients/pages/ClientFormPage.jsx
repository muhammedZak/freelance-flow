import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import BackLink from '@/components/common/BackLink';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';

import { selectCurrentUser } from '@features/auth';

import ClientForm from '../components/ClientForm';

import useClientForm from '../hooks/useClientForm';

import {
  clearClientMessages,
  clearSelectedClient,
} from '../slices/clientsSlice';

import {
  addClient,
  editClient,
  fetchClientById,
} from '../thunks/clientsThunks';

import {
  selectClientsError,
  selectClientsLoading,
  selectSelectedClient,
} from '../selectors/clientsSelectors';

function ClientFormPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const currentUser = useSelector(selectCurrentUser);

  const selectedClient = useSelector(selectSelectedClient);

  const loading = useSelector(selectClientsLoading);

  const error = useSelector(selectClientsError);

  const {
    formData,
    formError,
    handleChange,
    validateAndBuildClientData,
    setSubmissionError,
  } = useClientForm({
    client: selectedClient,
    isEditMode,
  });

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
    if (!id) {
      return;
    }

    dispatch(clearClientMessages());
    dispatch(fetchClientById(id));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const clientData = validateAndBuildClientData();
    console.log(clientData);

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

        navigate('/clients');

        return;
      }

      if (!currentUser || currentUser.role !== 'freelancer') {
        setSubmissionError(
          'You must be logged in as a freelancer to create a client.',
        );

        return;
      }

      const activeFreelancerId = String(currentUser.id ?? '').trim();

      if (!activeFreelancerId) {
        setSubmissionError(
          'The authenticated freelancer account is missing a valid user ID.',
        );

        return;
      }

      await dispatch(
        addClient({
          clientData,
          activeFreelancerId,
        }),
      ).unwrap();

      navigate('/clients');
    } catch (submissionError) {
      setSubmissionError(submissionError);
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
        message={error}
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
