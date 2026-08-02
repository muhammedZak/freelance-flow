import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActionLink from '@components/common/ActionLink';
import EmptyState from '@components/common/EmptyState';
import ErrorMessage from '@components/common/ErrorMessage';
import Loading from '@components/common/Loading';
import MessageAlert from '@components/common/MessageAlert';
import PageHeader from '@components/common/PageHeader';

import ClientFilters from '../components/ClientFilters';
import ClientsTable from '../components/ClientsTable';

import useClientFilters from '../hooks/useClientFilters';

import {
  selectAllClients,
  selectClientsError,
  selectClientsLoading,
  selectClientsSuccessMessage,
} from '../clientsSelectors';

import {
  clearClientMessages,
  fetchClients,
  removeClient,
} from '../clientsSlice';

function ClientsPage() {
  const dispatch = useDispatch();

  const clients = useSelector(selectAllClients);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);
  const successMessage = useSelector(selectClientsSuccessMessage);
  console.log(clients);
  const {
    searchText,
    statusFilter,
    sortBy,

    filteredClients,
    filteredCount,
    totalCount,

    hasActiveFilters,
    emptyMessage,

    updateSearchText,
    updateStatusFilter,
    updateSortBy,
    clearFilters,
  } = useClientFilters(clients);

  useEffect(() => {
    dispatch(fetchClients());

    return () => {
      dispatch(clearClientMessages());
    };
  }, [dispatch]);

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
        filteredCount={filteredCount}
        totalCount={totalCount}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={updateSearchText}
        onStatusChange={updateStatusFilter}
        onSortChange={updateSortBy}
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
