import { formatCurrency } from '@/utils/formatCurrency';

function InvoiceSummaryCards({ totalInvoices, paidAmount, outstandingAmount }) {
  return (
    <div className='mb-6 grid gap-4 sm:grid-cols-3'>
      <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
        <p className='text-sm text-slate-500'>Total Invoices</p>

        <p className='mt-2 text-2xl font-bold text-slate-900'>
          {totalInvoices}
        </p>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
        <p className='text-sm text-slate-500'>Paid Amount</p>

        <p className='mt-2 text-2xl font-bold text-green-700'>
          {formatCurrency(paidAmount)}
        </p>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
        <p className='text-sm text-slate-500'>Outstanding Amount</p>

        <p className='mt-2 text-2xl font-bold text-red-700'>
          {formatCurrency(outstandingAmount)}
        </p>
      </div>
    </div>
  );
}

export default InvoiceSummaryCards;
