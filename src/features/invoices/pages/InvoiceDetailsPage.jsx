import { Link } from 'react-router-dom';

import Loading from '@components/common/Loading';
import ErrorMessage from '@components/common/ErrorMessage';

import InvoiceCalculationCard from '../components/InvoiceCalculationCard';
import InvoiceInformationCard from '../components/InvoiceInformationCard';

import useInvoiceDetails from '../hooks/useInvoiceDetails';

function InvoiceDetailsPage() {
  const {
    selectedInvoice,
    clientName,
    projectTitle,
    canManageInvoices,
    accessDenied,
    initialLoading,
    operationLoading,
    blockingError,
    operationError,
    notFound,
    successMessage,
    handleStatusChange,
    handleDelete,
  } = useInvoiceDetails();

  if (initialLoading) {
    return <Loading />;
  }

  if (blockingError) {
    return <ErrorMessage message={blockingError} />;
  }

  if (notFound) {
    return <ErrorMessage message='Invoice not found' />;
  }

  if (!selectedInvoice) {
    return <ErrorMessage message='Invoice not found' />;
  }

  if (accessDenied) {
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
            <h1 className='text-2xl font-bold text-slate-900'>
              {selectedInvoice.invoiceNumber}
            </h1>

            <p className='text-slate-600'>Invoice for {projectTitle}</p>
          </div>

          {canManageInvoices && (
            <button
              type='button'
              onClick={handleDelete}
              disabled={operationLoading}
              className='rounded bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60'>
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

      {operationError && (
        <div className='mb-4'>
          <ErrorMessage message={operationError} />
        </div>
      )}

      <div className='grid gap-6 lg:grid-cols-2'>
        <InvoiceInformationCard
          invoice={selectedInvoice}
          clientName={clientName}
          projectTitle={projectTitle}
          canManageInvoices={canManageInvoices}
          loading={operationLoading}
          onStatusChange={handleStatusChange}
        />

        <InvoiceCalculationCard invoice={selectedInvoice} />
      </div>

      {operationLoading && (
        <p className='mt-4 text-sm text-slate-500'>Updating invoice...</p>
      )}
    </div>
  );
}

export default InvoiceDetailsPage;
