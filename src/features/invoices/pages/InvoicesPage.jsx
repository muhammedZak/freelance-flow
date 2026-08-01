import Loading from '@components/common/Loading';
import ErrorMessage from '@components/common/ErrorMessage';
import MessageAlert from '@components/common/MessageAlert';
import PageHeader from '@components/common/PageHeader';
import ActionLink from '@components/common/ActionLink';

import InvoiceFilters from '../components/InvoiceFilters';
import InvoiceList from '../components/InvoiceList';
import InvoiceSummaryCards from '../components/InvoiceSummaryCards';

import useInvoiceFilters from '../hooks/useInvoiceFilters';
import useInvoicesList from '../hooks/useInvoicesList';

function InvoicesPage() {
  const {
    clients,
    projects,
    visibleInvoices,
    isClient,
    canManageInvoices,
    paidAmount,
    outstandingAmount,
    loading,
    initialLoading,
    error,
    successMessage,
    handleDelete,
  } = useInvoicesList();

  const {
    searchText,
    statusFilter,
    sortBy,
    filteredInvoices,
    filteredCount,
    totalCount,
    hasActiveFilters,
    emptyMessage,
    getClientName,
    getProjectTitle,
    updateSearchText,
    updateStatusFilter,
    updateSortBy,
    clearFilters,
  } = useInvoiceFilters(visibleInvoices, clients, projects);

  if (initialLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const pageDescription = isClient
    ? 'View invoices for your assigned projects.'
    : 'Create and manage your freelance invoices.';

  return (
    <div className='workspace-page'>
      <PageHeader title='Invoices' description={pageDescription}>
        {canManageInvoices && (
          <ActionLink to='/invoices/new'>Add Invoice</ActionLink>
        )}
      </PageHeader>

      {successMessage && (
        <div className='mb-4'>
          <MessageAlert type='success' message={successMessage} />
        </div>
      )}

      <InvoiceSummaryCards
        totalInvoices={visibleInvoices.length}
        paidAmount={paidAmount}
        outstandingAmount={outstandingAmount}
      />

      <InvoiceFilters
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

      <InvoiceList
        invoices={filteredInvoices}
        emptyMessage={emptyMessage}
        loading={loading}
        canManageInvoices={canManageInvoices}
        getClientName={getClientName}
        getProjectTitle={getProjectTitle}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default InvoicesPage;
