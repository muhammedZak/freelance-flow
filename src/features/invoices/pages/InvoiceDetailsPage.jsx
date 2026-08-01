import Loading from '@components/common/Loading';
import ErrorMessage from '@components/common/ErrorMessage';
import MessageAlert from '@components/common/MessageAlert';
import PageHeader from '@components/common/PageHeader';
import BackLink from '@components/common/BackLink';
import Button from '@components/common/Button';

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
      <div className='mb-3'>
        <BackLink to='/invoices'>Back to Invoices</BackLink>
      </div>

      <PageHeader
        title={selectedInvoice.invoiceNumber}
        description={`Invoice for ${projectTitle}`}>
        {canManageInvoices && (
          <Button
            type='button'
            variant='danger'
            onClick={handleDelete}
            disabled={operationLoading}>
            Delete Invoice
          </Button>
        )}
      </PageHeader>

      {successMessage && (
        <div className='mb-4'>
          <MessageAlert type='success' message={successMessage} />
        </div>
      )}

      {operationError && (
        <div className='mb-4'>
          <ErrorMessage message={operationError} />
        </div>
      )}

      {operationLoading && (
        <div className='mb-4'>
          <MessageAlert
            type='info'
            title='Updating invoice'
            message='Please wait while the invoice changes are being saved.'
          />
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
    </div>
  );
}

export default InvoiceDetailsPage;
