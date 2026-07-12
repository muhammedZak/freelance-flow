import { Link, useParams } from 'react-router-dom';

function ProjectDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className='mb-2 text-2xl font-bold'>Project Details</h1>
      <p className='mb-4 text-slate-600'>Showing project id: {id}</p>

      <Link to={`/projects/${id}/tasks`} className='text-blue-600'>
        View project tasks
      </Link>
    </div>
  );
}

export default ProjectDetailsPage;
