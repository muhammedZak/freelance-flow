import { useParams } from 'react-router-dom';

function ClientDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className='mb-2 text-2xl font-bold'>Client Details</h1>
      <p className='text-slate-600'>Showing client id: {id}</p>
    </div>
  );
}

export default ClientDetailsPage;
