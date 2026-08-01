import Button from '@components/common/Button';
import MessageAlert from '@components/common/MessageAlert';

import InvoiceInformationFormCard from './InvoiceInformationFormCard';
import InvoiceCalculationFormCard from './InvoiceCalculationFormCard';

function InvoiceForm({
  formData,
  formError,
  loading,
  clients,
  projects,
  invoiceTotal,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className='space-y-6' aria-busy={loading}>
      {formError && (
        <MessageAlert
          type='error'
          title='Please check the invoice form'
          message={formError}
        />
      )}

      <InvoiceInformationFormCard
        formData={formData}
        clients={clients}
        projects={projects}
        onChange={onChange}
      />

      <InvoiceCalculationFormCard
        formData={formData}
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
