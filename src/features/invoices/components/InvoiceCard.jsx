import ActionLink from '@components/common/ActionLink';
import Button from '@components/common/Button';
import SectionCard from '@components/common/SectionCard';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

import InvoiceStatusBadge from './InvoiceStatusBadge';

function InvoiceCard({
  invoice,
  clientName,
  projectTitle,
  isClient = false,
  canManageInvoices = false,
  onDelete,
  onPay,
}) {
  const normalizedStatus = String(invoice?.status ?? '')
    .trim()
    .toLowerCase();

  /*
   * Current application invoices use "unpaid".
   * The new SaaS flow may use "pending".
   *
   * Supporting both keeps the UI compatible during
   * the schema transition.
   */
  const isPayableInvoice =
    normalizedStatus === 'pending' || normalizedStatus === 'unpaid';

  const showPayNow = isClient && isPayableInvoice;

  const showManagementActions = !isClient && canManageInvoices;

  function handleDelete() {
    if (!showManagementActions) {
      return;
    }

    if (typeof onDelete === 'function') {
      onDelete(invoice);
    }
  }

  function handlePay() {
    if (!showPayNow) {
      return;
    }

    if (typeof onPay === 'function') {
      onPay(invoice);
    }
  }

  return (
    <SectionCard className='h-full'>
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <h2 className='truncate text-lg font-bold text-slate-950 dark:text-white'>
            {invoice.invoiceNumber}
          </h2>

          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
            {clientName}
          </p>
        </div>

        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <p className='mb-4 text-sm text-slate-600 dark:text-slate-400'>
        {projectTitle}
      </p>

      <p className='mb-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
        {formatCurrency(invoice.total)}
      </p>

      <div className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
        <p>
          <span className='font-semibold text-slate-700 dark:text-slate-300'>
            Issue Date:
          </span>{' '}
          {formatDate(invoice.issueDate)}
        </p>

        <p>
          <span className='font-semibold text-slate-700 dark:text-slate-300'>
            Due Date:
          </span>{' '}
          {formatDate(invoice.dueDate)}
        </p>
      </div>

      <div className='mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800'>
        <ActionLink to={`/invoices/${invoice.id}`} variant='text' size='small'>
          View Details
        </ActionLink>

        {showManagementActions && (
          <>
            <ActionLink
              to={`/invoices/${invoice.id}/edit`}
              variant='secondary'
              size='small'>
              Edit
            </ActionLink>

            <Button
              type='button'
              variant='danger'
              size='small'
              onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}

        {showPayNow && (
          <Button
            type='button'
            variant='success'
            size='small'
            onClick={handlePay}
            disabled={typeof onPay !== 'function'}>
            Pay Now
          </Button>
        )}
      </div>
    </SectionCard>
  );
}

export default InvoiceCard;
