import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PageHeader from '../components/common/PageHeader';
import BackLink from '../components/common/BackLink';
import ActionLink from '../components/common/ActionLink';
import Button from '../components/common/Button';

import {
  clearClientMessages,
  clearSelectedClient,
  fetchClientById,
  removeClient,
} from '../features/clients/clientsSlice';

import { formatDate } from '../utils/formatDate';

function ClientDetailsPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedClient, loading, error } = useSelector(
    (state) => state.clients,
  );

  useEffect(() => {
    dispatch(clearClientMessages());
    dispatch(fetchClientById(id));

    return () => {
      dispatch(clearSelectedClient());
    };
  }, [dispatch, id]);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this client?',
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeClient(id)).unwrap();
      navigate('/clients');
    } catch (error) {
      console.log(error);
    }
  }

  if (loading && !selectedClient) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedClient) {
    return <ErrorMessage message='Client not found' />;
  }

  return (
    <div className='workspace-page'>
      <div className='mb-4'>
        <BackLink to='/clients'>Back to Clients</BackLink>
      </div>

      <PageHeader
        title={selectedClient.name}
        company={selectedClient.company}
        description='View the client information and manage this client.'>
        <ActionLink to={`/clients/${selectedClient.id}/edit`} variant='success'>
          Edit Client
        </ActionLink>

        <Button type='button' variant='danger' onClick={handleDelete}>
          Delete Client
        </Button>
      </PageHeader>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='mb-4 text-lg font-bold text-slate-900'>
            Contact Details
          </h2>

          <div className='space-y-3 text-sm'>
            <p>
              <span className='font-medium text-slate-700'>Email:</span>{' '}
              {selectedClient.email}
            </p>

            <p>
              <span className='font-medium text-slate-700'>Phone:</span>{' '}
              {selectedClient.phone}
            </p>

            <p>
              <span className='font-medium text-slate-700'>Address:</span>{' '}
              {selectedClient.address}
            </p>
          </div>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='mb-4 text-lg font-bold text-slate-900'>Client Info</h2>

          <div className='space-y-3 text-sm'>
            <p>
              <span className='font-medium text-slate-700'>Status:</span>{' '}
              <span
                className={
                  selectedClient.status === 'active'
                    ? 'rounded bg-green-100 px-2 py-1 text-xs text-green-700'
                    : 'rounded bg-slate-200 px-2 py-1 text-xs text-slate-700'
                }>
                {selectedClient.status}
              </span>
            </p>

            <p>
              <span className='font-medium text-slate-700'>Created At:</span>{' '}
              {formatDate(selectedClient.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetailsPage;
