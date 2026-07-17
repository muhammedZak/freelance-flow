import { useState } from 'react';

import { formatCurrency } from '../../utils/formatCurrency';

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function amountsAreEqual(firstAmount, secondAmount) {
  return Number(firstAmount).toFixed(2) === Number(secondAmount).toFixed(2);
}

function PaymentForm({ invoices, payments, loading, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    method: '',
    paymentDate: getTodayDate(),
    status: 'pending',
  });

  const [errors, setErrors] = useState({});

  const selectedInvoice = invoices.find(
    (invoice) => String(invoice.id) === String(formData.invoiceId),
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  }

  function handleInvoiceChange(event) {
    const invoiceId = event.target.value;

    const invoice = invoices.find(
      (currentInvoice) => String(currentInvoice.id) === String(invoiceId),
    );

    setFormData((currentData) => ({
      ...currentData,
      invoiceId: String(invoiceId),
      amount: invoice ? String(invoice.total) : '',
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      invoiceId: '',
      amount: '',
    }));
  }

  function validateForm() {
    const newErrors = {};
    const amount = Number(formData.amount);

    if (!formData.invoiceId) {
      newErrors.invoiceId = 'Please select an invoice.';
    }

    if (formData.amount === '') {
      newErrors.amount = 'Payment amount is required.';
    } else if (Number.isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Payment amount must be greater than zero.';
    }

    if (selectedInvoice && amount > Number(selectedInvoice.total)) {
      newErrors.amount = 'Payment amount cannot exceed the invoice total.';
    }

    if (!formData.method) {
      newErrors.method = 'Payment method is required.';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required.';
    }

    if (!formData.status) {
      newErrors.status = 'Payment status is required.';
    }

    if (
      formData.status === 'completed' &&
      selectedInvoice &&
      !amountsAreEqual(amount, selectedInvoice.total)
    ) {
      newErrors.amount =
        'A completed payment must equal the full invoice total.';
    }

    const completedPaymentExists = payments.some(
      (payment) =>
        String(payment.invoiceId) === String(formData.invoiceId) &&
        payment.status === 'completed',
    );

    if (
      formData.status === 'completed' &&
      selectedInvoice &&
      (selectedInvoice.status === 'paid' || completedPaymentExists)
    ) {
      newErrors.invoiceId = 'This invoice already has a completed payment.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      invoiceId: String(formData.invoiceId),
      amount: Number(formData.amount),
      method: formData.method,
      paymentDate: formData.paymentDate,
      status: formData.status,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='mb-5'>
        <h2 className='text-xl font-bold text-slate-900'>Add Payment</h2>

        <p className='text-sm text-slate-500'>
          Record a payment received for an invoice.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='md:col-span-2'>
          <label
            htmlFor='invoiceId'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Invoice
          </label>

          <select
            id='invoiceId'
            name='invoiceId'
            value={formData.invoiceId}
            onChange={handleInvoiceChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value=''>Select an invoice</option>

            {invoices.map((invoice) => (
              <option
                key={invoice.id}
                value={String(invoice.id)}
                disabled={invoice.status === 'paid'}>
                {invoice.invoiceNumber} - {formatCurrency(invoice.total)}
                {invoice.status === 'paid' ? ' - Paid' : ''}
              </option>
            ))}
          </select>

          {errors.invoiceId && (
            <p className='mt-1 text-sm text-red-600'>{errors.invoiceId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='amount'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Amount
          </label>

          <input
            id='amount'
            name='amount'
            type='number'
            min='0'
            step='0.01'
            value={formData.amount}
            onChange={handleChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />

          {selectedInvoice && (
            <p className='mt-1 text-xs text-slate-500'>
              Invoice total: {formatCurrency(selectedInvoice.total)}
            </p>
          )}

          {errors.amount && (
            <p className='mt-1 text-sm text-red-600'>{errors.amount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='method'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Payment Method
          </label>

          <select
            id='method'
            name='method'
            value={formData.method}
            onChange={handleChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value=''>Select method</option>
            <option value='cash'>Cash</option>
            <option value='bank transfer'>Bank Transfer</option>
            <option value='upi'>UPI</option>
            <option value='card'>Card</option>
          </select>

          {errors.method && (
            <p className='mt-1 text-sm text-red-600'>{errors.method}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='paymentDate'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Payment Date
          </label>

          <input
            id='paymentDate'
            name='paymentDate'
            type='date'
            value={formData.paymentDate}
            onChange={handleChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />

          {errors.paymentDate && (
            <p className='mt-1 text-sm text-red-600'>{errors.paymentDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='status'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Payment Status
          </label>

          <select
            id='status'
            name='status'
            value={formData.status}
            onChange={handleChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='pending'>Pending</option>
            <option value='completed'>Completed</option>
            <option value='failed'>Failed</option>
          </select>

          {errors.status && (
            <p className='mt-1 text-sm text-red-600'>{errors.status}</p>
          )}
        </div>
      </div>

      <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
        <button
          type='submit'
          disabled={loading}
          className='rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60'>
          {loading ? 'Saving...' : 'Save Payment'}
        </button>

        <button
          type='button'
          onClick={onCancel}
          disabled={loading}
          className='rounded border border-slate-300 px-4 py-2 text-slate-700 disabled:cursor-not-allowed disabled:opacity-60'>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PaymentForm;
