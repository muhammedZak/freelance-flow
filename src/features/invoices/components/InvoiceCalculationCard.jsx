import SectionCard from '@components/common/SectionCard';

import { formatCurrency } from '@/utils/formatCurrency';

function InvoiceCalculationCard({ invoice }) {
  return (
    <SectionCard title='Invoice Calculation'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
          <span className='text-slate-600'>Hours Worked</span>

          <span className='font-medium text-slate-900'>
            {invoice.hoursWorked}
          </span>
        </div>

        <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
          <span className='text-slate-600'>Hourly Rate</span>

          <span className='font-medium text-slate-900'>
            {formatCurrency(invoice.hourlyRate)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-lg font-bold text-slate-900'>Total</span>

          <span className='text-2xl font-bold text-slate-900'>
            {formatCurrency(invoice.total)}
          </span>
        </div>

        <p className='rounded bg-slate-100 p-3 text-sm text-slate-600'>
          {invoice.hoursWorked} hours × {formatCurrency(invoice.hourlyRate)} ={' '}
          {formatCurrency(invoice.total)}
        </p>
      </div>
    </SectionCard>
  );
}

export default InvoiceCalculationCard;
