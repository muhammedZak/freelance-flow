import { Link } from 'react-router-dom';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

import { INVOICE_STATUS } from '../invoices.constants';

function getStatusClasses(status) {
  if (status === INVOICE_STATUS.PAID) {
    return 'bg-green-100 text-green-700';
  }

  if (status === INVOICE_STATUS.OVERDUE) {
    return 'bg-red-100 text-red-700';
  }

  return 'bg-yellow-100 text-yellow-700';
}

function InvoiceCard({
  invoice,
  clientName,
  projectTitle,
  canManageInvoices,
  onDelete,
}) {
  return (
    <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-lg font-bold text-slate-900'>
            {invoice.invoiceNumber}
          </h2>

          <p className='text-sm text-slate-500'>{clientName}</p>
        </div>

        <span
          className={`rounded px-2 py-1 text-xs capitalize ${getStatusClasses(
            invoice.status,
          )}`}>
          {invoice.status}
        </span>
      </div>

      <p className='mb-4 text-sm text-slate-600'>{projectTitle}</p>

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
            onClick={() => onDelete(invoice)}
            className='text-red-600'>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default InvoiceCard;
