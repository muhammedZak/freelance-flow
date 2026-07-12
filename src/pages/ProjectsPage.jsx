import { Link } from 'react-router-dom';

function ProjectsPage() {
  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Projects</h1>
          <p className='text-slate-600'>
            Projects CRUD will be added in Phase 7.
          </p>
        </div>

        <Link
          to='/projects/new'
          className='rounded bg-slate-900 px-4 py-2 text-white'>
          Add Project
        </Link>
      </div>
    </div>
  );
}

export default ProjectsPage;
