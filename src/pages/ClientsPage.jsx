import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import {
  clearClientMessages,
  fetchClients,
  removeClient,
} from '../features/clients/clientsSlice';

import { formatDate } from '../utils/formatDate';

function ClientsPage() {
  const [searchText, setSearchText] = useState('');

  const dispatch = useDispatch();

  const { clients, loading, error, successMessage } = useSelector(
    (state) => state.clients,
  );

  useEffect(() => {
    dispatch(fetchClients());

    return () => {
      dispatch(clearClientMessages());
    };
  }, [dispatch]);

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this client?',
    );

    if (confirmDelete) {
      dispatch(removeClient(id));
    }
  }

  const filteredClients = clients.filter((client) => {
    const searchValue = searchText.toLowerCase();

    return (
      client.name.toLowerCase().includes(searchValue) ||
      client.email.toLowerCase().includes(searchValue) ||
      client.company.toLowerCase().includes(searchValue)
    );
  });

  if (loading && clients.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Clients</h1>
          <p className='text-slate-600'>Manage your freelance clients here.</p>
        </div>

        <Link
          to='/clients/new'
          className='rounded bg-slate-900 px-4 py-2 text-center text-white'>
          Add Client
        </Link>
      </div>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      <div className='mb-4'>
        <input
          type='text'
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Search by name, email, or company'
        />
      </div>

      {filteredClients.length === 0 ? (
        <EmptyState message='No clients found.' />
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse rounded bg-white text-left text-sm'>
            <thead>
              <tr className='border-b bg-slate-100'>
                <th className='p-3'>Name</th>
                <th className='p-3'>Company</th>
                <th className='p-3'>Email</th>
                <th className='p-3'>Status</th>
                <th className='p-3'>Created</th>
                <th className='p-3'>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className='border-b'>
                  <td className='p-3 font-medium text-slate-900'>
                    {client.name}
                  </td>
                  <td className='p-3'>{client.company}</td>
                  <td className='p-3'>{client.email}</td>
                  <td className='p-3'>
                    <span
                      className={
                        client.status === 'active'
                          ? 'rounded bg-green-100 px-2 py-1 text-xs text-green-700'
                          : 'rounded bg-slate-200 px-2 py-1 text-xs text-slate-700'
                      }>
                      {client.status}
                    </span>
                  </td>
                  <td className='p-3'>{formatDate(client.createdAt)}</td>
                  <td className='p-3'>
                    <div className='flex gap-2'>
                      <Link
                        to={`/clients/${client.id}`}
                        className='text-blue-600'>
                        View
                      </Link>

                      <Link
                        to={`/clients/${client.id}/edit`}
                        className='text-green-600'>
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(client.id)}
                        className='text-red-600'>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <p className='mt-3 text-sm text-slate-500'>Updating clients...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
