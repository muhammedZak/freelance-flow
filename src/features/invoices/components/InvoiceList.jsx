import EmptyState from '@components/common/EmptyState';
import Loading from '@components/common/Loading';

import InvoiceCard from './InvoiceCard';

function InvoiceList({
  invoices,
  emptyMessage,
  loading,
  canManageInvoices,
  getClientName,
  getProjectTitle,
  onDelete,
}) {
  if (invoices.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            clientName={getClientName(invoice.clientId)}
            projectTitle={getProjectTitle(invoice.projectId)}
            canManageInvoices={canManageInvoices}
            onDelete={onDelete}
          />
        ))}
      </div>

      {loading && (
        <div className='mt-4'>
          <Loading message='Updating invoices...' />
        </div>
      )}
    </>
  );
}

export default InvoiceList;
