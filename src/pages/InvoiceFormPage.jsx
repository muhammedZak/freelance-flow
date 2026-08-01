import { InvoiceForm, useInvoiceForm } from '@features/invoices';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PageHeader from '../components/common/PageHeader';
import BackLink from '../components/common/BackLink';

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

      {invoiceError && <ErrorMessage message={invoiceError} />}

      <div className='max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7'>
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
