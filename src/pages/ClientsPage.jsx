import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import MessageAlert from '../components/common/MessageAlert';

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

  function handleRetry() {
    dispatch(clearClientMessages());
    dispatch(fetchClients());
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
    return <Loading message='Loading clients...' />;
  }

  if (error && clients.length === 0) {
    return (
      <ErrorMessage
        title='Unable to load clients'
        message={error}
        onRetry={handleRetry}
        retryText='Reload Clients'
      />
    );
  }

  return (
    <div className='workspace-page'>
      <div className='page-header'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Clients
          </h1>

          <p className='text-slate-600 dark:text-slate-400'>
            Manage your freelance clients here.
          </p>
        </div>

        <Link
          to='/clients/new'
          className='rounded-xl bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500'>
          Add Client
        </Link>
      </div>

      {successMessage && (
        <div className='mb-4'>
          <MessageAlert type='success' message={successMessage} />
        </div>
      )}

      {error && clients.length > 0 && (
        <div className='mb-4'>
          <MessageAlert type='error' message={error} />
        </div>
      )}

      <div className='mb-4 grid gap-3 md:grid-cols-3'>
        <input
          type='text'
          value={searchText}
          onChange={(event) => updateSearchParams('search', event.target.value)}
          className='rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500'
          placeholder='Search name, email, or company'
        />

        <select
          value={statusFilter}
          onChange={(event) => updateSearchParams('status', event.target.value)}
          className='rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'>
          <option value='all'>All Status</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => updateSearchParams('sort', event.target.value)}
          className='rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'>
          <option value='newest'>Newest First</option>
          <option value='oldest'>Oldest First</option>
          <option value='name'>Name A-Z</option>
        </select>
      </div>

      <div className='mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500 dark:text-slate-400'>
          Showing {filteredClients.length} of {clients.length} clients
        </p>

        {hasActiveFilters && (
          <button
            type='button'
            onClick={clearFilters}
            className='self-start font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:self-auto'>
            Clear Filters
          </button>
        )}
      </div>

      {filteredClients.length === 0 ? (
        clients.length === 0 ? (
          <EmptyState
            message='No clients have been added.'
            actionText='Add Client'
            actionTo='/clients/new'
          />
        ) : (
          <EmptyState message='No clients match the selected filters.' />
        )
      ) : (
        <div className='overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70'>
                <th className='p-3 text-slate-700 dark:text-slate-300'>Name</th>

                <th className='p-3 text-slate-700 dark:text-slate-300'>
                  Company
                </th>

                <th className='p-3 text-slate-700 dark:text-slate-300'>
                  Email
                </th>

                <th className='p-3 text-slate-700 dark:text-slate-300'>
                  Status
                </th>

                <th className='p-3 text-slate-700 dark:text-slate-300'>
                  Created
                </th>

                <th className='p-3 text-slate-700 dark:text-slate-300'>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className='border-b border-slate-200 last:border-b-0 dark:border-slate-800'>
                  <td className='p-3 font-medium text-slate-900 dark:text-white'>
                    {client.name}
                  </td>

                  <td className='p-3 text-slate-600 dark:text-slate-400'>
                    {client.company}
                  </td>

                  <td className='p-3 text-slate-600 dark:text-slate-400'>
                    {client.email}
                  </td>

                  <td className='p-3'>
                    <span
                      className={
                        client.status === 'active'
                          ? 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-300'
                          : 'rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }>
                      {client.status}
                    </span>
                  </td>

                  <td className='p-3 text-slate-600 dark:text-slate-400'>
                    {formatDate(client.createdAt)}
                  </td>

                  <td className='p-3'>
                    <div className='flex flex-wrap gap-3'>
                      <Link
                        to={`/clients/${client.id}`}
                        className='font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
                        View
                      </Link>

                      <Link
                        to={`/clients/${client.id}/edit`}
                        className='font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'>
                        Edit
                      </Link>

                      <button
                        type='button'
                        onClick={() => handleDelete(client.id)}
                        className='font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <p
              role='status'
              className='border-t border-slate-200 p-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400'>
              Updating clients...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
