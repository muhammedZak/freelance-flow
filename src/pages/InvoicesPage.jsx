import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import { fetchClients } from '../features/clients/clientsSlice';
import { fetchProjects } from '../features/projects/projectsSlice';

import {
  clearInvoiceMessages,
  fetchInvoices,
  removeInvoice,
} from '../features/invoices/invoicesSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

function InvoicesPage() {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const { user } = useSelector((state) => state.auth);

  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
    successMessage,
  } = useSelector((state) => state.invoices);

  const {
    clients,
    loading: clientsLoading,
    error: clientsError,
  } = useSelector((state) => state.clients);

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);

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

  function getClientName(clientId) {
    const client = clients.find(
      (client) => String(client.id) === String(clientId),
    );

    return client ? client.name : 'Unknown Client';
  }

  function getProjectTitle(projectId) {
    const project = projects.find(
      (project) => String(project.id) === String(projectId),
    );

    return project ? project.title : 'Unknown Project';
  }

  function getStatusClasses(status) {
    if (status === 'paid') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'overdue') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  }

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

  const filteredInvoices = visibleInvoices
    .filter((invoice) => {
      const searchValue = searchText.toLowerCase();

      const clientName = getClientName(invoice.clientId).toLowerCase();

      const projectTitle = getProjectTitle(invoice.projectId).toLowerCase();

      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchValue) ||
        clientName.includes(searchValue) ||
        projectTitle.includes(searchValue);

      const matchesStatus =
        statusFilter === 'all' || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((firstInvoice, secondInvoice) => {
      if (sortBy === 'due-date') {
        return new Date(firstInvoice.dueDate) - new Date(secondInvoice.dueDate);
      }

      if (sortBy === 'amount-high') {
        return Number(secondInvoice.total) - Number(firstInvoice.total);
      }

      if (sortBy === 'amount-low') {
        return Number(firstInvoice.total) - Number(secondInvoice.total);
      }

      return (
        new Date(secondInvoice.issueDate) - new Date(firstInvoice.issueDate)
      );
    });

  const hasActiveFilters =
    searchText || statusFilter !== 'all' || sortBy !== 'newest';

  const paidAmount = visibleInvoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((total, invoice) => total + Number(invoice.total), 0);

  const outstandingAmount = visibleInvoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((total, invoice) => total + Number(invoice.total), 0);

  const loading = invoicesLoading || clientsLoading || projectsLoading;
  const error = invoicesError || clientsError || projectsError;

  if (loading && invoices.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='workspace-page'>
      <div className='page-header'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Invoices</h1>

          <p className='text-slate-600'>
            {user?.role === 'client'
              ? 'View invoices for your assigned projects.'
              : 'Create and manage your freelance invoices.'}
          </p>
        </div>

        {canManageInvoices && (
          <Link
            to='/invoices/new'
            className='rounded bg-slate-900 px-4 py-2 text-center text-white'>
            Add Invoice
          </Link>
        )}
      </div>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      <div className='mb-6 grid gap-4 sm:grid-cols-3'>
        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Total Invoices</p>

          <p className='mt-2 text-2xl font-bold text-slate-900'>
            {visibleInvoices.length}
          </p>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Paid Amount</p>

          <p className='mt-2 text-2xl font-bold text-green-700'>
            {formatCurrency(paidAmount)}
          </p>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Outstanding Amount</p>

          <p className='mt-2 text-2xl font-bold text-red-700'>
            {formatCurrency(outstandingAmount)}
          </p>
        </div>
      </div>

      <div className='mb-6'>
        <div className='grid gap-3 md:grid-cols-3'>
          <input
            type='text'
            value={searchText}
            onChange={(event) =>
              updateSearchParams('search', event.target.value)
            }
            placeholder='Search invoice, client, or project'
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              updateSearchParams('status', event.target.value)
            }
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='all'>All Status</option>
            <option value='paid'>Paid</option>
            <option value='unpaid'>Unpaid</option>
            <option value='overdue'>Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => updateSearchParams('sort', event.target.value)}
            className='rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='newest'>Newest First</option>
            <option value='due-date'>Due Date</option>
            <option value='amount-high'>Amount High to Low</option>
            <option value='amount-low'>Amount Low to High</option>
          </select>
        </div>

        <div className='mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-slate-500'>
            Showing {filteredInvoices.length} of {visibleInvoices.length}{' '}
            invoices
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
      </div>

      {filteredInvoices.length === 0 ? (
        <EmptyState
          message={
            visibleInvoices.length === 0
              ? 'No invoices have been added.'
              : 'No invoices match the selected filters.'
          }
        />
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-bold text-slate-900'>
                    {invoice.invoiceNumber}
                  </h2>

                  <p className='text-sm text-slate-500'>
                    {getClientName(invoice.clientId)}
                  </p>
                </div>

                <span
                  className={`rounded px-2 py-1 text-xs capitalize ${getStatusClasses(
                    invoice.status,
                  )}`}>
                  {invoice.status}
                </span>
              </div>

              <p className='mb-4 text-sm text-slate-600'>
                {getProjectTitle(invoice.projectId)}
              </p>

              <p className='mb-4 text-2xl font-bold text-slate-900'>
                {formatCurrency(invoice.total)}
              </p>

              <div className='space-y-2 text-sm text-slate-600'>
                <p>
                  <span className='font-medium'>Issue Date:</span>{' '}
                  {formatDate(invoice.issueDate)}
                </p>

                <p>
                  <span className='font-medium'>Due Date:</span>{' '}
                  {formatDate(invoice.dueDate)}
                </p>
              </div>

              <div className='mt-5 flex gap-4 text-sm'>
                <Link to={`/invoices/${invoice.id}`} className='text-blue-600'>
                  View Details
                </Link>

                {canManageInvoices && (
                  <button
                    type='button'
                    onClick={() => handleDelete(invoice)}
                    className='text-red-600'>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <p className='text-sm text-slate-500'>Updating invoices...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default InvoicesPage;
