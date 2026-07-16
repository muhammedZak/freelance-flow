import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import ClientForm from '../features/clients/ClientForm';

import {
  addClient,
  clearClientMessages,
  clearSelectedClient,
  editClient,
  fetchClientById,
} from '../features/clients/clientsSlice';

function ClientFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'active',
  });

  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedClient, loading, error } = useSelector(
    (state) => state.clients,
  );

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
        name: selectedClient.name || '',
        email: selectedClient.email || '',
        phone: selectedClient.phone || '',
        company: selectedClient.company || '',
        address: selectedClient.address || '',
        status: selectedClient.status || 'active',
      });
    }
  }, [isEditMode, selectedClient]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validateForm() {
    if (!formData.name.trim()) {
      return 'Client name is required';
    }

    if (!formData.email.trim()) {
      return 'Email is required';
    }

    if (!formData.email.includes('@')) {
      return 'Enter a valid email';
    }

    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }

    if (!formData.company.trim()) {
      return 'Company name is required';
    }

    if (!formData.address.trim()) {
      return 'Address is required';
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

    const clientData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      address: formData.address,
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
      setFormError(error);
    }
  }

  if (loading && isEditMode && !selectedClient) {
    return <Loading />;
  }

  if (error && isEditMode && !selectedClient) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className='mb-6'>
        <Link to='/clients' className='text-sm text-blue-600'>
          ← Back to Clients
        </Link>

        <h1 className='mt-2 text-2xl font-bold text-slate-900'>
          {isEditMode ? 'Edit Client' : 'Add Client'}
        </h1>

        <p className='text-slate-600'>
          {isEditMode
            ? 'Update the selected client details.'
            : 'Create a new client record.'}
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className='max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
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
