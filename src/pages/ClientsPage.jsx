import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const { clients, loading, error, successMessage } = useSelector(
    (state) => state.clients,
  );

  useEffect(() => {
    dispatch(fetchClients());

    return () => {
      dispatch(clearClientMessages());
    };
  }, [dispatch]);

  function updateSearchParams(key, value) {
    const newParams = new URLSearchParams(searchParams);

    const isDefaultValue = !value || value === 'all' || value === 'newest';

    if (isDefaultValue) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  }

  function clearFilters() {
    setSearchParams({});
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this client?',
    );

    if (confirmDelete) {
      dispatch(removeClient(String(id)));
    }
  }

  const filteredClients = clients
    .filter((client) => {
      const searchValue = searchText.toLowerCase();

      const matchesSearch =
        client.name.toLowerCase().includes(searchValue) ||
        client.email.toLowerCase().includes(searchValue) ||
        client.company.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'all' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((firstClient, secondClient) => {
      if (sortBy === 'name') {
        return firstClient.name.localeCompare(secondClient.name);
      }

      if (sortBy === 'oldest') {
        return (
          new Date(firstClient.createdAt) - new Date(secondClient.createdAt)
        );
      }

      return new Date(secondClient.createdAt) - new Date(firstClient.createdAt);
    });

  const hasActiveFilters =
    searchText || statusFilter !== 'all' || sortBy !== 'newest';

  if (loading && clients.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='workspace-page'>
      <div className='page-header'>
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

      <div className='mb-4 grid gap-3 md:grid-cols-3'>
        <input
          type='text'
          value={searchText}
          onChange={(event) => updateSearchParams('search', event.target.value)}
          className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Search name, email, or company'
        />

        <select
          value={statusFilter}
          onChange={(event) => updateSearchParams('status', event.target.value)}
          className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
          <option value='all'>All Status</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => updateSearchParams('sort', event.target.value)}
          className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
          <option value='newest'>Newest First</option>
          <option value='oldest'>Oldest First</option>
          <option value='name'>Name A-Z</option>
        </select>
      </div>

      <div className='mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500'>
          Showing {filteredClients.length} of {clients.length} clients
        </p>

        {hasActiveFilters && (
          <button
            type='button'
            onClick={clearFilters}
            className='self-start text-blue-600 sm:self-auto'>
            Clear Filters
          </button>
        )}
      </div>

      {filteredClients.length === 0 ? (
        <EmptyState
          message={
            clients.length === 0
              ? 'No clients have been added.'
              : 'No clients match the selected filters.'
          }
        />
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
                        type='button'
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
