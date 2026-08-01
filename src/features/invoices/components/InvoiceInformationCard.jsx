import SectionCard from '@components/common/SectionCard';

import SelectField from '@components/forms/SelectField';

import { formatDate } from '@/utils/formatDate';

import { INVOICE_STATUS_OPTIONS } from '../constants/invoices.constants';

import InvoiceStatusBadge from './InvoiceStatusBadge';

function MetadataItem({ label, children }) {
  return (
    <div>
      <p className='text-slate-500 dark:text-slate-400'>{label}</p>

      <div className='mt-1 font-medium text-slate-900 dark:text-slate-100'>
        {children}
      </div>
    </div>
  );
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
      <div className='space-y-5 text-sm'>
        <MetadataItem label='Status'>
          <InvoiceStatusBadge status={invoice.status} />
        </MetadataItem>

        <MetadataItem label='Client'>{clientName}</MetadataItem>

        <MetadataItem label='Project'>{projectTitle}</MetadataItem>

        <MetadataItem label='Issue Date'>
          {formatDate(invoice.issueDate)}
        </MetadataItem>

        <MetadataItem label='Due Date'>
          {formatDate(invoice.dueDate)}
        </MetadataItem>

        {canManageInvoices && (
          <div className='border-t border-slate-200 pt-5 dark:border-slate-800'>
            <SelectField
              id='invoiceStatus'
              name='invoiceStatus'
              label='Update Status'
              value={invoice.status}
              onChange={(event) => onStatusChange(event.target.value)}
              options={INVOICE_STATUS_OPTIONS}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default InvoiceInformationCard;
