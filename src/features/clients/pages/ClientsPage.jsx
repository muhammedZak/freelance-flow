import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ActionLink from '@components/common/ActionLink';
import EmptyState from '@components/common/EmptyState';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import MessageAlert from '@components/common/MessageAlert';
import PageHeader from '@components/common/PageHeader';

import ClientFilters from '../components/ClientFilters';
import ClientsTable from '../components/ClientsTable';

import {
  clearClientMessages,
  fetchClients,
  removeClient,
} from '../clientsSlice';

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

  const hasActiveFilters = Boolean(
    searchText || statusFilter !== 'all' || sortBy !== 'newest',
  );

  const emptyMessage =
    clients.length === 0
      ? 'No clients have been added.'
      : 'No clients match the selected filters.';

  if (loading && clients.length === 0) {
    return <Loading message='Loading clients.' />;
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

      <ClientFilters
        searchText={searchText}
        statusFilter={statusFilter}
        sortBy={sortBy}
        filteredCount={filteredClients.length}
        totalCount={clients.length}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={(value) => updateSearchParams('search', value)}
        onStatusChange={(value) => updateSearchParams('status', value)}
        onSortChange={(value) => updateSearchParams('sort', value)}
        onClearFilters={clearFilters}
      />

      {filteredClients.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ClientsTable
          clients={filteredClients}
          loading={loading}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ClientsPage;
