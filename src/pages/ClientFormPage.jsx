import { useParams } from 'react-router-dom';

function ClientFormPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className='mb-2 text-2xl font-bold'>
        {id ? 'Edit Client' : 'Add Client'}
      </h1>

      <p className='text-slate-600'>Client form will be added in Phase 6.</p>
    </div>
  );
}

export default ClientFormPage;
