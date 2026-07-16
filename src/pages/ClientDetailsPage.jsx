import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

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
    <div>
      <div className='mb-6'>
        <Link to='/clients' className='text-sm text-blue-600'>
          ← Back to Clients
        </Link>

        <div className='mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900'>
              {selectedClient.name}
            </h1>
            <p className='text-slate-600'>{selectedClient.company}</p>
          </div>

          <div className='flex gap-2'>
            <Link
              to={`/clients/${selectedClient.id}/edit`}
              className='rounded bg-green-600 px-4 py-2 text-white'>
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className='rounded bg-red-600 px-4 py-2 text-white'>
              Delete
            </button>
          </div>
        </div>
      </div>

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
