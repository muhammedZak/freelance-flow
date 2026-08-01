import Loading from '@components/common/Loading';
import ErrorMessage from '@components/common/ErrorMessage';
import PageHeader from '@components/common/PageHeader';
import BackLink from '@components/common/BackLink';

import InvoiceForm from '../components/InvoiceForm';

import useInvoiceForm from '../hooks/useInvoiceForm';

function InvoiceFormPage() {
  const {
    formData,
    formError,
    clients,
    clientProjects,
    invoiceTotal,
    invoiceLoading,
    invoiceError,
    loadingData,
    dataError,
    handleChange,
    handleSubmit,
  } = useInvoiceForm();

  if (loadingData) {
    return <Loading />;
  }

  if (dataError) {
    return <ErrorMessage message={dataError} />;
  }

  return (
    <div className='workspace-page'>
      <PageHeader
        title='Create Invoice'
        description='Create an invoice and automatically calculate its total.'>
        <BackLink to='/invoices'>Back to Invoices</BackLink>
      </PageHeader>

      {invoiceError && (
        <div className='mb-4'>
          <ErrorMessage message={invoiceError} />
        </div>
      )}

      <div className='max-w-3xl'>
        <InvoiceForm
          formData={formData}
          formError={formError}
          loading={invoiceLoading}
          clients={clients}
          projects={clientProjects}
          invoiceTotal={invoiceTotal}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default InvoiceFormPage;
