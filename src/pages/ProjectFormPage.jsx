import { useParams } from 'react-router-dom';

function ProjectFormPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className='mb-2 text-2xl font-bold'>
        {id ? 'Edit Project' : 'Add Project'}
      </h1>

      <p className='text-slate-600'>Project form will be added in Phase 7.</p>
    </div>
  );
}

export default ProjectFormPage;
