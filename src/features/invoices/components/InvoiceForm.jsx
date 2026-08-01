import Button from '@components/common/Button';

import InvoiceInformationFormCard from './InvoiceInformationFormCard';
import InvoiceCalculationFormCard from './InvoiceCalculationFormCard';

function InvoiceForm({
  formData,
  errors = {},
  loading,
  clients,
  projects,
  invoiceTotal,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className='space-y-6'
      aria-busy={loading}>
      <InvoiceInformationFormCard
        formData={formData}
        errors={errors}
        clients={clients}
        projects={projects}
        onChange={onChange}
      />

      <InvoiceCalculationFormCard
        formData={formData}
        errors={errors}
        invoiceTotal={invoiceTotal}
        onChange={onChange}
      />

      <div className='flex justify-end'>
        <Button type='submit' disabled={loading}>
          {loading ? 'Saving Invoice...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;
