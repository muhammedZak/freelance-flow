import SectionCard from '@components/common/SectionCard';

import InputField from '@components/forms/InputField';

import { formatCurrency } from '@/utils/formatCurrency';

function InvoiceCalculationFormCard({
  formData,
  errors = {},
  invoiceTotal,
  onChange,
}) {
  return (
    <SectionCard
      title='Billing Calculation'
      description='Enter the worked hours and hourly rate to calculate the invoice total automatically.'>
      <div className='space-y-5'>
        <div className='grid gap-5 sm:grid-cols-2'>
          <InputField
            id='hoursWorked'
            name='hoursWorked'
            label='Hours Worked'
            type='number'
            min='0'
            step='0.5'
            value={formData.hoursWorked}
            onChange={onChange}
            placeholder='20'
            error={errors.hoursWorked || ''}
            required
          />

          <InputField
            id='hourlyRate'
            name='hourlyRate'
            label='Hourly Rate'
            type='number'
            min='0'
            value={formData.hourlyRate}
            onChange={onChange}
            placeholder='800'
            error={errors.hourlyRate || ''}
            required
          />
        </div>

        <div className='rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60'>
          <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Calculated Total
          </p>

          <p className='mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white'>
            {formatCurrency(invoiceTotal)}
          </p>

          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
            {Number(formData.hoursWorked || 0)} hours ×{' '}
            {formatCurrency(formData.hourlyRate || 0)}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

export default InvoiceCalculationFormCard;
