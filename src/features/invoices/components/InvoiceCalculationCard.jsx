import SectionCard from '@components/common/SectionCard';

import { formatCurrency } from '@/utils/formatCurrency';

function CalculationRow({ label, value }) {
  return (
    <div className='flex items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800'>
      <span className='text-slate-600 dark:text-slate-400'>{label}</span>

      <span className='font-medium text-slate-950 dark:text-white'>
        {value}
      </span>
    </div>
  );
}

function InvoiceCalculationCard({ invoice }) {
  return (
    <SectionCard title='Invoice Calculation'>
      <div className='space-y-4'>
        <CalculationRow label='Hours Worked' value={invoice.hoursWorked} />

        <CalculationRow
          label='Hourly Rate'
          value={formatCurrency(invoice.hourlyRate)}
        />

        <div className='flex items-center justify-between gap-4'>
          <span className='text-lg font-bold text-slate-950 dark:text-white'>
            Total
          </span>

          <span className='text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
            {formatCurrency(invoice.total)}
          </span>
        </div>

        <div className='rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300'>
          {invoice.hoursWorked} hours × {formatCurrency(invoice.hourlyRate)} ={' '}
          <span className='font-semibold'>{formatCurrency(invoice.total)}</span>
        </div>
      </div>
    </SectionCard>
  );
}

export default InvoiceCalculationCard;
