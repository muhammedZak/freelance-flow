import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import Loading from '../components/common/Loading';
import PageHeader from '../components/common/PageHeader';
import ActionLink from '../components/common/ActionLink';
import SearchInput from '../components/forms/SearchInput';
import FilterSelect from '../components/forms/FilterSelect';

import PaymentForm from '../features/payments/PaymentForm';

import { fetchClients } from '../features/clients/clientsSlice';
import { fetchInvoices } from '../features/invoices/invoicesSlice';
import {
  addPayment,
  changePaymentStatus,
  clearPaymentMessages,
  fetchPayments,
  removePayment,
} from '../features/payments/paymentsSlice';
import { fetchProjects } from '../features/projects/projectsSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/common/Button';

const paymentStatusOptions = [
  {
    value: 'all',
    label: 'All Statuses',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'failed',
    label: 'Failed',
  },
];

const paymentMethodOptions = [
  {
    value: 'all',
    label: 'All Methods',
  },
  {
    value: 'cash',
    label: 'Cash',
  },
  {
    value: 'bank transfer',
    label: 'Bank Transfer',
  },
  {
    value: 'upi',
    label: 'UPI',
  },
  {
    value: 'card',
    label: 'Card',
  },
];

const paymentSortOptions = [
  {
    value: 'newest',
    label: 'Newest First',
  },
  {
    value: 'oldest',
    label: 'Oldest First',
  },
  {
    value: 'amount-high',
    label: 'Amount: High to Low',
  },
  {
    value: 'amount-low',
    label: 'Amount: Low to High',
  },
];

