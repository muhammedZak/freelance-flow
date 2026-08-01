import SectionCard from '@components/common/SectionCard';

import { formatCurrency } from '@/utils/formatCurrency';

function InvoiceSummaryCard({
  label,
  value,
  valueClassName = 'text-slate-950 dark:text-white',
}) {
  return (
    <SectionCard className='h-full'>
      <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
        {label}
      </p>

      <p className={`mt-3 text-2xl font-bold tracking-tight ${valueClassName}`}>
        {value}
      </p>
    </SectionCard>
  );
}

function InvoiceSummaryCards({ totalInvoices, paidAmount, outstandingAmount }) {
  return (
    <div className='mb-6 grid gap-4 sm:grid-cols-3'>
      <InvoiceSummaryCard label='Total Invoices' value={totalInvoices} />

      <InvoiceSummaryCard
        label='Paid Amount'
        value={formatCurrency(paidAmount)}
        valueClassName='text-green-700 dark:text-green-400'
      />

      <InvoiceSummaryCard
        label='Outstanding Amount'
        value={formatCurrency(outstandingAmount)}
        valueClassName='text-red-700 dark:text-red-400'
      />
    </div>
  );
}

export default InvoiceSummaryCards;
