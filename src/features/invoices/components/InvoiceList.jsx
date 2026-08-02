import { useSelector } from 'react-redux';

import EmptyState from '@components/common/EmptyState';
import Loading from '@components/common/Loading';

import { selectCurrentUser } from '@features/auth';

import InvoiceCard from './InvoiceCard';

function InvoiceList({
  invoices = [],
  emptyMessage = 'No invoices found.',
  loading = false,
  canManageInvoices: parentCanManageInvoices = true,
  getClientName,
  getProjectTitle,
  onDelete,
  onPay,
}) {
  const currentUser = useSelector(selectCurrentUser);

  const isClient = currentUser?.role === 'client';

  /*
   * Role is the primary authorization boundary.
   *
   * A parent component may further disable management,
   * but it can never grant management permissions to
   * a client or an unknown role.
   */
  const roleCanManageInvoices = currentUser?.role === 'freelancer';

  const canManageInvoices =
    roleCanManageInvoices && parentCanManageInvoices !== false;

  function resolveClientName(clientId) {
    if (typeof getClientName !== 'function') {
      return 'Unknown Client';
    }

    return getClientName(clientId) || 'Unknown Client';
  }

  function resolveProjectTitle(projectId) {
    if (typeof getProjectTitle !== 'function') {
      return 'Unknown Project';
    }

    return getProjectTitle(projectId) || 'Unknown Project';
  }

  function handleDelete(invoice) {
    if (!canManageInvoices) {
      return;
    }

    if (typeof onDelete === 'function') {
      onDelete(invoice);
    }
  }

  function handlePay(invoice) {
    if (!isClient) {
      return;
    }

    if (typeof onPay === 'function') {
      onPay(invoice);
    }
  }

  if (!Array.isArray(invoices) || invoices.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            clientName={resolveClientName(invoice.clientId)}
            projectTitle={resolveProjectTitle(invoice.projectId)}
            isClient={isClient}
            canManageInvoices={canManageInvoices}
            onDelete={handleDelete}
            onPay={handlePay}
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