function PaymentsPage() {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const methodFilter = searchParams.get('method') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const {
    payments,
    loading: paymentLoading,
    error: paymentError,
    successMessage,
  } = useSelector((state) => state.payments);

  const {
    invoices,
    loading: invoiceLoading,
    error: invoiceError,
  } = useSelector((state) => state.invoices);

  const {
    clients,
    loading: clientLoading,
    error: clientError,
  } = useSelector((state) => state.clients);

  const {
    projects,
    loading: projectLoading,
    error: projectError,
  } = useSelector((state) => state.projects);

  const canManagePayments =
    user?.role === 'freelancer' || user?.role === 'admin';

  useEffect(() => {
    dispatch(clearPaymentMessages());
    dispatch(fetchPayments());
    dispatch(fetchInvoices());
    dispatch(fetchClients());
    dispatch(fetchProjects());

    return () => {
      dispatch(clearPaymentMessages());
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

  const completedPayments = payments.filter(
    (payment) => payment.status === 'completed',
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === 'pending',
  );

  const totalReceivedAmount = completedPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const pendingPaymentAmount = pendingPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const pageLoading =
    paymentLoading || invoiceLoading || clientLoading || projectLoading;

  const pageError = paymentError || invoiceError || clientError || projectError;

  function findInvoice(invoiceId) {
    return invoices.find((invoice) => String(invoice.id) === String(invoiceId));
  }

  function findClient(clientId) {
    return clients.find((client) => String(client.id) === String(clientId));
  }

  function findProject(projectId) {
    return projects.find((project) => String(project.id) === String(projectId));
  }

  const filteredPayments = payments
    .filter((payment) => {
      const searchValue = searchText.toLowerCase();

      const invoice = findInvoice(payment.invoiceId);

      const client = invoice ? findClient(invoice.clientId) : null;

      const project = invoice ? findProject(invoice.projectId) : null;

      const invoiceNumber = invoice?.invoiceNumber?.toLowerCase() || '';

      const clientName = client?.name?.toLowerCase() || '';

      const projectTitle = project?.title?.toLowerCase() || '';

      const matchesSearch =
        invoiceNumber.includes(searchValue) ||
        clientName.includes(searchValue) ||
        projectTitle.includes(searchValue);

      const matchesStatus =
        statusFilter === 'all' || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === 'all' || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    })
    .sort((firstPayment, secondPayment) => {
      if (sortBy === 'oldest') {
        return (
          new Date(firstPayment.paymentDate) -
          new Date(secondPayment.paymentDate)
        );
      }

      if (sortBy === 'amount-high') {
        return Number(secondPayment.amount) - Number(firstPayment.amount);
      }

      if (sortBy === 'amount-low') {
        return Number(firstPayment.amount) - Number(secondPayment.amount);
      }

      return (
        new Date(secondPayment.paymentDate) - new Date(firstPayment.paymentDate)
      );
    });

  const hasActiveFilters =
    searchText ||
    statusFilter !== 'all' ||
    methodFilter !== 'all' ||
    sortBy !== 'newest';

  function openPaymentForm() {
    dispatch(clearPaymentMessages());
    setShowPaymentForm(true);
  }

  function closePaymentForm() {
    setShowPaymentForm(false);
  }

  async function handleAddPayment(formData) {
    try {
      await dispatch(addPayment(formData)).unwrap();

      closePaymentForm();

      dispatch(fetchInvoices());
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStatusChange(payment, status) {
    try {
      await dispatch(
        changePaymentStatus({
          id: String(payment.id),
          status,
        }),
      ).unwrap();

      dispatch(fetchInvoices());
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeletePayment(payment) {
    const invoice = findInvoice(payment.invoiceId);

    const invoiceNumber = invoice?.invoiceNumber || 'this invoice';

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the payment for ${invoiceNumber}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removePayment(String(payment.id))).unwrap();

      dispatch(fetchInvoices());
    } catch (error) {
      console.log(error);
    }
  }

  function getStatusClasses(status) {
    if (status === 'completed') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'failed') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  }

  if (!canManagePayments) {
    return (
      <ErrorMessage message='You do not have access to payment management.' />
    );
  }

  if (pageLoading && payments.length === 0) {
    return <Loading />;
  }

  return (
    <div className='workspace-page'>
      <PageHeader
        title='Payments'
        description='Record invoice payments and monitor payment status.'>
        <Button onClick={openPaymentForm}>Add Payment</Button>
      </PageHeader>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      {pageError && (
        <div className='mb-4'>
          <ErrorMessage message={pageError} />
        </div>
      )}

      {showPaymentForm && (
        <PaymentForm
          invoices={invoices}
          payments={payments}
          loading={paymentLoading}
          onSubmit={handleAddPayment}
          onCancel={closePaymentForm}
        />
      )}

      <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Total Received</p>

          <p className='mt-2 text-2xl font-bold text-green-700'>
            {formatCurrency(totalReceivedAmount)}
          </p>

          <p className='mt-1 text-xs text-slate-500'>Completed payments only</p>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Pending Amount</p>

          <p className='mt-2 text-2xl font-bold text-yellow-700'>
            {formatCurrency(pendingPaymentAmount)}
          </p>

          <p className='mt-1 text-xs text-slate-500'>
            Pending payment records only
          </p>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1'>
          <p className='text-sm text-slate-500'>Payment Records</p>

          <p className='mt-2 text-2xl font-bold text-slate-900'>
            {payments.length}
          </p>

          <p className='mt-1 text-xs text-slate-500'>All payment statuses</p>
        </div>
      </div>

      <div className='mb-6'>
        <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 lg:grid-cols-2'>
          <SearchInput
            value={searchText}
            onChange={(event) =>
              updateSearchParams('search', event.target.value)
            }
            placeholder='Search invoice number or payment method'
            ariaLabel='Search payments'
          />

          <FilterSelect
            value={statusFilter}
            onChange={(event) =>
              updateSearchParams('status', event.target.value)
            }
            options={paymentStatusOptions}
            ariaLabel='Filter payments by status'
          />

          <FilterSelect
            value={methodFilter}
            onChange={(event) =>
              updateSearchParams('method', event.target.value)
            }
            options={paymentMethodOptions}
            ariaLabel='Filter payments by method'
          />

          <FilterSelect
            value={sortBy}
            onChange={(event) => updateSearchParams('sort', event.target.value)}
            options={paymentSortOptions}
            ariaLabel='Sort payments'
          />
        </div>

        <div className='mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-slate-500'>
            Showing {filteredPayments.length} of {payments.length} payments
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

      <div className='mb-4'>
        <h2 className='text-xl font-bold text-slate-900'>Payment List</h2>

        <p className='text-sm text-slate-500'>
          Payments are ordered by payment date.
        </p>
      </div>

      {filteredPayments.length === 0 ? (
        <EmptyState
          message={
            payments.length === 0
              ? 'No payment records have been added.'
              : 'No payments match the selected filters.'
          }
        />
      ) : (
        <div className='space-y-4'>
          {filteredPayments.map((payment) => {
            const invoice = findInvoice(payment.invoiceId);

            const client = invoice ? findClient(invoice.clientId) : null;

            const project = invoice ? findProject(invoice.projectId) : null;

            return (
              <div
                key={payment.id}
                className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
                <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='flex-1'>
                    <div className='mb-3 flex flex-wrap items-center gap-2'>
                      <h3 className='text-lg font-bold text-slate-900'>
                        {invoice?.invoiceNumber || 'Unknown Invoice'}
                      </h3>

                      <span
                        className={`rounded px-2 py-1 text-xs capitalize ${getStatusClasses(
                          payment.status,
                        )}`}>
                        {payment.status}
                      </span>
                    </div>

                    <div className='grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3'>
                      <div>
                        <p className='text-slate-500'>Client</p>
                        <p className='font-medium text-slate-800'>
                          {client?.name || 'Unknown Client'}
                        </p>
                      </div>

                      <div>
                        <p className='text-slate-500'>Project</p>
                        <p className='font-medium text-slate-800'>
                          {project?.title || 'Unknown Project'}
                        </p>
                      </div>

                      <div>
                        <p className='text-slate-500'>Amount</p>
                        <p className='font-medium text-slate-800'>
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>

                      <div>
                        <p className='text-slate-500'>Payment Method</p>
                        <p className='font-medium capitalize text-slate-800'>
                          {payment.method}
                        </p>
                      </div>

                      <div>
                        <p className='text-slate-500'>Payment Date</p>
                        <p className='font-medium text-slate-800'>
                          {formatDate(payment.paymentDate)}
                        </p>
                      </div>

                      <div>
                        <p className='text-slate-500'>Invoice Total</p>
                        <p className='font-medium text-slate-800'>
                          {invoice
                            ? formatCurrency(invoice.total)
                            : 'Not available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 sm:flex-row lg:w-48 lg:flex-col'>
                    <select
                      value={payment.status}
                      disabled={paymentLoading}
                      onChange={(event) =>
                        handleStatusChange(payment, event.target.value)
                      }
                      className='rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900'>
                      <option value='pending'>Pending</option>
                      <option value='completed'>Completed</option>
                      <option value='failed'>Failed</option>
                    </select>

                    <button
                      type='button'
                      disabled={paymentLoading}
                      onClick={() => handleDeletePayment(payment)}
                      className='rounded bg-red-600 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60'>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
