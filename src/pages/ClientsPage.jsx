import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import MessageAlert from '../components/common/MessageAlert';
import Button from '../components/common/Button';
import ActionLink from '../components/common/ActionLink';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/forms/SearchInput';
import FilterSelect from '../components/forms/FilterSelect';

import {
  clearClientMessages,
  fetchClients,
  removeClient,
} from '../features/clients/clientsSlice';

import { formatDate } from '../utils/formatDate';

const clientStatusOptions = [
  {
    value: 'all',
    label: 'All Statuses',
  },
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'inactive',
    label: 'Inactive',
  },
];

const clientSortOptions = [
  {
    value: 'newest',
    label: 'Newest First',
  },
  {
    value: 'oldest',
    label: 'Oldest First',
  },
  {
    value: 'name-asc',
    label: 'Name: A to Z',
  },
  {
    value: 'name-desc',
    label: 'Name: Z to A',
  },
];

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
      const searchValue = searchText.trim().toLowerCase();

      if (!searchValue) {
        return true;
      }

      return (
        client.name?.toLowerCase().includes(searchValue) ||
        client.email?.toLowerCase().includes(searchValue) ||
        client.company?.toLowerCase().includes(searchValue)
      );
    })
    .filter((client) => {
      if (statusFilter === 'all') {
        return true;
      }

      return client.status === statusFilter;
    })
    .sort((firstClient, secondClient) => {
      if (sortBy === 'name-asc') {
        return firstClient.name.localeCompare(secondClient.name);
      }

      if (sortBy === 'name-desc') {
        return secondClient.name.localeCompare(firstClient.name);
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
      <PageHeader
        title='Clients'
        description='Manage your freelance clients here.'>
        <ActionLink to='/clients/new'>Add Client</ActionLink>
      </PageHeader>

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

      <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='sm:col-span-2'>
          <SearchInput
            value={searchText}
            onChange={(event) =>
              updateSearchParams('search', event.target.value)
            }
            placeholder='Search clients by name, email or company'
            ariaLabel='Search clients'
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(event) => updateSearchParams('status', event.target.value)}
          options={clientStatusOptions}
          ariaLabel='Filter clients by status'
        />

        <FilterSelect
          value={sortBy}
          onChange={(event) => updateSearchParams('sort', event.target.value)}
          options={clientSortOptions}
          ariaLabel='Sort clients'
        />
      </div>

      <div className='mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500 dark:text-slate-400'>
          Showing {filteredClients.length} of {clients.length} clients
        </p>

        {hasActiveFilters && (
          <Button
            variant='text'
            size='small'
            onClick={clearFilters}
            className='self-start sm:self-auto'>
            Clear Filters
          </Button>
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
                    <div className='flex flex-wrap gap-1'>
                      <ActionLink
                        to={`/clients/${client.id}`}
                        variant='text'
                        size='small'>
                        View
                      </ActionLink>

                      <ActionLink
                        to={`/clients/${client.id}/edit`}
                        variant='success'
                        size='small'>
                        Edit
                      </ActionLink>

                      <Button
                        variant='danger'
                        size='small'
                        onClick={() => handleDelete(client.id)}>
                        Delete
                      </Button>
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
