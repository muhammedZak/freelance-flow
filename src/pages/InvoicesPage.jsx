import {
  InvoiceFilters,
  InvoiceList,
  InvoiceSummaryCards,
  useInvoiceFilters,
  useInvoicesList,
} from '@features/invoices';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PageHeader from '../components/common/PageHeader';
import ActionLink from '../components/common/ActionLink';

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
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
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
