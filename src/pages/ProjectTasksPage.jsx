import { useParams } from 'react-router-dom';

function ProjectTasksPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className='mb-2 text-2xl font-bold'>Project Tasks</h1>
      <p className='text-slate-600'>
        Tasks for project id {id} will be added in Phase 8.
      </p>
    </div>
  );
}

export default ProjectTasksPage;
