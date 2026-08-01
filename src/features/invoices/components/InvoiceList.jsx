import EmptyState from '@components/common/EmptyState';

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

      {loading && (
        <p className='text-sm text-slate-500'>Updating invoices...</p>
      )}
    </div>
  );
}

export default InvoiceList;
