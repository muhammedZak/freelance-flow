import { useParams } from 'react-router-dom';

function InvoiceDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className='mb-2 text-2xl font-bold'>Invoice Details</h1>
      <p className='text-slate-600'>Showing invoice id: {id}</p>
    </div>
  );
}

export default InvoiceDetailsPage;
