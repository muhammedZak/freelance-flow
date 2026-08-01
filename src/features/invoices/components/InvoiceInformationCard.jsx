import SectionCard from '@components/common/SectionCard';

import { formatDate } from '@/utils/formatDate';

import { INVOICE_STATUS, INVOICE_STATUS_OPTIONS } from '../invoices.constants';

function getStatusClasses(status) {
  if (status === INVOICE_STATUS.PAID) {
    return 'bg-green-100 text-green-700';
  }

  if (status === INVOICE_STATUS.OVERDUE) {
    return 'bg-red-100 text-red-700';
  }

  return 'bg-yellow-100 text-yellow-700';
}

function InvoiceInformationCard({
  invoice,
  clientName,
  projectTitle,
  canManageInvoices,
  loading,
  onStatusChange,
}) {
  return (
    <SectionCard title='Invoice Information'>
      <div className='space-y-4 text-sm'>
        <div>
          <p className='text-slate-500'>Status</p>

          <div className='mt-1'>
            <span
              className={`inline-flex rounded px-2 py-1 text-xs capitalize ${getStatusClasses(
                invoice.status,
              )}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div>
          <p className='text-slate-500'>Client</p>

          <p className='font-medium text-slate-900'>{clientName}</p>
        </div>

        <div>
          <p className='text-slate-500'>Project</p>

          <p className='font-medium text-slate-900'>{projectTitle}</p>
        </div>

        <div>
          <p className='text-slate-500'>Issue Date</p>

          <p className='font-medium text-slate-900'>
            {formatDate(invoice.issueDate)}
          </p>
        </div>

        <div>
          <p className='text-slate-500'>Due Date</p>

          <p className='font-medium text-slate-900'>
            {formatDate(invoice.dueDate)}
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
              value={invoice.status}
              onChange={(event) => onStatusChange(event.target.value)}
              disabled={loading}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-60'>
              {INVOICE_STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default InvoiceInformationCard;
