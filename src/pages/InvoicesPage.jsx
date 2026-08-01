import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PageHeader from '../components/common/PageHeader';
import ActionLink from '../components/common/ActionLink';

import {
  fetchClients,
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
} from '@features/clients';

import {
  fetchProjects,
  selectAllProjects,
  selectIsProjectsListLoading,
  selectProjectsListError,
} from '@features/projects';

import {
  clearInvoiceMessages,
  fetchInvoices,
  removeInvoice,
  INVOICE_STATUS,
  selectAllInvoices,
  selectInvoicesSuccessMessage,
  selectInvoicesListError,
  selectIsInvoicesListLoading,
  useInvoiceFilters,
  InvoiceSummaryCards,
  InvoiceFilters,
  InvoiceList,
} from '@features/invoices';

function InvoicesPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const invoices = useSelector(selectAllInvoices);
  const invoicesLoading = useSelector(selectIsInvoicesListLoading);
  const invoicesError = useSelector(selectInvoicesListError);
  const successMessage = useSelector(selectInvoicesSuccessMessage);

  const clients = useSelector(selectAllClients);
  const clientsLoading = useSelector(selectClientsLoading);
  const clientsError = useSelector(selectClientsError);

  const projects = useSelector(selectAllProjects);
  const projectsLoading = useSelector(selectIsProjectsListLoading);
  const projectsError = useSelector(selectProjectsListError);

  const canManageInvoices =
    user?.role === 'freelancer' || user?.role === 'admin';

  useEffect(() => {
    dispatch(clearInvoiceMessages());
    dispatch(fetchInvoices());
    dispatch(fetchClients());
    dispatch(fetchProjects());

    return () => {
      dispatch(clearInvoiceMessages());
    };
  }, [dispatch]);

  async function handleDelete(invoice) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${invoice.invoiceNumber}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeInvoice(String(invoice.id))).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  const assignedProjectIds =
    user?.assignedProjectIds?.map((projectId) => String(projectId)) || [];

  const visibleInvoices =
    user?.role === 'client'
      ? invoices.filter((invoice) =>
          assignedProjectIds.includes(String(invoice.projectId)),
        )
      : invoices;

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

  const paidAmount = visibleInvoices
    .filter((invoice) => invoice.status === INVOICE_STATUS.PAID)
    .reduce((total, invoice) => total + Number(invoice.total), 0);

  const outstandingAmount = visibleInvoices
    .filter((invoice) => invoice.status !== INVOICE_STATUS.PAID)
    .reduce((total, invoice) => total + Number(invoice.total), 0);

  const loading = invoicesLoading || clientsLoading || projectsLoading;

  const error = invoicesError || clientsError || projectsError;

  if (loading && invoices.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const pageDescription =
    user?.role === 'client'
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
