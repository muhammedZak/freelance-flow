import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import ClientForm from '../components/ClientForm';
import PageHeader from '@/components/common/PageHeader';
import BackLink from '@/components/common/BackLink';

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

import { INITIAL_CLIENT_FORM_VALUES } from '../clients.constants';

import {
  getFirstValidationError,
  hasValidationErrors,
  validateClientForm,
} from '../clientsValidation';

function ClientFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_CLIENT_FORM_VALUES,
  }));

  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedClient = useSelector(selectSelectedClient);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);

  useEffect(() => {
    dispatch(clearClientMessages());

    if (isEditMode) {
      dispatch(fetchClientById(id));
    } else {
      dispatch(clearSelectedClient());
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedClient) {
      setFormData({
        ...INITIAL_CLIENT_FORM_VALUES,

        name: selectedClient.name || '',
        email: selectedClient.email || '',
        phone: selectedClient.phone || '',
        company: selectedClient.company || '',
        address: selectedClient.address || '',
        status: selectedClient.status ?? INITIAL_CLIENT_FORM_VALUES.status,
      });
    }
  }, [isEditMode, selectedClient]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (formError) {
      setFormError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError('');

    const validationErrors = validateClientForm(formData);

    if (hasValidationErrors(validationErrors)) {
      setFormError(getFirstValidationError(validationErrors));

      return;
    }

    const clientData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      address: formData.address.trim(),
      status: formData.status,
    };

    try {
      if (isEditMode) {
        await dispatch(editClient({ id, clientData })).unwrap();
      } else {
        await dispatch(addClient(clientData)).unwrap();
      }

      navigate('/clients');
    } catch (error) {
      setFormError(
        typeof error === 'string' ? error : 'Unable to save the client.',
      );
    }
  }

  if (loading && isEditMode && !selectedClient) {
    return <Loading />;
  }

  if (error && isEditMode && !selectedClient) {
    return <ErrorMessage message={error} />;
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
