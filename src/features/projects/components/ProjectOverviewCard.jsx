import SectionCard from '@components/common/SectionCard';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

function ProjectOverviewCard({ project }) {
  return (
    <SectionCard title='Project Details'>
      <div className='space-y-3 text-sm'>
        <p>
          <span className='font-medium text-slate-700'>Description:</span>{' '}
          {project.description}
        </p>

        <p>
          <span className='font-medium text-slate-700'>Status:</span>{' '}
          <span className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-700'>
            {project.status}
          </span>
        </p>

        <p>
          <span className='font-medium text-slate-700'>Budget:</span>{' '}
          {formatCurrency(project.budget)}
        </p>

        <p>
          <span className='font-medium text-slate-700'>Start Date:</span>{' '}
          {formatDate(project.startDate)}
        </p>

        <p>
          <span className='font-medium text-slate-700'>Deadline:</span>{' '}
          {formatDate(project.deadline)}
        </p>
      </div>
    </SectionCard>
  );
}

export default ProjectOverviewCard;
