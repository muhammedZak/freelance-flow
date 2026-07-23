import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import SectionCard from '../components/common/SectionCard';

import { fetchClients } from '../features/clients/clientsSlice';
import { fetchProjects } from '../features/projects/projectsSlice';

import {
  clearInvoiceMessages,
  clearSelectedInvoice,
  editInvoice,
  fetchInvoiceById,
  removeInvoice,
} from '../features/invoices/invoicesSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

function InvoiceDetailsPage() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { clients } = useSelector((state) => state.clients);
  const { projects } = useSelector((state) => state.projects);

  const { selectedInvoice, loading, error, successMessage } = useSelector(
    (state) => state.invoices,
  );

  const canManageInvoices =
    user?.role === 'freelancer' || user?.role === 'admin';

  useEffect(() => {
    dispatch(clearInvoiceMessages());
    dispatch(fetchInvoiceById(id));
    dispatch(fetchClients());
    dispatch(fetchProjects());

    return () => {
      dispatch(clearInvoiceMessages());
      dispatch(clearSelectedInvoice());
    };
  }, [dispatch, id]);

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

  async function handleStatusChange(event) {
    const newStatus = event.target.value;

    try {
      await dispatch(
        editInvoice({
          id: String(selectedInvoice.id),
          invoiceData: {
            status: newStatus,
          },
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedInvoice.invoiceNumber}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeInvoice(String(selectedInvoice.id))).unwrap();
      navigate('/invoices');
    } catch (error) {
      console.log(error);
    }
  }

  if (loading && !selectedInvoice) {
    return <Loading />;
  }

  if (error && !selectedInvoice) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedInvoice) {
    return <ErrorMessage message='Invoice not found' />;
  }

  const assignedProjectIds =
    user?.assignedProjectIds?.map((projectId) => String(projectId)) || [];

  const clientHasAccess =
    user?.role !== 'client' ||
    assignedProjectIds.includes(String(selectedInvoice.projectId));

  if (!clientHasAccess) {
    return <ErrorMessage message='You do not have access to this invoice.' />;
  }

  return (
    <div className='workspace-page'>
      <div className='page-header'>
        <Link to='/invoices' className='text-sm text-blue-600'>
          ← Back to Invoices
        </Link>

        <div className='mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-2xl font-bold text-slate-900'>
                {selectedInvoice.invoiceNumber}
              </h1>

              <span
                className={`rounded px-2 py-1 text-xs capitalize ${getStatusClasses(
                  selectedInvoice.status,
                )}`}>
                {selectedInvoice.status}
              </span>
            </div>

            <p className='text-slate-600'>
              Invoice for {getProjectTitle(selectedInvoice.projectId)}
            </p>
          </div>

          {canManageInvoices && (
            <button
              type='button'
              onClick={handleDelete}
              className='rounded bg-red-600 px-4 py-2 text-white'>
              Delete Invoice
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <p className='mb-4 rounded bg-green-100 p-3 text-sm text-green-700'>
          {successMessage}
        </p>
      )}

      {error && (
        <div className='mb-4'>
          <ErrorMessage message={error} />
        </div>
      )}

      <div className='grid gap-6 lg:grid-cols-2'>
        <SectionCard title='Invoice Information'>
          <div className='space-y-4 text-sm'>
            <div>
              <p className='text-slate-500'>Client</p>
              <p className='font-medium text-slate-900'>
                {getClientName(selectedInvoice.clientId)}
              </p>
            </div>

            <div>
              <p className='text-slate-500'>Project</p>
              <p className='font-medium text-slate-900'>
                {getProjectTitle(selectedInvoice.projectId)}
              </p>
            </div>

            <div>
              <p className='text-slate-500'>Issue Date</p>
              <p className='font-medium text-slate-900'>
                {formatDate(selectedInvoice.issueDate)}
              </p>
            </div>

            <div>
              <p className='text-slate-500'>Due Date</p>
              <p className='font-medium text-slate-900'>
                {formatDate(selectedInvoice.dueDate)}
              </p>
            </div>

            {canManageInvoices && (
              <div>
                <label
                  htmlFor='invoiceStatus'
                  className='mb-1 block text-slate-500'>
                  Update Status
                </label>

                <select
                  id='invoiceStatus'
                  value={selectedInvoice.status}
                  onChange={handleStatusChange}
                  disabled={loading}
                  className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 disabled:opacity-60'>
                  <option value='unpaid'>Unpaid</option>
                  <option value='paid'>Paid</option>
                  <option value='overdue'>Overdue</option>
                </select>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title='Invoice Calculation'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
              <span className='text-slate-600'>Hours Worked</span>

              <span className='font-medium text-slate-900'>
                {selectedInvoice.hoursWorked}
              </span>
            </div>

            <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
              <span className='text-slate-600'>Hourly Rate</span>

              <span className='font-medium text-slate-900'>
                {formatCurrency(selectedInvoice.hourlyRate)}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-lg font-bold text-slate-900'>Total</span>

              <span className='text-2xl font-bold text-slate-900'>
                {formatCurrency(selectedInvoice.total)}
              </span>
            </div>

            <p className='rounded bg-slate-100 p-3 text-sm text-slate-600'>
              {selectedInvoice.hoursWorked} hours ×{' '}
              {formatCurrency(selectedInvoice.hourlyRate)} ={' '}
              {formatCurrency(selectedInvoice.total)}
            </p>
          </div>
        </SectionCard>
      </div>

      {loading && selectedInvoice && (
        <p className='mt-4 text-sm text-slate-500'>Updating invoice...</p>
      )}
    </div>
  );
}

export default InvoiceDetailsPage;
